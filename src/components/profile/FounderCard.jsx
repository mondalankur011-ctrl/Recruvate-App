import React from "react";
import { Instagram, Linkedin, Youtube } from "lucide-react";
import { Image } from "@/components/ui/image";

const PHOTO =
  "https://media.base44.com/images/public/6ae45ebdce8c66f2fb594817/e04dc3a41_Screenshot2026-08-14132115.png";

const LINKS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/entrepranil",
    icon: Instagram,
    color: "#E1306C",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/pranilnandedkar/",
    icon: Linkedin,
    color: "#0A66C2",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@TheHRsUniverse",
    icon: Youtube,
    color: "#FF0000",
  },
];

export default function FounderCard() {
  return (
    <div className="rounded-[24px] bg-foreground p-4 text-background">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">Hosted by</p>
      <div className="mt-3 flex items-center gap-3.5">
        <div className="h-[96px] w-[76px] shrink-0 overflow-hidden rounded-[14px] ring-1 ring-background/15 shadow-[0_10px_24px_-12px_rgba(0,0,0,0.6)] bg-muted">
          <Image
            src={PHOTO}
            alt="Pranil, founder of Recruvate HR Solutions"
            className="h-full w-full object-cover"
            fittingType="fill"
          />
        </div>
        <div className="min-w-0">
          <p className="font-heading text-[17px] font-extrabold leading-tight">Pranil</p>
          <p className="mt-0.5 text-sm leading-snug text-background/50">
            Founder, Recruvate HR Solutions · Host, Let's Talk Careers
          </p>
        </div>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-background/55">
        Pranil sits down with HR leaders, founders and hiring managers to talk candidly about the
        roles they're building — turning open positions into conversations people actually want to
        watch.
      </p>

      <div className="mt-3.5 grid grid-cols-3 gap-2">
        {LINKS.map((link) => {
          const Icon = link.icon;
          return (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 items-center justify-center gap-1.5 rounded-xl bg-background/10 text-sm font-bold text-background/85 press"
            >
              <Icon className="h-3.5 w-3.5" style={{ color: link.color }} />
              {link.label}
            </a>
          );
        })}
      </div>
    </div>
  );
}
