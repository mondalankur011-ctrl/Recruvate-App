import React from "react";
import { Clock, Timer } from "lucide-react";

const WINDOW_MS = 48 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

const STATUS = {
  applied: { label: "Applied", tone: "bg-[#2E5AA8]/10 text-[#2E5AA8]" },
  in_review: { label: "In Review", tone: "bg-[#EE5C2B]/12 text-[#EE5C2B]" },
  interview: { label: "Interview", tone: "bg-[#6E4CC9]/12 text-[#6E4CC9]" },
  offer: { label: "Offer", tone: "bg-[#2C7A4B]/12 text-[#2C7A4B]" },
  rejected: { label: "Closed", tone: "bg-foreground/8 text-foreground/50" },
};

export default function ApplicationCard({ application, now }) {
  const appliedAt = new Date(application.applied_at || application.created_date).getTime();
  const elapsed = Math.max(0, now - appliedAt);
  const remaining = Math.max(0, WINDOW_MS - elapsed);
  const overdue = elapsed >= WINDOW_MS;
  const warming = !overdue && elapsed >= DAY_MS;

  const hours = Math.floor(remaining / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  const pad = (value) => String(value).padStart(2, "0");

  const status = STATUS[application.status] || STATUS.applied;
  const progress = Math.min(100, (elapsed / WINDOW_MS) * 100);

  return (
    <article className="rounded-[22px] bg-card p-4 shadow-[0_18px_44px_-34px_rgba(23,21,34,0.75)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-foreground/35">
            {application.company}
          </p>
          <h3 className="mt-1 truncate font-heading text-[15px] font-extrabold text-foreground">
            {application.job_title}
          </h3>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${status.tone}`}>
          {status.label}
        </span>
      </div>

      <div className="mt-3">
        {overdue ? (
          <div className="flex items-center gap-1.5 rounded-xl bg-[#EE5C2B]/10 px-3 py-2 text-sm font-bold text-[#EE5C2B]">
            <Timer className="h-3.5 w-3.5" /> No response yet, follow up
          </div>
        ) : (
          <div
            className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm font-bold ${
              warming ? "bg-[#EE5C2B]/10 text-[#EE5C2B]" : "bg-muted text-foreground/60"
            }`}
          >
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> Response window
            </span>
            <span className="font-mono">
              {hours}h {pad(minutes)}m {pad(seconds)}s left
            </span>
          </div>
        )}

        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              overdue ? "bg-[#C0392B]" : warming ? "bg-[#EE5C2B]" : "bg-[#2E5AA8]"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-1.5 text-sm text-foreground/35">
          Applied{" "}
          {new Date(appliedAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            hour: "numeric",
            minute: "2-digit",
          })}
        </p>
      </div>
    </article>
  );
}
