import React, { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import OnboardingShell from "@/components/onboarding/OnboardingShell";
import { normalizeSocial } from "@/lib/match";
import { SOCIAL_NETWORKS } from "@/lib/socials";

export default function SocialsStep({ profile, onNext, onSkip }) {
  const [values, setValues] = useState({
    linkedin: profile.linkedin || "",
    instagram: profile.instagram || "",
    facebook: profile.facebook || "",
    threads: profile.threads || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const patch = {};
      SOCIAL_NETWORKS.forEach((network) => {
        patch[network.key] = normalizeSocial(values[network.key], network.base);
      });
      await onNext(patch);
    } catch (err) {
      setError(err.message || "We couldn't save your links. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <OnboardingShell
      step={4}
      title="Link your socials"
      script="Show the person behind the resume."
      subtitle="Add the profiles you're proud of. You can update these any time."
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        {SOCIAL_NETWORKS.map((network) => {
          const Icon = network.icon;
          return (
            <label key={network.key} className="block">
              <span className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold uppercase tracking-[0.12em] text-foreground/50">
                <Icon className="h-3.5 w-3.5" style={{ color: network.color }} />
                {network.label}
              </span>
              <span className="relative block">
                <span
                  className="absolute left-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${network.color}14` }}
                >
                  <Icon className="h-4 w-4" style={{ color: network.color }} />
                </span>
                <input
                  type="text"
                  inputMode="url"
                  value={values[network.key]}
                  onChange={(e) => setValues((v) => ({ ...v, [network.key]: e.target.value }))}
                  placeholder={network.placeholder}
                  className="h-14 w-full rounded-2xl border border-border bg-card pl-14 pr-4 text-[15px] text-foreground placeholder:text-foreground/30 outline-none transition focus:ring-4"
                  style={{ ["--tw-ring-color"]: `${network.color}22` }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = network.color)}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "hsl(var(--border))")}
                />
              </span>
            </label>
          );
        })}

        {error && (
          <div className="rounded-xl bg-destructive/10 px-3 py-2.5 text-sm font-medium text-destructive">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="mt-1 flex h-14 w-full items-center justify-center gap-2 rounded-2xl brand-gradient text-[15px] font-bold text-white shadow-[0_14px_30px_-14px_rgba(238,92,43,0.9)] transition press disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Saving…
            </>
          ) : (
            <>
              Continue <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onSkip}
          disabled={saving}
          className="h-12 w-full rounded-2xl text-sm font-semibold text-foreground/50 press"
        >
          Skip for now
        </button>
      </form>
    </OnboardingShell>
  );
}
