"use client";

import React from "react";
import { useApp } from "@/context/app-context";
import { LoginCard } from "@/components/auth/login-card";
import { ChatLayout } from "@/components/chat/chat-layout";

export default function HomePage() {
  const { isAuthenticated, logout } = useApp();

  if (!isAuthenticated) {
    return (
      <main className="w-full h-screen flex items-center justify-center p-4 bg-[#f0f2f5] dark:bg-[#111b21] overflow-hidden">
        <LoginCard onSuccess={() => {}} />
      </main>
    );
  }

  return (
    <main className="w-full h-screen overflow-hidden">
      <ChatLayout onLogoutClick={() => logout()} />
    </main>
  );
}
