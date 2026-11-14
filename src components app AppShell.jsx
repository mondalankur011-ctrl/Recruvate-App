import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { AppContext } from "@/lib/appContext";
import BrandMark from "@/components/brand/BrandMark";
import BottomNav from "@/components/app/BottomNav";
import NotificationBell from "@/components/app/NotificationBell";
import OpenJobs from "@/pages/OpenJobs";
import ProcessBar from "@/pages/ProcessBar";
import Profile from "@/pages/Profile";

const TABS = [
  { path: "/", component: OpenJobs },
  { path: "/process", component: ProcessBar },
  { path: "/profile", component: Profile },
];

export default function AppShell() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const loadProfile = async () => {
    if (!user) return null;
    const records = await base44.entities.CandidateProfile.filter({ created_by_id: user.id });
    setProfile(records?.[0] || null);
    setLoading(false);
    return records?.[0] || null;
  };

  useEffect(() => {
    loadProfile();
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-[100dvh] items-center justify-center bg-background">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    );
  }

  if (!profile?.onboarding_complete) {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <AppContext.Provider value={{ profile, setProfile, reloadProfile: loadProfile, user }}>
      <div className="flex h-[100dvh] flex-col bg-background">
        <header
          className="z-30 border-b border-border/70 bg-background/92 backdrop-blur-md"
          style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
        >
          <div className="mx-auto flex w-full max-w-md items-center justify-between px-5 py-3">
            <BrandMark size="sm" />
            <NotificationBell user={user} />
          </div>
        </header>

        <main className="relative mx-auto w-full max-w-md flex-1 overflow-hidden">
          {TABS.map(({ path, component: Page }) => {
            const active = location.pathname === path;
            return (
              <div
                key={path}
                className={active ? "absolute inset-0 overflow-y-auto px-5 pb-32 pt-4" : "hidden"}
              >
                <Page />
              </div>
            );
          })}
        </main>

        <BottomNav />
      </div>
    </AppContext.Provider>
  );
}
