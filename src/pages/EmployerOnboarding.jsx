import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Building2, 
  Video, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Loader2, 
  Upload, 
  RotateCcw
} from "lucide-react";
import BrandMark from "@/components/brand/BrandMark";
import { base44 } from "@/api/base44Client";

export default function EmployerOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = Details, 2 = Video Pitch, 3 = Completed
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1 Details
  const [companyName, setCompanyName] = useState("Recruvate Pan India");
  const [fullName, setFullName] = useState("Priya Sharma");
  const [roleTitle, setRoleTitle] = useState("Head of Talent Acquisition");
  const [industry, setIndustry] = useState("Technology & Staffing");
  const [companySize, setCompanySize] = useState("50-200 employees");
  const [location, setLocation] = useState("Mumbai & Bengaluru");
  const [website, setWebsite] = useState("https://recruvate.in");
  const [workEmail, setWorkEmail] = useState("priya.sharma@recruvate.in");

  // Step 2 Video Pitch
  const [videoUrl, setVideoUrl] = useState("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4");
  const [videoDuration, setVideoDuration] = useState(75);
  const [videoUploading, setVideoUploading] = useState(false);

  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    if (!companyName.trim() || !fullName.trim() || !workEmail.trim()) {
      setError("Please fill in the required company and personal details.");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideoUploading(true);
    try {
      const res = await base44.integrations.Core.UploadPrivateFile({ file });
      setVideoUrl(res.file_uri);
      setVideoDuration(75);
    } catch (err) {
      setError("Failed to upload video");
    } finally {
      setVideoUploading(false);
    }
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      // Save employer profile
      await base44.entities.EmployerProfile.create({
        company_name: companyName.trim(),
        full_name: fullName.trim(),
        role_title: roleTitle.trim(),
        industry,
        company_size: companySize,
        location,
        website,
        work_email: workEmail,
        company_intro_video_uri: videoUrl,
        company_intro_video_duration: videoDuration,
        onboarding_complete: true,
        verified: true,
      });

      // Update current user
      const currentUser = await base44.auth.me().catch(() => null);
      if (currentUser) {
        await base44.auth.switchRole("employer");
      }

      setStep(3);
      setTimeout(() => {
        navigate("/employer/dashboard");
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to complete onboarding.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between p-4">
      {/* Top Header */}
      <div className="mx-auto flex w-full max-w-md items-center justify-between">
        <Link to="/landing">
          <BrandMark size="sm" />
        </Link>
        <div className="flex items-center gap-2 text-xs font-semibold text-foreground/60">
          <span>Step {step} of 2</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="mx-auto w-full max-w-md my-4">
        {step === 1 && (
          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-2">
              <Building2 className="h-4 w-4" />
              <span>Step 1 · Organisation Onboarding</span>
            </div>

            <h2 className="font-heading text-xl font-black text-foreground">Tell us about your company</h2>
            <p className="mt-1 text-xs text-foreground/60">
              This information will be presented to candidates on your job postings and company profile.
            </p>

            {error && (
              <div className="mt-4 rounded-xl bg-destructive/10 p-3 text-xs font-semibold text-destructive">
                {error}
              </div>
            )}

            <form onSubmit={handleDetailsSubmit} className="mt-5 space-y-3.5">
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-foreground/60">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Recruvate, Razorpay"
                    className="h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm font-medium text-foreground outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-foreground/60">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm font-medium text-foreground outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-foreground/60">
                    Your Role in Hiring
                  </label>
                  <select
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    className="h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm font-medium text-foreground outline-none focus:border-primary"
                  >
                    <option value="Head of Talent Acquisition">Head of Talent Acquisition</option>
                    <option value="HR Manager">HR Manager</option>
                    <option value="Founder / CEO">Founder / CEO</option>
                    <option value="Hiring Lead">Hiring Manager</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-foreground/60">
                    Industry
                  </label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g. Fintech, SaaS, E-Commerce"
                    className="h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm font-medium text-foreground outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-foreground/60">
                    Company Size
                  </label>
                  <select
                    value={companySize}
                    onChange={(e) => setCompanySize(e.target.value)}
                    className="h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm font-medium text-foreground outline-none focus:border-primary"
                  >
                    <option value="1-10 employees (Early Stage)">1-10 employees (Early Stage)</option>
                    <option value="11-50 employees (Seed/Growth)">11-50 employees (Seed/Growth)</option>
                    <option value="50-200 employees">50-200 employees</option>
                    <option value="200-1000 employees">200-1000 employees</option>
                    <option value="1000+ employees (Enterprise)">1000+ employees (Enterprise)</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-foreground/60">
                    Office Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Mumbai · Hybrid"
                    className="h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm font-medium text-foreground outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-foreground/60">
                    Official Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={workEmail}
                    onChange={(e) => setWorkEmail(e.target.value)}
                    placeholder="priya@company.com"
                    className="h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm font-medium text-foreground outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-foreground/60">
                    Company Website (Optional)
                  </label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://company.com"
                    className="h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm font-medium text-foreground outline-none focus:border-primary"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl brand-gradient text-xs font-bold text-white shadow-sm hover:opacity-95 transition press"
              >
                <span>Continue to Video Intro</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground/60 hover:text-foreground mb-4"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Company Details</span>
            </button>

            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-2">
              <Video className="h-4 w-4" />
              <span>Step 2 · Company Culture Video</span>
            </div>

            <h2 className="font-heading text-2xl font-black text-foreground">Record your 60–90 second intro</h2>
            <p className="mt-1 text-xs sm:text-sm text-foreground/60">
              Introduce your company to candidates. Speak about your culture, perks, and why candidates should join.
            </p>

            {/* Prompt Card from Page 5 of PDF */}
            <div className="my-5 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-xs text-foreground/80 leading-relaxed">
              <p className="font-bold text-primary mb-1">Recommended Speaker Prompts:</p>
              <ul className="list-disc pl-4 space-y-1 text-foreground/70">
                <li>Who the organisation is and what it does</li>
                <li>Services or products offered to customers</li>
                <li>Facilities, benefits, culture, and work mode (office / remote / hybrid)</li>
              </ul>
            </div>

            {/* Video Preview */}
            <div className="relative overflow-hidden rounded-2xl border border-border bg-black aspect-video flex items-center justify-center">
              {videoUrl ? (
                <video
                  src={videoUrl}
                  controls
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="text-center p-6 text-white/70">
                  <Video className="h-10 w-10 mx-auto text-primary mb-2" />
                  <p className="text-xs">No video pitch selected yet</p>
                </div>
              )}
            </div>

            {/* Video Controls */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <label className="inline-flex items-center gap-2 rounded-xl border border-border bg-muted px-4 py-2.5 text-xs font-bold text-foreground hover:bg-muted/80 cursor-pointer transition press">
                <Upload className="h-4 w-4 text-primary" />
                <span>{videoUploading ? "Uploading..." : "Upload Video File (.mp4, .mov)"}</span>
                <input
                  type="file"
                  accept="video/mp4,video/quicktime,video/webm"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={() => setVideoUrl("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4")}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Use Sample Video</span>
              </button>
            </div>

            <button
              onClick={handleFinalSubmit}
              disabled={loading || videoUploading}
              className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl brand-gradient text-sm font-bold text-white shadow-md hover:opacity-95 transition press disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <span>Complete Setup & Enter HR Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="rounded-3xl border border-border bg-card p-10 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 mb-4 animate-bounce">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h2 className="font-heading text-2xl font-black text-foreground">Organisation Verified!</h2>
            <p className="mt-2 text-sm text-foreground/60 max-w-sm mx-auto">
              Your company profile and culture video are ready. Opening your HR Dashboard...
            </p>
            <div className="mt-6 flex justify-center">
              <Loader2 className="h-6 w-6 text-primary animate-spin" />
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-foreground/40">
        Recruvate Hiring Mode · Pan India
      </div>
    </div>
  );
}
