"use client";

import React from "react";
import { useApp } from "@/context/app-context";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  X,
  MoreVertical,
  CheckCircle2,
  ArrowUpDown,
  CircleDot,
  Pencil,
  Trash2,
  Sun,
  Moon,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { ChatPriority, ChatSession, SortOption } from "@/types";
import { confirmDeleteChat, confirmStatusChange, promptRenameChat } from "@/lib/alerts";

interface SidebarInboxProps {
  onSelectChat?: () => void;
  onLogoutClick?: () => void;
}

export function SidebarInbox({ onSelectChat }: SidebarInboxProps) {
  const {
    theme,
    toggleTheme,
    currentUser,
    activeChatId,
    setActiveChatId,
    createNewChat,
    updatePriority,
    updateStatus,
    renameChat,
    deleteChat,
    sortOption,
    setSortOption,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sortedAndFilteredSessions,
  } = useApp();

  const handleSelect = (id: string) => {
    setActiveChatId(id);
    if (onSelectChat) onSelectChat();
  };

  // SweetAlert2 Rename Session Handler
  const handleRename = async (session: ChatSession) => {
    const newTitle = await promptRenameChat(session.title);
    if (newTitle) {
      renameChat(session.id, newTitle);
    }
  };

  // SweetAlert2 Delete Session Handler
  const handleDelete = async (session: ChatSession) => {
    const confirmed = await confirmDeleteChat(session.title);
    if (confirmed) {
      deleteChat(session.id);
    }
  };

  // SweetAlert2 Status Change Handler
  const handleStatusToggle = async (session: ChatSession) => {
    const confirmed = await confirmStatusChange(session.status, session.title);
    if (confirmed) {
      updateStatus(session.id, session.status === "resolved" ? "active" : "resolved");
    }
  };

  const renderPriorityBadge = (priority: ChatPriority) => {
    switch (priority) {
      case "high":
        return (
          <Badge variant="high" className="text-[10px] px-1.5 py-0 h-4 shrink-0 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            High
          </Badge>
        );
      case "medium":
        return (
          <Badge variant="medium" className="text-[10px] px-1.5 py-0 h-4 shrink-0 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Medium
          </Badge>
        );
      case "low":
        return (
          <Badge variant="low" className="text-[10px] px-1.5 py-0 h-4 shrink-0 font-normal">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Low
          </Badge>
        );
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-[#18181b] border-r border-slate-200/80 dark:border-slate-800 select-none">
      {/* 1. Header Sidebar & Brand */}
      <div className="p-3 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-2xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-none">
              Toko Husin AI
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              CS Dashboard & Evaluasi Bot
            </p>
          </div>
        </div>

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          title={theme === "light" ? "Ganti ke Tema Gelap" : "Ganti ke Tema Terang"}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>
      </div>

      {/* 2. Tombol "New Chat / Sesi Baru" */}
      <div className="p-3 pb-2 shrink-0">
        <Button
          type="button"
          onClick={createNewChat}
          className="w-full h-10 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 shadow-2xs font-semibold text-xs flex items-center justify-center gap-2 group transition-all"
        >
          <div className="w-5 h-5 rounded-lg bg-emerald-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
          <span>New Chat / Sesi Baru</span>
        </Button>
      </div>

      {/* 3. Search & Dropdown Sort / Filter */}
      <div className="px-3 pb-2 shrink-0 space-y-2">
        {/* Search Bar */}
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari topik atau pengujian..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-7 h-8 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:border-emerald-500 placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdown Sort dan Filter Status */}
        <div className="flex items-center gap-1.5 justify-between">
          {/* Dropdown Sort */}
          <div className="relative flex-1">
            <div className="flex items-center gap-1 h-7 px-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-[11px] text-slate-700 dark:text-slate-300">
              <ArrowUpDown className="w-3 h-3 text-slate-400 shrink-0" />
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="w-full bg-transparent outline-none cursor-pointer text-[11px] font-medium"
              >
                <option value="priority" className="dark:bg-slate-900">
                  ⚡ Prioritas (High → Low)
                </option>
                <option value="newest" className="dark:bg-slate-900">
                  🕒 Terbaru (Newest)
                </option>
                <option value="oldest" className="dark:bg-slate-900">
                  ⌛ Terlama (Oldest)
                </option>
                <option value="date" className="dark:bg-slate-900">
                  📅 Tanggal
                </option>
              </select>
            </div>
          </div>

          {/* Filter Status Pills (Semua, Berjalan, Selesai) */}
          <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-0.5 shrink-0 text-[10px]">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`px-2 py-0.5 rounded font-medium transition-colors ${
                statusFilter === "all"
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400"
              }`}
            >
              Semua
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("active")}
              className={`px-2 py-0.5 rounded font-medium transition-colors ${
                statusFilter === "active"
                  ? "bg-blue-600 text-white"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400"
              }`}
            >
              Active
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("resolved")}
              className={`px-2 py-0.5 rounded font-medium transition-colors ${
                statusFilter === "resolved"
                  ? "bg-emerald-600 text-white"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400"
              }`}
            >
              Resolved
            </button>
          </div>
        </div>
      </div>

      {/* 4. Daftar History Chat CS dengan AI (Scrollable) */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1 py-1 no-scrollbar">
        {sortedAndFilteredSessions.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400">
            <MessageSquare className="w-6 h-6 mx-auto mb-2 opacity-40" />
            <p>Tidak ada riwayat obrolan yang sesuai.</p>
          </div>
        ) : (
          sortedAndFilteredSessions.map((session) => {
            const isActive = session.id === activeChatId;

            return (
              <div
                key={session.id}
                onClick={() => handleSelect(session.id)}
                className={`group relative flex items-center justify-between gap-2 p-2.5 rounded-xl cursor-pointer transition-all border ${
                  isActive
                    ? "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 shadow-2xs"
                    : "border-transparent hover:bg-white/70 dark:hover:bg-slate-900/60 hover:border-slate-200/60 dark:hover:border-slate-800"
                }`}
              >
                {/* Content */}
                <div className="flex-1 min-w-0 pr-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {session.title}
                    </span>
                  </div>

                  {/* Badges: Priority + Status */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* Priority Badge */}
                    {renderPriorityBadge(session.priority)}

                    {/* Status Badge */}
                    {session.status === "resolved" ? (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        Resolved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0 rounded-full text-[10px] font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50">
                        <CircleDot className="w-2.5 h-2.5 animate-pulse" />
                        Active
                      </span>
                    )}

                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                      {session.platform}
                    </span>
                  </div>

                  {/* Last message snippet */}
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-1">
                    {session.lastMessage}
                  </p>
                </div>

                {/* 5. Fitur Hover Dropdown (Titik Tiga / Options Menu via SweetAlert2) */}
                <div
                  className="shrink-0 flex items-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className={`p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-opacity ${
                        isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      }`}
                      title="Opsi Obrolan"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="right" className="w-52">
                      <DropdownMenuLabel>Kelola Sesi Chat</DropdownMenuLabel>

                      {/* Sub-Menu: Set Priority dengan SweetAlert2 Toast */}
                      <div className="px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                        Set Priority:
                      </div>
                      <div className="grid grid-cols-3 gap-1 px-1.5 mb-1.5">
                        <button
                          type="button"
                          onClick={() => updatePriority(session.id, "high")}
                          className={`px-1.5 py-1 text-[10px] font-semibold rounded text-center transition-colors cursor-pointer ${
                            session.priority === "high"
                              ? "bg-red-500 text-white"
                              : "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/40"
                          }`}
                        >
                          High
                        </button>
                        <button
                          type="button"
                          onClick={() => updatePriority(session.id, "medium")}
                          className={`px-1.5 py-1 text-[10px] font-semibold rounded text-center transition-colors cursor-pointer ${
                            session.priority === "medium"
                              ? "bg-amber-500 text-white"
                              : "bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-950/40"
                          }`}
                        >
                          Medium
                        </button>
                        <button
                          type="button"
                          onClick={() => updatePriority(session.id, "low")}
                          className={`px-1.5 py-1 text-[10px] font-semibold rounded text-center transition-colors cursor-pointer ${
                            session.priority === "low"
                              ? "bg-slate-500 text-white"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800"
                          }`}
                        >
                          Low
                        </button>
                      </div>

                      <DropdownMenuSeparator />

                      {/* Tandai Selesai / Mark as Resolved dengan SweetAlert2 Confirm */}
                      <DropdownMenuItem onClick={() => handleStatusToggle(session)}>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>
                          {session.status === "resolved"
                            ? "Buka Kembali (Active)"
                            : "Tandai Selesai / Resolved"}
                        </span>
                      </DropdownMenuItem>

                      {/* Ubah Nama Sesi dengan SweetAlert2 Input Prompt */}
                      <DropdownMenuItem onClick={() => handleRename(session)}>
                        <Pencil className="w-3.5 h-3.5 text-blue-600" />
                        <span>Ubah Nama Sesi...</span>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      {/* Hapus Chat dengan SweetAlert2 Confirmation Dialog */}
                      <DropdownMenuItem
                        destructive
                        onClick={() => handleDelete(session)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus Chat...</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 5. User Profile Footer */}
      <div className="p-3 border-t border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <Avatar
            src={currentUser.avatar}
            alt={currentUser.name}
            fallback={currentUser.name.slice(0, 2).toUpperCase()}
            size="sm"
          />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
              {currentUser.name}
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
              {currentUser.roleLabel}
            </p>
          </div>
        </div>

        <a
          href="/login"
          title="Buka Halaman Login / Ganti Akun"
          className="text-[10px] text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium px-2 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          Ganti Akun
        </a>
      </div>
    </div>
  );
}
