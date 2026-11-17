import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

export default function Onboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      if (!user) return;
      const records = await base44.entities.CandidateProfile.filter({ created_by_id: user.id });
      const existing = records?.[0];
      if (existing?.onboarding_complete) {
        navigate("/", { replace: true });
        return;
      }
      const record =
        existing ||
        (await base44.entities.CandidateProfile.create({
          email: user.email,
          phone: localStorage.getItem("hru_signup_phone") || "",
          full_name: user.full_name || "",
        }));
      if (alive) {
        setProfile(record);
        setLoading(false);
      }
    };
    load();
    return () => {
      alive = false;
    };
  }, [user]);

  const save = async (patch) => {
    const updated = await base44.entities.CandidateProfile.update(profile.id, patch);
    setProfile(updated);
    return updated;
  };

  if (loading || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    );
  }

  return <Outlet context={{ profile, save, setProfile, user }} />;
}
