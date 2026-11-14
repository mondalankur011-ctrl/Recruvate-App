import React from "react";
import { CalendarClock, X } from "lucide-react";

export default function ResumeReminderBanner({ updatedOn, onDismiss, onUpdate }) {
  return (
    <div className="relative overflow-hidden rounded-[22px] border border-primary/25 bg-primary/5 p-4">
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss reminder"
        className="absolute right-2.5 top-2.5 flex h-11 w-11 items-center justify-center rounded-full text-foreground/35 press"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="flex items-start gap-3 pr-8">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl brand-gradient">
          <CalendarClock className="h-5 w-5 text-white" />
        </span>
        <div>
          <p className="text-sm font-bold text-foreground">Time to refresh your resume</p>
          <p className="mt-1 text-sm leading-relaxed text-foreground/55">
            {updatedOn
              ? `You last updated your CV in ${updatedOn}. A fresh copy keeps your matches sharp.`
              : "Add a fresh copy of your CV so your matches stay sharp."}
          </p>
          <button
            type="button"
            onClick={onUpdate}
            className="mt-2.5 inline-flex h-11 items-center rounded-xl bg-foreground px-4 text-sm font-bold text-background press"
          >
            Update resume
          </button>
        </div>
      </div>
    </div>
  );
}
