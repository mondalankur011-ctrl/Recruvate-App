import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Briefcase, 
  Building2, 
  Clock, 
  Sparkles, 
  Video, 
  ShieldCheck, 
  UserCheck,
  ChevronRight
} from "lucide-react";
import BrandMark from "@/components/brand/BrandMark";
import { base44 } from "@/api/base44Client";

export default function Landing() {
  const navigate = useNavigate();
  const [loadingDemo, setLoadingDemo] = useState(false);

  const handleDemoCandidate = async () => {
    setLoadingDemo(true);
    try {
      await base44.auth.loginAsDemoCandidate();
      navigate("/");
    } finally {
      setLoadingDemo(false);
    }
  };

  const handleDemoEmployer = async () => {
    setLoadingDemo(true);
    try {
      await base44.auth.loginAsDemoEmployer();
      navigate("/employer/dashboard");
    } finally {
      setLoadingDemo(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground pb-12">
      {/* Mobile App Header */}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur-md px-5 py-3.5">
        <div className="flex items-center justify-between">
          <BrandMark size="sm" />
          <div className="flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-primary">
            <Sparkles className="h-3 w-3" />
            <span>48h Clock</span>
          </div>
        </div>
      </header>

      {/* Main Mobile App Body */}
      <main className="flex-1 px-5 pt-6 space-y-6">
        {/* App Hero */}
        <section className="space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold text-primary">
            <span>✨</span>
            <span>A Recruvate Spotlight Series</span>
          </div>

          <h1 className="font-heading text-3xl font-black leading-tight tracking-tight text-foreground">
            Careers with <br />
            <span className="brand-text-gradient">a human voice.</span>
          </h1>

          <p className="text-sm font-medium leading-relaxed text-foreground/70">
            Skip the silent rejections. Match with top companies using a 1-minute video pitch and a guaranteed 48-hour response clock.
          </p>
        </section>

        {/* 1-Tap Instant Demo Buttons */}
        <section className="rounded-2xl border border-primary/20 bg-primary/5 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Instant 1-Click Demo</span>
            </p>
            <span className="text-[10px] font-medium text-foreground/50">No signup needed</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={handleDemoCandidate}
              disabled={loadingDemo}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-card border border-border/80 px-3 py-2.5 text-xs font-bold text-foreground shadow-sm hover:border-primary/50 transition press"
            >
              <UserCheck className="h-3.5 w-3.5 text-primary" />
              <span>Candidate Demo</span>
            </button>

            <button
              onClick={handleDemoEmployer}
              disabled={loadingDemo}
              className="flex items-center justify-center gap-1.5 rounded-xl brand-gradient px-3 py-2.5 text-xs font-bold text-white shadow-sm hover:opacity-95 transition press"
            >
              <Building2 className="h-3.5 w-3.5" />
              <span>HR Demo (Priya)</span>
            </button>
          </div>
        </section>

        {/* Persona Selectors (Candidate vs Employer) */}
        <section className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-foreground/50">
            Choose Your Experience
          </p>

          {/* Job Seeker Card */}
          <Link
            to="/login"
            className="group block rounded-2xl border border-border bg-card p-4 transition hover:border-primary/60 hover:shadow-md press"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold text-foreground group-hover:text-primary transition">
                    I'm Looking for a Job
                  </h3>
                  <p className="text-xs text-foreground/60">
                    Browse roles & submit 60s video pitch
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition" />
            </div>
          </Link>

          {/* Employer Card */}
          <Link
            to="/employer/login"
            className="group block rounded-2xl border border-border bg-card p-4 transition hover:border-primary/60 hover:shadow-md press"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading text-base font-bold text-foreground group-hover:text-primary transition">
                      I'm Hiring Talent
                    </h3>
                    <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-primary">
                      HR Mode
                    </span>
                  </div>
                  <p className="text-xs text-foreground/60">
                    Post vacancies & review applicant pitches
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition" />
            </div>
          </Link>
        </section>

        {/* Mobile Feature Highlights */}
        <section className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-foreground/50">
            Why Recruvate Works
          </p>

          <div className="space-y-2.5">
            <div className="flex items-start gap-3 rounded-2xl border border-border/80 bg-card/60 p-3.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Video className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">60-Second Video Pitch</h4>
                <p className="text-[11px] text-foreground/65 leading-relaxed mt-0.5">
                  Introduce yourself with personality before the resume even gets scanned.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-border/80 bg-card/60 p-3.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">Guaranteed 48h Clock</h4>
                <p className="text-[11px] text-foreground/65 leading-relaxed mt-0.5">
                  Employers respond within 48 hours or candidates receive automated feedback.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-border/80 bg-card/60 p-3.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">Verified Employers</h4>
                <p className="text-[11px] text-foreground/65 leading-relaxed mt-0.5">
                  Every company and hiring manager is verified for safety and fast hiring.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 2x2 Mobile Platform Metrics */}
        <section className="rounded-2xl border border-border bg-card p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/50 text-center mb-3">
            Platform Metrics
          </p>
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="rounded-xl bg-background p-2.5">
              <p className="font-heading text-lg font-black text-primary">15,000+</p>
              <p className="text-[10px] font-medium text-foreground/60">Candidates Placed</p>
            </div>
            <div className="rounded-xl bg-background p-2.5">
              <p className="font-heading text-lg font-black text-foreground">500+</p>
              <p className="text-[10px] font-medium text-foreground/60">Partner Companies</p>
            </div>
            <div className="rounded-xl bg-background p-2.5">
              <p className="font-heading text-lg font-black text-emerald-500">48h</p>
              <p className="text-[10px] font-medium text-foreground/60">Response Clock</p>
            </div>
            <div className="rounded-xl bg-background p-2.5">
              <p className="font-heading text-lg font-black text-foreground">95%</p>
              <p className="text-[10px] font-medium text-foreground/60">Matching Rate</p>
            </div>
          </div>
        </section>

        {/* Mobile Footer */}
        <footer className="text-center pt-2">
          <p className="font-script text-lg text-primary">Let's talk careers</p>
          <p className="text-[11px] text-foreground/40 mt-0.5">
            Pan India · Serving clients since 2017
          </p>
        </footer>
      </main>
    </div>
  );
}
