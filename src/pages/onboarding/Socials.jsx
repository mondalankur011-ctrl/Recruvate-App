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

