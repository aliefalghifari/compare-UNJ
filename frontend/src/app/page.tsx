"use client";

import React from "react";
import { useApp } from "@/context/app-context";
import { ChatLayout } from "@/components/chat/chat-layout";
// Catatan: Fitur Login tetap dipertahankan dan diarsipkan di bawah ini sesuai arahan.
// Halaman login tetap dapat diakses mandiri melalui rute URL: /login
// import { LoginCard } from "@/components/auth/login-card";

export default function HomePage() {
  const { logout } = useApp();

  /* 
  =============================================================================
  [LOGIN ROUTING LOGIC - DI-ARCHIVE SEMENTARA]
  Untuk tahap pengujian MVP saat ini, pengguna langsung diarahkan ke layout Chat.
  Jika ingin mengaktifkan kembali gerbang login wajib di root ('/'):
  -----------------------------------------------------------------------------
  const { isAuthenticated } = useApp();
  if (!isAuthenticated) {
    return (
      <main className="w-full h-screen flex items-center justify-center p-4 bg-[#f0f2f5] dark:bg-[#111b21] overflow-hidden">
        <LoginCard onSuccess={() => {}} />
      </main>
    );
  }
  =============================================================================
  */

  return (
    <main className="w-full h-screen overflow-hidden">
      <ChatLayout onLogoutClick={() => logout()} />
    </main>
  );
}
