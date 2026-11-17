import React, { useState } from "react";
import { useApp } from "@/lib/appContext";
import { base44 } from "@/api/base44Client";
import { FileText, LogOut, Play, Trash2, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import ProfileHeader from "@/components/profile/ProfileHeader";
import CompletionCard from "@/components/profile/CompletionCard";
import SocialLinksCard from "@/components/profile/SocialLinksCard";
import FounderCard from "@/components/profile/FounderCard";
import ResumeUpload from "@/components/onboarding/ResumeUpload";
import { qualityOf } from "@/lib/match";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";

export default function Profile() {
  const { profile, setProfile } = useApp();
  const { logout } = useAuth();
  const { toast } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const confirmDelete = async (event) => {
    event.preventDefault();
    setDeleting(true);
    try {
      await base44.entities.CandidateProfile.delete(profile.id);
      toast({
        title: "Account deleted",
        description: "Your account has been removed. Signing you out.",
      });
      setDeleteOpen(false);
      logout();
    } catch (err) {
      toast({
        title: "Couldn't delete account",
        description: err.message || "Please try again.",
      });
    } finally {
      setDeleting(false);
    }
  };

  const items = [
    { label: "Account created", done: true },
    {
      label: "Personal details",
      done: Boolean(profile.full_name && profile.department && profile.location),
    },
    { label: "Resume / CV uploaded", done: Boolean(profile.resume_file_uri) },
    {
      label: "Social links added",
      done: Boolean(profile.linkedin || profile.instagram || profile.facebook || profile.threads),
    },
    { label: "Intro video recorded", done: Boolean(profile.intro_video_uri) },
  ];

  const updateResume = async (file) => {
    const updated = await base44.entities.CandidateProfile.update(profile.id, {
      resume_file_uri: file.uri,
      resume_file_name: file.name,
      resume_updated_date: new Date().toISOString().slice(0, 10),
      reminder_dismissed_at: null,
    });
    setProfile(updated);
  };

  const quality = profile.intro_video_uri ? qualityOf(profile.intro_video_duration) : null;
  const resumeUpdated = profile.resume_updated_date
    ? new Date(profile.resume_updated_date).toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric",
      })
    : "Not uploaded";

  return (
    <div className="space-y-4">
      <ProfileHeader profile={profile} />

      <CompletionCard items={items} />

      <div className="rounded-[24px] bg-card p-4 shadow-[0_18px_44px_-34px_rgba(23,21,34,0.75)]">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-foreground/40">
            Resume / CV
          </p>
          <span className="text-[10.5px] font-semibold text-foreground/35">
            Updated {resumeUpdated}
          </span>
        </div>
        <div className="mt-2.5">
          <ResumeUpload
            value={
              profile.resume_file_uri
                ? { uri: profile.resume_file_uri, name: profile.resume_file_name }
                : null
            }
            onChange={updateResume}
          />
        </div>
      </div>

      {profile.intro_video_uri && (
        <div className="rounded-[24px] bg-card p-4 shadow-[0_18px_44px_-34px_rgba(23,21,34,0.75)]">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-foreground/40">
            Intro video
          </p>
          <div className="mt-2.5 flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-foreground">
              <Play className="h-4 w-4 fill-background text-background" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">
                {Math.round(profile.intro_video_duration)}s intro
              </p>
              <p className="text-sm text-foreground/40">Stored privately for Recruvate review</p>
            </div>
            <span
              className={`shrink-0 rounded-full border px-2.5 py-1 text-[10.5px] font-bold ${quality.badge}`}
            >
              {profile.intro_video_quality || quality.label}
            </span>
          </div>
        </div>
      )}

      {!profile.intro_video_uri && (
        <div className="flex items-center gap-2.5 rounded-[24px] bg-card p-4">
          <FileText className="h-4 w-4 text-primary" />
          <p className="text-sm text-foreground/55">No intro video yet.</p>
        </div>
      )}

      <SocialLinksCard profile={profile} onChange={setProfile} />

      <FounderCard />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogTrigger asChild>
          <button
            type="button"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/5 text-sm font-bold text-destructive press"
          >
            <Trash2 className="h-4 w-4" /> Delete account
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading">Delete your account?</AlertDialogTitle>
            <AlertDialogDescription>
              This is permanent. Your profile, resume, intro video and all application history will be
              removed and cannot be recovered. Are you sure?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleting}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {deleting ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Deleting…
                </span>
              ) : (
                "Yes, delete forever"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <button
        type="button"
        onClick={() => logout()}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card text-sm font-bold text-foreground/60 press"
      >
        <LogOut className="h-4 w-4" /> Sign out
      </button>
    </div>
  );
}
