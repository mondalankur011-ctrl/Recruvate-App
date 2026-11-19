import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

const { appId, token, functionsVersion, appBaseUrl } = appParams;

// Only initialize real client if appId and appBaseUrl are actually provided
const hasRemoteConfig = Boolean(appId && appBaseUrl);
const realClient = hasRemoteConfig
  ? createClient({
      appId,
      token: token || '',
      functionsVersion,
      serverUrl: '',
      appBaseUrl,
      analytics: { enabled: false },
    })
  : null;

// Seed jobs for local offline development / preview
const INITIAL_JOBS = [
  {
    id: "job-1",
    title: "Senior Technical Recruiter",
    company: "Recruvate Pan India",
    department: "Human Resources",
    location: "Mumbai · Hybrid",
    type: "Full-time",
    salary_range: "₹12,00,000 - ₹18,00,000",
    skills: ["Tech Hiring", "Executive Search", "ATS", "Talent Sourcing"],
    description: "Lead technical recruitment for high-growth tech startups and unicorns across Pan India.",
    open_positions: 2,
    experience_level: "3-5 years",
    work_mode: "Hybrid",
    deadline: "2026-12-15",
    is_active: true,
    views_count: 248,
    applicants_count: 6,
    created_date: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: "job-2",
    title: "Lead Frontend Engineer (React)",
    company: "Fintech Partner Unicorn",
    department: "Engineering",
    location: "Bengaluru · On-site",
    type: "Full-time",
    salary_range: "₹24,00,000 - ₹35,00,000",
    skills: ["React", "TypeScript", "Tailwind CSS", "Architecture", "PWA"],
    description: "Architect candidate-facing and recruiter portals using modern React, Tailwind, and performant web technologies.",
    open_positions: 3,
    experience_level: "5+ years",
    work_mode: "On-site",
    deadline: "2026-12-20",
    is_active: true,
    views_count: 412,
    applicants_count: 8,
    created_date: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: "job-3",
    title: "People & Culture Specialist",
    company: "Recruvate Spotlight",
    department: "Human Resources",
    location: "Delhi NCR · Hybrid",
    type: "Full-time",
    salary_range: "₹9,00,000 - ₹14,00,000",
    skills: ["HR Operations", "Employee Experience", "Talent Acquisition"],
    description: "Drive people programs, onboarding excellence, and candidate experience for executive roles.",
    open_positions: 1,
    experience_level: "2-4 years",
    work_mode: "Hybrid",
    deadline: "2026-12-10",
    is_active: true,
    views_count: 185,
    applicants_count: 3,
    created_date: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: "job-4",
    title: "Full Stack Engineer (Node.js & React)",
    company: "SaaS Scale-up Partner",
    department: "Engineering",
    location: "Remote · India",
    type: "Full-time",
    salary_range: "₹18,00,000 - ₹28,00,000",
    skills: ["React", "Node.js", "PostgreSQL", "REST APIs"],
    description: "Build robust recruiter APIs and candidate pipelines connecting thousands of applicants daily.",
    open_positions: 2,
    experience_level: "3-5 years",
    work_mode: "Remote",
    deadline: "2026-12-30",
    is_active: true,
    views_count: 320,
    applicants_count: 5,
    created_date: new Date(Date.now() - 86400000 * 7).toISOString()
  },
  {
    id: "job-5",
    title: "Senior Product Designer",
    company: "Consumer Tech Partner",
    department: "Design",
    location: "Bengaluru · Hybrid",
    type: "Full-time",
    salary_range: "₹20,00,000 - ₹30,00,000",
    skills: ["Product Design", "Figma", "Design Systems", "User Research"],
    description: "Design mobile-first job search flows, video-first applicant experiences, and recruiter tools.",
    open_positions: 1,
    experience_level: "4-6 years",
    work_mode: "Hybrid",
    deadline: "2026-12-18",
    is_active: true,
    views_count: 290,
    applicants_count: 4,
    created_date: new Date(Date.now() - 86400000 * 8).toISOString()
  }
];

