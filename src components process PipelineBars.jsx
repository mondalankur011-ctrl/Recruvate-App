import React from "react";

export const STAGES = [
  { key: "applied", label: "Applied", color: "#2E5AA8" },
  { key: "in_review", label: "In Review", color: "#EE5C2B" },
  { key: "interview", label: "Interview", color: "#6E4CC9" },
  { key: "offer", label: "Offer", color: "#2C7A4B" },
];

export default function PipelineBars({ applications }) {
  const total = applications.length;

  return (
    <div className="rounded-[24px] bg-card p-4 shadow-[0_18px_44px_-34px_rgba(23,21,34,0.75)]">
      <div className="flex items-baseline justify-between">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-foreground/40">
          Your pipeline
        </p>
        <p className="text-[11px] font-semibold text-foreground/45">
          {total} application{total === 1 ? "" : "s"}
        </p>
      </div>

      <div className="mt-3.5 space-y-3">
        {STAGES.map((stage) => {
          const count = applications.filter((application) => application.status === stage.key).length;
          const share = total ? (count / total) * 100 : 0;
          const width = count > 0 ? Math.max(9, share) : 0;
          return (
            <div key={stage.key}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-foreground">{stage.label}</span>
                <span className="font-heading text-[13px] font-extrabold text-foreground/55">{count}</span>
              </div>
              <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${width}%`, backgroundColor: stage.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
