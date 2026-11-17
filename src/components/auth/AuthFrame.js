import React from "react";
import BrandMark from "@/components/brand/BrandMark";

export default function AuthFrame({ children }) {
  return (
    <div
      className="min-h-screen bg-background"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(120%_100%_at_50%_0%,rgba(238,92,43,0.12),transparent_70%)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto w-full max-w-md px-5 pb-10 pt-8">
        <BrandMark />

        <div className="mt-7">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
            A Recruvate spotlight series
          </p>
          <h1 className="mt-2 font-heading text-[33px] font-black leading-[1.02] tracking-tight text-foreground">
            Careers with <span className="brand-text-gradient">a human voice.</span>
          </h1>
          <p className="mt-1 font-script text-[26px] leading-tight text-primary">Let's talk careers</p>
        </div>

        <div className="mt-6 rounded-[26px] bg-card p-5 shadow-[0_24px_60px_-32px_rgba(23,21,34,0.45)]">
          {children}
        </div>

        <p className="mt-5 text-center text-sm text-foreground/40">
          Pan India · Serving clients since 2017
        </p>
      </div>
    </div>
  );
}
