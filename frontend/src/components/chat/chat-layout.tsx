"use client";

import React from "react";
import { SidebarInbox } from "./sidebar-inbox";
import { ConversationPanel } from "./conversation-panel";
import { useApp } from "@/context/app-context";

interface ChatLayoutProps {
  onLogoutClick?: () => void;
}

export function ChatLayout({ onLogoutClick }: ChatLayoutProps) {
  const { isSidebarOpen } = useApp();

  return (
    <div className="w-full h-screen flex flex-row overflow-hidden bg-white dark:bg-[#121214]">
      {/* Panel Kiri: Sidebar History, Priority & Management */}
      <aside
        className={`h-full shrink-0 transition-all duration-300 ease-in-out ${
          isSidebarOpen
            ? "w-[300px] sm:w-[320px] md:w-[340px] lg:w-[360px]"
            : "w-0 -translate-x-full md:translate-x-0 md:w-0 overflow-hidden"
        }`}
      >
        <SidebarInbox onLogoutClick={onLogoutClick} />
      </aside>

      {/* Panel Kanan: Area Chat Gemini / ChatGPT Style */}
      <main className="flex-1 h-full min-w-0 flex flex-col relative overflow-hidden">
        <ConversationPanel />
      </main>
    </div>
  );
}
