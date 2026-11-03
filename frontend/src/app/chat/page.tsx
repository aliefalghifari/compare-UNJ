"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ChatLayout } from "@/components/chat/chat-layout";
import { useApp } from "@/context/app-context";

export default function ChatPage() {
  const router = useRouter();
  const { logout } = useApp();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <main className="w-full h-screen overflow-hidden">
      <ChatLayout onLogoutClick={handleLogout} />
    </main>
  );
}