// Seed applicants for HR Dashboard demo
const INITIAL_APPLICATIONS = [
  {
    id: "app-101",
    job_id: "job-1",
    job_title: "Senior Technical Recruiter",
    company: "Recruvate Pan India",
    candidate_id: "cand-1",
    candidate_name: "Pooja Varma",
    candidate_email: "pooja.varma@gmail.com",
    candidate_phone: "+91 98201 44521",
    department: "Human Resources",
    match_score: 94,
    status: "applied",
    applied_at: new Date(Date.now() - 3600000 * 14).toISOString(),
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    video_duration: 68,
    video_quality: "Clear · Good pace",
    resume_name: "Pooja_Varma_CV_2026.pdf",
    skills: ["Tech Hiring", "ATS", "Executive Search", "LinkedIn Recruiter"],
    notes: "5+ years scaling tech teams in Bangalore and Mumbai. Strong focus on senior ICs."
  },
  {
    id: "app-102",
    job_id: "job-2",
    job_title: "Lead Frontend Engineer (React)",
    company: "Fintech Partner Unicorn",
    candidate_id: "cand-2",
    candidate_name: "Arjun Mehta",
    candidate_email: "arjun.mehta.dev@gmail.com",
    candidate_phone: "+91 97112 88934",
    department: "Engineering",
    match_score: 89,
    status: "interview",
    applied_at: new Date(Date.now() - 3600000 * 28).toISOString(),
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    video_duration: 54,
    video_quality: "Clear",
    resume_name: "Arjun_Mehta_Lead_Frontend_CV.pdf",
    skills: ["React", "TypeScript", "Tailwind CSS", "Architecture", "PWA"],
    notes: "Built design systems and high-throughput checkout applications."
  },
  {
    id: "app-103",
    job_id: "job-5",
    job_title: "Senior Product Designer",
    company: "Consumer Tech Partner",
    candidate_id: "cand-3",
    candidate_name: "Sneha Kapoor",
    candidate_email: "sneha.design@gmail.com",
    candidate_phone: "+91 99304 11293",
    department: "Design",
    match_score: 96,
    status: "in_review",
    applied_at: new Date(Date.now() - 3600000 * 41).toISOString(),
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    video_duration: 72,
    video_quality: "High clarity · Passionate",
    resume_name: "Sneha_Kapoor_Design_Portfolio.pdf",
    skills: ["Figma", "UI/UX", "User Research", "Prototyping", "Design Systems"],
    notes: "Designed consumer mobile apps with over 2M monthly active users."
  },
  {
    id: "app-104",
    job_id: "job-1",
    job_title: "Senior Technical Recruiter",
    company: "Recruvate Pan India",
    candidate_id: "cand-4",
    candidate_name: "Vikram Malhotra",
    candidate_email: "vikram.malhotra@yahoo.com",
    candidate_phone: "+91 98450 77123",
    department: "Human Resources",
    match_score: 82,
    status: "applied",
    applied_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    video_duration: 61,
    video_quality: "Clear",
    resume_name: "Vikram_M_Recruiter_Resume.pdf",
    skills: ["Talent Sourcing", "Screening", "Interviewing", "Campus Hiring"],
    notes: "Wide network across top tier engineering colleges in India."
  }
];

// Seed employer profile
const INITIAL_EMPLOYER_PROFILE = {
  id: "emp-demo-1",
  company_name: "Recruvate Pan India",
  full_name: "Priya Sharma",
  role_title: "Head of Talent Acquisition",
  industry: "Staffing & Recruitment / Tech",
  company_size: "50-200 employees",
  location: "Mumbai & Bengaluru, India",
  website: "https://recruvate.in",
  work_email: "priya.sharma@recruvate.in",
  company_intro_video_uri: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  company_intro_video_duration: 75,
  onboarding_complete: true,
  verified: true
};

