"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { LoginCard } from "@/components/auth/login-card";

export default function LoginPage() {
  const router = useRouter();

  const handleLoginSuccess = () => {
    router.push("/chat");
  };

  return (
    <main className="flex h-[100dvh] min-h-0 w-full items-center justify-center overflow-y-auto bg-[#f0f2f5] p-3 dark:bg-[#111b21] sm:p-4">
      <LoginCard onSuccess={handleLoginSuccess} />
    </main>
  );
}
