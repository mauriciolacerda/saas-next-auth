"use client";

import { useState } from "react";
import { RegisterForm } from "@/app/(auth)/components/RegisterForm";
import { TenantForm } from "@/app/(auth)/components/TenantForm";

export default function OnboardingFlow() {
  const [step, setStep] = useState(1);
  const [ownerId, setOwnerId] = useState<string | null>(null);

  const handleRegisterFormSubmit = (data: { user: { id: string } }) => {
    setStep(2);
    setOwnerId(data.user.id);
  };

  return (
    <>
      {step === 1 && <RegisterForm onSubmit={handleRegisterFormSubmit} />}
      {step === 2 && ownerId && <TenantForm ownerId={ownerId} />}
    </>
  );
}
