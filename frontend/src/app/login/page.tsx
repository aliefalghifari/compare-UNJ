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
    <main className="w-full h-screen flex items-center justify-center p-4 bg-[#f0f2f5] dark:bg-[#111b21] overflow-hidden">
      <LoginCard onSuccess={handleLoginSuccess} />
    </main>
  );
}
