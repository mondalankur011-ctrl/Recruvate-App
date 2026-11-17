import React, { useState } from "react";
import { Briefcase, MapPin, Loader2, ArrowRight, User } from "lucide-react";
import OnboardingShell from "@/components/onboarding/OnboardingShell";
import TextField from "@/components/auth/TextField";
import ResumeUpload from "@/components/onboarding/ResumeUpload";

export default function DetailsStep({ profile, onNext }) {
  const [name, setName] = useState(profile.full_name || "");
  const [department, setDepartment] = useState(profile.department || "");
  const [location, setLocation] = useState(profile.location || "");
  const [resume, setResume] = useState({
    uri: profile.resume_file_uri || "",
    name: profile.resume_file_name || "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const complete = name.trim() && department.trim() && location.trim() && resume.uri;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!resume.uri) {
      setError("Please upload your resume or CV so we can match you to the right roles.");
      return;
    }
    setSaving(true);
    try {
      await onNext({
        full_name: name.trim(),
        department: department.trim(),
        location: location.trim(),
        resume_file_uri: resume.uri,
        resume_file_name: resume.name,
        resume_updated_date: new Date().toISOString().slice(0, 10),
      });
    } catch (err) {
      setError(err.message || "We couldn't save your details. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <OnboardingShell
      step={3}
      title="Fill your details"
      script="So we know who we're talking to."
      subtitle="This is what Recruvate and hiring teams see first."
    >
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <TextField
          label="Full name"
          icon={User}
          placeholder="Your name"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          label="Department"
          icon={Briefcase}
          placeholder="Marketing / Sales / IT / HR..."
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          required
        />
        <TextField
          label="Location"
          icon={MapPin}
          placeholder="City, State"
          autoComplete="address-level2"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />

        <div>
          <span className="mb-1.5 block text-sm font-semibold uppercase tracking-[0.12em] text-foreground/50">
            Resume / CV
          </span>
          <ResumeUpload value={resume} onChange={setResume} />
        </div>

        {error && (
          <div className="rounded-xl bg-destructive/10 px-3 py-2.5 text-sm font-medium text-destructive">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!complete || saving}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl brand-gradient text-[15px] font-bold text-white shadow-[0_14px_30px_-14px_rgba(238,92,43,0.9)] transition press disabled:opacity-40 disabled:shadow-none"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Saving…
            </>
          ) : (
            <>
              Continue <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </OnboardingShell>
  );
}
