# PRD — HR's Universe

> A mobile-first, installable job-seeker app by **Recruvate** that tracks job applications and hosts video introductions — "Careers with a human voice."

---

## 1. Background

Recruvate is an India-based recruitment firm ("Pan India · Serving clients since 2017"). Candidates today apply through generic job boards that reduce them to a static resume. HR's Universe reframes the search around the candidate's voice: a short, mandatory video introduction that lets recruiters hear the person behind the CV, plus a personal pipeline that keeps every application accountable to a 48-hour response window.

This product is the candidate-facing companion to Recruvate's placement service.

## 2. Vision

Give every candidate a single, private space on their phone where they:

- Build a profile once and let Recruvate match them to roles.
- Record a 40–90 second video introduction that becomes their signature.
- Track every application through a transparent, time-bound pipeline.
- Keep their resume fresh and their recruiter responsive.

## 3. Target users

| User | Role | Needs |
| --- | --- | --- |
| **Candidate** (primary) | Job seeker invited or self-registering | A private profile, matched jobs, application tracking, a video intro they control |
| **Recruvate team** (operator) | Staff who curate jobs and move applications | (Out of scope in this build — admin tooling deferred) |

## 4. Goals & non-goals

### Goals
- A candidate can register, verify their email, complete a guided onboarding (details → socials → resume + video), and land on a ranked job feed in one sitting.
- Every application the candidate creates is tracked with a 48-hour response window and clear status progression.
- The candidate's resume and intro video are stored privately and never exposed to other users.
- The app is installable (PWA) and works on mobile and tablet.

### Non-goals (this phase)
- Recruiter/admin dashboards (deferred).
- In-app messaging between candidate and recruiter.
- Public job listings or employer-facing pages.
- ATS integrations with third-party systems.
- Monetization or paid plans.

## 5. User journeys

### 5.1 First-time candidate
1. **Sign up** — email + password, or Google.
2. **Verify** — 6-digit OTP delivered by email.
3. **Onboard** — 3 guided steps:
   - **Details** — full name, department, location, phone.
   - **Socials** — optional LinkedIn, Instagram, Facebook, Threads.
   - **Video** — upload or record a 40–90s intro; resume upload.
4. **Land on Open Jobs** — roles ranked by department/skill match.

### 5.2 Returning candidate
1. **Sign in** — email/password or Google.
2. **Open Jobs** — see newly posted roles, apply or save.
3. **Process Bar** — review active applications and their response windows.
4. **Profile** — update details, refresh resume, re-record video, edit socials, sign out.

### 5.3 Resume refresh
- If a candidate's resume is older than 6 months (or missing), a reminder banner appears on Open Jobs. Dismissing it logs the dismissal; uploading a fresh resume clears it and raises a notification.

## 6. Functional requirements

### F1 — Authentication
- Email/password registration with email-delivered OTP verification.
- Google sign-in as an alternative.
- Password reset via email link.
- Session persistence; protected routes redirect unauthenticated users to login.

### F2 — Onboarding
- A single guided flow of 3 content steps (details → socials → video/resume).
- Onboarding must complete before the candidate reaches the main app.
- Video introduction is **mandatory**, 40–90 seconds, with real-time duration feedback.
- Resume is **mandatory** before onboarding completes.

### F3 — Profile
- Full name, email, phone, department, location.
- Social links (LinkedIn, Instagram, Facebook, Threads) — normalized to valid URLs.
- Resume file (PDF/DOC/DOCX), stored privately; date-tracked for freshness.
- Intro video (stored privately) with duration and a quality label (clear/acceptable/short).

### F4 — Job feed (Open Jobs)
- List active jobs, ranked by a match score computed from the candidate's department and job metadata.
- Each job card shows title, company, location, type, salary, skills, match %, apply/save actions.
- Applying creates an Application record with a 48-hour response clock.
- Saving creates a SavedJob record; unsave removes it.
- Resume-overdue reminder banner with dismiss + update actions.

### F5 — Application pipeline (Process Bar)
- Visual pipeline grouping applications by status: Applied → In Review → Interview → Offer → Closed/Rejected.
- Each application card shows a 48-hour countdown with urgency states (on-track / due-soon / overdue).
- Progress bar reflecting time elapsed within the 48-hour window.

### F6 — Notifications
- System-generated notifications (e.g., resume refresh) visible to the owning candidate.
- Dismissible, timestamped, private to the user.

### F7 — Installability & responsiveness
- Web manifest, maskable icons, theme color.
- Mobile-first layout with bottom navigation; tablet/desktop friendly.
- Safe-area aware (notch / home indicator).

## 7. Non-functional requirements

| Area | Requirement |
| --- | --- |
| **Performance** | First contentful paint under 2s on mid-range mobile; job feed loads within 1s of auth. |
| **Privacy** | Resumes and videos are private; only the owning candidate can read them. |
| **Accessibility** | Touch targets ≥ 44px; sufficient contrast on the cream/ink palette. |
| **Offline resilience** | App shell loads without network; data lists show skeletons while loading. |
| **Branding** | Recruvate palette (cream #F7F0E4, ink #171522, orange #EE5C2B), Archivo headings, Inter body, Caveat script accent. |
| **Devices** | Primary: mobile (iOS/Android PWA). Secondary: tablet (920px), desktop. |

## 8. Success metrics

- Onboarding completion rate (% of signups who finish the video step).
- Time-to-first-application (median).
- 48-hour response adherence (% of applications updated within the window).
- Resume freshness (% of profiles with a resume < 6 months old).
- PWA install rate.

## 9. Constraints & assumptions

- Authentication uses the platform's email-OTP flow; **SMS OTP is not supported** by the platform, so phone-based verification is out of scope.
- Jobs are seeded/managed by Recruvate staff out of band until an admin tool is built.
- Match scoring is a deterministic local function (department + keyword overlap), not an AI ranking — for this phase.
- The app is not yet published; there is no live URL.

## 10. Open questions

- Should candidates be able to delete their account and all data from inside the app?
- Will Recruvate staff need to annotate candidate videos (e.g., quality tags) before shortlisting?
- Should the 48-hour window reset when status changes, or stay anchored to `applied_at`?
- Do we need push notifications for status changes once a native build exists?
