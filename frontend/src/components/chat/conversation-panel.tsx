"use client";

import React, { useState, useRef, useEffect } from "react";
import { useApp } from "@/context/app-context";
import { Avatar } from "@/components/ui/avatar";
import { QUICK_REPLIES } from "@/data/mock-data";
import {
  Send,
  Smile,
  Paperclip,
  Phone,
  Video,
  Search,
  MoreVertical,
  CheckCheck,
  Check,
  ArrowLeft,
  PackageCheck,
  ShoppingBag,
} from "lucide-react";

interface ConversationPanelProps {
  onBackToSidebar?: () => void;
}

export function ConversationPanel({ onBackToSidebar }: ConversationPanelProps) {
  const { activeContact, sendMessage, currentRole } = useApp();
  const [inputText, setInputText] = useState("");
  const [showOrderDetails, setShowOrderDetails] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeContact?.messages]);

  if (!activeContact) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#efeae2] dark:bg-[#0b141a] p-6 text-center text-[#54656f] dark:text-[#8696a0]">
        <div className="w-14 h-14 rounded-full bg-[#f0f2f5] dark:bg-[#202c33] flex items-center justify-center text-[#00a884] mb-3">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-slate-800 dark:text-[#e9edef]">
          Pusat Percakapan Toko
        </h3>
        <p className="text-xs max-w-xs mt-1 text-[#54656f] dark:text-[#8696a0]">
          Pilih salah satu kontak dari daftar untuk membuka obrolan.
        </p>
      </div>
    );
  }

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    sendMessage(inputText.trim());
    setInputText("");
    setShowEmojiPicker(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const insertQuickReply = (text: string) => {
    setInputText(text);
  };

  const emojis = ["😊", "🙏", "👍", "📦", "✨", "❤️"];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#efeae2] dark:bg-[#0b141a] relative overflow-hidden">
      {/* 1. Header Chat */}
      <div className="h-16 px-4 bg-[#f0f2f5] dark:bg-[#202c33] border-b border-[#e9edef] dark:border-[#222d34] flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          {onBackToSidebar && (
            <button
              type="button"
              onClick={onBackToSidebar}
              className="md:hidden p-1.5 -ml-1 text-[#54656f] dark:text-[#8696a0] hover:text-slate-800"
              title="Kembali"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <Avatar
            src={activeContact.avatar}
            alt={activeContact.name}
            fallback={activeContact.name.slice(0, 2).toUpperCase()}
            isOnline={activeContact.isOnline}
            size="md"
          />

          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-slate-900 dark:text-[#e9edef] truncate">
              {activeContact.name}
            </span>
            <span className="text-xs text-[#54656f] dark:text-[#8696a0] truncate">
              {activeContact.isOnline ? "Online" : "Terakhir dilihat baru saja"} • {activeContact.platform}
            </span>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 text-[#54656f] dark:text-[#aebac1]">
          <button
            type="button"
            onClick={() => setShowOrderDetails(!showOrderDetails)}
            className={`p-2 rounded-full transition-colors ${
              showOrderDetails
                ? "text-[#00a884] bg-slate-200/60 dark:bg-[#374248]"
                : "hover:bg-slate-200/80 dark:hover:bg-[#374248]"
            }`}
            title="Info Pesanan"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => alert(`Memulai panggilan suara ke ${activeContact.name}`)}
            className="p-2 rounded-full hover:bg-slate-200/80 dark:hover:bg-[#374248] transition-colors hidden sm:block"
            title="Panggilan Suara"
          >
            <Phone className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => alert(`Memulai panggilan video ke ${activeContact.name}`)}
            className="p-2 rounded-full hover:bg-slate-200/80 dark:hover:bg-[#374248] transition-colors hidden sm:block"
            title="Panggilan Video"
          >
            <Video className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => alert("Pencarian pesan")}
            className="p-2 rounded-full hover:bg-slate-200/80 dark:hover:bg-[#374248] transition-colors"
            title="Cari"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => alert("Menu lainnya")}
            className="p-2 rounded-full hover:bg-slate-200/80 dark:hover:bg-[#374248] transition-colors"
            title="Lainnya"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Info Pesanan Ringkas */}
      {showOrderDetails && activeContact.orderInfo && (
        <div className="bg-[#f0f2f5]/90 dark:bg-[#182229] border-b border-[#e9edef] dark:border-[#222d34] px-4 py-2 flex items-center justify-between text-xs z-10">
          <div className="flex items-center gap-2 min-w-0">
            <PackageCheck className="w-4 h-4 text-[#00a884] shrink-0" />
            <div className="truncate">
              <span className="font-semibold text-slate-800 dark:text-[#d1d7db]">
                {activeContact.orderInfo.productName}
              </span>
              <span className="text-[#54656f] dark:text-[#8696a0] ml-1.5 font-mono text-[11px]">
                ({activeContact.orderInfo.orderId})
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-2">
            <span className="font-semibold text-slate-800 dark:text-[#e9edef]">
              {activeContact.orderInfo.totalAmount}
            </span>
            <span className="text-[10px] text-[#54656f] dark:text-[#8696a0] border border-[#e9edef] dark:border-[#2a3942] px-2 py-0.5 rounded-full">
              {activeContact.orderInfo.status}
            </span>
          </div>
        </div>
      )}

      {/* 2. Area Pesan (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5 z-10">
        {/* Date separator */}
        <div className="flex justify-center my-2">
          <span className="bg-white dark:bg-[#182229] text-[11px] text-[#54656f] dark:text-[#8696a0] px-3 py-1 rounded-md shadow-2xs">
            Hari ini
          </span>
        </div>

        {activeContact.messages.map((msg) => {
          const isOut = !msg.isIncoming;

          return (
            <div
              key={msg.id}
              className={`flex w-full ${isOut ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[70%] md:max-w-[65%] rounded-lg px-3 py-1.5 text-sm shadow-2xs select-text ${
                  isOut
                    ? "bg-[#d9fdd3] dark:bg-[#005c4b] text-[#111b21] dark:text-[#e9edef]"
                    : "bg-white dark:bg-[#202c33] text-[#111b21] dark:text-[#e9edef]"
                }`}
              >
                {msg.isIncoming && (
                  <p className="text-[11px] font-semibold text-[#00a884] mb-0.5">
                    {msg.senderName}
                  </p>
                )}

                <p className="whitespace-pre-wrap leading-relaxed break-words text-[13px]">
                  {msg.text}
                </p>

                <div
                  className={`flex items-center justify-end gap-1 text-[10px] mt-0.5 select-none ${
                    isOut
                      ? "text-[#667781] dark:text-[#8696a0]"
                      : "text-[#667781] dark:text-[#8696a0]"
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {isOut && (
                    <span>
                      {msg.status === "read" ? (
                        <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                      ) : (
                        <Check className="w-3.5 h-3.5 text-[#8696a0]" />
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Reply Bar untuk CS (Scrollbar tersembunyi bersih) */}
      {(currentRole === "cs" || currentRole === "owner") && (
        <div
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          className="px-3 py-1.5 bg-[#f0f2f5]/90 dark:bg-[#202c33]/90 border-t border-[#e9edef] dark:border-[#222d34] flex items-center gap-1.5 overflow-x-auto no-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] z-10 shrink-0"
        >
          <span className="text-[11px] font-medium text-[#54656f] dark:text-[#8696a0] shrink-0 pl-1">
            Template:
          </span>
          {QUICK_REPLIES.map((reply, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => insertQuickReply(reply)}
              className="text-xs bg-white dark:bg-[#111b21] text-slate-700 dark:text-[#d1d7db] hover:text-[#00a884] border border-[#e9edef] dark:border-[#2a3942] px-2.5 py-1 rounded-full whitespace-nowrap transition-colors shrink-0 cursor-pointer"
            >
              {reply}
            </button>
          ))}
        </div>
      )}

      {/* Emoji Picker Popup */}
      {showEmojiPicker && (
        <div className="absolute bottom-16 left-4 bg-white dark:bg-[#233138] border border-[#e9edef] dark:border-[#2a3942] p-2 rounded-lg shadow-lg z-30 flex gap-2">
          {emojis.map((em, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setInputText((prev) => prev + em);
                setShowEmojiPicker(false);
              }}
              className="text-base p-1 hover:scale-125 transition-transform cursor-pointer"
            >
              {em}
            </button>
          ))}
        </div>
      )}

      {/* 3. Input Bar (Bawah) */}
      <div className="p-2.5 bg-[#f0f2f5] dark:bg-[#202c33] border-t border-[#e9edef] dark:border-[#222d34] flex items-center gap-2 z-20 shrink-0">
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className={`p-2 rounded-full transition-colors cursor-pointer ${
            showEmojiPicker
              ? "text-[#00a884]"
              : "text-[#54656f] dark:text-[#aebac1] hover:text-slate-800"
          }`}
          title="Emotikon"
        >
          <Smile className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => alert("Pilih file atau gambar untuk dilampirkan")}
          className="p-2 rounded-full text-[#54656f] dark:text-[#aebac1] hover:text-slate-800 transition-colors cursor-pointer"
          title="Lampirkan"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        <form onSubmit={handleSend} className="flex-1 flex items-center gap-2">
          <input
            type="text"
            placeholder="Ketik pesan..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 h-10 px-3 bg-white dark:bg-[#2a3942] text-slate-900 dark:text-[#e9edef] rounded-lg text-sm border-none focus:outline-none placeholder:text-[#54656f] dark:placeholder:text-[#8696a0]"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="h-10 w-10 rounded-full bg-[#00a884] hover:bg-[#008f6f] text-white flex items-center justify-center transition-colors disabled:opacity-40 cursor-pointer shrink-0"
            title="Kirim"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
