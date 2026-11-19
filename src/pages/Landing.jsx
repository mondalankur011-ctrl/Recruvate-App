import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Briefcase, 
  Building2, 
  Clock, 
  CheckCircle2, 
  Play, 
  ArrowRight, 
  Sparkles, 
  Video, 
  Users, 
  ShieldCheck, 
  Layers, 
  TrendingUp, 
  ChevronRight,
  UserCheck
} from "lucide-react";
import BrandMark from "@/components/brand/BrandMark";
import { base44 } from "@/api/base44Client";

export default function Landing() {
  const navigate = useNavigate();
  const [roleModalOpen, setRoleModalOpen] = useState(false);

  const handleDemoCandidate = async () => {
    await base44.auth.loginAsDemoCandidate();
    navigate("/");
  };

  const handleDemoEmployer = async () => {
    await base44.auth.loginAsDemoEmployer();
    navigate("/employer/dashboard");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5">
          <Link to="/" className="flex items-center gap-2 press">
            <BrandMark size="md" />
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-foreground/75">
            <a href="#what-we-do" className="hover:text-primary transition">What We Do</a>
            <a href="#how-it-works" className="hover:text-primary transition">How It Works</a>
            <a href="#hiring-mode" className="hover:text-primary transition flex items-center gap-1.5">
              <span>Hiring Mode</span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary uppercase tracking-wider">New</span>
            </a>
            <a href="#stats" className="hover:text-primary transition">Why Recruvate</a>
          </nav>

          <div className="flex items-center gap-2.5">
            <Link
              to="/login"
              className="rounded-xl px-4 py-2 text-xs font-bold text-foreground/80 hover:bg-muted transition press"
            >
              Log In
            </Link>
            <button
              onClick={() => setRoleModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl brand-gradient px-4 py-2 text-xs font-bold text-white shadow-sm hover:opacity-95 transition press"
            >
              <span>Get Started</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-28">
        <div 
          className="pointer-events-none absolute inset-x-0 top-0 h-[450px] bg-[radial-gradient(100%_80%_at_50%_0%,rgba(238,92,43,0.15),transparent_75%)]" 
          aria-hidden="true" 
        />
        
        <div className="relative mx-auto max-w-5xl px-5 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs font-bold text-primary shadow-sm mb-6">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Pan India · Serving Clients Since 2017</span>
          </div>

          <h1 className="font-heading text-4xl font-black tracking-tight sm:text-6xl md:text-7xl leading-[1.05]">
            Careers with a <span className="brand-text-gradient">human voice.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-foreground/70 leading-relaxed">
            The modern recruitment platform connecting ambitious candidates with forward-thinking employers through 
            <strong className="text-foreground"> 60-second video introductions </strong> 
            and a guaranteed <strong className="text-foreground">48-hour response window</strong>.
          </p>

          {/* Quick Demo Access Pill */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleDemoCandidate}
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-primary bg-primary/10 px-5 py-3 text-xs sm:text-sm font-bold text-primary hover:bg-primary hover:text-white transition shadow-sm press"
            >
              <Users className="h-4 w-4" />
              <span>Explore as Candidate Demo</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={handleDemoEmployer}
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-foreground/20 bg-card px-5 py-3 text-xs sm:text-sm font-bold text-foreground hover:border-primary hover:text-primary transition shadow-sm press"
            >
              <Building2 className="h-4 w-4 text-primary" />
              <span>Explore as HR / Employer Demo</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Two User Paths (Page 2 of Proposal) */}
          <div className="mt-14 grid gap-6 md:grid-cols-2 text-left">
            {/* Candidate Card */}
            <div className="group relative rounded-3xl border border-border bg-card p-7 shadow-sm transition hover:border-primary/50 hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-5 group-hover:scale-105 transition">
                <Briefcase className="h-6 w-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-primary">For Job Seekers & Students</span>
              <h3 className="mt-1 text-2xl font-extrabold text-foreground">I'm looking for a job</h3>
              <p className="mt-2 text-sm text-foreground/65 leading-relaxed">
                Build your profile once, record a signature 60-second pitch, and apply to hand-curated roles with a strict 48-hour response guarantee.
              </p>

              <ul className="mt-5 space-y-2 text-xs font-semibold text-foreground/75">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>No keyword black holes — recruiters hear you directly</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Transparent 48-hour response countdown</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Private and encrypted resume storage</span>
                </li>
              </ul>

              <div className="mt-7 pt-5 border-t border-border flex items-center justify-between">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-primary group-hover:gap-2 transition"
                >
                  <span>Sign up as Candidate</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <button
                  onClick={handleDemoCandidate}
                  className="text-xs font-semibold text-foreground/50 hover:text-foreground underline underline-offset-4"
                >
                  Quick Demo
                </button>
              </div>
            </div>

            {/* Employer Card */}
            <div className="group relative rounded-3xl border border-border bg-card p-7 shadow-sm transition hover:border-primary/50 hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-5 group-hover:scale-105 transition">
                <Building2 className="h-6 w-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-primary">For Companies & HR Teams</span>
              <h3 className="mt-1 text-2xl font-extrabold text-foreground">I'm hiring talent</h3>
              <p className="mt-2 text-sm text-foreground/65 leading-relaxed">
                Post open vacancies, introduce your company culture via video, and evaluate applicants through short candidate pitches before booking interviews.
              </p>

              <ul className="mt-5 space-y-2 text-xs font-semibold text-foreground/75">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Watch 60-second video intros for every applicant</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Post and manage active vacancies with 1 click</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Direct pipeline management (Shortlist, Interview, Offer)</span>
                </li>
              </ul>

              <div className="mt-7 pt-5 border-t border-border flex items-center justify-between">
                <Link
                  to="/employer/login"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-primary group-hover:gap-2 transition"
                >
                  <span>Enter Hiring Mode</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <button
                  onClick={handleDemoEmployer}
                  className="text-xs font-semibold text-foreground/50 hover:text-foreground underline underline-offset-4"
                >
                  HR Demo Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Recruvate Does (Page 2 of Proposal) */}
      <section id="what-we-do" className="py-16 md:py-24 border-t border-border bg-card/40">
        <div className="mx-auto max-w-5xl px-5">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-[11px] font-bold uppercase tracking-widest text-primary">What Recruvate Does</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl text-foreground">
              Moving beyond static, lifeless resumes
            </h2>
            <p className="mt-3 text-sm sm:text-base text-foreground/65">
              Traditional job boards reduce talented candidates to flat PDFs and ghost them for weeks. Recruvate brings real human connection back into recruitment.
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <Video className="h-5 w-5" />
              </div>
              <h4 className="text-lg font-bold text-foreground">Video Introductions</h4>
              <p className="mt-2 text-sm text-foreground/60 leading-relaxed">
                Candidates record a 40–90 second pitch. Recruiters see communication skills and personality before scheduling time-consuming screening calls.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <Clock className="h-5 w-5" />
              </div>
              <h4 className="text-lg font-bold text-foreground">48-Hour Response Window</h4>
              <p className="mt-2 text-sm text-foreground/60 leading-relaxed">
                Every application is bound to a live 48-hour response window with urgency indicators (On-track, Due soon, Overdue), keeping employers accountable.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h4 className="text-lg font-bold text-foreground">Verified Employers</h4>
              <p className="mt-2 text-sm text-foreground/60 leading-relaxed">
                Only verified companies with official corporate domains and checked postings can publish jobs, protecting candidates from ghost listings and spam.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works (Page 2 & 4 of Proposal) */}
      <section id="how-it-works" className="py-16 md:py-24 border-t border-border">
        <div className="mx-auto max-w-5xl px-5">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-[11px] font-bold uppercase tracking-widest text-primary">How It Works</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl text-foreground">
              A simple, transparent 3-step journey
            </h2>
            <p className="mt-3 text-sm sm:text-base text-foreground/65">
              From first signup to verified application in a single smooth flow.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3 relative">
            <div className="relative rounded-2xl border border-border bg-card p-6">
              <span className="text-4xl font-black text-primary/25 font-heading">01</span>
              <h4 className="mt-2 text-lg font-bold text-foreground">Create Profile & Video</h4>
              <p className="mt-2 text-sm text-foreground/60 leading-relaxed">
                Enter your department, upload your CV, and record your 60-second video introduction straight from your phone or laptop.
              </p>
            </div>

            <div className="relative rounded-2xl border border-border bg-card p-6">
              <span className="text-4xl font-black text-primary/25 font-heading">02</span>
              <h4 className="mt-2 text-lg font-bold text-foreground">Discover Matched Roles</h4>
              <p className="mt-2 text-sm text-foreground/60 leading-relaxed">
                Explore open jobs ranked by algorithmic match score with complete salary and role transparency.
              </p>
            </div>

            <div className="relative rounded-2xl border border-border bg-card p-6">
              <span className="text-4xl font-black text-primary/25 font-heading">03</span>
              <h4 className="mt-2 text-lg font-bold text-foreground">Apply & Track in Process Bar</h4>
              <p className="mt-2 text-sm text-foreground/60 leading-relaxed">
                One-tap application with an active 48-hour feedback timer. Watch status progress from Applied to Interview and Offer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Hiring Mode Section (Pages 3, 5, 6, 7 of Proposal) */}
      <section id="hiring-mode" className="py-16 md:py-24 border-t border-border bg-primary/[0.03]">
        <div className="mx-auto max-w-5xl px-5">
          <div className="rounded-3xl border-2 border-primary/20 bg-card p-8 md:p-12 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="max-w-xl">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary uppercase tracking-wider">
                  Employer Experience
                </span>
                <h3 className="mt-3 text-3xl font-black text-foreground sm:text-4xl">
                  Introducing Hiring Mode for HRs & Recruiters
                </h3>
                <p className="mt-3 text-sm sm:text-base text-foreground/70 leading-relaxed">
                  Post vacancies in 2 minutes, introduce your workplace culture with a 90-second video, and review applicant video pitches on your dedicated HR dashboard.
                </p>
              </div>

              <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-3">
                <Link
                  to="/employer/login"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl brand-gradient px-6 py-3.5 text-sm font-bold text-white shadow-md hover:opacity-95 transition press"
                >
                  <Building2 className="h-4 w-4" />
                  <span>Access HR Dashboard</span>
                </Link>
                <button
                  onClick={handleDemoEmployer}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-background px-6 py-3 text-xs font-bold text-foreground hover:bg-muted transition press"
                >
                  <span>1-Click HR Demo Login</span>
                </button>
              </div>
            </div>

            {/* Feature matrix */}
            <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-4 pt-8 border-t border-border">
              <div className="space-y-1">
                <p className="text-xs font-bold text-primary uppercase">1. Org Onboarding</p>
                <p className="text-sm font-bold text-foreground">Company & Role Setup</p>
                <p className="text-xs text-foreground/60">Verified official domain and work email checks</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold text-primary uppercase">2. Culture Intro</p>
                <p className="text-sm font-bold text-foreground">60–90s Pitch</p>
                <p className="text-xs text-foreground/60">Showcase perks, team culture, and office vibe</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold text-primary uppercase">3. Vacancy Posting</p>
                <p className="text-sm font-bold text-foreground">Preview & Publish</p>
                <p className="text-xs text-foreground/60">Instant publishing to candidates with custom skills</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold text-primary uppercase">4. Applicant Review</p>
                <p className="text-sm font-bold text-foreground">Video Pitches</p>
                <p className="text-xs text-foreground/60">Watch candidate videos, shortlist, and interview</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Stats (Page 2 of Proposal) */}
      <section id="stats" className="py-16 md:py-20 border-t border-border bg-background">
        <div className="mx-auto max-w-5xl px-5 text-center">
          <p className="text-[11px] font-bold uppercase tracking-widest text-primary">Why Join Recruvate?</p>
          <h2 className="mt-2 text-3xl font-black text-foreground">Proven results across Pan India</h2>

          <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
            <div className="rounded-2xl border border-border bg-card p-6">
              <p className="font-heading text-4xl font-black text-primary">15K+</p>
              <p className="mt-1 text-xs sm:text-sm font-semibold text-foreground/65">Candidates Placed</p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <p className="font-heading text-4xl font-black text-primary">500+</p>
              <p className="mt-1 text-xs sm:text-sm font-semibold text-foreground/65">Hiring Partners</p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <p className="font-heading text-4xl font-black text-primary">48h</p>
              <p className="mt-1 text-xs sm:text-sm font-semibold text-foreground/65">Response Guarantee</p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <p className="font-heading text-4xl font-black text-primary">95%</p>
              <p className="mt-1 text-xs sm:text-sm font-semibold text-foreground/65">Matching Accuracy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border bg-card/60 py-10">
        <div className="mx-auto flex max-w-5xl flex-col sm:flex-row items-center justify-between gap-6 px-5 text-center sm:text-left">
          <BrandMark size="sm" />
          <p className="text-xs text-foreground/50">
            © 2026 Recruvate Pan India · Serving clients since 2017. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs font-semibold text-foreground/70">
            <Link to="/login" className="hover:text-primary transition">Candidate Portal</Link>
            <span>·</span>
            <Link to="/employer/login" className="hover:text-primary transition">Employer Portal</Link>
          </div>
        </div>
      </footer>

      {/* Role Picker Modal */}
      {roleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-7 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="font-heading text-2xl font-black text-foreground">Choose your experience</h3>
            <p className="mt-1 text-sm text-foreground/60">
              Select how you would like to use Recruvate today:
            </p>

            <div className="mt-6 space-y-3">
              <Link
                to="/register"
                onClick={() => setRoleModalOpen(false)}
                className="flex items-center gap-4 rounded-2xl border-2 border-border p-4 hover:border-primary hover:bg-primary/5 transition press text-left"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">I am a Job Seeker / Candidate</h4>
                  <p className="text-xs text-foreground/60">Create a profile, record a video pitch, find jobs</p>
                </div>
              </Link>

              <Link
                to="/employer/login"
                onClick={() => setRoleModalOpen(false)}
                className="flex items-center gap-4 rounded-2xl border-2 border-border p-4 hover:border-primary hover:bg-primary/5 transition press text-left"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">I am an Employer / HR Manager</h4>
                  <p className="text-xs text-foreground/60">Post openings, view candidate videos, hire talent</p>
                </div>
              </Link>
            </div>

            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
              <button
                type="button"
                onClick={() => setRoleModalOpen(false)}
                className="text-xs font-semibold text-foreground/50 hover:text-foreground"
              >
                Close
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => { setRoleModalOpen(false); handleDemoCandidate(); }}
                  className="rounded-xl bg-muted px-2.5 py-1 text-[11px] font-bold text-foreground/70 hover:text-foreground"
                >
                  Candidate Demo
                </button>
                <button
                  type="button"
                  onClick={() => { setRoleModalOpen(false); handleDemoEmployer(); }}
                  className="rounded-xl bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary hover:bg-primary/20"
                >
                  HR Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
