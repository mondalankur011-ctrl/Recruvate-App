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

