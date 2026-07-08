import { useEffect, useRef, useState, useCallback } from 'react';

export interface ValidationConfig {
  blurPass: number;
  blurWarn: number;
  brightnessMinPass: number;
  brightnessMaxPass: number;
  brightnessMinWarn: number;
  brightnessMaxWarn: number;
  coveragePass: number;
  coverageWarn: number;
}

export const DEFAULT_CONFIG: ValidationConfig = {
  blurPass: 40,
  blurWarn: 20,
  brightnessMinPass: 80,
  brightnessMaxPass: 200,
  brightnessMinWarn: 40,
  brightnessMaxWarn: 230,
  coveragePass: 0.10,
  coverageWarn: 0.05,
};

export interface AnalysisMetric {
  score: number;
  status: 'pass' | 'fail' | 'warning';
  message?: string;
  rect?: { x: number; y: number; width: number; height: number };
}

export interface AnalysisResult {
  blur?: AnalysisMetric;
  brightness?: AnalysisMetric;
  coverage?: AnalysisMetric;
  overallStatus: 'pass' | 'fail' | 'warning';
}

// 'loading' = worker/OpenCV WASM still starting up, no frames analyzed yet.
// 'ready'   = at least one frame has been (or can be) analyzed.
// 'error'   = Workers/OpenCV unsupported, worker crashed, or WASM never
//             finished loading — live guidance is unavailable but the camera
//             itself keeps working so the user can still capture manually.
export type AnalysisEngineStatus = 'loading' | 'ready' | 'error';

// Frames are downscaled to this before analysis. Analyzing full 1080p frames
// allocates ~8MB per frame at 10 FPS (both here and inside the WASM heap),
// which stalls or crashes low-memory devices. ~640px is plenty for
// blur/brightness/contour detection; the coverage rect is scaled back up to
// video coordinates before it reaches the UI.
const MAX_ANALYSIS_DIM = 640;

// ── Shared worker lifecycle ──────────────────────────────────────────────────
// One worker (and one ~150MB OpenCV WASM heap) per page, shared across every
// camera open in the create-deal flow. Creating a fresh worker per camera
// open — main photo, 4 angle slots, video — piles up WASM heaps faster than
// the browser reclaims them and eventually crashes the tab. The worker is
// released when the last subscriber unmounts and only actually terminated
// after an idle grace period, so re-opening the camera reuses the warm engine
// (no reload, loading UI resolves instantly).

type SharedAnalysisWorker = {
  worker: Worker;
  ready: boolean;
  failed: boolean;
  refs: number;
  idleTimer: ReturnType<typeof setTimeout> | null;
};

let sharedWorker: SharedAnalysisWorker | null = null;
const WORKER_IDLE_TTL = 30000;

function acquireAnalysisWorker(): SharedAnalysisWorker | null {
  if (typeof Worker === 'undefined') {
    console.error('Web Workers are not supported in this browser — live analysis disabled');
    return null;
  }

  if (sharedWorker) {
    if (sharedWorker.idleTimer) {
      clearTimeout(sharedWorker.idleTimer);
      sharedWorker.idleTimer = null;
    }
    sharedWorker.refs++;
    return sharedWorker;
  }

  try {
    const worker = new Worker(new URL('../workers/proofValidation.worker.ts', import.meta.url));
    const record: SharedAnalysisWorker = { worker, ready: false, failed: false, refs: 1, idleTimer: null };
    // Manager-level listener tracks readiness for subscribers that attach
    // after the worker already announced it (i.e. every reuse).
    worker.addEventListener('message', (event: MessageEvent) => {
      if (event.data?.type === 'ready') record.ready = true;
      else if (event.data?.type === 'init-error') record.failed = true;
    });
    worker.addEventListener('error', () => {
      record.failed = true;
    });
    sharedWorker = record;
    return record;
  } catch (e) {
    console.error('Failed to create analysis worker:', e);
    return null;
  }
}

function releaseAnalysisWorker(record: SharedAnalysisWorker) {
  record.refs = Math.max(0, record.refs - 1);
  if (record.refs === 0 && !record.idleTimer) {
    record.idleTimer = setTimeout(() => {
      record.worker.terminate();
      if (sharedWorker === record) sharedWorker = null;
    }, WORKER_IDLE_TTL);
  }
}

