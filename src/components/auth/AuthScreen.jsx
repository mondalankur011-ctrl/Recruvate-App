import React, { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail, Phone } from "lucide-react";
import AuthFrame from "@/components/auth/AuthFrame";
import GoogleIcon from "@/components/GoogleIcon";
import TextField from "@/components/auth/TextField";
import PasswordStrength from "@/components/auth/PasswordStrength";
import OtpStep from "@/components/auth/OtpStep";
import { safeReturnTo } from "@/lib/authReturnTo";

const PHONE_KEY = "hru_signup_phone";

export default function AuthScreen({ initialMode = "signup" }) {
  const [mode, setMode] = useState(initialMode);
  const [step, setStep] = useState("form");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogle = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      await base44.auth.loginWithProvider("google", safeReturnTo());
    } catch (err) {
      setError(err.message || "Google sign-in failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  const isSignup = mode === "signup";
  const passwordsMatch = confirm.length > 0 && password === confirm;
  const phoneDigits = phone.replace(/\D/g, "");
  const canSubmit = isSignup
    ? email.trim().length > 3 && phoneDigits.length >= 10 && password.length >= 8 && passwordsMatch
    : email.trim().length > 3 && password.length > 0;

  const switchMode = (next) => {
    setMode(next);
    setError("");
    setPassword("");
    setConfirm("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isSignup) {
      if (password.length < 8) {
        setError("Your password needs at least 8 characters.");
        return;
      }
      if (password !== confirm) {
        setError("Passwords do not match.");
        return;
      }
    }

    setLoading(true);
    try {
      if (isSignup) {
        await base44.auth.register({ email: email.trim(), password });
        localStorage.setItem(PHONE_KEY, phone.trim());
        setStep("otp");
      } else {
        await base44.auth.loginViaEmailPassword(email.trim(), password);
        try {
          await base44.auth.resendOtp(email.trim());
        } catch (sendError) {
          // Password already authenticated the session — don't trap the user here.
          window.location.href = safeReturnTo();
          return;
        }
        setStep("otp");
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (step === "otp") {
    return <OtpStep email={email.trim()} onBack={() => setStep("form")} />;
  }

  const eyeButton = (shown, toggle) => (
    <button
      type="button"
      onClick={toggle}
      aria-label={shown ? "Hide password" : "Show password"}
      className="flex h-11 w-11 items-center justify-center rounded-xl text-foreground/40 press hover:bg-muted"
    >
      {shown ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
    </button>
  );

  return (
    <AuthFrame>
      <div className="flex rounded-2xl bg-muted p-1">
        {[
          { key: "signup", label: "Sign Up" },
          { key: "login", label: "Log In" },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => switchMode(tab.key)}
            className={`h-11 flex-1 rounded-xl text-sm font-bold tracking-tight transition-all duration-300 ${
              mode === tab.key
                ? "bg-card text-foreground shadow-[0_6px_16px_-8px_rgba(23,21,34,0.5)]"
                : "text-foreground/50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <h2 className="mt-5 font-heading text-[21px] font-extrabold tracking-tight text-foreground">
        {isSignup ? "Create your account" : "Welcome back"}
      </h2>
      <p className="mt-1 text-sm text-foreground/55">
        {isSignup
          ? "One profile, matched to real openings."
          : "Log in and verify with a code to continue."}
      </p>

      {error && (
        <div className="mt-4 rounded-xl bg-destructive/10 px-3 py-2.5 text-sm font-medium text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
        <TextField
          label="Email"
          icon={Mail}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {isSignup && (
          <TextField
            label="Phone number"
            icon={Phone}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+91 98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        )}

        <div>
          <div className="flex items-end justify-between">
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground/50">
              Password
            </span>
            {!isSignup && (
              <Link to="/forgot-password" className="mb-1.5 text-sm font-semibold text-primary press">
                Forgot password?
              </Link>
            )}
          </div>
          <TextField
            icon={Lock}
            type={showPassword ? "text" : "password"}
            autoComplete={isSignup ? "new-password" : "current-password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            right={eyeButton(showPassword, () => setShowPassword((s) => !s))}
          />
          {isSignup && <PasswordStrength password={password} />}
        </div>

        {isSignup && (
          <div>
            <TextField
              label="Confirm password"
              icon={Lock}
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              right={eyeButton(showConfirm, () => setShowConfirm((s) => !s))}
            />
            {confirm.length > 0 && (
              <p
                className={`mt-1.5 px-1 text-sm font-semibold ${
                  passwordsMatch ? "text-[#2C7A4B]" : "text-destructive"
                }`}
                aria-live="polite"
              >
                {passwordsMatch ? "Passwords match" : "Passwords do not match"}
              </p>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !canSubmit}
          className="mt-1 flex h-14 w-full items-center justify-center gap-2 rounded-2xl brand-gradient text-[15px] font-bold text-white shadow-[0_14px_30px_-14px_rgba(238,92,43,0.9)] transition press disabled:opacity-40 disabled:shadow-none"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {isSignup ? "Creating account…" : "Logging in…"}
            </>
          ) : (
            <>
              {isSignup ? "Create account" : "Log in"}
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-foreground/10" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/40">
          or
        </span>
        <span className="h-px flex-1 bg-foreground/10" />
      </div>

      <button
        type="button"
        onClick={handleGoogle}
        disabled={googleLoading}
        className="mt-3 flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-foreground/12 bg-card text-sm font-bold text-foreground shadow-[0_10px_26px_-20px_rgba(23,21,34,0.5)] transition press disabled:opacity-50"
      >
        {googleLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <GoogleIcon className="h-5 w-5" />
        )}
        Continue with Google
      </button>

      <p className="mt-4 text-center text-sm text-foreground/55">
        {isSignup ? (
          <>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => switchMode("login")}
              className="font-semibold text-primary press"
            >
              Log in
            </button>
          </>
        ) : (
          <>
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => switchMode("signup")}
              className="font-semibold text-primary press"
            >
              Sign up
            </button>
          </>
        )}
      </p>
    </AuthFrame>
  );
}
