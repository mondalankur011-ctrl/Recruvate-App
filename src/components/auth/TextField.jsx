import React from "react";

export default function TextField({ label, icon: Icon, right, className = "", ...props }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground/50">
          {label}
        </span>
      )}
      <span className="relative block">
        {Icon && (
          <Icon className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-foreground/30" />
        )}
        <input
          {...props}
          className={`h-14 w-full rounded-2xl border border-border bg-muted ${
            Icon ? "pl-11" : "pl-4"
          } ${right ? "pr-12" : "pr-4"} text-[15px] text-foreground placeholder:text-foreground/30 outline-none transition focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/10 ${className}`}
        />
        {right && <span className="absolute right-2 top-1/2 -translate-y-1/2">{right}</span>}
      </span>
    </label>
  );
}
