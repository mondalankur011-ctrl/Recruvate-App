import React from "react";
import { ArrowLeft } from "lucide-react";
import BrandMark from "@/components/brand/BrandMark";

export default function OnboardingShell({ step, title, script, subtitle, onBack, children }) {
  return (
    <div
      className="min-h-screen bg-background"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <div className="mx-auto w-full max-w-md px-5 pb-16 pt-6">
        <div className="flex items-center justify-between">
          <BrandMark size="sm" />
          <span className="rounded-full bg-card px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-foreground/50">
            Step {step} of 5
          </span>
        </div>

        <div className="mt-5 flex gap-1.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <span
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                i <= step ? "brand-gradient" : "bg-muted"
              }`}
            />
          ))}
        </div>

        <div className="mt-7 animate-rise">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="mb-3 -ml-1 inline-flex items-center gap-1.5 text-sm font-medium text-foreground/50 press"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
          )}
          <h1 className="font-heading text-[27px] font-black leading-[1.08] tracking-tight text-foreground">
            {title}
          </h1>
          {script && <p className="mt-1 font-script text-[23px] leading-tight text-primary">{script}</p>}
          {subtitle && <p className="mt-2.5 text-sm leading-relaxed text-foreground/55">{subtitle}</p>}
        </div>

        <div className="mt-6 animate-rise">{children}</div>
      </div>
    </div>
  );
}
