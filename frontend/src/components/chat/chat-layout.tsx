"use client";

import React from "react";
import { SidebarInbox } from "./sidebar-inbox";
import { ConversationPanel } from "./conversation-panel";
import { useApp } from "@/context/app-context";

interface ChatLayoutProps {
  onLogoutClick?: () => void;
}

export function ChatLayout({ onLogoutClick }: ChatLayoutProps) {
  const { isSidebarOpen, setIsSidebarOpen } = useApp();
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateViewport = () => {
      setIsMobile(mediaQuery.matches);
      if (mediaQuery.matches) setIsSidebarOpen(false);
    };
    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);
    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, [setIsSidebarOpen]);

  React.useEffect(() => {
    if (!isMobile || !isSidebarOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsSidebarOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isMobile, isSidebarOpen, setIsSidebarOpen]);

  return (
    <div className="relative flex h-[100dvh] min-h-0 w-full flex-row overflow-hidden bg-[#f3f4f1] dark:bg-[#121214]">
      {isMobile && isSidebarOpen && (
        <button
          type="button"
          aria-label="Tutup daftar percakapan"
          onClick={() => setIsSidebarOpen(false)}
          className="absolute inset-0 z-40 bg-slate-950/35 backdrop-blur-[1px] md:hidden"
        />
      )}

      {/* Panel Kiri: Sidebar History, Priority & Management */}
      <aside
        className={`h-full shrink-0 transition-all duration-300 ease-in-out ${
          isSidebarOpen
            ? "fixed inset-y-0 left-0 z-50 w-[min(88vw,360px)] shadow-xl md:relative md:inset-auto md:z-auto md:w-[340px] md:shadow-none lg:w-[360px]"
            : "fixed inset-y-0 left-0 z-50 w-[min(88vw,360px)] -translate-x-full shadow-xl md:relative md:inset-auto md:z-auto md:w-0 md:translate-x-0 md:overflow-hidden md:shadow-none"
        }`}
      >
        <SidebarInbox
          onLogoutClick={onLogoutClick}
          onSelectChat={() => {
            if (isMobile) setIsSidebarOpen(false);
          }}
        />
      </aside>

      {/* Panel Kanan: Area Chat Gemini / ChatGPT Style */}
      <main className="relative z-0 flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <ConversationPanel />
      </main>
    </div>
  );
}
