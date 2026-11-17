import React from "react";

const LOGO_URL =
  "https://media.base44.com/images/public/6ae45ebdce8c66f2fb594817/5323a059f_Screenshot2026-08-15110308.png";

export default function BrandMark({ size = "md", light = false }) {
  const iconSize = size === "lg" ? "h-10 w-10" : size === "sm" ? "h-7 w-7" : "h-8 w-8";
  const titleSize = size === "lg" ? "text-[22px]" : size === "sm" ? "text-[15px]" : "text-[18px]";

  return (
    <div className="flex items-center gap-2.5">
      <img
        src={LOGO_URL}
        alt="HR's Universe logo"
        className={`${iconSize} shrink-0 rounded-xl object-contain`}
      />
      <div className="leading-none">
        <p
          className={`font-heading font-black tracking-tight ${titleSize} ${
            light ? "text-background" : "text-foreground"
          }`}
        >
          HR's Universe
        </p>
        <p
          className={`mt-1 text-[9px] font-semibold uppercase tracking-[0.2em] ${
            light ? "text-background/55" : "text-foreground/45"
          }`}
        >
          by Recruvate
        </p>
      </div>
    </div>
  );
}
