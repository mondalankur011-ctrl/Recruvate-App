import React from "react";
import { Check } from "lucide-react";

export default function CompletionCard({ items }) {
  const done = items.filter((item) => item.done).length;
  const percent = Math.round((done / items.length) * 100);

  return (
    <div className="rounded-[24px] bg-card p-4 shadow-[0_18px_44px_-34px_rgba(23,21,34,0.75)]">
      <div className="flex items-baseline justify-between">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-foreground/40">
          Profile completion
        </p>
        <p className="font-heading text-[15px] font-extrabold text-foreground">{percent}%</p>
      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full brand-gradient transition-all duration-700"
          style={{ width: `${percent}%` }}
        />
      </div>

      <ul className="mt-3.5 space-y-2">
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-2.5">
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                item.done ? "bg-[#2C7A4B] text-white" : "border border-border text-transparent"
              }`}
            >
              <Check className="h-3 w-3" strokeWidth={3} />
            </span>
            <span
              className={`text-sm ${
                item.done ? "text-foreground/60" : "font-semibold text-foreground"
              }`}
            >
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
