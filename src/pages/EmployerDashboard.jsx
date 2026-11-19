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
  CheckCircle2, 
  Play, 
  X, 
  FileText, 
  Phone, 
  Mail, 
  PauseCircle,
  PlayCircle,
  MessageSquare,
  UserCheck,
  Send
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
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [selectedVideoApp, setSelectedVideoApp] = useState(null);
  const [selectedResumeApp, setSelectedResumeApp] = useState(null);
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [messageModalApp, setMessageModalApp] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [toast, setToast] = useState("");

  // New Job Form State
  const [newTitle, setNewTitle] = useState("");
  const [newDept, setNewDept] = useState("Technology");
  const [newType, setNewType] = useState("Full-time");
  const [newMode, setNewMode] = useState("Hybrid");
  const [newLocation, setNewLocation] = useState("Bengaluru / Mumbai");
  const [newSalary, setNewSalary] = useState("₹15L - ₹24L / year");
  const [newExp, setNewExp] = useState("3-5 years");
  const [newSkills, setNewSkills] = useState("React, TypeScript, TailwindCSS");
  const [newDesc, setNewDesc] = useState("Looking for an energetic team member to build modern products.");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const user = await base44.auth.me().catch(() => null);
      setCurrentUser(user);

      const jobsRes = await base44.entities.Job.filter({}, { limit: 50 });
      setVacancies(jobsRes?.items || jobsRes || []);

      const apps = await base44.entities.Application.filter({}, { limit: 100 });
      setApplications(apps || []);
    } catch (err) {
      console.warn("Failed to load HR data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await base44.entities.Application.update(appId, { status: newStatus });
      setApplications((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
      );
      showToast(`Status updated to: ${newStatus}`);
    } catch (err) {
      showToast("Failed to update status");
    }
  };

  const handleToggleJob = async (jobId, currentActive) => {
    try {
      await base44.entities.Job.update(jobId, { is_active: !currentActive });
      setVacancies((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, is_active: !currentActive } : j))
      );
      showToast(!currentActive ? "Vacancy activated" : "Vacancy paused");
    } catch (err) {
      showToast("Error updating vacancy");
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const skillsArray = newSkills.split(",").map((s) => s.trim()).filter(Boolean);
      const created = await base44.entities.Job.create({
        title: newTitle.trim(),
        department: newDept,
        type: newType,
        work_mode: newMode,
        location: newLocation,
        salary_range: newSalary,
        experience_required: newExp,
        skills: skillsArray,
        description: newDesc,
        is_active: true
      });

      setVacancies((prev) => [created, ...prev]);
      setPostModalOpen(false);
      setNewTitle("");
      showToast("New vacancy published successfully!");
    } catch (err) {
      showToast("Failed to publish vacancy");
    }
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    showToast(`Message sent to ${messageModalApp.candidate_name}!`);
    setMessageModalApp(null);
    setMessageText("");
  };

  const handleSwitchToCandidate = async () => {
    await base44.auth.loginAsDemoCandidate();
    navigate("/");
  };

  // Filtered applicants
  const filteredApps = applications.filter((app) => {
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesQuery = !searchQuery || 
      (app.candidate_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.job_title || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  const getClockStatus = (appliedAt) => {
    if (!appliedAt) return { label: "On Track", color: "text-emerald-500 bg-emerald-500/10", urgent: false };
    const elapsedHours = (Date.now() - new Date(appliedAt).getTime()) / (1000 * 60 * 60);
    const remaining = Math.max(0, 48 - elapsedHours);
    if (remaining <= 0) return { label: "Overdue", color: "text-rose-500 bg-rose-500/10", remaining: 0, urgent: true };
    if (remaining <= 12) return { label: `${Math.round(remaining)}h left (Due)`, color: "text-amber-500 bg-amber-500/10", remaining, urgent: true };
    return { label: `${Math.round(remaining)}h left`, color: "text-primary bg-primary/10", remaining, urgent: false };
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground pb-20 selection:bg-primary/20">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-4 inset-x-5 z-50 flex items-center justify-center">
          <div className="flex items-center gap-2 rounded-2xl bg-foreground px-4 py-2.5 text-xs font-bold text-background shadow-2xl animate-in fade-in duration-150">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{toast}</span>
          </div>
        </div>
      )}

      {/* Mobile App Header */}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur-md px-5 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Link to="/landing">
              <BrandMark size="sm" />
            </Link>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-primary">
              HR Mode
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPostModalOpen(true)}
              className="flex items-center gap-1 rounded-xl brand-gradient px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:opacity-95 transition press"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Post Job</span>
            </button>
            <button
              onClick={handleSwitchToCandidate}
              className="flex items-center justify-center h-8 w-8 rounded-xl border border-border bg-card text-foreground/70 hover:text-primary transition press"
              title="Switch to Candidate Mode"
            >
              <UserCheck className="h-4 w-4 text-primary" />
            </button>
          </div>
        </div>

        {/* Company Title Bar */}
        <div className="mt-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-foreground/80 font-semibold truncate">
            <Building2 className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="truncate">{currentUser?.company_name || "Recruvate India"}</span>
          </div>
          <span className="text-[11px] text-foreground/50 shrink-0">
            {currentUser?.name || "Priya Sharma"}
          </span>
        </div>
      </header>

      {/* Main Scrollable Content */}
      <main className="flex-1 px-5 pt-4 space-y-4">
        {/* Compact 2x2 Metric Cards */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="rounded-2xl border border-border bg-card p-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/50">Active Jobs</span>
              <Briefcase className="h-3.5 w-3.5 text-primary" />
            </div>
            <p className="mt-1 font-heading text-xl font-black text-foreground">
              {vacancies.filter((v) => v.is_active).length}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/50">Applicants</span>
              <Users className="h-3.5 w-3.5 text-emerald-500" />
            </div>
            <p className="mt-1 font-heading text-xl font-black text-foreground">
              {applications.length}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/50">Pitches</span>
              <Video className="h-3.5 w-3.5 text-purple-500" />
            </div>
            <p className="mt-1 font-heading text-xl font-black text-foreground">
              {applications.filter((a) => a.video_pitch_url).length}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/50">48h Clock</span>
              <Clock className="h-3.5 w-3.5 text-amber-500" />
            </div>
            <p className="mt-1 font-heading text-xl font-black text-amber-500">
              {applications.filter((a) => a.status === "pending").length} Due
            </p>
          </div>
        </div>

        {/* Mobile Tab Segment Controls */}
        <div className="flex rounded-xl bg-card border border-border p-1">
          <button
            onClick={() => setActiveTab("applicants")}
            className={`flex-1 rounded-lg py-2 text-xs font-bold transition ${
              activeTab === "applicants"
                ? "bg-primary text-white shadow-sm"
                : "text-foreground/70 hover:text-foreground"
            }`}
          >
            Applicants ({applications.length})
          </button>
          <button
            onClick={() => setActiveTab("vacancies")}
            className={`flex-1 rounded-lg py-2 text-xs font-bold transition ${
              activeTab === "vacancies"
                ? "bg-primary text-white shadow-sm"
                : "text-foreground/70 hover:text-foreground"
            }`}
          >
            Vacancies ({vacancies.length})
          </button>
        </div>

        {/* APPLICANTS TAB */}
        {activeTab === "applicants" && (
          <div className="space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground/40" />
              <input
                type="text"
                placeholder="Search candidate or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full rounded-xl border border-input bg-card pl-9 pr-3 text-xs font-medium text-foreground outline-none focus:border-primary"
              />
            </div>

            {/* Horizontal Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
              {["all", "pending", "shortlisted", "interview", "offered", "rejected"].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-bold capitalize transition ${
                    statusFilter === st
                      ? "bg-primary text-white"
                      : "bg-card border border-border text-foreground/70 hover:bg-muted"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Candidate Cards List */}
            {filteredApps.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-8 text-center text-xs text-foreground/50">
                No candidates found matching this filter.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredApps.map((app) => {
                  const clock = getClockStatus(app.applied_at);
                  return (
                    <div
                      key={app.id}
                      className="rounded-2xl border border-border bg-card p-4 space-y-3 shadow-sm hover:border-primary/40 transition"
                    >
                      {/* Top: Avatar, Name & Match Score */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl brand-gradient text-xs font-black text-white">
                            {app.candidate_name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("") || "CA"}
                          </div>
                          <div>
                            <h4 className="font-heading text-sm font-bold text-foreground">
                              {app.candidate_name || "Applicant"}
                            </h4>
                            <p className="text-[11px] text-foreground/60">
                              {app.job_title}
                            </p>
                          </div>
                        </div>

                        {/* Match & 48h Badge */}
                        <div className="flex flex-col items-end gap-1">
                          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-extrabold text-emerald-500">
                            {app.match_score || 90}% Match
                          </span>
                          <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${clock.color}`}>
                            {clock.label}
                          </span>
                        </div>
                      </div>

                      {/* Candidate Details Chips */}
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-foreground/70">
                        <span className="rounded-md bg-muted px-2 py-0.5 font-medium">
                          {app.experience_years ? `${app.experience_years} yrs exp` : "3 yrs exp"}
                        </span>
                        <span className="rounded-md bg-muted px-2 py-0.5 font-medium">
                          {app.location || "Mumbai, India"}
                        </span>
                        <span className={`rounded-md px-2 py-0.5 font-bold uppercase text-[9px] ${
                          app.status === "shortlisted" ? "bg-emerald-500/15 text-emerald-600" :
                          app.status === "interview" ? "bg-purple-500/15 text-purple-600" :
                          app.status === "offered" ? "bg-primary/15 text-primary" :
                          app.status === "rejected" ? "bg-destructive/15 text-destructive" :
                          "bg-amber-500/15 text-amber-600"
                        }`}>
                          {app.status}
                        </span>
                      </div>

                      {/* Video Pitch & Resume Action Buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => setSelectedVideoApp(app)}
                          className="flex items-center justify-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-xs font-bold text-primary hover:bg-primary hover:text-white transition press"
                        >
                          <Play className="h-3 w-3 fill-current" />
                          <span>Video Pitch</span>
                        </button>

                        <button
                          onClick={() => setSelectedResumeApp(app)}
                          className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-background px-3 py-2 text-xs font-bold text-foreground/80 hover:border-primary/50 transition press"
                        >
                          <FileText className="h-3.5 w-3.5 text-foreground/50" />
                          <span>View CV</span>
                        </button>
                      </div>

                      {/* Quick Status Bar */}
                      <div className="flex items-center justify-between border-t border-border/60 pt-2.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/40">
                          Move Status:
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleStatusChange(app.id, "shortlisted")}
                            className="rounded-lg bg-emerald-500/10 px-2 py-1 text-[10px] font-bold text-emerald-600 hover:bg-emerald-500 hover:text-white transition"
                          >
                            Shortlist
                          </button>
                          <button
                            onClick={() => handleStatusChange(app.id, "interview")}
                            className="rounded-lg bg-purple-500/10 px-2 py-1 text-[10px] font-bold text-purple-600 hover:bg-purple-500 hover:text-white transition"
                          >
                            Interview
                          </button>
                          <button
                            onClick={() => setMessageModalApp(app)}
                            className="rounded-lg bg-muted px-2 py-1 text-[10px] font-bold text-foreground/70 hover:bg-foreground hover:text-background transition"
                          >
                            Message
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

        {/* VACANCIES TAB */}
        {activeTab === "vacancies" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-foreground/60">
                Posted Positions ({vacancies.length})
              </span>
              <button
                onClick={() => setPostModalOpen(true)}
                className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Position</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {vacancies.map((job) => {
                const count = applications.filter((a) => a.job_id === job.id).length;
                return (
                  <div
                    key={job.id}
                    className="rounded-2xl border border-border bg-card p-4 space-y-2.5 shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-heading text-sm font-bold text-foreground">{job.title}</h4>
                        <p className="text-[11px] text-foreground/60">
                          {job.department} · {job.location || "Remote"}
                        </p>
                      </div>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
                        job.is_active ? "bg-emerald-500/15 text-emerald-500" : "bg-muted text-foreground/50"
                      }`}>
                        {job.is_active ? "Active" : "Paused"}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                      <span className="rounded-md bg-muted px-2 py-0.5 font-bold text-foreground/80">
                        {job.salary_range || "Competitive"}
                      </span>
                      <span className="rounded-md bg-muted px-2 py-0.5 font-medium text-foreground/70">
                        {job.work_mode || "Hybrid"}
                      </span>
                      <span className="rounded-md bg-primary/10 px-2 py-0.5 font-bold text-primary">
                        {count} Applicants
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-t border-border/60 pt-2 text-xs">
                      <button
                        onClick={() => handleToggleJob(job.id, job.is_active)}
                        className="flex items-center gap-1 text-[11px] font-semibold text-foreground/60 hover:text-primary transition"
                      >
                        {job.is_active ? (
                          <>
                            <PauseCircle className="h-3.5 w-3.5" />
                            <span>Pause Hiring</span>
                          </>
                        ) : (
                          <>
                            <PlayCircle className="h-3.5 w-3.5 text-emerald-500" />
                            <span>Resume Hiring</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          setJobFilter(job.id);
                          setActiveTab("applicants");
                        }}
                        className="text-[11px] font-bold text-primary hover:underline"
                      >
                        View Applicants →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-border/80 bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-md items-center justify-around py-2">
          <button
            onClick={() => setActiveTab("applicants")}
            className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
              activeTab === "applicants" ? "text-primary" : "text-foreground/50"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Applicants</span>
          </button>

          <button
            onClick={() => setActiveTab("vacancies")}
            className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
              activeTab === "vacancies" ? "text-primary" : "text-foreground/50"
            }`}
          >
            <Briefcase className="h-4 w-4" />
            <span>Vacancies</span>
          </button>

          <button
            onClick={() => setPostModalOpen(true)}
            className="flex flex-col items-center gap-1 text-[10px] font-bold text-primary"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full brand-gradient text-white shadow-md">
              <Plus className="h-4 w-4" />
            </div>
            <span>Post</span>
          </button>

          <button
            onClick={handleSwitchToCandidate}
            className="flex flex-col items-center gap-1 text-[10px] font-bold text-foreground/50 hover:text-foreground"
          >
            <UserCheck className="h-4 w-4" />
            <span>Candidate</span>
          </button>
        </div>
      </nav>

      {/* MODAL: Watch Candidate Video Pitch */}
      {selectedVideoApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-3xl bg-card border border-border p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading text-sm font-bold text-foreground">
                  {selectedVideoApp.candidate_name}'s Pitch
                </h3>
                <p className="text-[11px] text-foreground/60">{selectedVideoApp.job_title}</p>
              </div>
              <button
                onClick={() => setSelectedVideoApp(null)}
                className="rounded-full bg-muted p-1 text-foreground/60 hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="relative aspect-[9/16] w-full overflow-hidden rounded-2xl bg-black">
              <video
                src={selectedVideoApp.video_pitch_url}
                controls
                autoPlay
                className="h-full w-full object-cover"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  handleStatusChange(selectedVideoApp.id, "shortlisted");
                  setSelectedVideoApp(null);
                }}
                className="rounded-xl brand-gradient py-2 text-xs font-bold text-white shadow-sm"
              >
                Shortlist Candidate
              </button>
              <button
                onClick={() => {
                  handleStatusChange(selectedVideoApp.id, "rejected");
                  setSelectedVideoApp(null);
                }}
                className="rounded-xl border border-border py-2 text-xs font-bold text-foreground/70"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: View Resume */}
      {selectedResumeApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-3xl bg-card border border-border p-5 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-heading text-base font-bold text-foreground">
                  {selectedResumeApp.candidate_name}
                </h3>
                <p className="text-xs text-foreground/60">{selectedResumeApp.job_title}</p>
              </div>
              <button
                onClick={() => setSelectedResumeApp(null)}
                className="rounded-full bg-muted p-1 text-foreground/60 hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="rounded-xl bg-muted/60 p-3 space-y-1.5">
                <p className="font-bold text-foreground">Contact & Location</p>
                <p className="text-foreground/70 flex items-center gap-1.5">
                  <Mail className="h-3 w-3 text-primary" /> {selectedResumeApp.candidate_email || "candidate@recruvate.com"}
                </p>
                <p className="text-foreground/70 flex items-center gap-1.5">
                  <Phone className="h-3 w-3 text-primary" /> +91 98765 43210
                </p>
              </div>

              <div className="rounded-xl bg-muted/60 p-3 space-y-1.5">
                <p className="font-bold text-foreground">Experience & Highlights</p>
                <p className="text-foreground/70 leading-relaxed">
                  3+ years specializing in modern web and mobile application engineering. Proficient in React, TypeScript, APIs, and agile sprint delivery.
                </p>
              </div>

              <div className="rounded-xl bg-muted/60 p-3 space-y-1.5">
                <p className="font-bold text-foreground">Uploaded CV File</p>
                <a
                  href={selectedResumeApp.resume_url || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-primary font-bold hover:underline"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>resume-verified.pdf</span>
                </a>
              </div>
            </div>

            <button
              onClick={() => setSelectedResumeApp(null)}
              className="w-full rounded-xl bg-foreground py-2 text-xs font-bold text-background"
            >
              Close Resume
            </button>
          </div>
        </div>
      )}

      {/* MODAL: Post New Vacancy */}
      {postModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-3xl bg-card border border-border p-5 space-y-3.5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-2.5">
              <h3 className="font-heading text-sm font-bold text-foreground flex items-center gap-1.5">
                <Plus className="h-4 w-4 text-primary" />
                <span>Post New Vacancy</span>
              </h3>
              <button
                onClick={() => setPostModalOpen(false)}
                className="rounded-full bg-muted p-1 text-foreground/60 hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-3 text-xs">
              <div>
                <label className="mb-1 block font-bold text-foreground/70 uppercase text-[10px]">Job Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Frontend Engineer"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="h-9 w-full rounded-xl border border-input bg-background px-3 text-xs outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-1 block font-bold text-foreground/70 uppercase text-[10px]">Department</label>
                  <input
                    type="text"
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="h-9 w-full rounded-xl border border-input bg-background px-3 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-bold text-foreground/70 uppercase text-[10px]">Work Mode</label>
                  <select
                    value={newMode}
                    onChange={(e) => setNewMode(e.target.value)}
                    className="h-9 w-full rounded-xl border border-input bg-background px-2 text-xs outline-none"
                  >
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                    <option value="In-office">In-office</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-1 block font-bold text-foreground/70 uppercase text-[10px]">Salary Range</label>
                  <input
                    type="text"
                    value={newSalary}
                    onChange={(e) => setNewSalary(e.target.value)}
                    className="h-9 w-full rounded-xl border border-input bg-background px-3 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-bold text-foreground/70 uppercase text-[10px]">Experience</label>
                  <input
                    type="text"
                    value={newExp}
                    onChange={(e) => setNewExp(e.target.value)}
                    className="h-9 w-full rounded-xl border border-input bg-background px-3 text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block font-bold text-foreground/70 uppercase text-[10px]">Required Skills (comma separated)</label>
                <input
                  type="text"
                  value={newSkills}
                  onChange={(e) => setNewSkills(e.target.value)}
                  className="h-9 w-full rounded-xl border border-input bg-background px-3 text-xs outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block font-bold text-foreground/70 uppercase text-[10px]">Job Description</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background p-2 text-xs outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full rounded-xl brand-gradient py-2.5 text-xs font-bold text-white shadow-sm hover:opacity-95 transition press"
                >
                  Publish Vacancy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Send Message */}
      {messageModalApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-3xl bg-card border border-border p-5 space-y-3.5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-2.5">
              <h3 className="font-heading text-sm font-bold text-foreground flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4 text-primary" />
                <span>Message {messageModalApp.candidate_name}</span>
              </h3>
              <button
                onClick={() => setMessageModalApp(null)}
                className="rounded-full bg-muted p-1 text-foreground/60 hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <textarea
              rows={3}
              placeholder="Hi, we loved your video pitch! Would you be available for a quick interview call tomorrow?"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="w-full rounded-xl border border-input bg-background p-3 text-xs outline-none focus:border-primary"
            />

            <button
              onClick={handleSendMessage}
              className="w-full rounded-xl brand-gradient py-2.5 text-xs font-bold text-white shadow-sm flex items-center justify-center gap-1.5"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Send In-App Message</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
