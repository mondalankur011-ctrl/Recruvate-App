import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Building2, 
  Briefcase, 
  Users, 
  Video, 
  Clock, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  Award, 
  Eye, 
  Play, 
  X, 
  ArrowRight, 
  ChevronRight, 
  Sparkles, 
  RotateCcw, 
  LogOut, 
  FileText, 
  Phone, 
  Mail, 
  ExternalLink,
  PauseCircle,
  PlayCircle,
  Trash2,
  Check,
  MessageSquare
} from "lucide-react";
import BrandMark from "@/components/brand/BrandMark";
import { base44 } from "@/api/base44Client";

export default function EmployerDashboard() {
  const navigate = useNavigate();

  // State
  const [currentUser, setCurrentUser] = useState(null);
  const [vacancies, setVacancies] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active View Tab: 'applicants' | 'vacancies'
  const [activeTab, setActiveTab] = useState("applicants");
  const [statusFilter, setStatusFilter] = useState("all");
  const [jobFilter, setJobFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [selectedVideoApp, setSelectedVideoApp] = useState(null);
  const [selectedResumeApp, setSelectedResumeApp] = useState(null);
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [messageModalApp, setMessageModalApp] = useState(null);
  const [messageText, setMessageText] = useState("");

  // New Job Form State
  const [newTitle, setNewTitle] = useState("");
  const [newDepartment, setNewDepartment] = useState("Engineering");
  const [newLocation, setNewLocation] = useState("Bengaluru · Hybrid");
  const [newType, setNewType] = useState("Full-time");
  const [newSalary, setNewSalary] = useState("₹15,00,000 - ₹25,00,000");
  const [newPositions, setNewPositions] = useState(2);
  const [newExp, setNewExp] = useState("3-5 years");
  const [newWorkMode, setNewWorkMode] = useState("Hybrid");
  const [newSkills, setNewSkills] = useState("React, Tailwind CSS, TypeScript");
  const [newDesc, setNewDesc] = useState("We are looking for a driven professional to join our core team. You will lead key initiatives and collaborate closely with cross-functional partners.");

  // Toast message
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  // Load data
  const loadDashboardData = async () => {
    try {
      const user = await base44.auth.me().catch(() => null);
      setCurrentUser(user);

      const [jobsData, appsData] = await Promise.all([
        base44.entities.Job.filter({}, { sort: "-created_date" }),
        base44.entities.Application.filter({}, { sort: "-applied_at" }),
      ]);

      setVacancies(jobsData.items || jobsData || []);
      setApplications(appsData || []);
    } catch (err) {
      console.warn("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Application Actions
  const updateAppStatus = async (appId, newStatus) => {
    try {
      await base44.entities.Application.update(appId, { status: newStatus });
      setApplications((prev) =>
        prev.map((app) => (app.id === appId ? { ...app, status: newStatus } : app))
      );
      const statusLabels = {
        applied: "Marked as Applied",
        in_review: "Moved to In Review",
        interview: "Interview Invitation Sent",
        offer: "Job Offer Extended",
        rejected: "Candidate Rejected"
      };
      showToast(statusLabels[newStatus] || "Status updated");
    } catch (err) {
      showToast("Failed to update status");
    }
  };

  // Vacancy Actions
  const toggleVacancy = async (jobId, currentStatus) => {
    try {
      const updated = !currentStatus;
      await base44.entities.Job.update(jobId, { is_active: updated });
      setVacancies((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, is_active: updated } : j))
      );
      showToast(updated ? "Vacancy activated" : "Vacancy paused");
    } catch (err) {
      showToast("Failed to toggle vacancy");
    }
  };

  // Post Vacancy Submit
  const handlePostVacancy = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const skillsArray = newSkills.split(",").map((s) => s.trim()).filter(Boolean);
      const newJob = await base44.entities.Job.create({
        title: newTitle.trim(),
        company: currentUser?.company_name || "Recruvate Partner",
        department: newDepartment,
        location: newLocation,
        type: newType,
        salary_range: newSalary,
        skills: skillsArray,
        description: newDesc,
        open_positions: Number(newPositions) || 1,
        experience_level: newExp,
        work_mode: newWorkMode,
        is_active: true,
        views_count: 1,
        applicants_count: 0
      });

      setVacancies((prev) => [newJob, ...prev]);
      setPostModalOpen(false);
      showToast(`Vacancy "${newTitle}" published live to candidates!`);
      // Reset form
      setNewTitle("");
    } catch (err) {
      showToast("Failed to publish vacancy");
    }
  };

  // Switch to Candidate Mode
  const handleSwitchToCandidate = async () => {
    await base44.auth.switchRole("candidate");
    navigate("/");
  };

  // Filtered Applications
  const filteredApps = applications.filter((app) => {
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesJob = jobFilter === "all" || app.job_id === jobFilter;
    const matchesQuery = !searchQuery || 
      (app.candidate_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.job_title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.department || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesJob && matchesQuery;
  });

  // Calculate 48h clock for application
  const getClockStatus = (appliedAt) => {
    if (!appliedAt) return { label: "On Track", color: "text-emerald-500", urgent: false };
    const elapsedHours = (Date.now() - new Date(appliedAt).getTime()) / (1000 * 60 * 60);
    const remaining = Math.max(0, 48 - elapsedHours);
    if (remaining <= 0) return { label: "Overdue", color: "text-rose-500", remaining: 0, urgent: true };
    if (remaining <= 12) return { label: `${Math.round(remaining)}h left (Due Soon)`, color: "text-amber-500", remaining, urgent: true };
    return { label: `${Math.round(remaining)}h left`, color: "text-foreground/70", remaining, urgent: false };
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-foreground px-5 py-3 text-sm font-bold text-background shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/92 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <Link to="/landing">
              <BrandMark size="sm" />
            </Link>
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-primary">
              <Building2 className="h-3 w-3" />
              <span>Hiring Mode</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setPostModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl brand-gradient px-4 py-2 text-xs font-bold text-white shadow-sm hover:opacity-95 transition press"
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Post New Vacancy</span>
              <span className="sm:hidden">Post</span>
            </button>

            <button
              onClick={handleSwitchToCandidate}
              className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-bold text-foreground/80 hover:text-primary hover:border-primary/50 transition press"
              title="Switch to Candidate view"
            >
              <Briefcase className="h-3.5 w-3.5 text-primary" />
              <span className="hidden md:inline">Switch to Candidate Mode</span>
            </button>

            <button
              onClick={() => base44.auth.logout()}
              className="rounded-xl border border-border p-2 text-foreground/60 hover:text-destructive hover:bg-destructive/10 transition press"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Subheader / Organisation Bar */}
      <div className="border-b border-border/60 bg-card/50 py-3">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 text-xs">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-[11px]">
              HR
            </div>
            <div>
              <span className="font-bold text-foreground">{currentUser?.full_name || "Priya Sharma (HR Lead)"}</span>
              <span className="text-foreground/50 ml-1.5">· {currentUser?.company_name || "Recruvate Pan India"}</span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-foreground/60 text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Verified Employer</span>
            </span>
            <span>48-Hour Guarantee Active</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-6 sm:py-8 space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-foreground/50">Active Vacancies</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-heading text-2xl sm:text-3xl font-black text-foreground">
                {vacancies.filter((v) => v.is_active).length}
              </span>
              <span className="text-xs font-semibold text-emerald-500">Live on feed</span>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-foreground/50">Total Applicants</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-heading text-2xl sm:text-3xl font-black text-foreground">
                {applications.length}
              </span>
              <span className="text-xs font-semibold text-primary">Ready to review</span>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-foreground/50">Video Pitches</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-heading text-2xl sm:text-3xl font-black text-foreground">
                {applications.filter((a) => a.video_url).length}
              </span>
              <span className="text-xs font-semibold text-indigo-500 flex items-center gap-1">
                <Video className="h-3 w-3" />
                <span>60s intros</span>
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-foreground/50">48h Clock Due Soon</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-heading text-2xl sm:text-3xl font-black text-amber-500">
                {applications.filter((a) => getClockStatus(a.applied_at).urgent).length}
              </span>
              <span className="text-xs font-semibold text-amber-500 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Action needed</span>
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab("applicants")}
            className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-bold transition ${
              activeTab === "applicants"
                ? "border-primary text-primary"
                : "border-transparent text-foreground/60 hover:text-foreground"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Applicant Pipeline ({applications.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("vacancies")}
            className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-bold transition ${
              activeTab === "vacancies"
                ? "border-primary text-primary"
                : "border-transparent text-foreground/60 hover:text-foreground"
            }`}
          >
            <Briefcase className="h-4 w-4" />
            <span>Manage Vacancies ({vacancies.length})</span>
          </button>
        </div>

        {/* TAB 1: APPLICANT PIPELINE */}
        {activeTab === "applicants" && (
          <div className="space-y-4">
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
                <input
                  type="text"
                  placeholder="Search candidate name, job, skill..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 w-full rounded-xl border border-input bg-card pl-10 pr-4 text-xs font-medium text-foreground outline-none focus:border-primary"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Status Filter Chips */}
                {["all", "applied", "in_review", "interview", "offer", "rejected"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold capitalize transition press ${
                      statusFilter === st
                        ? "bg-foreground text-background"
                        : "bg-card border border-border text-foreground/70 hover:text-foreground"
                    }`}
                  >
                    {st.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Candidate Cards Grid */}
            {filteredApps.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-12 text-center text-foreground/50">
                <Users className="h-10 w-10 mx-auto text-foreground/30 mb-2" />
                <p className="text-sm font-bold">No candidates found for this filter</p>
                <p className="text-xs mt-1">Try selecting "All" or posting a new vacancy.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredApps.map((app) => {
                  const clock = getClockStatus(app.applied_at);
                  const isShortlisted = app.status === "in_review";
                  const isInterview = app.status === "interview";
                  const isOffer = app.status === "offer";
                  const isRejected = app.status === "rejected";

                  return (
                    <div
                      key={app.id}
                      className="rounded-2xl border border-border bg-card p-5 shadow-sm hover:border-primary/40 transition flex flex-col justify-between"
                    >
                      <div>
                        {/* Card Header: Candidate Info & 48h clock */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl brand-gradient text-white font-black text-sm shadow-sm">
                              {(app.candidate_name || "C").slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-base text-foreground leading-tight">
                                  {app.candidate_name || "Candidate"}
                                </h4>
                                {app.match_score && (
                                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                    {app.match_score}% Match
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-foreground/60 mt-0.5">
                                Applied for <strong className="text-foreground">{app.job_title}</strong>
                              </p>
                            </div>
                          </div>

                          {/* 48h Clock Badge */}
                          <div className={`flex items-center gap-1 rounded-lg bg-muted/60 px-2.5 py-1 text-[11px] font-bold ${clock.color}`}>
                            <Clock className="h-3 w-3" />
                            <span>{clock.label}</span>
                          </div>
                        </div>

                        {/* Candidate Skills & Notes */}
                        {app.skills && (
                          <div className="mt-3.5 flex flex-wrap gap-1.5">
                            {app.skills.map((sk) => (
                              <span
                                key={sk}
                                className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold text-foreground/75"
                              >
                                {sk}
                              </span>
                            ))}
                          </div>
                        )}

                        {app.notes && (
                          <p className="mt-3 rounded-xl bg-muted/40 p-2.5 text-xs text-foreground/70 italic">
                            "{app.notes}"
                          </p>
                        )}
                      </div>

                      {/* Video Intro & Action Buttons */}
                      <div className="mt-5 pt-4 border-t border-border space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          {/* Watch Video Pitch CTA */}
                          {app.video_url ? (
                            <button
                              type="button"
                              onClick={() => setSelectedVideoApp(app)}
                              className="inline-flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary hover:text-white transition press"
                            >
                              <Play className="h-3.5 w-3.5 fill-current" />
                              <span>Watch Video Pitch ({app.video_duration || 60}s)</span>
                            </button>
                          ) : (
                            <span className="text-xs text-foreground/40 italic">No video pitch attached</span>
                          )}

                          {/* View Resume CTA */}
                          <button
                            type="button"
                            onClick={() => setSelectedResumeApp(app)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-bold text-foreground/70 hover:text-foreground hover:bg-muted transition press"
                          >
                            <FileText className="h-3.5 w-3.5 text-primary" />
                            <span>View Resume</span>
                          </button>
                        </div>

                        {/* Workflow Pipeline Buttons */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <button
                            type="button"
                            onClick={() => updateAppStatus(app.id, "in_review")}
                            className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                              isShortlisted
                                ? "bg-amber-500 text-white"
                                : "bg-muted text-foreground/70 hover:bg-muted/80"
                            }`}
                          >
                            Shortlist
                          </button>

                          <button
                            type="button"
                            onClick={() => updateAppStatus(app.id, "interview")}
                            className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                              isInterview
                                ? "bg-primary text-white"
                                : "bg-muted text-foreground/70 hover:bg-muted/80"
                            }`}
                          >
                            Interview
                          </button>

                          <button
                            type="button"
                            onClick={() => updateAppStatus(app.id, "offer")}
                            className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                              isOffer
                                ? "bg-emerald-600 text-white"
                                : "bg-muted text-foreground/70 hover:bg-muted/80"
                            }`}
                          >
                            Make Offer
                          </button>

                          <button
                            type="button"
                            onClick={() => updateAppStatus(app.id, "rejected")}
                            className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                              isRejected
                                ? "bg-rose-500 text-white"
                                : "bg-muted text-foreground/70 hover:bg-muted/80"
                            }`}
                          >
                            Reject
                          </button>

                          <button
                            type="button"
                            onClick={() => { setMessageModalApp(app); setMessageText(""); }}
                            className="ml-auto rounded-lg border border-border p-1 text-foreground/60 hover:text-primary transition"
                            title="Message Candidate"
                          >
                            <MessageSquare className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MANAGE VACANCIES */}
        {activeTab === "vacancies" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-foreground/60">
                All Published Vacancies ({vacancies.length})
              </p>
              <button
                onClick={() => setPostModalOpen(true)}
                className="flex items-center gap-1.5 rounded-xl brand-gradient px-4 py-2 text-xs font-bold text-white shadow-sm hover:opacity-95 transition press"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Create Vacancy</span>
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {vacancies.map((job) => (
                <div
                  key={job.id}
                  className="rounded-2xl border border-border bg-card p-5 shadow-sm hover:border-primary/40 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        job.is_active
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-muted text-foreground/40"
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${job.is_active ? "bg-emerald-500" : "bg-foreground/40"}`} />
                        <span>{job.is_active ? "Active" : "Paused"}</span>
                      </span>

                      <span className="text-[11px] font-semibold text-foreground/50">
                        {job.department}
                      </span>
                    </div>

                    <h3 className="mt-3 text-lg font-bold text-foreground leading-snug">
                      {job.title}
                    </h3>
                    <p className="text-xs font-medium text-foreground/60 mt-1">
                      {job.location} · {job.type}
                    </p>
                    <p className="mt-2 text-sm font-bold text-primary">
                      {job.salary_range}
                    </p>

                    <p className="mt-3 text-xs text-foreground/65 line-clamp-2">
                      {job.description}
                    </p>

                    {job.skills && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {job.skills.slice(0, 3).map((sk) => (
                          <span
                            key={sk}
                            className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-foreground/70"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
                    <div className="text-xs text-foreground/60">
                      <strong className="text-foreground">{job.applicants_count || 0}</strong> applicants
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleVacancy(job.id, job.is_active)}
                        className="rounded-lg border border-border px-2.5 py-1 text-xs font-semibold text-foreground/70 hover:bg-muted transition"
                      >
                        {job.is_active ? "Pause" : "Resume"}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setJobFilter(job.id);
                          setActiveTab("applicants");
                        }}
                        className="rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary hover:bg-primary/20 transition"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* MODAL 1: Watch Candidate Video Pitch */}
      {selectedVideoApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl rounded-3xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Candidate Video Introduction</span>
                <h3 className="font-heading text-xl font-black text-foreground">
                  {selectedVideoApp.candidate_name}
                </h3>
                <p className="text-xs text-foreground/60">{selectedVideoApp.job_title} · {selectedVideoApp.department}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedVideoApp(null)}
                className="rounded-xl border border-border p-2 text-foreground/60 hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Video Player */}
            <div className="relative mt-5 overflow-hidden rounded-2xl bg-black aspect-video flex items-center justify-center">
              <video
                src={selectedVideoApp.video_url}
                controls
                autoPlay
                className="h-full w-full object-cover"
              />
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-foreground/60">
              <span>Duration: ~{selectedVideoApp.video_duration || 60} seconds</span>
              <span className="font-semibold text-emerald-500">Quality: {selectedVideoApp.video_quality || "Clear voice"}</span>
            </div>

            <div className="mt-5 pt-4 border-t border-border flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  updateAppStatus(selectedVideoApp.id, "interview");
                  setSelectedVideoApp(null);
                }}
                className="rounded-xl brand-gradient px-4 py-2 text-xs font-bold text-white shadow-sm press"
              >
                Invite to Interview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: View Candidate Resume */}
      {selectedResumeApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Candidate Dossier</span>
                <h3 className="font-heading text-xl font-black text-foreground">
                  {selectedResumeApp.candidate_name}
                </h3>
                <p className="text-xs text-foreground/60">{selectedResumeApp.candidate_email} · {selectedResumeApp.candidate_phone}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedResumeApp(null)}
                className="rounded-xl border border-border p-2 text-foreground/60 hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 space-y-4 text-xs">
              <div className="rounded-2xl border border-border bg-muted/30 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-foreground text-sm truncate">{selectedResumeApp.resume_name || "Resume_CV.pdf"}</p>
                    <p className="text-foreground/50 text-[11px]">Stored securely on Recruvate Cloud</p>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="font-bold uppercase tracking-wider text-foreground/60 text-[10px] mb-1.5">Candidate Summary & Notes:</h5>
                <p className="text-foreground/80 leading-relaxed bg-muted/20 p-3 rounded-xl border border-border/50">
                  {selectedResumeApp.notes || "Experienced professional with proven skills in high-growth team environments."}
                </p>
              </div>

              <div>
                <h5 className="font-bold uppercase tracking-wider text-foreground/60 text-[10px] mb-1.5">Verified Core Competencies:</h5>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedResumeApp.skills || []).map((sk) => (
                    <span key={sk} className="rounded-lg bg-primary/10 px-2.5 py-1 font-bold text-primary">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedResumeApp(null)}
                className="rounded-xl bg-foreground text-background px-4 py-2 text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Message Candidate */}
      {messageModalApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-heading text-lg font-bold text-foreground">
                Message {messageModalApp.candidate_name}
              </h3>
              <button
                type="button"
                onClick={() => setMessageModalApp(null)}
                className="rounded-xl border border-border p-1.5 text-foreground/60"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <p className="text-xs text-foreground/60">
                Send an official message directly to <strong className="text-foreground">{messageModalApp.candidate_email}</strong>.
              </p>
              <textarea
                rows={4}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Hi Pooja, we watched your video pitch and would love to connect for a 30-min conversation..."
                className="w-full rounded-xl border border-input bg-background p-3 text-xs text-foreground outline-none focus:border-primary"
              />
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setMessageModalApp(null)}
                className="rounded-xl border border-border px-4 py-2 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast(`Message sent to ${messageModalApp.candidate_name}`);
                  setMessageModalApp(null);
                }}
                className="rounded-xl brand-gradient px-4 py-2 text-xs font-bold text-white shadow-sm"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Post New Vacancy (Page 6 of Proposal) */}
      {postModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Step 4 & 5 · Vacancy Publisher</span>
                <h3 className="font-heading text-2xl font-black text-foreground">Post a New Vacancy</h3>
              </div>
              <button
                type="button"
                onClick={() => setPostModalOpen(false)}
                className="rounded-xl border border-border p-2 text-foreground/60 hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handlePostVacancy} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-foreground/60">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Senior Backend Engineer"
                    className="h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm font-medium text-foreground outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-foreground/60">
                    Department
                  </label>
                  <select
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    className="h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm font-medium text-foreground outline-none focus:border-primary"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Design">Design</option>
                    <option value="Product">Product</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-foreground/60">
                    Job Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="h-11 w-full rounded-xl border border-input bg-background px-3 text-xs font-medium text-foreground outline-none focus:border-primary"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-foreground/60">
                    Work Mode
                  </label>
                  <select
                    value={newWorkMode}
                    onChange={(e) => setNewWorkMode(e.target.value)}
                    className="h-11 w-full rounded-xl border border-input bg-background px-3 text-xs font-medium text-foreground outline-none focus:border-primary"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-foreground/60">
                    Open Positions
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newPositions}
                    onChange={(e) => setNewPositions(e.target.value)}
                    className="h-11 w-full rounded-xl border border-input bg-background px-3 text-xs font-medium text-foreground outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-foreground/60">
                    Salary Range
                  </label>
                  <input
                    type="text"
                    value={newSalary}
                    onChange={(e) => setNewSalary(e.target.value)}
                    placeholder="e.g. ₹18,00,000 - ₹28,00,000"
                    className="h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm font-medium text-foreground outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-foreground/60">
                    Experience Level
                  </label>
                  <input
                    type="text"
                    value={newExp}
                    onChange={(e) => setNewExp(e.target.value)}
                    placeholder="e.g. Fresher / 2-4 years / 5+ years"
                    className="h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm font-medium text-foreground outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-foreground/60">
                  Required Skills (comma separated)
                </label>
                <input
                  type="text"
                  value={newSkills}
                  onChange={(e) => setNewSkills(e.target.value)}
                  placeholder="e.g. Node.js, PostgreSQL, Docker, AWS"
                  className="h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm font-medium text-foreground outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-foreground/60">
                  Role Description & Responsibilities
                </label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background p-3 text-xs font-medium text-foreground outline-none focus:border-primary"
                />
              </div>

              {/* Live Preview Box */}
              <div className="rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Live Candidate Card Preview:</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <h4 className="font-bold text-sm text-foreground">{newTitle || "Senior Role Title"}</h4>
                  <span className="text-xs font-bold text-primary">{newSalary}</span>
                </div>
                <p className="text-[11px] text-foreground/60">{currentUser?.company_name || "Recruvate"} · {newLocation} · {newType}</p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setPostModalOpen(false)}
                  className="rounded-xl border border-border px-4 py-2.5 text-xs font-semibold hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl brand-gradient px-6 py-2.5 text-xs font-bold text-white shadow-md hover:opacity-95 transition press"
                >
                  <Plus className="h-4 w-4" />
                  <span>Publish Vacancy to Job Seekers</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
