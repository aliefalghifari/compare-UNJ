"use client";

import React, { useState, useRef, useEffect } from "react";
import { useApp } from "@/context/app-context";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { QUICK_PROMPTS } from "@/data/mock-data";
import {
  Paperclip,
  PanelLeft,
  Sparkles,
  CheckCircle2,
  CircleDot,
  ArrowUp,
  Tag,
  PackageCheck,
  Bot,
} from "lucide-react";
import { ChatPriority } from "@/types";
import { confirmStatusChange, showToast } from "@/lib/alerts";

export function ConversationPanel() {
  const {
    activeChat,
    sendMessage,
    isAiTyping,
    updatePriority,
    updateStatus,
    isSidebarOpen,
    toggleSidebar,
    currentUser,
  } = useApp();

  const [inputPrompt, setInputPrompt] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto scroll to bottom of feed
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChat?.messages, isAiTyping]);

  // Handle textarea auto-resize
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        180
      )}px`;
    }
  }, [inputPrompt]);

  if (!activeChat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-white dark:bg-[#121214] p-6 text-center text-slate-500">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 mb-4 shadow-2xs">
          <Bot className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          Dashboard Evaluasi AI Chatbot
        </h2>
        <p className="text-xs max-w-sm mt-1.5 text-slate-500 dark:text-slate-400">
          Pilih salah satu sesi di sebelah kiri atau klik &quot;New Chat / Sesi Baru&quot; untuk memulai pengujian respon AI.
        </p>
      </div>
    );
  }

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputPrompt.trim() || isAiTyping) return;

    sendMessage(inputPrompt.trim());
    setInputPrompt("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleStatusToggle = async () => {
    const confirmed = await confirmStatusChange(activeChat.status, activeChat.title);
    if (confirmed) {
      updateStatus(
        activeChat.id,
        activeChat.status === "resolved" ? "active" : "resolved"
      );
    }
  };

  const handleSimulateAttachment = () => {
    showToast({
      icon: "info",
      title: "File Simulasi: Katalog_Produk_Husin_2026.pdf dilampirkan",
    });
    setInputPrompt(
      (prev) => prev + " [Lampiran: Katalog_Produk_Husin_2026.pdf] "
    );
  };

  const renderPriorityBadge = (priority: ChatPriority) => {
    switch (priority) {
      case "high":
        return (
          <Badge variant="high" className="gap-1 font-semibold">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            High Priority
          </Badge>
        );
      case "medium":
        return (
          <Badge variant="medium" className="gap-1 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Medium Priority
          </Badge>
        );
      case "low":
        return (
          <Badge variant="low" className="gap-1 font-normal">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            Low Priority
          </Badge>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#121214] relative overflow-hidden">
      {/* 1. Header Chat (Gemini / ChatGPT Style) */}
      <header className="h-14 px-4 border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-[#121214]/80 backdrop-blur-md flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          {/* Toggle sidebar button */}
          <button
            type="button"
            onClick={toggleSidebar}
            title={isSidebarOpen ? "Tutup Sidebar" : "Buka Sidebar"}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <PanelLeft className="w-4 h-4" />
          </button>

          {/* Title & Badges */}
          <div className="flex items-center gap-2 min-w-0">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate max-w-[200px] sm:max-w-xs md:max-w-md">
              {activeChat.title}
            </h2>

            {/* Priority Badge with Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="cursor-pointer">
                {renderPriorityBadge(activeChat.priority)}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="left" className="w-36">
                <DropdownMenuItem onClick={() => updatePriority(activeChat.id, "high")}>
                  <span className="w-2 h-2 rounded-full bg-red-500 mr-1" />
                  <span>High Priority</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => updatePriority(activeChat.id, "medium")}>
                  <span className="w-2 h-2 rounded-full bg-amber-500 mr-1" />
                  <span>Medium Priority</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => updatePriority(activeChat.id, "low")}>
                  <span className="w-2 h-2 rounded-full bg-slate-400 mr-1" />
                  <span>Low Priority</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Status Badge with SweetAlert2 Confirm */}
            <button
              type="button"
              onClick={handleStatusToggle}
              title="Klik untuk ubah status obrolan (SweetAlert2)"
              className="cursor-pointer"
            >
              {activeChat.status === "resolved" ? (
                <Badge variant="resolved" className="gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Resolved</span>
                </Badge>
              ) : (
                <Badge variant="active" className="gap-1">
                  <CircleDot className="w-3 h-3 text-blue-600 animate-pulse" />
                  <span>Active</span>
                </Badge>
              )}
            </button>
          </div>
        </div>

        {/* AI Bot Active indicator & Quick status toggle */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Status Koneksi AI */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden sm:inline">AI Bot Active</span>
            <span className="sm:hidden">Online</span>
          </div>

          <button
            type="button"
            onClick={handleStatusToggle}
            className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer border ${
              activeChat.status === "resolved"
                ? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                : "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {activeChat.status === "resolved" ? "Buka Kembali" : "Tandai Selesai"}
          </button>
        </div>
      </header>

      {/* 2. Area Message Feed (Center-aligned `max-w-3xl`) */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Order Details Banner if available */}
          {activeChat.orderInfo && (
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs shadow-2xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                  <PackageCheck className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {activeChat.orderInfo.productName}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    ID Transaksi: {activeChat.orderInfo.orderId} • Kanal: {activeChat.platform}
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-slate-900 dark:text-slate-100">
                  {activeChat.orderInfo.totalAmount}
                </p>
                <span className="text-[10px] text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full font-medium">
                  {activeChat.orderInfo.status}
                </span>
              </div>
            </div>
          )}

          {/* Conversation Feed */}
          {activeChat.messages.map((msg) => {
            const isCustomerOrCS = msg.senderRole === "cs" || msg.senderRole === "customer";

            return (
              <div
                key={msg.id}
                className={`flex gap-3.5 ${
                  isCustomerOrCS ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* Avatar */}
                <div className="shrink-0">
                  {isCustomerOrCS ? (
                    <Avatar
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      fallback="CS"
                      size="sm"
                      className="ring-1 ring-slate-200 dark:ring-slate-700"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-2xs">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}
                </div>

                {/* Message Body */}
                <div
                  className={`flex flex-col max-w-[85%] sm:max-w-[78%] ${
                    isCustomerOrCS ? "items-end" : "items-start"
                  }`}
                >
                  {/* Sender Name & Timestamp */}
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {isCustomerOrCS ? "CS Staf (Anda)" : "AI Assistant Toko Husin"}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {msg.timestamp}
                    </span>
                  </div>

                  {/* Bubble */}
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      isCustomerOrCS
                        ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded-tr-sm shadow-2xs"
                        : "bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-800 rounded-tl-sm shadow-2xs"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    {/* AI Intent & Entities metadata preview (Sesuai backend intent/entity) */}
                    {(msg.detectedIntent || (msg.detectedEntities && msg.detectedEntities.length > 0)) && (
                      <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] space-y-1">
                        {msg.detectedIntent && (
                          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                            <Tag className="w-3 h-3 shrink-0" />
                            <span>Klasifikasi: {msg.detectedIntent}</span>
                          </div>
                        )}
                        {msg.detectedEntities && msg.detectedEntities.length > 0 && (
                          <div className="flex items-center gap-1.5 flex-wrap text-slate-500 dark:text-slate-400">
                            {msg.detectedEntities.map((ent, idx) => (
                              <span
                                key={idx}
                                className="px-1.5 py-0.2 rounded bg-slate-200/60 dark:bg-slate-700/60 text-[10px]"
                              >
                                {ent.label}: {ent.value}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator saat AI sedang "merespon" */}
          {isAiTyping && (
            <div className="flex gap-3.5 items-start animate-in fade-in duration-200">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-2xs">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-slate-100 dark:bg-slate-800/80 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                <span
                  className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
                <span className="text-xs text-slate-500 dark:text-slate-400 ml-2 font-medium">
                  AI Bot sedang mengevaluasi intent & menyusun respon...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 3. Prompt / Message Input Box (Bottom Floating ala Gemini/ChatGPT) */}
      <div className="p-4 pt-0 shrink-0 z-20">
        <div className="max-w-3xl mx-auto">
          {/* Quick Prompt Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setInputPrompt(prompt)}
                className="text-xs bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-800 px-3 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer shadow-2xs shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Floating Input Box Card */}
          <div className="relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg p-2 focus-within:border-emerald-500/70 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tulis pesan pengujian CS untuk AI Bot... (Tekan Enter untuk kirim)"
              className="w-full bg-transparent text-sm text-slate-900 dark:text-slate-100 outline-none resize-none px-2 py-1 max-h-44 placeholder:text-slate-400"
            />

            {/* Input Actions Footer */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleSimulateAttachment}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Lampirkan File / Dokumen Bukti (SweetAlert2)"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  Shift + Enter untuk baris baru
                </span>
              </div>

              {/* Send Button */}
              <button
                type="button"
                onClick={() => handleSend()}
                disabled={!inputPrompt.trim() || isAiTyping}
                className="h-8 w-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-30 disabled:hover:bg-emerald-600 text-white flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                title="Kirim Pesan CS"
              >
                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Disclaimer Text */}
          <p className="text-[11px] text-slate-400 text-center mt-2">
            Toko Husin AI Assistant v1.0 • Simulasi Model NLP & Klasifikasi Intensi Backend
          </p>
        </div>
      </div>
    </div>
  );
}
