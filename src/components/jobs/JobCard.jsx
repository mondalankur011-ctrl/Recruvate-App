import React from "react";
import { ArrowRight, MapPin, Clock, Bookmark, Check } from "lucide-react";
import { matchTone } from "@/lib/match";

export default function JobCard({ job, match, applied, saved, busy, onApply, onSave }) {
  const summary =
    job.description && job.description.length > 150
      ? `${job.description.slice(0, 150).trimEnd()}…`
      : job.description;

  return (
    <article className="rounded-[24px] bg-card p-4 shadow-[0_18px_44px_-34px_rgba(23,21,34,0.75)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-foreground/35">
            {job.company}
          </p>
          <h3 className="mt-1 font-heading text-[17px] font-extrabold leading-[1.15] tracking-tight text-foreground">
            {job.title}
          </h3>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-foreground/50">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {job.location}
            </span>
            {job.employment_type && (
              <>
                <span className="text-foreground/20">•</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {job.employment_type}
                </span>
              </>
            )}
          </div>
        </div>
        {match > 0 && (
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold text-white ${matchTone(match)}`}
          >
            {match}% match
          </span>
        )}
      </div>

      {summary && (
        <p className="mt-2.5 text-sm leading-relaxed text-foreground/55">{summary}</p>
      )}

      {job.skills?.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {job.skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-foreground/60"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {job.salary_range && (
        <p className="mt-2.5 text-sm font-semibold text-[#2C7A4B]">{job.salary_range}</p>
      )}

      <div className="mt-3.5 flex gap-2">
        <button
          type="button"
          onClick={onApply}
          disabled={applied || busy}
          className={`flex h-12 flex-1 items-center justify-center gap-1.5 rounded-2xl text-sm font-bold transition press ${
            applied
              ? "bg-[#2C7A4B]/10 text-[#2C7A4B]"
              : "brand-gradient text-white shadow-[0_12px_26px_-14px_rgba(238,92,43,0.9)]"
          }`}
        >
          {applied ? (
            <>
              <Check className="h-4 w-4" /> Applied
            </>
          ) : (
            <>
              Apply <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={busy}
          className={`flex h-12 w-12 items-center justify-center rounded-2xl border transition press ${
            saved
              ? "border-primary/30 bg-primary/10 text-primary"
              : "border-border bg-card text-foreground/45"
          }`}
          aria-label={saved ? "Remove from saved" : "Save job"}
        >
          <Bookmark className="h-[18px] w-[18px]" fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
    </article>
  );
}
