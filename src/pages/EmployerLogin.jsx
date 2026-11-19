import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Building2, 
  Mail, 
  Lock, 
  ArrowRight, 
  Loader2, 
  Sparkles 
} from "lucide-react";
import BrandMark from "@/components/brand/BrandMark";
import { base44 } from "@/api/base44Client";

export default function EmployerLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      await base44.auth.loginAsDemoEmployer();
      navigate("/employer/dashboard");
    } catch (err) {
      setError(err.message || "Demo login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isRegister) {
        await base44.auth.register({
          email: email.trim(),
          password,
          role: "employer",
          company_name: companyName.trim() || "My Company"
        });
        navigate("/employer/onboarding");
      } else {
        await base44.auth.loginViaEmailPassword(email.trim(), password, "employer");
        navigate("/employer/dashboard");
      }
    } catch (err) {
      setError(err.message || "Failed to log in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between p-5 sm:p-8">
      {/* Top Header */}
      <div className="mx-auto flex w-full max-w-md items-center justify-between">
        <Link to="/landing">
          <BrandMark size="sm" />
        </Link>
        <Link 
          to="/landing" 
          className="text-xs font-semibold text-foreground/60 hover:text-foreground"
        >
          Back to Home
        </Link>
      </div>

      {/* Main Card */}
      <div className="mx-auto w-full max-w-md my-8">
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm">
          {/* Badge */}
          <div className="flex items-center justify-between mb-5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary">
              <Building2 className="h-3.5 w-3.5" />
              <span>Hiring Mode</span>
            </span>
            <Link
              to="/login"
              className="text-xs font-semibold text-foreground/60 hover:text-primary transition"
            >
              Candidate Portal →
            </Link>
          </div>

          <h2 className="font-heading text-2xl font-black text-foreground">
            {isRegister ? "Register your organisation" : "HR & Recruiter Portal"}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-foreground/60">
            {isRegister
              ? "Start reviewing video pitches and hire verified candidates 3x faster."
              : "Sign in to manage active vacancies and candidate video introductions."}
          </p>

          {/* Quick Demo Access Button */}
          <div className="mt-6 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-4 text-center">
            <p className="text-xs font-bold text-foreground">Want to test the HR experience immediately?</p>
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="mt-2.5 inline-flex w-full items-center justify-center gap-2 rounded-xl brand-gradient py-2.5 px-4 text-xs font-bold text-white shadow-sm hover:opacity-95 transition press disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>1-Click HR Demo Login (Priya Sharma · Recruvate)</span>
                </>
              )}
            </button>
          </div>

          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">or use work email</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          {error && (
            <div className="mb-4 rounded-xl bg-destructive/10 p-3 text-xs font-semibold text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {isRegister && (
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-foreground/60">
                  Company Name
                </label>
                <div className="relative flex items-center">
                  <Building2 className="absolute left-3.5 h-4 w-4 text-foreground/40" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Razorpay, Swiggy, TechCorp"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="h-11 w-full rounded-xl border border-input bg-background pl-10 pr-4 text-sm font-medium text-foreground outline-none focus:border-primary"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-foreground/60">
                Official Work Email
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 h-4 w-4 text-foreground/40" />
                <input
                  type="email"
                  required
                  placeholder="hr@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 w-full rounded-xl border border-input bg-background pl-10 pr-4 text-sm font-medium text-foreground outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-foreground/60">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 h-4 w-4 text-foreground/40" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 w-full rounded-xl border border-input bg-background pl-10 pr-4 text-sm font-medium text-foreground outline-none focus:border-primary"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-foreground text-sm font-bold text-background transition hover:bg-foreground/90 press disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <span>{isRegister ? "Continue to Org Setup" : "Sign In to HR Dashboard"}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Register / Login */}
          <div className="mt-5 text-center text-xs text-foreground/60">
            {isRegister ? (
              <p>
                Already have an employer account?{" "}
                <button
                  type="button"
                  onClick={() => setIsRegister(false)}
                  className="font-bold text-primary hover:underline"
                >
                  Log In
                </button>
              </p>
            ) : (
              <p>
                New hiring organisation?{" "}
                <button
                  type="button"
                  onClick={() => setIsRegister(true)}
                  className="font-bold text-primary hover:underline"
                >
                  Register here
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Feature points */}
        <div className="mt-6 grid grid-cols-2 gap-3 text-center text-[11px] font-semibold text-foreground/60">
          <div className="rounded-xl border border-border/80 bg-card/60 p-2.5">
            ✓ 60s Candidate Video Pitches
          </div>
          <div className="rounded-xl border border-border/80 bg-card/60 p-2.5">
            ✓ 48-Hour Response Tracking
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-foreground/40">
        Recruvate Pan India · Serving employers & candidates since 2017
      </div>
    </div>
  );
}
