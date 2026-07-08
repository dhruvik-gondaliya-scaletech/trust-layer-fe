declare const self: any;

// @techstark/opencv-js's default export shape varies by build: it can be the
// resolved cv module, a factory function, a Promise, or an object that only
// becomes usable after onRuntimeInitialized fires (its .d.ts always claims
// it's the resolved module, which isn't reliable). Handle all of them once
// here and cache the resolved value before any cv.* call.
import cvImport from '@techstark/opencv-js';

import type { ValidationConfig, AnalysisResult, AnalysisMetric } from '@/utils/analysis';

let cv: any = null;

async function getCv(): Promise<any> {
  if (cv) return cv;
  const raw = cvImport as any;
  if (typeof raw === 'function') {
    cv = await raw();
  } else if (raw instanceof Promise) {
    cv = await raw;
  } else if (raw && typeof raw === 'object') {
    if (raw.getBuildInformation || raw.Mat) {
      cv = raw;
    } else {
      cv = await new Promise((resolve) => {
        raw.onRuntimeInitialized = () => resolve(raw);
      });
    }
  } else {
    cv = raw;
  }
  return cv;
}

// Notify the main thread as soon as OpenCV is usable (or definitively isn't)
// instead of making it infer readiness from the first analyzed frame — this
// is what drives the "loading verification engine" UI.
getCv()
  .then(() => self.postMessage({ type: 'ready' }))
  .catch((err: unknown) => {
    console.error('Failed to initialize OpenCV.js in worker:', err);
    self.postMessage({ type: 'init-error', message: (err as Error)?.message ?? 'Failed to load OpenCV' });
  });

// Last-resort safety net: an uncaught error/rejection here would otherwise
// kill the worker silently, leaving the main thread waiting forever.
self.onerror = (event: any) => {
  console.error('Unhandled error in analysis worker:', event?.message ?? event);
};
self.onunhandledrejection = (event: any) => {
  console.error('Unhandled rejection in analysis worker:', event?.reason ?? event);
};

function analyzeBlur(mat: any, config: ValidationConfig): AnalysisMetric {
  const gray = new cv.Mat();
  const laplacian = new cv.Mat();
  let mean: any = null;
  let stddev: any = null;

  try {
    cv.cvtColor(mat, gray, cv.COLOR_RGBA2GRAY);
    cv.Laplacian(gray, laplacian, cv.CV_64F);

    mean = new cv.Mat();
    stddev = new cv.Mat();
    cv.meanStdDev(laplacian, mean, stddev);

    const variance = Math.pow(stddev.doubleAt(0, 0), 2);

    let status: 'pass' | 'fail' | 'warning' = 'fail';
    let message = 'Image is too blurry';

    if (variance >= config.blurPass) {
      status = 'pass';
      message = 'Image sharpness is acceptable';
    } else if (variance >= config.blurWarn) {
      status = 'warning';
      message = 'Image is slightly blurry';
    }

    return { score: variance, status, message };
  } finally {
    gray.delete();
    laplacian.delete();
    if (mean) mean.delete();
    if (stddev) stddev.delete();
  }
}

function analyzeBrightness(mat: any, config: ValidationConfig): AnalysisMetric {
  const gray = new cv.Mat();
  let mean: any = null;
  let stddev: any = null;

  try {
    cv.cvtColor(mat, gray, cv.COLOR_RGBA2GRAY);

    mean = new cv.Mat();
    stddev = new cv.Mat();
    cv.meanStdDev(gray, mean, stddev);

    const luminance = mean.doubleAt(0, 0);

    let status: 'pass' | 'fail' | 'warning' = 'fail';
    let message = 'Image is too dark or too bright';

    if (luminance >= config.brightnessMinPass && luminance <= config.brightnessMaxPass) {
      status = 'pass';
      message = 'Brightness is optimal';
    } else if (luminance >= config.brightnessMinWarn && luminance <= config.brightnessMaxWarn) {
      status = 'warning';
      message = luminance < config.brightnessMinPass ? 'Image is a bit dark' : 'Image is a bit bright';
    }

    return { score: luminance, status, message };
  } finally {
    gray.delete();
    if (mean) mean.delete();
    if (stddev) stddev.delete();
  }
}

// Persists across messages for this worker's lifetime so the coverage box
// stays sticky/smoothed frame-to-frame instead of jittering.
let lastRect: { x: number; y: number; width: number; height: number } | null = null;

