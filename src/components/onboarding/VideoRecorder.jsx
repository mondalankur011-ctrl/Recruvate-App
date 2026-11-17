import React, { useEffect, useRef, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, Upload, Video, Square } from "lucide-react";
import { qualityOf } from "@/lib/match";

const MAX_SECONDS = 90;
const MIN_SECONDS = 40;

const clock = (seconds) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

const readDuration = (file) =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const el = document.createElement("video");
    el.preload = "metadata";
    el.onloadedmetadata = () => {
      const duration = el.duration;
      URL.revokeObjectURL(url);
      resolve(duration);
    };
    el.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("unreadable"));
    };
    el.src = url;
  });

export default function VideoRecorder({ onChange }) {
  const [mode, setMode] = useState("idle");
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState("");
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const elapsedRef = useRef(0);
  const fileRef = useRef(null);

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => stopStream, []);

  const upload = async (file, seconds) => {
    setMode("uploading");
    setError("");
    try {
      const { file_uri } = await base44.integrations.Core.UploadPrivateFile({ file });
      onChange({
        uri: file_uri,
        duration: Math.round(seconds),
        quality: qualityOf(seconds).label,
      });
      setMode("idle");
    } catch (err) {
      setError(err.message || "We couldn't save that video. Please try again.");
      setMode("idle");
    }
  };

  const finalize = async (mimeType) => {
    const seconds = elapsedRef.current;
    stopStream();
    if (seconds < MIN_SECONDS) {
      setMode("idle");
      setError(
        `That take was ${seconds}s. It needs at least ${MIN_SECONDS} seconds — give it another go.`
      );
      return;
    }
    const blob = new Blob(chunksRef.current, { type: "video/webm" });
    const file = new File([blob], `intro-${Date.now()}.webm`, { type: mimeType || "video/webm" });
    await upload(file, seconds);
  };

  const stopRecording = () => {
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
  };

  const startRecording = async () => {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 720 } },
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
      const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
        ? "video/webm;codecs=vp9"
        : "video/webm";
      const recorder = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => finalize(mimeType);
      recorder.start();
      recorderRef.current = recorder;
      elapsedRef.current = 0;
      setElapsed(0);
      setMode("recording");
    } catch (err) {
      setError("We couldn't reach your camera. You can upload a video instead.");
    }
  };

  useEffect(() => {
    if (mode !== "recording") return undefined;
    const timer = setInterval(() => {
      elapsedRef.current += 1;
      setElapsed(elapsedRef.current);
      if (elapsedRef.current >= MAX_SECONDS) stopRecording();
    }, 1000);
    return () => clearInterval(timer);
  }, [mode]);

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setError("");
    let seconds = 0;
    try {
      seconds = await readDuration(file);
    } catch (err) {
      setError("We couldn't read that file. Try a different video.");
      return;
    }
    if (!seconds || seconds < MIN_SECONDS || seconds > MAX_SECONDS) {
      onChange(null);
      setError(
        `That video is ${Math.round(seconds) || "?"}s long. Your intro must be between ${MIN_SECONDS} and ${MAX_SECONDS} seconds.`
      );
      return;
    }
    await upload(file, seconds);
  };

  const quality = qualityOf(elapsed);
  const progress = Math.min(100, (elapsed / MAX_SECONDS) * 100);

  return (
    <div>
      <input ref={fileRef} type="file" accept="video/*" onChange={handleFile} className="hidden" />

      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[28px] bg-foreground">
        <video
          ref={videoRef}
          muted
          playsInline
          autoPlay
          className={`h-full w-full object-cover transition-opacity duration-300 ${
            mode === "recording" ? "opacity-100" : "opacity-0"
          }`}
        />
        {mode !== "recording" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-8 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-background/10">
              <Video className="h-7 w-7 text-background/70" />
            </span>
            <p className="text-sm leading-relaxed text-background/45">
              Your camera stays off until you hit record
            </p>
          </div>
        )}

        {mode === "recording" && (
          <>
            <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-[#C0392B] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> Rec
            </div>
            <div className="absolute right-4 top-4 rounded-full bg-black/55 px-3 py-1 font-mono text-[13px] font-semibold text-white">
              {clock(elapsed)}
            </div>
            <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-black/45 p-3 backdrop-blur-sm">
              <div className="flex items-center justify-between text-[11px] font-semibold text-white">
                <span className={`rounded-full border px-2 py-0.5 ${quality.badge}`}>{quality.label}</span>
                <span className="font-mono text-white/70">
                  {clock(elapsed)} / {clock(MAX_SECONDS)}
                </span>
              </div>
              <div className="relative mt-2.5 h-2 rounded-full bg-white/20">
                <div
                  className={`h-2 rounded-full transition-[width] duration-1000 ease-linear ${quality.bar}`}
                  style={{ width: `${progress}%` }}
                />
                <span className="absolute -top-1 left-[44.4%] h-4 w-0.5 rounded bg-white/60" />
                <span className="absolute -top-1 left-[66.6%] h-4 w-0.5 rounded bg-white/60" />
              </div>
              <div className="mt-1 flex justify-between font-mono text-[9px] text-white/45">
                <span>0s</span>
                <span>40s</span>
                <span>60s</span>
                <span>90s</span>
              </div>
            </div>
          </>
        )}

        {mode === "uploading" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/70">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
            <p className="text-sm font-medium text-white/80">Saving your intro…</p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 rounded-xl bg-destructive/10 px-3 py-2.5 text-sm font-medium text-destructive">
          {error}
        </div>
      )}

      <div className="mt-4 flex gap-2.5">
        {mode === "recording" ? (
          <button
            type="button"
            onClick={stopRecording}
            className="flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-foreground text-[15px] font-bold text-background press"
          >
            <Square className="h-4 w-4 fill-background" /> Stop & use this take
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={startRecording}
              disabled={mode === "uploading"}
              className="flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl brand-gradient text-sm font-bold text-white shadow-[0_14px_30px_-14px_rgba(238,92,43,0.9)] press disabled:opacity-40"
            >
              <Video className="h-4 w-4" /> Record video
            </button>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={mode === "uploading"}
              className="flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl border border-border bg-card text-sm font-bold text-foreground press disabled:opacity-40"
            >
              <Upload className="h-4 w-4" /> Upload video
            </button>
          </>
        )}
      </div>
    </div>
  );
}
