# Bhaskar Changes Documentation

This document explains every change made to the **Recruvate App** repository, the reason behind each change, and what to do with the code going forward.

---

## Table of Contents
1. [Summary of Issues Found](#1-summary-of-issues-found)
2. [Folder & File Restructuring](#2-folder--file-restructuring)
3. [Vite Alias Configuration (`vite.config.js`)](#3-vite-alias-configuration-viteconfigjs)
4. [JavaScript Project Configuration (`jsconfig.json`)](#4-javascript-project-configuration-jsconfigjson)
5. [JSX Extension Fix (`AuthFrame.jsx`)](#5-jsx-extension-fix-authframejsx)
6. [Missing Page Route Wrappers](#6-missing-page-route-wrappers)
   - [6.1 `src/pages/Login.jsx`](#61-srcpagesloginjsx)
   - [6.2 `src/pages/ForgotPassword.jsx`](#62-srcpagesforgotpasswordjsx)
   - [6.3 `src/pages/onboarding/Details.jsx`](#63-srcpagesonboardingdetailsjsx)
   - [6.4 `src/pages/onboarding/Socials.jsx`](#64-srcpagesonboardingsocialsjsx)
   - [6.5 `src/pages/onboarding/Video.jsx`](#65-srcpagesonboardingvideojsx)
7. [What To Do With This Code (Next Steps)](#7-what-to-do-with-this-code-next-steps)

---

## 1. Summary of Issues Found

When inspecting the repository, the project could not run or build due to several core issues:
1. **Flattened Directory Names:** Over 100 files had spaces instead of directory slashes (e.g., `src App.jsx`, `entities Job.jsonc`, `src components app AppShell.jsx` were all sitting flat in the root directory).
2. **Missing Path Alias Resolution:** Imports using `@/` (such as `@/components/ui/button`) failed or threw warnings because Vite was not configured with an absolute path alias.
3. **Missing `jsconfig.json`:** The script `npm run typecheck` failed because `jsconfig.json` was missing.
4. **File Extension Syntax Error:** `AuthFrame.js` contained JSX syntax, which Vite rejected during build because Vite requires the `.jsx` extension for files containing JSX elements.
5. **Missing Route Page Wrappers:** `src/App.jsx` declared routes for `/login`, `/forgot-password`, `/onboarding/details`, `/onboarding/socials`, and `/onboarding/video`, but these page components did not exist in `src/pages/`.

---

## 2. Folder & File Restructuring

### What was changed:
All 115 files that were sitting flat in the root folder with spaces in their names were moved into their correct directory structure using `git mv`:
* Files starting with `src ...` were moved into `src/...`
* Files starting with `entities ...` were moved into `entities/...`
* Files starting with `connectors ...` were moved into `connectors/...`

### Why:
* In `index.html`, Vite looks for `/src/main.jsx`.
* In `src/App.jsx` and across all components, modules import from `@/components/...`, `@/lib/...`, `@/pages/...`, and `@/hooks/...`.
* When files have spaces in their names in the root directory, neither the Node runtime, Vite, nor Git can resolve directory-based module paths.

### What to do with it:
* **Keep this folder structure intact.** Do not rename or flatten files back into root. All future components should go into `src/components/`, pages into `src/pages/`, etc.

---

## 3. Vite Alias Configuration (`vite.config.js`)

### What was changed:
Added path resolution for the `@` symbol pointing to the `src` directory using Node's `path` and `fileURLToPath`:

```javascript
import base44 from "@base44/vite-plugin"
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from "path"
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
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
* Vite emitted the warning:
  `[plugin builtin:vite-alias] rewrote @/pages/... but was not an absolute path...`
* Adding `resolve.alias: { '@': path.resolve(__dirname, './src') }` allows Vite to unambiguously resolve every `@/...` import to the exact absolute path on disk.

### What to do with it:
* Leave this configuration in `vite.config.js`. If you add new top-level aliases later (e.g. `@assets`), you can register them inside `resolve.alias`.

---

## 4. JavaScript Project Configuration (`jsconfig.json`)

### What was created:
Created `jsconfig.json` in the root of `Recruvate-App`:

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
* `package.json` includes `"typecheck": "tsc -p ./jsconfig.json"`. Without this file, running `npm run typecheck` returned an error: `Cannot read file './jsconfig.json'`.
* It enables VS Code, Cursor, and IDEs to understand `@/*` path mapping so you get "Go to Definition", auto-imports, and IntelliSense.

### What to do with it:
* Keep this file in the project root. It ensures code intelligence and type-checking work out of the box.

---

## 5. JSX Extension Fix (`AuthFrame.jsx`)

### What was changed:
Renamed `src/components/auth/AuthFrame.js` to `src/components/auth/AuthFrame.jsx`.

### Why:
* Vite's default JavaScript parser disables JSX syntax inside `.js` files. When building, Vite threw:
  `[builtin:vite-transform] Unexpected JSX expression in src/components/auth/AuthFrame.js:6:5`
* Renaming to `.jsx` tells the Vite compiler to parse JSX tags (`<div>`, `<BrandMark />`) properly.

### What to do with it:
* Keep the `.jsx` extension for all React components containing JSX markup.

---

## 6. Missing Page Route Wrappers

In `src/App.jsx`, routes were defined for authentication and onboarding, but the wrapper files were not provided in the original repository. We created them to complete the routing architecture.

---

### 6.1 `src/pages/Login.jsx`

#### Code:
```jsx
import React from "react";
import AuthScreen from "@/components/auth/AuthScreen";

export default function Login() {
  return <AuthScreen initialMode="login" />;
}
```

#### Why:
* `src/App.jsx` renders `<Route path="/login" element={<Login />} />`.
* The existing `Register.jsx` used `<AuthScreen initialMode="signup" />`. The `AuthScreen` component was already built to handle both `login` and `signup` states. Creating `Login.jsx` connects the `/login` route to `AuthScreen` with `initialMode="login"`.

#### What to do with it:
* When users navigate to `/login`, this loads the branded Recruvate login screen with email/password and Google login options. You can add extra banners or links here if needed in the future.

---

### 6.2 `src/pages/ForgotPassword.jsx`

#### Code:
```jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await base44.auth.resetPasswordRequest(email.trim());
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <AuthLayout
        icon={CheckCircle2}
        title="Check your email"
        subtitle={`We've sent a password reset link to ${email}`}
        footer={
          <Link to="/login" className="text-primary font-medium hover:underline">
            Back to login
          </Link>
        }
      >
        <p className="text-sm text-foreground/70 text-center">
          Click the link in the email to reset your password. If you don't see it, check your spam folder.
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      icon={Mail}
      title="Reset your password"
      subtitle="Enter your email and we'll send you a link to reset your password"
      footer={
        <div className="text-center text-sm">
          Remember your password?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Log in
          </Link>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive font-medium">
            {error}
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending link...
            </>
          ) : (
            "Send reset link"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}
```

#### Why:
* `src/App.jsx` renders `<Route path="/forgot-password" element={<ForgotPassword />} />`.
* `ResetPassword.jsx` references `/forgot-password`, and `AuthScreen.jsx` displays a "Forgot password?" link pointing to `/forgot-password`.
* It calls `base44.auth.resetPasswordRequest(email)` from `@base44/sdk`, matching the backend authentication API.

#### What to do with it:
* This provides a complete password recovery flow. When users submit their email, Base44 sends a reset link pointing to `/reset-password?token=...`.

---

### 6.3 `src/pages/onboarding/Details.jsx`

#### Code:
```jsx
import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import DetailsStep from "@/components/onboarding/DetailsStep";

export default function Details() {
  const { profile, save } = useOutletContext();
  const navigate = useNavigate();

  const handleNext = async (patch) => {
    await save(patch);
    navigate("/onboarding/socials");
  };

  return <DetailsStep profile={profile} onNext={handleNext} />;
}
```

#### Why:
* In `src/App.jsx`, `/onboarding` is a parent route containing `<Route path="details" element={<OnboardingDetails />} />`.
* `src/pages/Onboarding.jsx` provides `<Outlet context={{ profile, save, setProfile, user }} />`.
* `Details.jsx` reads `profile` and `save` from the outlet context, connects to the existing `DetailsStep` component, saves the name/location/department/resume, and moves the user forward to `/onboarding/socials`.

#### What to do with it:
* This manages Step 1 of onboarding. If you ever want to add new fields to the candidate's initial details, update `DetailsStep.jsx`.

---

### 6.4 `src/pages/onboarding/Socials.jsx`

#### Code:
```jsx
import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import SocialsStep from "@/components/onboarding/SocialsStep";

export default function Socials() {
  const { profile, save } = useOutletContext();
  const navigate = useNavigate();

  const handleNext = async (patch) => {
    await save(patch);
    navigate("/onboarding/video");
  };

  const handleSkip = () => {
    navigate("/onboarding/video");
  };

  return <SocialsStep profile={profile} onNext={handleNext} onSkip={handleSkip} />;
}
```

#### Why:
* In `src/App.jsx`, `/onboarding` contains `<Route path="socials" element={<OnboardingSocials />} />`.
* It connects the existing `SocialsStep` component to `Onboarding.jsx`'s outlet context and handles both the "Next" (save links) and "Skip" flows by routing the candidate to `/onboarding/video`.

#### What to do with it:
* This manages Step 2 of onboarding (optional social links: LinkedIn, Instagram, Facebook, Threads).

---

### 6.5 `src/pages/onboarding/Video.jsx`

#### Code:
```jsx
import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import VideoStep from "@/components/onboarding/VideoStep";

export default function Video() {
  const { profile, save } = useOutletContext();
  const navigate = useNavigate();

  const handleNext = async (patch) => {
    await save({ ...patch, onboarding_complete: true });
    navigate("/", { replace: true });
  };

  const handleBack = () => {
    navigate("/onboarding/socials");
  };

  return <VideoStep profile={profile} onNext={handleNext} onBack={handleBack} />;
}
```

#### Why:
* In `src/App.jsx`, `/onboarding` contains `<Route path="video" element={<OnboardingVideo />} />`.
* According to `PRD.md`, the video introduction is the signature feature of HR's Universe and is mandatory to complete onboarding.
* When the candidate uploads or records their video, this component saves the video metadata (`intro_video_uri`, `duration`, `quality`) along with `onboarding_complete: true` to the `CandidateProfile` entity, then redirects them to the main app dashboard at `/`.

#### What to do with it:
* This manages Step 3 of onboarding (the video pitch).

---

## 7. What To Do With This Code (Next Steps)

1. **Running in Local Development:**
   * Run the Base44 CLI command from `Recruvate-App`:
     ```bash
     base44 dev
     ```
   * Or run frontend only with:
     ```bash
     npm run dev
     ```

2. **Verifying Code Integrity:**
   * To check for linting errors:
     ```bash
     npm run lint
     ```
   * To check TypeScript / JS types:
     ```bash
     npm run typecheck
     ```
   * To create a production build:
     ```bash
     npm run build
     ```
     *(Build outputs to the `dist/` directory and is ready for deployment).*

3. **Deploying / Publishing:**
   * Once you are ready to publish changes to Base44:
     ```bash
     base44 dashboard open
     ```
   * Or commit and push your branch to GitHub.