function analyzeCoverage(mat: any, config: ValidationConfig): AnalysisMetric {
  const gray = new cv.Mat();
  const laplacian = new cv.Mat();
  const edges = new cv.Mat();
  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();

  try {
    cv.cvtColor(mat, gray, cv.COLOR_RGBA2GRAY);
    cv.Laplacian(gray, laplacian, cv.CV_64F);

    cv.GaussianBlur(gray, gray, new cv.Size(5, 5), 0, 0, cv.BORDER_DEFAULT);
    cv.Canny(gray, edges, 50, 150);

    const M = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(9, 9));
    cv.dilate(edges, edges, M);
    M.delete();

    cv.findContours(edges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

    let bestScore = 0;
    let maxRect: { x: number; y: number; width: number; height: number } | null = null;

    const imgArea = mat.rows * mat.cols;
    const imgCenterX = mat.cols / 2;
    const imgCenterY = mat.rows / 2;
    const maxDist = Math.sqrt(imgCenterX * imgCenterX + imgCenterY * imgCenterY);

    for (let i = 0; i < contours.size(); ++i) {
      const contour = contours.get(i);
      const rect = cv.boundingRect(contour);
      const area = rect.width * rect.height;

      if (area > imgArea * 0.01 && area < imgArea * 0.95) {
        const centerX = rect.x + rect.width / 2;
        const centerY = rect.y + rect.height / 2;

        const dist = Math.sqrt(Math.pow(centerX - imgCenterX, 2) + Math.pow(centerY - imgCenterY, 2));
        const centrality = Math.max(0, 1 - (dist / maxDist));

        let focusScore = 1;
        let roi: any = null;
        let roiMean: any = null;
        let roiStddev: any = null;
        try {
          roi = laplacian.roi(rect);
          roiMean = new cv.Mat();
          roiStddev = new cv.Mat();
          cv.meanStdDev(roi, roiMean, roiStddev);
          const variance = roiStddev.doubleAt(0, 0) * roiStddev.doubleAt(0, 0);
          focusScore = Math.sqrt(variance);
        } catch (e) {
          // Non-fatal — fall back to the neutral focus score for this contour
        } finally {
          if (roi) roi.delete();
          if (roiMean) roiMean.delete();
          if (roiStddev) roiStddev.delete();
        }

        let stickyMultiplier = 1.0;
        if (lastRect) {
          const overlapX = Math.max(0, Math.min(rect.x + rect.width, lastRect.x + lastRect.width) - Math.max(rect.x, lastRect.x));
          const overlapY = Math.max(0, Math.min(rect.y + rect.height, lastRect.y + lastRect.height) - Math.max(rect.y, lastRect.y));
          const overlapArea = overlapX * overlapY;
          if (overlapArea > (area * 0.5)) {
            stickyMultiplier = 1.5;
          }
        }

        const score = area * Math.pow(centrality, 3) * focusScore * stickyMultiplier;

        if (score > bestScore) {
          bestScore = score;
          maxRect = { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
        }
      }
      contour.delete();
    }

    const coverageRatio = maxRect ? (maxRect.width * maxRect.height) / imgArea : 0;

    if (maxRect) {
      if (lastRect) {
        maxRect = {
          x: (lastRect.x * 0.6) + (maxRect.x * 0.4),
          y: (lastRect.y * 0.6) + (maxRect.y * 0.4),
          width: (lastRect.width * 0.6) + (maxRect.width * 0.4),
          height: (lastRect.height * 0.6) + (maxRect.height * 0.4),
        };
      }
      lastRect = maxRect;
    } else {
      lastRect = null;
    }

    let status: 'pass' | 'fail' | 'warning' = 'fail';
    let message = 'Subject is too small or missing';

    if (coverageRatio >= config.coveragePass) {
      status = 'pass';
      message = 'Subject coverage is optimal';
    } else if (coverageRatio >= config.coverageWarn) {
      status = 'warning';
      message = 'Move closer to the subject';
    }

    return { score: coverageRatio * 100, status, message, rect: maxRect || undefined };
  } catch (err) {
    console.error('Error in coverage analysis', err);
    return { score: 0, status: 'fail', message: 'Analysis failed' };
  } finally {
    gray.delete();
    laplacian.delete();
    edges.delete();
    contours.delete();
    hierarchy.delete();
  }
}

type AnalyzeMessage = {
  type: 'analyze';
  requestId: number;
  width: number;
  height: number;
  buffer: ArrayBuffer;
  config: ValidationConfig;
};

self.onmessage = (event: MessageEvent<AnalyzeMessage>) => {
  const msg = event.data;
  if (msg.type !== 'analyze') return;

  // OpenCV WASM hasn't finished initializing yet — drop this frame, the main
  // thread will send another one on its next tick.
  if (!cv || !cv.Mat) {
    self.postMessage({ type: 'not-ready', requestId: msg.requestId });
    return;
  }

  let mat: any = null;
  try {
    const imageData = new ImageData(new Uint8ClampedArray(msg.buffer), msg.width, msg.height);
    mat = cv.matFromImageData(imageData);

    const blur = analyzeBlur(mat, msg.config);
    const brightness = analyzeBrightness(mat, msg.config);
    const coverage = analyzeCoverage(mat, msg.config);

    let overallStatus: 'pass' | 'fail' | 'warning' = 'pass';
    const metrics = [blur, brightness, coverage];
    if (metrics.some((m) => m.status === 'fail')) overallStatus = 'fail';
    else if (metrics.some((m) => m.status === 'warning')) overallStatus = 'warning';

    const result: AnalysisResult = { blur, brightness, coverage, overallStatus };
    self.postMessage({ type: 'result', requestId: msg.requestId, result });
  } catch (err) {
    self.postMessage({ type: 'error', requestId: msg.requestId, message: (err as Error)?.message ?? 'Analysis failed' });
  } finally {
    if (mat) mat.delete();
  }
};

export {};
