import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import AuthFrame from "@/components/auth/AuthFrame";
import { safeReturnTo } from "@/lib/authReturnTo";

export default function OtpStep({ email, onBack }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [seconds, setSeconds] = useState(30);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  const verify = async (value) => {
    if (verifying) return;
    setError("");
    setVerifying(true);
    try {
      const result = await base44.auth.verifyOtp({ email, otpCode: value });
      if (result?.access_token) {
        base44.auth.setToken(result.access_token);
      }
      window.location.href = safeReturnTo();
    } catch (err) {
      setError(err.message || "That code didn't work. Please try again.");
      setCode("");
      setVerifying(false);
    }
  };

  const handleChange = (value) => {
    setCode(value);
    setError("");
    if (value.length === 6) verify(value);
  };

  const handleResend = async () => {
    if (seconds > 0 || resending) return;
    setResending(true);
    setError("");
    try {
      await base44.auth.resendOtp(email);
      setSeconds(30);
    } catch (err) {
      setError(err.message || "We couldn't send a new code. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthFrame>
      <button
        type="button"
        onClick={onBack}
        className="mb-4 -ml-1 inline-flex items-center gap-1.5 text-sm font-medium text-foreground/50 press"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="mb-1 flex h-11 w-11 items-center justify-center rounded-2xl brand-gradient">
        <ShieldCheck className="h-5 w-5 text-white" />
      </div>
      <h2 className="mt-3 font-heading text-[22px] font-extrabold tracking-tight text-foreground">
        Verify it's you
      </h2>
      <p className="mt-1 text-sm leading-relaxed text-foreground/55">
        We sent a 6-digit code to <span className="font-semibold text-foreground">{email}</span>. Enter it
        below to continue.
      </p>

      {error && (
        <div className="mt-4 rounded-xl bg-destructive/10 px-3 py-2.5 text-sm font-medium text-destructive">
          {error}
        </div>
      )}

      <div className="mt-6 flex justify-center">
        <InputOTP
          maxLength={6}
          value={code}
          onChange={handleChange}
          autoFocus
          autoComplete="one-time-code"
          inputMode="numeric"
        >
          <InputOTPGroup className="gap-2">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <InputOTPSlot
                key={i}
                index={i}
                className="h-14 w-11 rounded-xl border-2 border-border bg-muted font-heading text-xl font-bold text-foreground data-[active=true]:border-primary data-[active=true]:bg-card"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>

      <div className="mt-6 flex items-center justify-center text-sm text-foreground/55">
        {verifying ? (
          <span className="inline-flex items-center gap-2 font-medium text-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Verifying…
          </span>
        ) : seconds > 0 ? (
          <span>
            Resend code in <span className="font-semibold text-foreground">{seconds}s</span>
          </span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="font-semibold text-primary press disabled:opacity-50"
          >
            {resending ? "Sending…" : "Resend code"}
          </button>
        )}
      </div>
    </AuthFrame>
  );
}
