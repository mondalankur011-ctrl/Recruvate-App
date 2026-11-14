import React, { useCallback, useEffect, useState } from "react";
import { useApp } from "@/lib/appContext";
import { base44 } from "@/api/base44Client";
import { Sparkles } from "lucide-react";
import JobCard from "@/components/jobs/JobCard";
import ResumeReminderBanner from "@/components/app/ResumeReminderBanner";
import ResumeUpload from "@/components/onboarding/ResumeUpload";
import PullToRefresh from "@/components/app/PullToRefresh";
import { matchScore } from "@/lib/match";

const MONTH_MS = 2629800000;

export default function OpenJobs() {
  const { user, profile, setProfile } = useApp();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [showUploader, setShowUploader] = useState(false);

  const loadData = useCallback(async () => {
    const [jobPage, apps, saves] = await Promise.all([
      base44.entities.Job.filter({ is_active: true }, { sort: "-created_date", limit: 100 }),
      base44.entities.Application.filter({ created_by_id: user.id }),
      base44.entities.SavedJob.filter({ created_by_id: user.id }),
    ]);
    setJobs(jobPage.items || []);
    setApplications(apps || []);
    setSavedJobs(saves || []);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    loadData().finally(() => setLoading(false));
  }, [user, loadData]);

  const resumeDate = profile.resume_updated_date ? new Date(profile.resume_updated_date) : null;
  const monthsSince = resumeDate ? (Date.now() - resumeDate.getTime()) / MONTH_MS : 99;
  const dismissedAt = profile.reminder_dismissed_at ? new Date(profile.reminder_dismissed_at) : null;
  const dismissedThisCycle = dismissedAt && (!resumeDate || dismissedAt > resumeDate);
  const resumeOverdue = !profile.resume_file_uri || monthsSince >= 6;

  useEffect(() => {
    if (!resumeOverdue || monthsSince < 6) return;
    const ensureNotification = async () => {
      const existing = await base44.entities.Notification.filter({
        created_by_id: user.id,
        type: "resume_refresh",
      });
      const alreadySent = existing.some(
        (item) => !resumeDate || new Date(item.created_date) >= resumeDate
      );
      if (alreadySent) return;
      await base44.entities.Notification.create({
        title: "Time to refresh your resume",
        message:
          "It's been six months since your last CV. Upload a fresh copy so Recruvate keeps matching you to the right roles.",
        type: "resume_refresh",
        read: false,
      });
    };
    ensureNotification();
  }, [resumeOverdue, profile.resume_updated_date]);

  const rankedJobs = [...jobs]
    .map((job) => ({ job, match: matchScore(job, profile) }))
    .sort((a, b) => b.match - a.match);

  const appliedIds = new Set(applications.map((application) => application.job_id));
  const savedIds = new Set(savedJobs.map((saved) => saved.job_id));

  const apply = async (job) => {
    setBusyId(job.id);
    const tempId = `temp-${Date.now()}`;
    const optimistic = {
      id: tempId,
      job_id: job.id,
      job_title: job.title,
      company: job.company,
      location: job.location,
      status: "applied",
      applied_at: new Date().toISOString(),
    };
    setApplications((prev) => [...prev, optimistic]);
    try {
      const record = await base44.entities.Application.create({
        job_id: job.id,
        job_title: job.title,
        company: job.company,
        location: job.location,
        status: "applied",
        applied_at: new Date().toISOString(),
      });
      setApplications((prev) => prev.map((a) => (a.id === tempId ? record : a)));
    } catch (err) {
      setApplications((prev) => prev.filter((a) => a.id !== tempId));
    } finally {
      setBusyId("");
    }
  };

  const toggleSave = async (job) => {
    setBusyId(job.id);
    const existing = savedJobs.find((saved) => saved.job_id === job.id);
    if (existing) {
      setSavedJobs((prev) => prev.filter((saved) => saved.id !== existing.id));
      try {
        await base44.entities.SavedJob.delete(existing.id);
      } catch (err) {
        setSavedJobs((prev) => [...prev, existing]);
      } finally {
        setBusyId("");
      }
    } else {
      const tempId = `temp-${Date.now()}`;
      const optimistic = {
        id: tempId,
        job_id: job.id,
        job_title: job.title,
        company: job.company,
      };
      setSavedJobs((prev) => [...prev, optimistic]);
      try {
        const record = await base44.entities.SavedJob.create({
          job_id: job.id,
          job_title: job.title,
          company: job.company,
        });
        setSavedJobs((prev) => prev.map((s) => (s.id === tempId ? record : s)));
      } catch (err) {
        setSavedJobs((prev) => prev.filter((s) => s.id !== tempId));
      } finally {
        setBusyId("");
      }
    }
  };

  const dismissReminder = async () => {
    const updated = await base44.entities.CandidateProfile.update(profile.id, {
      reminder_dismissed_at: new Date().toISOString(),
    });
    setProfile(updated);
  };

  const updateResume = async (file) => {
    const updated = await base44.entities.CandidateProfile.update(profile.id, {
      resume_file_uri: file.uri,
      resume_file_name: file.name,
      resume_updated_date: new Date().toISOString().slice(0, 10),
      reminder_dismissed_at: null,
    });
    setProfile(updated);
    setShowUploader(false);
  };

  const firstName = (profile.full_name || "").split(" ")[0];

  return (
    <PullToRefresh onRefresh={loadData}>
      <div className="space-y-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            Open jobs · matched to your CV
          </p>
          <h1 className="mt-1.5 font-heading text-[26px] font-black leading-[1.1] tracking-tight text-foreground">
            {firstName ? `Hi ${firstName}, ` : ""}
            <span className="brand-text-gradient">
              {loading ? "finding roles" : `${jobs.length} roles`}
            </span>{" "}
            for you.
          </h1>
          <p className="mt-1.5 text-sm leading-relaxed text-foreground/50">
            {applications.length} applied · {savedJobs.length} saved · pulled from your department and CV
          </p>
        </div>

        {resumeOverdue && !dismissedThisCycle && (
          <ResumeReminderBanner
            updatedOn={
              resumeDate
                ? resumeDate.toLocaleDateString("en-IN", { month: "long", year: "numeric" })
                : ""
            }
            onDismiss={dismissReminder}
            onUpdate={() => setShowUploader(true)}
          />
        )}

        {showUploader && (
          <div className="rounded-[22px] bg-card p-4">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-foreground/45">
              Upload your latest resume
            </p>
            <ResumeUpload value={null} onChange={updateResume} />
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-[188px] animate-pulse rounded-[24px] bg-card/70" />
            ))}
          </div>
        ) : rankedJobs.length === 0 ? (
          <div className="rounded-[24px] bg-card px-5 py-10 text-center">
            <Sparkles className="mx-auto h-7 w-7 text-primary" />
            <p className="mt-3 font-heading text-[15px] font-extrabold text-foreground">
              New roles are on the way
            </p>
            <p className="mt-1 text-sm text-foreground/50">
              Recruvate adds fresh openings every week — check back soon.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {rankedJobs.map(({ job, match }) => (
              <JobCard
                key={job.id}
                job={job}
                match={match}
                applied={appliedIds.has(job.id)}
                saved={savedIds.has(job.id)}
                busy={busyId === job.id}
                onApply={() => apply(job)}
                onSave={() => toggleSave(job)}
              />
            ))}
          </div>
        )}
      </div>
    </PullToRefresh>
  );
}