// ── Hook ─────────────────────────────────────────────────────────────────────
// Runs the OpenCV.js analysis off the main thread. The main thread only does
// the requestAnimationFrame-driven canvas capture below; all Mat math happens
// in proofValidation.worker.ts so blur/brightness/coverage detection never
// blocks rendering or camera preview.
export const useAnalysis = (videoElement: HTMLVideoElement | null, enabled: boolean) => {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [status, setStatus] = useState<AnalysisEngineStatus>('loading');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const workerRecordRef = useRef<SharedAnalysisWorker | null>(null);
  const frameIdRef = useRef<number | null>(null);
  const lastProcessTimeRef = useRef<number>(0);
  const isProcessingRef = useRef<boolean>(false);
  const watchdogRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Downscale factor of the frame currently in flight, used to map the
  // worker's coverage rect back to video-native coordinates.
  const rectScaleRef = useRef<{ x: number; y: number }>({ x: 1, y: 1 });
  const statusRef = useRef<AnalysisEngineStatus>('loading');
  const config = DEFAULT_CONFIG;

  const FRAME_INTERVAL = 100; // ~10 FPS — safe now that analysis runs off the main thread
  const READY_TIMEOUT = 15000; // OpenCV WASM never finished loading — stop spinning forever
  const STALL_TIMEOUT = FRAME_INTERVAL * 8; // self-heal if a worker response is ever lost

  const updateStatus = useCallback((next: AnalysisEngineStatus) => {
    statusRef.current = next;
    setStatus(next);
  }, []);

  useEffect(() => {
    canvasRef.current = document.createElement('canvas');

    const record = acquireAnalysisWorker();
    if (!record) {
      updateStatus('error');
      return;
    }
    workerRecordRef.current = record;

    // Reused warm worker — it announced ready/failed before we subscribed.
    if (record.failed) updateStatus('error');
    else if (record.ready) updateStatus('ready');
    else updateStatus('loading');

    const readyTimer = setTimeout(() => {
      if (statusRef.current === 'loading') updateStatus('error');
    }, READY_TIMEOUT);
    if (record.ready || record.failed) clearTimeout(readyTimer);

    const onError = (e: ErrorEvent) => {
      console.error('Analysis worker crashed:', e.message);
      isProcessingRef.current = false;
      clearTimeout(readyTimer);
      updateStatus('error');
    };

    const onMessage = (event: MessageEvent) => {
      const msg = event.data;

      if (msg.type === 'ready') {
        clearTimeout(readyTimer);
        updateStatus('ready');
        return;
      }
      if (msg.type === 'init-error') {
        clearTimeout(readyTimer);
        updateStatus('error');
        return;
      }

      isProcessingRef.current = false;
      if (watchdogRef.current) {
        clearTimeout(watchdogRef.current);
        watchdogRef.current = null;
      }

      if (msg.type === 'result') {
        clearTimeout(readyTimer);
        if (statusRef.current !== 'ready') updateStatus('ready');

        const r = msg.result as AnalysisResult;
        const scale = rectScaleRef.current;
        if (r.coverage?.rect && (scale.x !== 1 || scale.y !== 1)) {
          r.coverage.rect = {
            x: r.coverage.rect.x * scale.x,
            y: r.coverage.rect.y * scale.y,
            width: r.coverage.rect.width * scale.x,
            height: r.coverage.rect.height * scale.y,
          };
        }
        setResult(r);
      } else if (msg.type === 'error') {
        console.error('Analysis worker error:', msg.message);
      }
      // 'not-ready' (OpenCV still loading) — just wait for the next scheduled frame
    };

    record.worker.addEventListener('message', onMessage);
    record.worker.addEventListener('error', onError);

    return () => {
      clearTimeout(readyTimer);
      if (watchdogRef.current) clearTimeout(watchdogRef.current);
      if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
      record.worker.removeEventListener('message', onMessage);
      record.worker.removeEventListener('error', onError);
      releaseAnalysisWorker(record);
      workerRecordRef.current = null;
      isProcessingRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const processFrame = useCallback((timestamp: number) => {
    const record = workerRecordRef.current;
    if (!enabled || !videoElement || !canvasRef.current || !record) return;
    // Engine is dead — keep the camera preview running but stop burning CPU
    // shipping frames nobody will analyze.
    if (statusRef.current === 'error') return;

    if (timestamp - lastProcessTimeRef.current >= FRAME_INTERVAL && !isProcessingRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      const vw = videoElement.videoWidth;
      const vh = videoElement.videoHeight;

      // readyState < 2 means no decodable frame yet — drawing it produces a
      // black frame that would feed garbage into every analyzer.
      if (ctx && vw > 0 && vh > 0 && videoElement.readyState >= 2) {
        const scale = Math.min(1, MAX_ANALYSIS_DIM / Math.max(vw, vh));
        const cw = Math.max(1, Math.round(vw * scale));
        const ch = Math.max(1, Math.round(vh * scale));
        if (canvas.width !== cw) canvas.width = cw;
        if (canvas.height !== ch) canvas.height = ch;
        ctx.drawImage(videoElement, 0, 0, cw, ch);

        try {
          isProcessingRef.current = true;
          lastProcessTimeRef.current = timestamp;
          rectScaleRef.current = { x: vw / cw, y: vh / ch };

          const imageData = ctx.getImageData(0, 0, cw, ch);
          // Transfer the pixel buffer to the worker instead of copying it.
          record.worker.postMessage(
            {
              type: 'analyze',
              requestId: timestamp,
              width: cw,
              height: ch,
              buffer: imageData.data.buffer,
              config,
            },
            [imageData.data.buffer]
          );

          // Self-heal: if this frame's response is ever lost (worker hiccup),
          // don't let isProcessingRef stay stuck and freeze analysis forever.
          if (watchdogRef.current) clearTimeout(watchdogRef.current);
          watchdogRef.current = setTimeout(() => {
            isProcessingRef.current = false;
          }, STALL_TIMEOUT);
        } catch (e) {
          console.error('Analysis dispatch failed', e);
          isProcessingRef.current = false;
        }
      }
    }

    if (enabled) {
      frameIdRef.current = requestAnimationFrame(processFrame);
    }
  }, [enabled, videoElement, config]);

  useEffect(() => {
    if (enabled && videoElement) {
      frameIdRef.current = requestAnimationFrame(processFrame);
    } else {
      if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
      setResult(null);
    }

    return () => {
      if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
    };
  }, [enabled, videoElement, processFrame]);

  return { result, status };
};
