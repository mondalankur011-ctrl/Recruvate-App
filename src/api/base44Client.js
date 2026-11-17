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

// Seed data for local offline development / preview
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
    is_active: true,
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
    is_active: true,
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
    is_active: true,
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
    is_active: true,
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
    is_active: true,
    created_date: new Date(Date.now() - 86400000 * 8).toISOString()
  }
];

// Local storage helper
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
  if (!getStore(name, null)) {
    setStore(name, initialData);
  }

  return {
    async filter(criteria = {}, options = {}) {
      let items = getStore(name, initialData);
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
      const items = getStore(name, initialData);
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
      const items = getStore(name, initialData);
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
      const items = getStore(name, initialData);
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
  Application: createEntityStore("Application", []),
  SavedJob: createEntityStore("SavedJob", []),
  Notification: createEntityStore("Notification", []),
};

// Mock authentication
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

  async loginViaEmailPassword(email, password) {
    const user = {
      id: "usr-" + btoa(email).replace(/[^a-zA-Z0-9]/g, "").slice(0, 10),
      email: email.trim(),
      full_name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      role: "candidate"
    };
    setStore("current_user", user);
    localStorage.setItem("base44_access_token", "demo-token-" + user.id);
    return { access_token: "demo-token-" + user.id, user };
  },

  async register({ email, password }) {
    return this.loginViaEmailPassword(email, password);
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
        return { file_uri: "https://media.base44.com/mock-file.pdf", file_name: file?.name || "resume.pdf" };
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
