import React from 'react';
import { useAuth } from '@/lib/AuthContext';

const UserNotRegisteredError = () => {
  const { logout } = useAuth();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <div className="w-full max-w-md rounded-[24px] bg-card p-8 shadow-[0_24px_60px_-32px_rgba(23,21,34,0.45)] border border-border">
        <div className="text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="mt-6 font-heading text-3xl font-bold text-foreground">Access Restricted</h1>
          <p className="mt-4 text-sm text-foreground/60">
            You are not registered to use this application. Please contact the app administrator to request access.
          </p>
          <div className="mt-8 rounded-xl bg-muted p-4 text-sm text-foreground/60">
            <p>If you believe this is an error, you can:</p>
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>Verify you are logged in with the correct account</li>
              <li>Contact the app administrator for access</li>
              <li>Try logging out and back in again</li>
            </ul>
          </div>
          <button
            type="button"
            onClick={() => logout('/login')}
            className="mt-6 inline-flex h-11 items-center justify-center rounded-xl border border-border bg-card px-5 text-sm font-bold text-foreground/70 press"
          >
            Back to login
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserNotRegisteredError;
