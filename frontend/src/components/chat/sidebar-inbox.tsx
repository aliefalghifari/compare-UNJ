"use client";

import React, { useState } from "react";
import { useApp } from "@/context/app-context";
import { Avatar } from "@/components/ui/avatar";
import {
  Search,
  X,
  Pin,
  CheckCheck,
  LogOut,
  Sun,
  Moon,
  SlidersHorizontal,
} from "lucide-react";

interface SidebarInboxProps {
  onSelectChat?: () => void;
  onLogoutClick?: () => void;
}

export function SidebarInbox({ onSelectChat, onLogoutClick }: SidebarInboxProps) {
  const {
    theme,
    toggleTheme,
    currentUser,
    currentRole,
    switchRole,
    logout,
    activeContactId,
    setActiveContactId,
    searchQuery,
    setSearchQuery,
    selectedPlatformFilter,
    setSelectedPlatformFilter,
    filteredContacts,
  } = useApp();

  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const filterTabs = [
    { id: "all", label: "Semua" },
    { id: "unread", label: "Belum Dibaca" },
    { id: "shopee", label: "Shopee" },
    { id: "tiktok shop", label: "TikTok" },
    { id: "lazada", label: "Lazada" },
    { id: "whatsapp", label: "WhatsApp" },
  ];

  const handleContactClick = (id: string) => {
    setActiveContactId(id);
    if (onSelectChat) {
      onSelectChat();
    }
  };

  const handleLogout = () => {
    if (onLogoutClick) {
      onLogoutClick();
    } else {
      logout();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#111b21] select-none">
      {/* 1. Header Atas: Profil Pengguna Login & Status */}
      <div className="h-16 px-4 bg-[#f0f2f5] dark:bg-[#202c33] flex items-center justify-between border-b border-[#e9edef] dark:border-[#222d34] shrink-0">
        <div className="flex items-center gap-3">
          <Avatar
            src={currentUser.avatar}
            alt={currentUser.name}
            fallback={currentUser.name.slice(0, 2).toUpperCase()}
            isOnline={currentUser.isOnline}
            size="md"
          />
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-slate-800 dark:text-[#e9edef] truncate max-w-[130px]">
              {currentUser.name}
            </span>
            <span className="text-xs text-[#00a884] font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00a884]" />
              {currentUser.roleLabel} • Online
            </span>
          </div>
        </div>

        {/* Action Buttons: Theme Toggle, Role Switch, Logout */}
        <div className="flex items-center gap-1 relative text-[#54656f] dark:text-[#aebac1]">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            title={theme === "light" ? "Ganti ke Tema Gelap" : "Ganti ke Tema Terang"}
            className="p-2 rounded-full hover:bg-slate-200/80 dark:hover:bg-[#374248] transition-colors cursor-pointer"
          >
            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* Role Switcher Button */}
          <button
            type="button"
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            title="Ganti Role Simulasi"
            className="p-2 rounded-full hover:bg-slate-200/80 dark:hover:bg-[#374248] transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            title="Keluar / Ganti Akun"
            className="p-2 rounded-full hover:bg-slate-200/80 dark:hover:bg-[#374248] hover:text-rose-500 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>

          {/* Role Selector Dropdown */}
          {showRoleMenu && (
            <div className="absolute top-11 right-0 w-48 bg-white dark:bg-[#233138] rounded-lg shadow-lg border border-[#e9edef] dark:border-[#2a3942] py-1 z-50 animate-in fade-in">
              <div className="px-3 py-1.5 border-b border-[#e9edef] dark:border-[#2a3942]">
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  Role Simulasi:
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  switchRole("cs");
                  setShowRoleMenu(false);
                }}
                className={`w-full px-3 py-2 text-left text-xs transition-colors ${
                  currentRole === "cs"
                    ? "text-[#00a884] font-semibold bg-[#f0f2f5] dark:bg-[#111b21]"
                    : "text-slate-700 dark:text-[#d1d7db] hover:bg-[#f5f6f6] dark:hover:bg-[#111b21]"
                }`}
              >
                Customer Service (CS)
              </button>
              <button
                type="button"
                onClick={() => {
                  switchRole("customer");
                  setShowRoleMenu(false);
                }}
                className={`w-full px-3 py-2 text-left text-xs transition-colors ${
                  currentRole === "customer"
                    ? "text-[#00a884] font-semibold bg-[#f0f2f5] dark:bg-[#111b21]"
                    : "text-slate-700 dark:text-[#d1d7db] hover:bg-[#f5f6f6] dark:hover:bg-[#111b21]"
                }`}
              >
                Customer (Pelanggan)
              </button>
              <button
                type="button"
                onClick={() => {
                  switchRole("owner");
                  setShowRoleMenu(false);
                }}
                className={`w-full px-3 py-2 text-left text-xs transition-colors ${
                  currentRole === "owner"
                    ? "text-[#00a884] font-semibold bg-[#f0f2f5] dark:bg-[#111b21]"
                    : "text-slate-700 dark:text-[#d1d7db] hover:bg-[#f5f6f6] dark:hover:bg-[#111b21]"
                }`}
              >
                Pemilik Toko (Husin)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Search Bar Kotak Masuk */}
      <div className="p-2.5 bg-white dark:bg-[#111b21] border-b border-[#e9edef] dark:border-[#222d34] shrink-0 space-y-2">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-[#54656f] dark:text-[#8696a0] absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari obrolan atau pesan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 h-9 text-xs bg-[#f0f2f5] dark:bg-[#202c33] text-slate-900 dark:text-[#d1d7db] rounded-lg outline-none focus:bg-white dark:focus:bg-[#111b21] focus:ring-1 focus:ring-[#00a884] placeholder:text-[#54656f] dark:placeholder:text-[#8696a0] transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 text-[#54656f] dark:text-[#8696a0] hover:text-slate-800"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Chips / Tabs (Scrollbar tersembunyi bersih) */}
        <div
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          className="flex items-center gap-1.5 overflow-x-auto no-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] py-0.5 text-[11px]"
        >
          {filterTabs.map((tab) => {
            const isActive = selectedPlatformFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedPlatformFilter(tab.id)}
                className={`px-3 py-1 rounded-full whitespace-nowrap font-medium transition-colors cursor-pointer ${
                  isActive
                    ? "bg-[#00a884] text-white"
                    : "bg-[#f0f2f5] dark:bg-[#202c33] text-[#54656f] dark:text-[#8696a0] hover:bg-[#e9edef] dark:hover:bg-[#2a3942]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Daftar List Chat Pelanggan */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#f0f2f5] dark:divide-[#222d34]">
        {filteredContacts.length === 0 ? (
          <div className="p-8 text-center text-[#54656f] dark:text-[#8696a0] text-xs">
            <p>Tidak ada percakapan ditemukan.</p>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mt-2 text-[#00a884] underline font-medium"
              >
                Bersihkan pencarian
              </button>
            )}
          </div>
        ) : (
          filteredContacts.map((contact) => {
            const isActive = contact.id === activeContactId;

            return (
              <div
                key={contact.id}
                onClick={() => handleContactClick(contact.id)}
                className={`flex items-start gap-3 p-3 cursor-pointer transition-colors relative select-none ${
                  isActive
                    ? "bg-[#f0f2f5] dark:bg-[#2a3942]"
                    : "hover:bg-[#f5f6f6] dark:hover:bg-[#202c33]/70"
                }`}
              >
                <Avatar
                  src={contact.avatar}
                  alt={contact.name}
                  fallback={contact.name.slice(0, 2).toUpperCase()}
                  isOnline={contact.isOnline}
                  size="lg"
                  className="shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="font-semibold text-sm text-slate-900 dark:text-[#e9edef] truncate">
                        {contact.name}
                      </span>
                      {contact.pinned && (
                        <Pin className="w-3 h-3 text-[#54656f] dark:text-[#8696a0] shrink-0 fill-current" />
                      )}
                    </div>
                    <span
                      className={`text-[11px] shrink-0 ml-2 ${
                        contact.unreadCount > 0
                          ? "text-[#00a884] font-semibold"
                          : "text-[#54656f] dark:text-[#8696a0]"
                      }`}
                    >
                      {contact.lastMessageTime}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 min-w-0">
                      <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb] shrink-0" />
                      <p className="text-xs text-[#54656f] dark:text-[#8696a0] truncate">
                        {contact.lastMessage}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Marketplace Tag */}
                      <span className="text-[10px] font-medium text-[#54656f] dark:text-[#8696a0]">
                        {contact.platform}
                      </span>

                      {/* Unread badge */}
                      {contact.unreadCount > 0 && (
                        <span className="w-4 h-4 rounded-full bg-[#00a884] text-white text-[10px] font-bold flex items-center justify-center">
                          {contact.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
