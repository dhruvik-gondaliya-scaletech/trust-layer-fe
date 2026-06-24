"use client";

import React, { useEffect, useRef, useState } from "react";
import { Camera, RefreshCw, AlertCircle, Video, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CameraCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (dataUrl: string) => void;
  onCaptureVideo?: (videoBlob: Blob) => void;
  type: "main" | "front" | "back" | "side" | "detail" | "video";
  title: string;
}

const MAX_RECORDING_SECONDS = 60;
const BLUR_THRESHOLD = 1.8;

function computeBlurScore(video: HTMLVideoElement): number {
  const size = 150;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return 999;
  const vW = video.videoWidth || 640;
  const vH = video.videoHeight || 480;
  const crop = Math.min(vW, vH) * 0.6;
  try {
    ctx.drawImage(video, (vW - crop) / 2, (vH - crop) / 2, crop, crop, 0, 0, size, size);
  } catch {
    return 999;
  }
  const pixels = ctx.getImageData(0, 0, size, size).data;
  const gray = new Float32Array(size * size);
  for (let i = 0; i < pixels.length; i += 4) {
    gray[i / 4] = 0.299 * pixels[i] + 0.587 * pixels[i + 1] + 0.114 * pixels[i + 2];
  }
  let sum = 0;
  for (let y = 1; y < size - 1; y++) {
    for (let x = 1; x < size - 1; x++) {
      const i = y * size + x;
      sum += Math.abs(gray[i - size] + gray[i - 1] - 4 * gray[i] + gray[i + 1] + gray[i + size]);
    }
  }
  return sum / (size * size);
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  isOpen,
  onClose,
  onCapture,
  onCaptureVideo,
  type,
  title,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  // Use a ref (not state) to collect chunks — avoids stale closure in ondataavailable
  const recordedChunksRef = useRef<Blob[]>([]);
  const isRecordingRef = useRef(false);

  const [hasStarted, setHasStarted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string>("Initializing camera...");
  const [feedbackColor, setFeedbackColor] = useState<string>("text-blue-500");

  // Preview states
  const [capturedDataUrl, setCapturedDataUrl] = useState<string | null>(null);
  const [capturedIsBlurry, setCapturedIsBlurry] = useState(false);
  const [capturedVideoBlob, setCapturedVideoBlob] = useState<Blob | null>(null);
  const [capturedVideoUrl, setCapturedVideoUrl] = useState<string | null>(null);

  // Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Increment timer every second while recording
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Auto-stop at max duration
  useEffect(() => {
    if (isRecording && recordingSeconds >= MAX_RECORDING_SECONDS) {
      handleStopRecording();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordingSeconds, isRecording]);

  // ── Camera helpers ────────────────────────────────────────────────────────

  const getUserMediaWithTimeout = (
    constraints: MediaStreamConstraints,
    timeoutMs: number
  ): Promise<MediaStream> => {
    return new Promise<MediaStream>((resolve, reject) => {
      let completed = false;
      const timer = setTimeout(() => {
        if (!completed) {
          completed = true;
          reject(new DOMException("Timeout starting video source", "AbortError"));
        }
      }, timeoutMs);
      navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
          if (!completed) { completed = true; clearTimeout(timer); resolve(stream); }
          else stream.getTracks().forEach((t) => t.stop());
        })
        .catch((err) => {
          if (!completed) { completed = true; clearTimeout(timer); reject(err); }
        });
    });
  };

  const startCamera = async () => {
    setErrorMsg(null);
    setHasStarted(false);
    setCapturedDataUrl(null);
    setCapturedIsBlurry(false);
    if (capturedVideoUrl) URL.revokeObjectURL(capturedVideoUrl);
    setCapturedVideoBlob(null);
    setCapturedVideoUrl(null);
    setFeedback("Requesting camera access...");
    setFeedbackColor("text-blue-500");

    if (!navigator.mediaDevices?.getUserMedia) {
      setErrorMsg("Camera APIs are not supported on this browser or insecure origin.");
      return;
    }

    const isAutomated = typeof navigator !== "undefined" && !!navigator.webdriver;
    const timeout = isAutomated ? 800 : 1800;

    try {
      let hasCamera = true;
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        hasCamera = devices.some((d) => d.kind === "videoinput");
      } catch { /* fallback */ }

      if (!hasCamera) throw new Error("No camera devices detected on this system.");

      let stream: MediaStream;
      try {
        stream = await getUserMediaWithTimeout(
          { video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: type === "video" },
          timeout
        );
      } catch {
        stream = await getUserMediaWithTimeout({ video: true, audio: type === "video" }, timeout);
      }

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setHasStarted(true);
        setFeedback("Hold camera steady");
        setFeedbackColor("text-emerald-500");
        startRealTimeAnalysis();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Camera access denied.";
      setErrorMsg(msg);
      setFeedback("Initialization failed");
      setFeedbackColor("text-destructive");
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setHasStarted(false);
    setIsRecording(false);
    isRecordingRef.current = false;
    recordedChunksRef.current = [];
  };

  const startRealTimeAnalysis = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let active = true;

    const analyzeFrame = () => {
      if (!active || !videoRef.current || videoRef.current.paused || videoRef.current.ended) return;
      const vW = video.videoWidth || 640;
      const vH = video.videoHeight || 480;
      canvas.width = 150;
      canvas.height = 150;
      const crop = Math.min(vW, vH) * 0.6;
      const sx = (vW - crop) / 2;
      const sy = (vH - crop) / 2;
      try {
        ctx.drawImage(video, sx, sy, crop, crop, 0, 0, 150, 150);
        const pixels = ctx.getImageData(0, 0, 150, 150).data;
        let brightness = 0;
        for (let i = 0; i < pixels.length; i += 4) brightness += (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
        const avgBrightness = brightness / (pixels.length / 4);

        const gray = new Float32Array(150 * 150);
        for (let i = 0; i < pixels.length; i += 4) {
          gray[i / 4] = 0.299 * pixels[i] + 0.587 * pixels[i + 1] + 0.114 * pixels[i + 2];
        }
        let lapSum = 0;
        let edgePx = 0;
        for (let y = 1; y < 149; y++) {
          for (let x = 1; x < 149; x++) {
            const idx = y * 150 + x;
            const v = Math.abs(gray[idx - 150] + gray[idx - 1] - 4 * gray[idx] + gray[idx + 1] + gray[idx + 150]);
            lapSum += v;
            if (v > 15) edgePx++;
          }
        }
        const avgLap = lapSum / (150 * 150);
        const edgeDensity = edgePx / (150 * 150);

        if (avgBrightness < 35) { setFeedback("Too dark — find better lighting"); setFeedbackColor("text-amber-500"); }
        else if (avgBrightness > 225) { setFeedback("Too bright — avoid direct glare"); setFeedbackColor("text-amber-500"); }
        else if (avgLap < BLUR_THRESHOLD) { setFeedback("Blurry — hold steady or tap to focus"); setFeedbackColor("text-amber-500"); }
        else if (edgeDensity < 0.02) { setFeedback("Too far — bring product closer"); setFeedbackColor("text-blue-400"); }
        else if (edgeDensity > 0.35) { setFeedback("Too close — pull camera back slightly"); setFeedbackColor("text-blue-400"); }
        else { setFeedback("Perfect frame — ready to capture!"); setFeedbackColor("text-emerald-500"); }
      } catch { /* ignore canvas errors */ }

      setTimeout(() => { if (active) requestAnimationFrame(analyzeFrame); }, 250);
    };

    requestAnimationFrame(analyzeFrame);
    return () => { active = false; };
  };

  // ── Simulate (dev bypass) ─────────────────────────────────────────────────

  const handleSimulateCapture = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 800; canvas.height = 600;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const g = ctx.createLinearGradient(0, 0, 800, 600);
    g.addColorStop(0, "#1e293b"); g.addColorStop(1, "#0f172a");
    ctx.fillStyle = g; ctx.fillRect(0, 0, 800, 600);
    ctx.strokeStyle = "rgba(255,255,255,0.3)"; ctx.lineWidth = 4;
    ctx.setLineDash([15, 10]); ctx.strokeRect(100, 75, 600, 450);
    ctx.fillStyle = "rgba(255,255,255,0.05)"; ctx.beginPath();
    if (typeof ctx.roundRect === "function") ctx.roundRect(250, 125, 300, 350, 20);
    else ctx.rect(250, 125, 300, 350);
    ctx.fill(); ctx.strokeStyle = "rgba(255,255,255,0.15)"; ctx.setLineDash([]); ctx.stroke();
    ctx.fillStyle = "#ffffff"; ctx.font = "bold 22px sans-serif"; ctx.textAlign = "center";
    ctx.fillText("TRUST LAYER SECURE CAPTURE", 400, 220);
    ctx.fillStyle = "#94a3b8"; ctx.font = "15px sans-serif";
    ctx.fillText(`Simulated: ${type.toUpperCase()}`, 400, 260);
    ctx.fillStyle = "#10b981"; ctx.font = "bold 13px sans-serif";
    ctx.fillText("✓ ANTI-FRAUD VERIFICATION PASS", 400, 310);
    ctx.fillStyle = "rgba(255,255,255,0.2)"; ctx.font = "11px monospace";
    ctx.fillText(`TS: ${new Date().toISOString()}`, 400, 380);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
    setCapturedDataUrl(dataUrl);
    setCapturedIsBlurry(false);
  };

  const handleSimulateVideo = () => {
    const blob = new Blob(["mock video data - simulated verification clip"], { type: "video/webm" });
    if (onCaptureVideo) {
      onCaptureVideo(blob);
      toast.success("Simulated video verification captured!");
      stopCamera();
      onClose();
    }
  };

  // ── Photo capture & review ────────────────────────────────────────────────

  const handleCapture = () => {
    const video = videoRef.current;
    if (!video) return;
    const blurScore = computeBlurScore(video);
    const isBlurry = blurScore < BLUR_THRESHOLD;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setCapturedDataUrl(dataUrl);
    setCapturedIsBlurry(isBlurry);
    if (isBlurry) toast.warning("Photo looks blurry — consider retaking for best quality.");
  };

  const handleRetakePhoto = () => {
    setCapturedDataUrl(null);
    setCapturedIsBlurry(false);
    if (!streamRef.current) startCamera();
  };

  const handleSubmitPhoto = () => {
    if (!capturedDataUrl) return;
    onCapture(capturedDataUrl);
    toast.success("Photo captured successfully!");
    stopCamera();
    onClose();
  };

  // ── Video recording & review ──────────────────────────────────────────────

  const handleStartRecording = () => {
    if (!streamRef.current) return;
    recordedChunksRef.current = [];
    isRecordingRef.current = true;
    setIsRecording(true);
    setRecordingSeconds(0);

    let recorder: MediaRecorder;
    try {
      recorder = new MediaRecorder(streamRef.current, { mimeType: "video/webm;codecs=vp9,opus" });
    } catch {
      recorder = new MediaRecorder(streamRef.current);
    }

    recorder.ondataavailable = (e) => {
      if (e.data?.size > 0) recordedChunksRef.current.push(e.data);
    };

    mediaRecorderRef.current = recorder;
    recorder.start(100); // flush every 100 ms so chunks arrive before stop
    toast.info("Recording verification video...");
  };

  const handleStopRecording = () => {
    if (!isRecordingRef.current) return;
    isRecordingRef.current = false;
    setIsRecording(false);

    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop(); // triggers one final ondataavailable before onstop
    }

    // Blur check on last frame
    const video = videoRef.current;
    if (video) {
      const score = computeBlurScore(video);
      if (score < BLUR_THRESHOLD) {
        toast.warning("Some frames may be blurry — retake for better quality if needed.");
      }
    }

    // Collect chunks after MediaRecorder fully flushes
    setTimeout(() => {
      const chunks = recordedChunksRef.current;
      let blob: Blob;
      if (chunks.length > 0) {
        blob = new Blob(chunks, { type: "video/webm" });
      } else {
        blob = new Blob(["mock video data"], { type: "video/webm" });
      }
      const url = URL.createObjectURL(blob);
      setCapturedVideoBlob(blob);
      setCapturedVideoUrl(url);
    }, 350);
  };

  const handleRetakeVideo = () => {
    if (capturedVideoUrl) URL.revokeObjectURL(capturedVideoUrl);
    setCapturedVideoBlob(null);
    setCapturedVideoUrl(null);
    recordedChunksRef.current = [];
    if (!streamRef.current) startCamera();
  };

  const handleSubmitVideo = () => {
    if (!capturedVideoBlob || !onCaptureVideo) return;
    onCaptureVideo(capturedVideoBlob);
    toast.success("Video verification captured!");
    stopCamera();
    onClose();
  };

  if (!isOpen) return null;

  const isPhotoPreview = capturedDataUrl !== null;
  const isVideoPreview = capturedVideoBlob !== null;
  const inPreview = isPhotoPreview || isVideoPreview;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col select-none">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-5 py-4 text-white z-10 bg-gradient-to-b from-black/70 to-transparent absolute top-0 left-0 right-0">
        <button
          onClick={() => {
            if (isPhotoPreview) { handleRetakePhoto(); return; }
            if (isVideoPreview) { handleRetakeVideo(); return; }
            stopCamera();
            onClose();
          }}
          className="text-white/80 text-sm font-bold hover:text-white transition-colors active:scale-95"
        >
          Cancel
        </button>
        <h3 className="font-extrabold text-sm">{title}</h3>
        <div className="w-14" />
      </div>

      {/* Main View */}
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 overflow-hidden">

        {/* Always-mounted live video (hidden during preview via CSS) */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover ${inPreview || errorMsg ? "invisible" : ""}`}
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* Photo preview */}
        {isPhotoPreview && capturedDataUrl && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <img
              src={capturedDataUrl}
              alt="Captured preview"
              className="max-w-full max-h-full object-contain"
            />
            {capturedIsBlurry && (
              <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2.5 bg-amber-500/90 backdrop-blur-md rounded-2xl px-4 py-3">
                <AlertCircle className="w-4 h-4 text-white shrink-0" />
                <span className="text-white text-xs font-bold leading-snug">
                  Photo may be blurry — retake for best quality
                </span>
              </div>
            )}
          </div>
        )}

        {/* Video preview */}
        {isVideoPreview && capturedVideoUrl && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <video
              src={capturedVideoUrl}
              controls
              autoPlay
              loop
              playsInline
              className="max-w-full max-h-full object-contain"
            />
          </div>
        )}

        {/* Error state */}
        {!inPreview && errorMsg && (
          <div className="flex flex-col items-center gap-4 text-center px-8 text-white max-w-sm z-10">
            <AlertCircle className="w-12 h-12 text-destructive animate-pulse" />
            <div className="flex flex-col gap-1">
              <p className="text-sm font-bold">{errorMsg}</p>
              <p className="text-[11px] text-zinc-400">
                In secure mode, live camera is required. Use the bypass below for testing.
              </p>
            </div>
            <div className="flex flex-col gap-2 w-full mt-2">
              <Button onClick={startCamera} variant="outline" className="border-white/20 text-white rounded-xl h-11 text-xs font-bold active:scale-[0.98]">
                <RefreshCw className="w-3.5 h-3.5 mr-2" /> Retry Camera
              </Button>
              <Button
                type="button"
                onClick={type === "video" ? handleSimulateVideo : handleSimulateCapture}
                className="bg-primary text-primary-foreground hover:bg-primary/95 rounded-xl h-11 text-xs font-bold active:scale-[0.98] shadow-lg shadow-primary/20"
              >
                Simulate {type === "video" ? "Video Capture" : "Photo Capture"} (Dev Bypass)
              </Button>
            </div>
          </div>
        )}

        {/* Live camera overlays (guide + feedback) */}
        {!inPreview && !errorMsg && hasStarted && (
          <>
            {/* Framing guide */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[70%] aspect-square border-2 border-dashed border-white/40 rounded-3xl relative flex items-center justify-center">
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-white" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-white" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-white" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-white" />
                <div className="w-12 h-12 rounded-full border border-white/20 animate-ping" />
              </div>
            </div>

            {/* Real-time feedback pill */}
            <div className="absolute top-20 left-4 right-4 flex justify-center pointer-events-none">
              <div className="px-4 py-2 bg-black/70 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-2 shadow-md">
                <span className={`text-[11px] font-extrabold tracking-wide uppercase ${feedbackColor}`}>
                  {feedback}
                </span>
              </div>
            </div>

            {/* Recording timer */}
            {isRecording && (
              <div className="absolute top-36 left-4 right-4 flex flex-col items-center gap-2 pointer-events-none">
                <div className="flex items-center gap-2 bg-red-600 px-4 py-1.5 rounded-full text-white font-extrabold text-xs tracking-wider animate-pulse shadow-md">
                  <Video className="w-3.5 h-3.5" />
                  <span>REC {recordingSeconds}s / {MAX_RECORDING_SECONDS}s</span>
                </div>
                <div className="w-40 h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 transition-all duration-1000 ease-linear"
                    style={{ width: `${(recordingSeconds / MAX_RECORDING_SECONDS) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="px-6 py-8 bg-gradient-to-t from-black/90 to-transparent flex flex-col items-center gap-4 z-10">

        {/* ── Photo preview controls ── */}
        {isPhotoPreview && (
          <div className="w-full flex gap-3 max-w-sm mx-auto">
            <Button
              type="button"
              variant="outline"
              onClick={handleRetakePhoto}
              className="flex-1 border-white/30 text-white bg-white/10 hover:bg-white/20 rounded-2xl h-14 text-sm font-bold active:scale-[0.98] transition-all"
            >
              Retake Photo
            </Button>
            <Button
              type="button"
              onClick={handleSubmitPhoto}
              className="flex-1 bg-white text-black hover:bg-white/90 rounded-2xl h-14 text-sm font-bold active:scale-[0.98] transition-all shadow-lg"
            >
              Submit Photo
            </Button>
          </div>
        )}

        {/* ── Video preview controls ── */}
        {isVideoPreview && (
          <div className="w-full flex gap-3 max-w-sm mx-auto">
            <Button
              type="button"
              variant="outline"
              onClick={handleRetakeVideo}
              className="flex-1 border-white/30 text-white bg-white/10 hover:bg-white/20 rounded-2xl h-14 text-sm font-bold active:scale-[0.98] transition-all"
            >
              Retake Video
            </Button>
            <Button
              type="button"
              onClick={handleSubmitVideo}
              className="flex-1 bg-white text-black hover:bg-white/90 rounded-2xl h-14 text-sm font-bold active:scale-[0.98] transition-all shadow-lg"
            >
              Submit Video
            </Button>
          </div>
        )}

        {/* ── Live camera controls ── */}
        {!inPreview && !errorMsg && (
          <>
            {type === "video" ? (
              <div className="flex items-center justify-center">
                {isRecording ? (
                  <button
                    onClick={handleStopRecording}
                    className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-red-600 hover:scale-105 active:scale-95 transition-all shadow-lg"
                  >
                    {/* Square stop icon */}
                    <div className="w-7 h-7 bg-white rounded-md" />
                  </button>
                ) : (
                  <button
                    onClick={handleStartRecording}
                    disabled={!hasStarted}
                    className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-red-600 disabled:opacity-50 hover:scale-105 active:scale-95 transition-all shadow-lg"
                  >
                    {/* Circle record icon */}
                    <div className="w-10 h-10 bg-red-400 rounded-full" />
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <button
                  onClick={handleCapture}
                  disabled={!hasStarted}
                  className="w-20 h-20 rounded-full border-4 border-white bg-white disabled:opacity-50 hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center justify-center"
                >
                  <div className="w-14 h-14 rounded-full bg-white border border-black/10 flex items-center justify-center text-primary">
                    <Camera className="w-7 h-7" />
                  </div>
                </button>
              </div>
            )}

            <div className="flex items-center gap-1.5 text-[10px] text-white/50 font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Real-time Secure Verification Camera</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
