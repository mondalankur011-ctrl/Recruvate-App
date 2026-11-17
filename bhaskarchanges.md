# Bhaskar Documentation — Recruvate Web App (HR's Universe)

> Complete log and guide explaining every issue found, code change made, reasoning behind it, and next steps for the project.

---

## Table of Contents
1. [Overview & Project Type](#1-overview--project-type)
2. [Original Problems Discovered](#2-original-problems-discovered)
3. [Folder & File Restructuring](#3-folder--file-restructuring)
4. [Vite Alias Configuration (`vite.config.js`)](#4-vite-alias-configuration-viteconfigjs)
5. [Project Configuration (`jsconfig.json`)](#5-project-configuration-jsconfigjson)
6. [JSX Syntax & Extension Fix (`AuthFrame.jsx`)](#6-jsx-syntax--extension-fix-authframejsx)
7. [Missing Page Route Wrappers](#7-missing-page-route-wrappers)
   - [7.1 `src/pages/Login.jsx`](#71-srcpagesloginjsx)
   - [7.2 `src/pages/ForgotPassword.jsx`](#72-srcpagesforgotpasswordjsx)
   - [7.3 `src/pages/onboarding/Details.jsx`](#73-srcpagesonboardingdetailsjsx)
   - [7.4 `src/pages/onboarding/Socials.jsx`](#74-srcpagesonboardingsocialsjsx)
   - [7.5 `src/pages/onboarding/Video.jsx`](#75-srcpagesonboardingvideojsx)
8. [Workspace Root Configuration (`package.json`)](#8-workspace-root-configuration-packagejson)
9. [Runtime & Offline Mock Architecture (`base44Client.js`)](#9-runtime--offline-mock-architecture-base44clientjs)
10. [Infinite Loading & Lifecycle Safeguards](#10-infinite-loading--lifecycle-safeguards)
11. [PWA Manifest & Entity Schema Fix](#11-pwa-manifest--entity-schema-fix)
12. [Dev Server Configuration](#12-dev-server-configuration)
13. [How to Run, Build, and Maintain](#13-how-to-run-build-and-maintain)

---

## 1. Overview & Project Type

### Is this an App or Web?
This is a **Web Application built as a Mobile-First Progressive Web App (PWA)**:
* **Technology:** 100% web technology (React 18, Vite, Tailwind CSS, Lucide icons, Radix UI).
* **Look & Feel:** Designed to look and function like a mobile phone app (with bottom navigation, pull-to-refresh, video pitch recording, and quick application pipelines).
* **Installable (PWA):** Users can visit the site on mobile or desktop and click **"Add to Home Screen"** / **"Install"** to run it in full-screen standalone mode without going through the Google Play Store or Apple App Store.

---

## 2. Original Problems Discovered

When inspecting the repository, the project could neither build nor run due to several critical blocks:
1. **Flattened File Tree:** 115 files had spaces instead of directory slashes (e.g. `src App.jsx`, `entities Job.jsonc`, `src components auth AuthScreen.jsx` sat flat in the root folder).
2. **Missing Path Alias:** Vite threw warnings and failed to resolve `@/...` imports to absolute physical paths.
3. **Missing `jsconfig.json`:** `npm run typecheck` broke because `tsc -p ./jsconfig.json` was looking for a non-existent config file.
4. **Syntax Error during Vite Build:** `AuthFrame.js` contained JSX tags inside a `.js` file, which Rollup/Vite rejected.
5. **Missing Page Routes:** `src/App.jsx` imported 5 route wrappers (`Login`, `ForgotPassword`, `Details`, `Socials`, `Video`) that did not exist in `src/pages/`.
6. **Workspace Root Disconnect:** The outer folder was `RecruvateApp` while files lived inside `Recruvate-App`. Running `npm run dev` in the workspace root failed with `package.json not found`.
7. **Base44 Cloud Lock & Infinite Spinner:** Without an active Base44 cloud backend or Deno instance, API calls failed with `TypeError: Failed to fetch`, trapping the user in an infinite loading spinner and preventing login, registration, and onboarding.
8. **PWA Manifest Error:** `entities/Job.jsonc` accidentally contained the JSON for the PWA web app manifest instead of the `Job` schema, while `index.html`'s `/manifest.json` returned 404.

---

## 3. Folder & File Restructuring

### What was changed:
All 115 flattened files were moved into their correct directory hierarchy using `git mv`:
* `src ...` $\rightarrow$ `src/...`
* `entities ...` $\rightarrow$ `entities/...`
* `connectors ...` $\rightarrow$ `connectors/...`

### Clean Directory Structure Result:
```
Recruvate-App/
├── connectors/
│   └── github.jsonc
├── entities/
│   ├── Application.jsonc
│   ├── CandidateProfile.jsonc
│   └── Job.jsonc
├── public/
│   └── manifest.json
├── src/
│   ├── api/
│   │   └── base44Client.js
│   ├── components/
│   │   ├── app/
│   │   ├── auth/
│   │   ├── brand/
│   │   ├── jobs/
│   │   ├── onboarding/
│   │   ├── process/
│   │   ├── profile/
│   │   └── ui/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   │   └── onboarding/
│   ├── utils/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── jsconfig.json
├── package.json
├── tailwind.config.js
└── vite.config.js
```

### Why:
* Vite's entry point in `index.html` references `/src/main.jsx`.
* All ESM imports in the codebase use structured paths like `@/components/ui/button`.
* Flattened filenames with spaces in the root directory break all module resolution.

### What to do with it:
* **Leave this structure as is.** Place all new UI components in `src/components/`, new screens in `src/pages/`, and shared logic in `src/lib/`.

---

## 4. Vite Alias Configuration (`vite.config.js`)

### What was changed:
Added path aliasing in `vite.config.js`:
```javascript
import base44 from "@base44/vite-plugin"
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from "path"
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    base44({
      legacySDKImports: process.env.BASE44_LEGACY_SDK_IMPORTS === 'true',
      hmrNotifier: true,
      navigationNotifier: true,
      analyticsTracker: true,
      visualEditAgent: true
    }),
    react(),
  ]
});
```

### Why:
* Resolves `@/` to the physical disk path of `./src`, eliminating duplicate module warnings and module import failures during build and HMR.

### What to do with it:
* Keep this file as configured. Any future custom path aliases can be added under `resolve.alias`.

---

## 5. Project Configuration (`jsconfig.json`)

### What was created:
Created `Recruvate-App/jsconfig.json`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "jsx": "react-jsx",
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "node",
    "allowJs": true,
    "checkJs": false,
    "skipLibCheck": true
  },
  "include": ["src/**/*"]
}
```

### Why:
* Enables `npm run typecheck` (`tsc -p ./jsconfig.json`) to validate code without crashing.
* Gives VS Code / Cursor IDEs full IntelliSense, autocomplete, and jump-to-definition for all `@/*` imports.

### What to do with it:
* Keep in root.

---

## 6. JSX Syntax & Extension Fix (`AuthFrame.jsx`)

### What was changed:
Renamed `src/components/auth/AuthFrame.js` $\rightarrow$ `src/components/auth/AuthFrame.jsx`.

### Why:
* Vite uses Rollup / esbuild, which strictly disallows JSX expressions (`<div>`, `<BrandMark />`) in `.js` files. Renaming to `.jsx` enables the JSX compiler.

### What to do with it:
* Keep as `.jsx`. Always name React components containing JSX tags with `.jsx` or `.tsx`.

---

## 7. Missing Page Route Wrappers

`src/App.jsx` contained routes that were missing their implementation files. We created all 5 wrapper pages:

### 7.1 `src/pages/Login.jsx`
* **Code:**
  ```jsx
  import React from "react";
  import AuthScreen from "@/components/auth/AuthScreen";

  export default function Login() {
    return <AuthScreen initialMode="login" />;
  }
  ```
* **Why:** Maps `/login` to `AuthScreen` in login mode.
* **What to do:** Renders the Recruvate login screen.

### 7.2 `src/pages/ForgotPassword.jsx`
* **Code:** Uses `AuthLayout`, input form, and calls `base44.auth.resetPasswordRequest(email)`.
* **Why:** Maps `/forgot-password` so candidates who forgot their credentials can request a password reset email.
* **What to do:** Handles password reset requests.

### 7.3 `src/pages/onboarding/Details.jsx`
* **Code:** Connects to `useOutletContext()` from `Onboarding.jsx` and renders `DetailsStep`.
* **Why:** Handles Step 1 of candidate onboarding (Full name, Department, Location, Resume upload) and navigates to `/onboarding/socials`.
* **What to do:** Manages personal profile initialization.

### 7.4 `src/pages/onboarding/Socials.jsx`
* **Code:** Connects to `useOutletContext()` and renders `SocialsStep`.
* **Why:** Handles Step 2 of onboarding (optional LinkedIn, Instagram, Facebook, Threads) with next & skip controls, navigating to `/onboarding/video`.
* **What to do:** Manages social profile linking.

### 7.5 `src/pages/onboarding/Video.jsx`
* **Code:** Connects to `useOutletContext()` and renders `VideoStep`.
* **Why:** Handles Step 3 of onboarding (the signature 40–90 second candidate video pitch), saves video details, sets `onboarding_complete: true`, and navigates to the home page (`/`).
* **What to do:** Finalizes candidate onboarding.

---

## 8. Workspace Root Configuration (`package.json`)

### What was created:
Created `C:\MyCode\RecruvateApp\package.json`:
```json
{
  "name": "recruvate-app-workspace",
  "private": true,
  "version": "1.0.0",
  "scripts": {
    "dev": "npm --prefix Recruvate-App run dev",
    "build": "npm --prefix Recruvate-App run build",
    "lint": "npm --prefix Recruvate-App run lint",
    "typecheck": "npm --prefix Recruvate-App run typecheck",
    "preview": "npm --prefix Recruvate-App run preview"
  }
}
```

### Why:
* Users open terminal in `C:\MyCode\RecruvateApp` (the workspace root). Running `npm run dev` was failing with `package.json not found`. This root package file transparently delegates commands to `Recruvate-App`.

### What to do with it:
* You can now run `npm run dev` or `npm run build` from either directory.

---

## 9. Runtime & Offline Mock Architecture (`base44Client.js`)

### What was changed:
Rewrote [src/api/base44Client.js](file:///C:/MyCode/RecruvateApp/Recruvate-App/src/api/base44Client.js) with a hybrid architecture:
1. **Cloud Mode:** If `appId` and `appBaseUrl` are configured and reachable, it connects to the real Base44 backend.
2. **Offline Local Mock Mode:** If no backend is running or configured, it automatically provides a local in-memory/localStorage engine:
   * **Authentication:** Instant signup, login, OTP verification, and Google demo login.
   * **Seeded Jobs:** 5 realistic Pan-India jobs based on PRD specifications:
     - *Senior Technical Recruiter* (Recruvate Pan India, ₹12 - 18 LPA)
     - *Lead Frontend Engineer* (Fintech Unicorn, ₹24 - 35 LPA)
     - *People & Culture Specialist* (Recruvate Spotlight, ₹9 - 14 LPA)
     - *Full Stack Engineer* (SaaS Partner, ₹18 - 28 LPA)
     - *Senior Product Designer* (Consumer Tech, ₹20 - 30 LPA)
   * **Applications & Process Bar:** Saves submitted applications and displays the 48-hour response countdown pipeline.
   * **File Uploads:** Local Object URLs for uploaded resumes and video recordings.

### Quick Demo Access:
Added a **"Fill Demo Credentials"** button on `AuthScreen.jsx` so anyone can test the app with 1 click (`candidate@recruvate.com` / `Recruvate2026!`).

---

## 10. Infinite Loading & Lifecycle Safeguards

### What was changed:
* **`AuthContext.jsx`:** Guaranteed `setAuthChecked(true)` runs in all error/offline cases so `ProtectedRoute` never gets stuck waiting for authentication checks.
* **`AppShell.jsx`:** Wrapped `loadProfile()` in `try ... catch ... finally { setLoading(false) }`.
* **`Onboarding.jsx`:** Wrapped profile initialization in `try ... catch ... finally { setLoading(false) }`.
* **`OpenJobs.jsx`:** Added optional chaining (`profile?.resume_updated_date`) and error handling on data fetch.
* **`Profile.jsx`:** Added null guard before reading profile properties.

### Why:
* Previously, any rejected network promise left `loading === true`, displaying an infinite spinning circle that blocked the UI. Now all loading states resolve cleanly.

---

## 11. PWA Manifest & Entity Schema Fix

### What was changed:
1. Created [public/manifest.json](file:///C:/MyCode/RecruvateApp/Recruvate-App/public/manifest.json) containing the PWA metadata (app name, standalone display mode, theme colors, icons).
2. Restored [entities/Job.jsonc](file:///C:/MyCode/RecruvateApp/Recruvate-App/entities/Job.jsonc) to a valid schema defining `title`, `company`, `department`, `location`, `salary_range`, `skills`, and `description`.

### Why:
* `index.html` references `/manifest.json` for PWA mobile installability.
* `entities/Job.jsonc` had been accidentally overwritten with manifest contents.

---

## 12. Dev Server Configuration

Configured Vite in `vite.config.js` to run on `http://127.0.0.1:5173/`:
```javascript
server: {
  host: '127.0.0.1',
  port: 5173,
}
```

---

## 13. How to Run, Build, and Maintain

### Running the App:
From `C:\MyCode\RecruvateApp` or `C:\MyCode\RecruvateApp\Recruvate-App`:
```bash
npm run dev
```
Then open: **http://127.0.0.1:5173/** in your browser.

### Verifying Code:
```bash
npm run lint       # Runs ESLint (0 errors)
npm run typecheck  # Runs TypeScript / JS check (0 errors)
npm run build      # Produces production bundle in dist/
```

### Next Steps & Recommendations:
1. **Demo & Testing:** Open the app at `http://127.0.0.1:5173/`, click "Fill Demo Credentials", log in, explore the open jobs feed, apply to roles, and check the Process Bar timer.
2. **Onboarding Test:** Click "Sign Out" from Profile, switch to "Sign Up", fill credentials, and test the 3-step onboarding flow.
3. **Publishing to Base44 Cloud:** When you are ready to connect a live Base44 cloud backend:
   ```bash
   base44 login
   base44 link
   base44 dev
   ```
   The app will automatically switch from local mock mode to your live Base44 cloud backend.
