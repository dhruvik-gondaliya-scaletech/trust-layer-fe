"use client";

import React, { useEffect, useRef, useState } from "react";
import { Camera, RefreshCw, AlertCircle, Video, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getBlurScore } from "@/utils/blur";
import { getDistanceRatio } from "@/utils/distance";
import { CameraMode } from "@/types/enums";

interface CameraValidationProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (dataUrl: string) => void;
  onCaptureVideo?: (videoBlob: Blob) => void;
  type: CameraMode;
  title: string;
}

enum CameraFeedback {
  INITIALIZING = "Initializing camera...",
  REQUESTING_ACCESS = "Requesting camera access...",
  POSITION_ITEM = "Position item inside frame",
  INITIALIZATION_FAILED = "Initialization failed",
  LOADING_CV = "Loading computer vision...",
  HOLD_STEADY = "Hold steady to focus",
  GET_CLOSER = "Get a bit closer",
  MOVE_BACK = "Move back if product is cropped",
  PERFECT_PHOTO = "Perfect. Ready to capture.",
  PERFECT_RECORD = "Perfect. Ready to record.",
}

const MAX_RECORDING_SECONDS = 60;

export const CameraValidation: React.FC<CameraValidationProps> = ({
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
  const recordedChunksRef = useRef<Blob[]>([]);
  const isRecordingRef = useRef(false);
  const ratioHistoryRef = useRef<number[]>([]);
  const lastDistanceStateRef = useRef<"closer" | "perfect" | "back">("perfect");
  // Holds the stop fn for the current analysis loop; called before starting a new one
  const analysisCleanupRef = useRef<(() => void) | null>(null);
  // Pauses the analysis loop while the user is reviewing a captured photo/video
  const inPreviewRef = useRef(false);
  // Tracks the actual MIME type the MediaRecorder settled on to avoid type/data mismatch
  const mimeTypeRef = useRef<string>("video/webm");

  const [hasStarted, setHasStarted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string>(CameraFeedback.INITIALIZING);
  const [feedbackColor, setFeedbackColor] = useState<string>("text-blue-400");

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
    ratioHistoryRef.current = [];
    lastDistanceStateRef.current = "perfect";
    inPreviewRef.current = false;
    if (capturedVideoUrl) URL.revokeObjectURL(capturedVideoUrl);
    setCapturedVideoBlob(null);
    setCapturedVideoUrl(null);
    setFeedback(CameraFeedback.REQUESTING_ACCESS);
    setFeedbackColor("text-blue-400");

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
          { video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: type === CameraMode.VIDEO },
          timeout
        );
      } catch {
        stream = await getUserMediaWithTimeout({ video: true, audio: type === CameraMode.VIDEO }, timeout);
      }

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch((err) => {
          console.warn("video.play() failed or was blocked by browser:", err);
        });
        setHasStarted(true);
        setFeedback(CameraFeedback.POSITION_ITEM);
        setFeedbackColor("text-blue-400");
        startRealTimeAnalysis();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Camera access denied.";
      setErrorMsg(msg);
      setFeedback(CameraFeedback.INITIALIZATION_FAILED);
      setFeedbackColor("text-red-500");
    }
  };

  const stopCamera = () => {
    // Kill the analysis loop before stopping the stream
    analysisCleanupRef.current?.();
    analysisCleanupRef.current = null;
    // Cancel any in-progress recording. Clear onstop BEFORE calling stop() so
    // the async onstop callback never fires and cannot corrupt the next session
    // with stale chunks from this canceled recording.
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.onstop = null;
      try { recorder.stop(); } catch { /* ignore */ }
    }
    mediaRecorderRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    // Clear srcObject so the browser releases the stream reference (important on iOS)
    if (videoRef.current) videoRef.current.srcObject = null;
    setHasStarted(false);
    setIsRecording(false);
    isRecordingRef.current = false;
    recordedChunksRef.current = [];
  };

  const startRealTimeAnalysis = () => {
    // Stop any existing loop before starting a new one to prevent multiple loops
    analysisCleanupRef.current?.();

    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    const S = 320; // 320x320 analysis resolution
    let active = true;
    analysisCleanupRef.current = () => { active = false; };

    const analyzeFrame = () => {
      if (!active || !videoRef.current) return;

      // Pause while showing preview to save CPU/battery
      if (inPreviewRef.current) {
        setTimeout(() => { if (active) requestAnimationFrame(analyzeFrame); }, 500);
        return;
      }

      if (video.paused || video.ended || video.readyState < 2 || video.videoWidth === 0) {
        // Schedule next check instead of exiting permanently
        setTimeout(() => { if (active) requestAnimationFrame(analyzeFrame); }, 300);
        return;
      }

      if (!window.cv) {
        setFeedback(CameraFeedback.LOADING_CV);
        setFeedbackColor("text-blue-400");
        setTimeout(() => { if (active) requestAnimationFrame(analyzeFrame); }, 300);
        return;
      }

      const vW = video.videoWidth || 640;
      const vH = video.videoHeight || 480;
      canvas.width = S;
      canvas.height = S;

      // Crop video to a square and draw onto hidden canvas
      const crop = Math.min(vW, vH);
      const sx = (vW - crop) / 2;
      const sy = (vH - crop) / 2;

      try {
        ctx.drawImage(video, sx, sy, crop, crop, 0, 0, S, S);

        // Convert the 320x320 canvas to an OpenCV Mat
        const src = window.cv.imread(canvas);

        const blurScore = getBlurScore(src);
        const distanceRatio = getDistanceRatio(src);

        // Delete Mat to avoid memory leak
        src.delete();

        // Rolling average over last 5 frames to smooth per-device sensor noise
        const history = ratioHistoryRef.current;
        history.push(distanceRatio);
        if (history.length > 5) history.shift();
        const smoothedRatio = history.reduce((a, b) => a + b, 0) / history.length;

        // Hysteresis: exit bands are wider than entry bands so the message
        // doesn't flip at the threshold edge on different-FOV cameras.
        // Entry: closer < 0.20, back > 0.75
        // Exit:  closer needs > 0.27 to leave, back needs < 0.68 to leave
        const prev = lastDistanceStateRef.current;
        let distanceState: "closer" | "perfect" | "back";
        if (prev === "closer") {
          distanceState = smoothedRatio < 0.27 ? "closer" : smoothedRatio > 0.75 ? "back" : "perfect";
        } else if (prev === "back") {
          distanceState = smoothedRatio > 0.68 ? "back" : smoothedRatio < 0.20 ? "closer" : "perfect";
        } else {
          distanceState = smoothedRatio < 0.20 ? "closer" : smoothedRatio > 0.75 ? "back" : "perfect";
        }
        lastDistanceStateRef.current = distanceState;

        if (blurScore < 80) {
          setFeedback(CameraFeedback.HOLD_STEADY);
          setFeedbackColor("text-amber-400");
        } else if (distanceState === "closer") {
          setFeedback(CameraFeedback.GET_CLOSER);
          setFeedbackColor("text-amber-400");
        } else if (distanceState === "back") {
          setFeedback(CameraFeedback.MOVE_BACK);
          setFeedbackColor("text-amber-400");
        } else {
          setFeedback(type === CameraMode.VIDEO ? CameraFeedback.PERFECT_RECORD : CameraFeedback.PERFECT_PHOTO);
          setFeedbackColor("text-emerald-400");
        }
      } catch (err) {
        console.error("Frame analysis failed:", err);
      }

      // Analyze every 300ms
      setTimeout(() => { if (active) requestAnimationFrame(analyzeFrame); }, 300);
    };

    requestAnimationFrame(analyzeFrame);
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
    inPreviewRef.current = true;
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

    // Full-resolution canvas for the submitted image
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    let isBlurry = false;
    if (window.cv) {
      try {
        // Run blur check at the same 320x320 resolution used by live analysis so
        // the threshold of 80 stays consistent regardless of capture resolution
        const analysisCanvas = document.createElement("canvas");
        analysisCanvas.width = 320;
        analysisCanvas.height = 320;
        const aCtx = analysisCanvas.getContext("2d");
        if (aCtx) {
          const vW = video.videoWidth || 1280;
          const vH = video.videoHeight || 720;
          const crop = Math.min(vW, vH);
          aCtx.drawImage(video, (vW - crop) / 2, (vH - crop) / 2, crop, crop, 0, 0, 320, 320);
          const src = window.cv.imread(analysisCanvas);
          const blurScore = getBlurScore(src);
          isBlurry = blurScore < 80;
          src.delete();
        }
      } catch (err) {
        console.error("Capture analysis failed:", err);
      }
    }

    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    inPreviewRef.current = true;
    setCapturedDataUrl(dataUrl);
    setCapturedIsBlurry(isBlurry);
    if (isBlurry) toast.warning("Photo looks blurry — consider retaking for best quality.");
  };

  const handleRetakePhoto = () => {
    inPreviewRef.current = false;
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

    // Probe for the best supported MIME type to avoid type/data mismatch on Safari
    // (Safari records mp4, not webm)
    let chosenMime = "";
    if (typeof MediaRecorder !== "undefined") {
      for (const candidate of [
        "video/webm;codecs=vp9,opus",
        "video/webm",
        "video/mp4",
      ]) {
        if (MediaRecorder.isTypeSupported(candidate)) {
          chosenMime = candidate;
          break;
        }
      }
    }

    let recorder: MediaRecorder;
    try {
      recorder = chosenMime
        ? new MediaRecorder(streamRef.current, { mimeType: chosenMime })
        : new MediaRecorder(streamRef.current);
    } catch {
      recorder = new MediaRecorder(streamRef.current);
    }

    // Use the MIME type the recorder actually settled on for the Blob
    mimeTypeRef.current = recorder.mimeType || chosenMime || "video/webm";

    recorder.ondataavailable = (e) => {
      if (e.data?.size > 0) recordedChunksRef.current.push(e.data);
    };

    // Use onstop instead of a fixed timeout — the spec guarantees all
    // ondataavailable events fire before onstop, so chunks are complete here
    recorder.onstop = () => {
      const chunks = recordedChunksRef.current;
      if (chunks.length === 0) {
        toast.error("Recording captured no data — please try again.");
        inPreviewRef.current = false;
        return;
      }
      const blob = new Blob(chunks, { type: mimeTypeRef.current });
      const url = URL.createObjectURL(blob);
      inPreviewRef.current = true;
      setCapturedVideoBlob(blob);
      setCapturedVideoUrl(url);
    };

    mediaRecorderRef.current = recorder;
    recorder.start(100); // flush every 100 ms
    toast.info("Recording verification video...");
  };

  const handleStopRecording = () => {
    if (!isRecordingRef.current) return;
    isRecordingRef.current = false;
    setIsRecording(false);

    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop(); // triggers ondataavailable flush → then onstop → blob creation
    }

    // Blur check on last frame at the same 320x320 as live analysis
    const video = videoRef.current;
    if (video && window.cv) {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 320;
        canvas.height = 320;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const vW = video.videoWidth || 640;
          const vH = video.videoHeight || 480;
          const crop = Math.min(vW, vH);
          ctx.drawImage(video, (vW - crop) / 2, (vH - crop) / 2, crop, crop, 0, 0, 320, 320);
          const src = window.cv.imread(canvas);
          const blurScore = getBlurScore(src);
          src.delete();
          if (blurScore < 80) {
            toast.warning("Some frames may be blurry — retake for better quality if needed.");
          }
        }
      } catch (err) {
        console.error("Video stop analysis error:", err);
      }
    }
  };

  const handleRetakeVideo = () => {
    inPreviewRef.current = false;
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
        {/* Live camera stream */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover ${inPreview || errorMsg ? "invisible" : ""}`}
        />
        {/* Hidden analysis canvas (resized to 320x320) */}
        <canvas ref={canvasRef} width={320} height={320} className="hidden" style={{ display: "none" }} />

        {/* Photo preview */}
        {isPhotoPreview && capturedDataUrl && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <Image
              src={capturedDataUrl}
              alt="Captured preview"
              fill
              unoptimized
              className="object-contain"
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
                onClick={type === CameraMode.VIDEO ? handleSimulateVideo : handleSimulateCapture}
                className="bg-primary text-primary-foreground hover:bg-primary/95 rounded-xl h-11 text-xs font-bold active:scale-[0.98] shadow-lg shadow-primary/20"
              >
                Simulate {type === CameraMode.VIDEO ? "Video Capture" : "Photo Capture"} (Dev Bypass)
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
                <span className={`text-[13px] font-semibold tracking-wide ${feedbackColor}`}>
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
            {type === CameraMode.VIDEO ? (
              <div className="flex items-center justify-center">
                {isRecording ? (
                  <button
                    onClick={handleStopRecording}
                    className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-red-600 hover:scale-105 active:scale-95 transition-all shadow-lg"
                  >
                    <div className="w-7 h-7 bg-white rounded-md" />
                  </button>
                ) : (
                  <button
                    onClick={handleStartRecording}
                    disabled={!hasStarted}
                    className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-red-600 disabled:opacity-50 hover:scale-105 active:scale-95 transition-all shadow-lg"
                  >
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
              <span>Real-time Secure Verification Camera (OpenCV.js Enabled)</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
