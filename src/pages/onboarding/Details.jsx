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
