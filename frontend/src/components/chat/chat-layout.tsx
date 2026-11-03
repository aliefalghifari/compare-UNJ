"use client";

import React, { useState } from "react";
import { SidebarInbox } from "./sidebar-inbox";
import { ConversationPanel } from "./conversation-panel";

interface ChatLayoutProps {
  onLogoutClick?: () => void;
}

export function ChatLayout({ onLogoutClick }: ChatLayoutProps) {
  // Mobile toggle between sidebar list and active conversation
  const [mobileView, setMobileView] = useState<"list" | "chat">("chat");

  const handleSelectChat = () => {
    setMobileView("chat");
  };

  const handleBackToSidebar = () => {
    setMobileView("list");
  };

  return (
    <div className="w-full h-screen flex flex-row overflow-hidden bg-white dark:bg-[#111b21]">
      {/* Panel Kiri: Sidebar Daftar Chat (Kotak Masuk) */}
      <div
        className={`w-full md:w-[350px] lg:w-[380px] xl:w-[420px] h-full shrink-0 border-r border-[#e9edef] dark:border-[#222d34] ${
          mobileView === "chat" ? "hidden md:flex flex-col" : "flex flex-col"
        }`}
      >
        <SidebarInbox
          onSelectChat={handleSelectChat}
          onLogoutClick={onLogoutClick}
        />
      </div>

      {/* Panel Kanan: Area Percakapan */}
      <div
        className={`flex-1 h-full min-w-0 ${
          mobileView === "list" ? "hidden md:flex flex-col" : "flex flex-col"
        }`}
      >
        <ConversationPanel onBackToSidebar={handleBackToSidebar} />
      </div>
    </div>
  );
}
