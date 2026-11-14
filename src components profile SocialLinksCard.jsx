import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { ArrowUpRight, Loader2, Pencil, Share2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SOCIAL_NETWORKS } from "@/lib/socials";
import { normalizeSocial } from "@/lib/match";

export default function SocialLinksCard({ profile, onChange }) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const linked = SOCIAL_NETWORKS.filter((network) => profile[network.key]);

  const openEditor = () => {
    const next = {};
    SOCIAL_NETWORKS.forEach((network) => {
      next[network.key] = profile[network.key] || "";
    });
    setValues(next);
    setError("");
    setOpen(true);
  };

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      const patch = {};
      SOCIAL_NETWORKS.forEach((network) => {
        patch[network.key] = normalizeSocial(values[network.key], network.base);
      });
      const updated = await base44.entities.CandidateProfile.update(profile.id, patch);
      onChange(updated);
      setOpen(false);
    } catch (err) {
      setError(err.message || "We couldn't save your links.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-[24px] bg-card p-4 shadow-[0_18px_44px_-34px_rgba(23,21,34,0.75)]">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-foreground/40">
          Social links
        </p>
        <button
          type="button"
          onClick={openEditor}
          className="inline-flex h-11 items-center gap-1.5 rounded-lg bg-muted px-3 text-sm font-bold text-foreground/60 press"
        >
          <Pencil className="h-3.5 w-3.5" /> Edit
        </button>
      </div>

      {linked.length === 0 ? (
        <button
          type="button"
          onClick={openEditor}
          className="mt-3 flex w-full flex-col items-center gap-1.5 rounded-2xl border-2 border-dashed border-border px-4 py-6 press"
        >
          <Share2 className="h-5 w-5 text-primary" />
          <span className="text-sm font-semibold text-foreground">Add your social profiles</span>
          <span className="text-sm text-foreground/40">LinkedIn, Instagram, Facebook, Threads</span>
        </button>
      ) : (
        <div className="mt-2.5 space-y-1.5">
          {linked.map((network) => {
            const Icon = network.icon;
            return (
              <a
                key={network.key}
                href={profile[network.key]}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 rounded-xl px-1 py-1.5 press"
              >
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${network.color}14` }}
                >
                  <Icon className="h-4 w-4" style={{ color: network.color }} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-foreground">
                    {network.label}
                  </span>
                  <span className="block truncate text-sm text-foreground/40">
                    {profile[network.key].replace(/^https?:\/\/(www\.)?/, "")}
                  </span>
                </span>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-foreground/25" />
              </a>
            );
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[92vw] max-w-sm rounded-[24px] border-border bg-background p-5">
          <DialogHeader>
            <DialogTitle className="font-heading text-[17px] font-extrabold text-foreground">
              Your social links
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2.5">
            {SOCIAL_NETWORKS.map((network) => {
              const Icon = network.icon;
              return (
                <label key={network.key} className="block">
                  <span className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-foreground/45">
                    <Icon className="h-3 w-3" style={{ color: network.color }} />
                    {network.label}
                  </span>
                  <input
                    type="text"
                    inputMode="url"
                    value={values[network.key] || ""}
                    onChange={(e) => setValues((v) => ({ ...v, [network.key]: e.target.value }))}
                    placeholder={network.placeholder}
                    className="h-12 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground placeholder:text-foreground/30 outline-none focus:border-primary"
                  />
                </label>
              );
            })}
            {error && <p className="text-sm font-medium text-destructive">{error}</p>}
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl brand-gradient text-sm font-bold text-white press disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {saving ? "Saving…" : "Save links"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
