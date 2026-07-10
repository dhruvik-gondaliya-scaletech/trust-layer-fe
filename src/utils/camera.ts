import { useState, useCallback, useRef, useEffect } from 'react';

type RecordingState = 'idle' | 'recording' | 'paused';

export const useCamera = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  const close = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setStream(null);
    }
  }, []);

  const open = useCallback(async (isVideo: boolean = false) => {
    if (isStarting) return;
    setIsStarting(true);
    setError(null);
    close();

    try {
      const idealVideo: MediaTrackConstraints = {
        facingMode: { ideal: "environment" },
        width: { ideal: 1920 },
        height: { ideal: 1080 },
      };

      // Fallback ladder: ideal constraints → generic device → (video mode
      // only) drop the audio requirement entirely. A missing or in-use
      // microphone must never black out the camera preview — a silent
      // verification video beats no video.
      const attempts: MediaStreamConstraints[] = [
        { video: idealVideo, audio: isVideo },
        { video: true, audio: isVideo },
      ];
      if (isVideo) {
        attempts.push(
          { video: idealVideo, audio: false },
          { video: true, audio: false },
        );
      }

      let newStream: MediaStream | null = null;
      let lastErr: unknown = null;
      for (const constraints of attempts) {
        try {
          newStream = await navigator.mediaDevices.getUserMedia(constraints);
          break;
        } catch (attemptErr: any) {
          lastErr = attemptErr;
          // User explicitly denied — retrying other constraints just re-prompts.
          if (attemptErr?.name === 'NotAllowedError') throw attemptErr;
        }
      }
      if (!newStream) throw lastErr;

      if (isVideo && newStream.getAudioTracks().length === 0) {
        console.warn('Recording without audio — no usable microphone found.');
      }

      streamRef.current = newStream;
      setStream(newStream);
    } catch (err: any) {
      console.error('Camera open error:', err);
      if (err.name === 'NotAllowedError') {
        setError('Camera access denied. Please grant permission.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera device found.');
      } else if (err.name === 'NotReadableError') {
        setError('Camera is already in use.');
      } else {
        setError(err.message || 'Camera access denied');
      }
    } finally {
      setIsStarting(false);
    }
  }, [close, isStarting]);

  useEffect(() => {
    return () => {
      close();
    };
  }, [close]);

  return { stream, error, isStarting, open, close };
};

export const usePhotoCapture = () => {
  const capturePhoto = useCallback((videoElement: HTMLVideoElement | null) => {
    if (!videoElement) return null;
    try {
      const canvas = document.createElement('canvas');
      canvas.width = videoElement.videoWidth || 1920;
      canvas.height = videoElement.videoHeight || 1080;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/jpeg', 0.9);
    } catch (err) {
      console.error('Failed to capture photo', err);
      return null;
    }
  }, []);
  return { capturePhoto };
};

// Verification videos must fall within this window: long enough to prove
// physical possession from multiple angles, short enough to stay uploadable.
export const MIN_RECORDING_SECONDS = 10;
export const MAX_RECORDING_SECONDS = 60;

export const useVideoRecording = () => {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  // Set when the MAX_RECORDING_SECONDS auto-stop fires with nobody awaiting
  // stopRecording() — lets the caller still receive the finished blob.
  const [autoStoppedBlob, setAutoStoppedBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const resolveRef = useRef<((value: Blob | null) => void) | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mimeTypeRef = useRef<string>('video/webm');

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const clearAutoStoppedBlob = useCallback(() => setAutoStoppedBlob(null), []);

  const startRecording = useCallback((stream: MediaStream | null) => {
    if (!stream) return;
    if (typeof MediaRecorder === 'undefined') {
      console.error('MediaRecorder is not supported in this browser');
      return;
    }

    chunksRef.current = [];
    setRecordingSeconds(0);
    setAutoStoppedBlob(null);
    clearTimer();

    try {
      let mimeType = '';
      for (const candidate of ['video/webm;codecs=vp9,opus', 'video/webm', 'video/mp4']) {
        if (MediaRecorder.isTypeSupported(candidate)) {
          mimeType = candidate;
          break;
        }
      }
      mimeTypeRef.current = mimeType || 'video/webm';

      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onerror = (event) => {
        console.error('MediaRecorder error', event);
      };
      recorder.onstop = () => {
        clearTimer();
        const chunks = chunksRef.current;
        const blob = chunks.length > 0 ? new Blob(chunks, { type: recorder.mimeType || mimeTypeRef.current }) : null;
        setRecordingState('idle');

        if (resolveRef.current) {
          // A caller is awaiting stopRecording() — hand the blob back directly.
          resolveRef.current(blob);
          resolveRef.current = null;
        } else if (blob) {
          // Nobody called stopRecording() — this was the MAX_RECORDING_SECONDS
          // auto-stop. Surface the finished blob via state instead of dropping it.
          setAutoStoppedBlob(blob);
        }
      };
      recorder.start(100);
      setRecordingState('recording');

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          const next = prev + 1;
          if (next >= MAX_RECORDING_SECONDS) {
            clearTimer();
            const activeRecorder = mediaRecorderRef.current;
            if (activeRecorder && activeRecorder.state !== 'inactive') {
              try {
                activeRecorder.stop();
              } catch (e) {
                console.error('Failed to auto-stop recording at max duration', e);
              }
            }
          }
          return next;
        });
      }, 1000);
    } catch (err) {
      console.error('Recording failed to start', err);
      setRecordingState('idle');
    }
  }, [clearTimer]);

  const stopRecording = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const recorder = mediaRecorderRef.current;
      if (recorder && recorder.state !== 'inactive') {
        resolveRef.current = resolve;
        try {
          recorder.stop();
        } catch (err) {
          console.error('Failed to stop recording', err);
          resolveRef.current = null;
          resolve(null);
        }
      } else {
        resolve(null);
      }
    });
  }, []);

  // Stop any in-progress recording if the component unmounts mid-recording
  // (e.g. user backs out of the camera overlay) instead of leaking the recorder.
  useEffect(() => {
    return () => {
      clearTimer();
      const recorder = mediaRecorderRef.current;
      if (recorder && recorder.state !== 'inactive') {
        recorder.onstop = null;
        try {
          recorder.stop();
        } catch {
          // ignore — we're tearing down anyway
        }
      }
    };
  }, [clearTimer]);

  return {
    startRecording,
    stopRecording,
    recordingState,
    recordingSeconds,
    autoStoppedBlob,
    clearAutoStoppedBlob,
    minRecordingSeconds: MIN_RECORDING_SECONDS,
    maxRecordingSeconds: MAX_RECORDING_SECONDS,
  };
};
