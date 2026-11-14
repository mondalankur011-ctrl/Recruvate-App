import React, { useState } from "react";
import { ArrowRight, CheckCircle2, Loader2, RotateCcw } from "lucide-react";
import OnboardingShell from "@/components/onboarding/OnboardingShell";
import VideoRecorder from "@/components/onboarding/VideoRecorder";
import { qualityOf } from "@/lib/match";

export default function VideoStep({ profile, onBack, onNext }) {
  const [video, setVideo] = useState(
    profile.intro_video_uri
      ? {
          uri: profile.intro_video_uri,
          duration: profile.intro_video_duration,
          quality: profile.intro_video_quality,
        }
      : null
  );
  const [recording, setRecording] = useState(!profile.intro_video_uri);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleContinue = async () => {
    if (!video?.uri) return;
    setError("");
    setSaving(true);
    try {
      await onNext({
        intro_video_uri: video.uri,
        intro_video_duration: video.duration,
        intro_video_quality: video.quality,
      });
    } catch (err) {
      setError(err.message || "We couldn't save your video. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const quality = video ? qualityOf(video.duration) : null;

  return (
    <OnboardingShell
      step={5}
      title="Your one-minute intro"
      script="This is your voice, not your resume."
      subtitle="Record it here or upload one. It must be between 40 and 90 seconds."
      onBack={onBack}
    >
      <div className="animate-note relative mb-5 rounded-2xl border-2 border-primary/30 bg-primary/5 px-4 py-3 shadow-[0_18px_34px_-24px_rgba(238,92,43,0.85)]">
        <span className="absolute -top-2.5 left-6 h-5 w-12 rotate-[-3deg] rounded-sm bg-primary/20" />
        <p className="font-script text-[21px] leading-snug text-foreground">
          Talk about things that are NOT mentioned in your resume and introduce yourself.
        </p>
        <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
          Mandatory · Recruvate reviews every intro
        </p>
      </div>

      {video && !recording ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-2xl border border-[#2C7A4B]/25 bg-card p-4">
            <CheckCircle2 className="h-6 w-6 shrink-0 text-[#2C7A4B]" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">Intro video received</p>
              <p className="text-sm text-foreground/50">
                {Math.round(video.duration)}s · stored privately for the Recruvate team
              </p>
            </div>
            <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${quality.badge}`}>
              {quality.label}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              setVideo(null);
              setRecording(true);
            }}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card text-sm font-semibold text-foreground/70 press"
          >
            <RotateCcw className="h-4 w-4" /> Record or upload again
          </button>
        </div>
      ) : (
        <VideoRecorder
          onChange={(next) => {
            setVideo(next);
            if (next) setRecording(false);
          }}
        />
      )}

      {error && (
        <div className="mt-3 rounded-xl bg-destructive/10 px-3 py-2.5 text-sm font-medium text-destructive">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={handleContinue}
        disabled={!video?.uri || saving}
        className="mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-2xl brand-gradient text-[15px] font-bold text-white shadow-[0_14px_30px_-14px_rgba(238,92,43,0.9)] transition press disabled:opacity-40 disabled:shadow-none"
      >
        {saving ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Finishing…
          </>
        ) : (
          <>
            Finish setup <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
      <p className="mt-2 text-center text-sm text-foreground/40">
        You can't skip this step — it's how we get to know you.
      </p>
    </OnboardingShell>
  );
}