// Local storage helpers
function getStore(key, defaultValue) {
  try {
    const item = localStorage.getItem(`recruvate_${key}`);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStore(key, value) {
  try {
    localStorage.setItem(`recruvate_${key}`, JSON.stringify(value));
  } catch {}
}

// In-memory / localStorage entity helper
function createEntityStore(name, initialData = []) {
  if (getStore(name, null) === null) {
    setStore(name, initialData);
  }

  return {
    async filter(criteria = {}, options = {}) {
      let items = getStore(name, initialData) || [];
      items = items.filter((item) => {
        for (const [k, v] of Object.entries(criteria)) {
          if (item[k] !== v) return false;
        }
        return true;
      });

      if (options.sort) {
        const desc = options.sort.startsWith("-");
        const key = desc ? options.sort.slice(1) : options.sort;
        items.sort((a, b) => {
          if (desc) return (b[key] || 0) > (a[key] || 0) ? 1 : -1;
          return (a[key] || 0) > (b[key] || 0) ? 1 : -1;
        });
      }

      if (options.limit) {
        items = items.slice(0, options.limit);
      }

      return name === "Job" ? { items } : items;
    },

    async create(data) {
      const items = getStore(name, initialData) || [];
      const user = getStore("current_user", null);
      const newItem = {
        id: `${name.toLowerCase()}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        created_date: new Date().toISOString(),
        created_by_id: user?.id || "demo-user-id",
        ...data,
      };
      items.unshift(newItem);
      setStore(name, items);
      return newItem;
    },

    async update(id, patch) {
      const items = getStore(name, initialData) || [];
      const index = items.findIndex((it) => it.id === id);
      if (index === -1) {
        const newItem = { id, ...patch };
        items.unshift(newItem);
        setStore(name, items);
        return newItem;
      }
      items[index] = { ...items[index], ...patch, updated_date: new Date().toISOString() };
      setStore(name, items);
      return items[index];
    },

    async delete(id) {
      const items = getStore(name, initialData) || [];
      const filtered = items.filter((it) => it.id !== id);
      setStore(name, filtered);
      return true;
    },

    async bulkUpdate(patches = []) {
      for (const patch of patches) {
        if (patch.id) await this.update(patch.id, patch);
      }
      return true;
    }
  };
}

const mockEntities = {
  Job: createEntityStore("Job", INITIAL_JOBS),
  CandidateProfile: createEntityStore("CandidateProfile", []),
  EmployerProfile: createEntityStore("EmployerProfile", [INITIAL_EMPLOYER_PROFILE]),
  Application: createEntityStore("Application", INITIAL_APPLICATIONS),
  SavedJob: createEntityStore("SavedJob", []),
  Notification: createEntityStore("Notification", []),
};

// Mock authentication with role switching
const mockAuth = {
  async me() {
    const user = getStore("current_user", null);
    if (!user) {
      const err = new Error("Unauthenticated");
      err.status = 401;
      throw err;
    }
    return user;
  },

  async loginViaEmailPassword(email, password, role = "candidate") {
    const isEmp = role === "employer" || email.includes("hr") || email.includes("employer") || email.includes("recruvate.in");
    const user = {
      id: "usr-" + btoa(email).replace(/[^a-zA-Z0-9]/g, "").slice(0, 10),
      email: email.trim(),
      full_name: isEmp ? "Priya Sharma (HR)" : email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      company_name: isEmp ? "Recruvate Pan India" : "",
      role: isEmp ? "employer" : "candidate"
    };
    setStore("current_user", user);
    localStorage.setItem("base44_access_token", "demo-token-" + user.id);
    return { access_token: "demo-token-" + user.id, user };
  },

  async register({ email, password, role = "candidate", company_name = "" }) {
    const user = {
      id: "usr-" + btoa(email).replace(/[^a-zA-Z0-9]/g, "").slice(0, 10),
      email: email.trim(),
      full_name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      company_name: company_name || (role === "employer" ? "My Organisation" : ""),
      role: role || "candidate"
    };
    setStore("current_user", user);
    localStorage.setItem("base44_access_token", "demo-token-" + user.id);
    return { access_token: "demo-token-" + user.id, user };
  },

  async loginAsDemoEmployer() {
    const user = {
      id: "usr-emp-priya",
      email: "priya.sharma@recruvate.in",
      full_name: "Priya Sharma",
      company_name: "Recruvate Pan India",
      role: "employer"
    };
    setStore("current_user", user);
    localStorage.setItem("base44_access_token", "demo-token-" + user.id);
    return { access_token: "demo-token-" + user.id, user };
  },

  async loginAsDemoCandidate() {
    const user = {
      id: "usr-cand-rahul",
      email: "rahul.sharma@gmail.com",
      full_name: "Rahul Sharma",
      role: "candidate"
    };
    setStore("current_user", user);
    localStorage.setItem("base44_access_token", "demo-token-" + user.id);
    return { access_token: "demo-token-" + user.id, user };
  },

  async switchRole(targetRole) {
    const user = getStore("current_user", null);
    if (!user) return null;
    const updated = {
      ...user,
      role: targetRole,
      company_name: targetRole === "employer" ? (user.company_name || "Recruvate Partner") : ""
    };
    setStore("current_user", updated);
    return updated;
  },

  async resendOtp(email) {
    return { success: true };
  },

  async verifyOtp({ email, otpCode }) {
    const user = getStore("current_user", null) || {
      id: "usr-" + Date.now(),
      email,
      full_name: email.split("@")[0],
      role: "candidate"
    };
    setStore("current_user", user);
    localStorage.setItem("base44_access_token", "demo-token-" + user.id);
    return { access_token: "demo-token-" + user.id, user };
  },

  async loginWithProvider(provider, returnTo) {
    const user = {
      id: "usr-google-" + Date.now(),
      email: "google.candidate@recruvate.com",
      full_name: "Google Candidate",
      role: "candidate"
    };
    setStore("current_user", user);
    localStorage.setItem("base44_access_token", "demo-token-" + user.id);
    window.location.href = returnTo || "/";
  },

  logout(redirectUrl) {
    localStorage.removeItem("recruvate_current_user");
    localStorage.removeItem("base44_access_token");
    localStorage.removeItem("token");
    if (redirectUrl) {
      window.location.href = redirectUrl;
    } else {
      window.location.href = "/landing";
    }
  },

  redirectToLogin(redirectUrl) {
    window.location.href = "/login" + (redirectUrl ? `?return_to=${encodeURIComponent(redirectUrl)}` : "");
  },

  setToken(token) {
    if (token) localStorage.setItem("base44_access_token", token);
  },

  async resetPasswordRequest(email) {
    return { success: true };
  },

  async resetPassword({ resetToken, newPassword }) {
    return { success: true };
  }
};

const mockIntegrations = {
  Core: {
    async UploadPrivateFile({ file }) {
      try {
        const url = URL.createObjectURL(file);
        return { file_uri: url, file_name: file.name };
      } catch {
        return { file_uri: "https://media.base44.com/mock-file.pdf", file_name: file?.name || "document.pdf" };
      }
    }
  }
};

const mockApp = {
  async getPublicSettings() {
    return {
      id: appId || "recruvate-local",
      public_settings: {
        app_name: "HR's Universe",
        auth_providers: ["google", "email"]
      }
    };
  }
};

// Client proxy: uses real Base44 SDK when configured & online, with seamless local fallback
export const base44 = {
  app: {
    async getPublicSettings() {
      if (realClient) {
        try {
          return await realClient.app.getPublicSettings();
        } catch {}
      }
      return mockApp.getPublicSettings();
    }
  },

  auth: new Proxy(mockAuth, {
    get(target, prop) {
      if (realClient && typeof realClient.auth?.[prop] === "function") {
        return async (...args) => {
          try {
            return await realClient.auth[prop](...args);
          } catch (err) {
            if (target[prop]) return target[prop](...args);
            throw err;
          }
        };
      }
      return target[prop];
    }
  }),

  entities: new Proxy(mockEntities, {
    get(target, entityName) {
      if (!target[entityName]) {
        target[entityName] = createEntityStore(entityName, []);
      }
      return target[entityName];
    }
  }),

  integrations: mockIntegrations
};
