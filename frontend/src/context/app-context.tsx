"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import {
  ChatPriority,
  ChatSession,
  ChatStatus,
  Message,
  SortOption,
  UserProfile,
  UserRole,
} from "@/types";
import { INITIAL_CHAT_SESSIONS, MOCK_USERS } from "@/data/mock-data";
import { showToast } from "@/lib/alerts";

interface AppContextType {
  // Theme state
  theme: "light" | "dark";
  toggleTheme: () => void;

  // Auth state (Default isAuthenticated = true for instant Chat access on /)
  isAuthenticated: boolean;
  currentUser: UserProfile;
  currentRole: UserRole;
  login: (role: UserRole, email?: string) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;

  // Sidebar responsive / collapse state
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  // Chat sessions state
  chatSessions: ChatSession[];
  activeChatId: string;
  activeChat: ChatSession | undefined;
  setActiveChatId: (id: string) => void;
  createNewChat: () => void;
  sendMessage: (text: string) => void;

  // AI typing indicator
  isAiTyping: boolean;

  // Management operations with SweetAlert2 notifications
  updatePriority: (id: string, priority: ChatPriority, notify?: boolean) => void;
  updateStatus: (id: string, status: ChatStatus, notify?: boolean) => void;
  renameChat: (id: string, newTitle: string, notify?: boolean) => void;
  deleteChat: (id: string, notify?: boolean) => void;

  // Sort & Filter state
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: "all" | "active" | "resolved";
  setStatusFilter: (filter: "all" | "active" | "resolved") => void;

  // Processed sessions list
  sortedAndFilteredSessions: ChatSession[];

  // Backward compatibility alias for existing code
  contacts: ChatSession[];
  activeContact: ChatSession | undefined;
  activeContactId: string;
  setActiveContactId: (id: string) => void;
  filteredContacts: ChatSession[];
  selectedPlatformFilter: string;
  setSelectedPlatformFilter: (platform: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Theme state with lazy initialization
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";
    try {
      const saved = localStorage.getItem("app_theme") as "light" | "dark" | null;
      if (saved) return saved;
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    try {
      localStorage.setItem("app_theme", nextTheme);
    } catch {
      // ignore
    }
  };

  // Auth state: Set default isAuthenticated = true so CS lands directly in Chat Dashboard
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [currentRole, setCurrentRole] = useState<UserRole>("cs");
  const [customEmail, setCustomEmail] = useState<string | null>(null);

  const currentUser: UserProfile = {
    ...MOCK_USERS[currentRole],
    ...(customEmail ? { email: customEmail } : {}),
  };

  const login = (role: UserRole, email?: string) => {
    setCurrentRole(role);
    if (email && email.trim()) {
      setCustomEmail(email.trim());
    } else {
      setCustomEmail(null);
    }
    setIsAuthenticated(true);
    showToast({ icon: "success", title: "Berhasil Masuk sebagai " + MOCK_USERS[role].roleLabel });
  };

  const logout = () => {
    setIsAuthenticated(false);
    showToast({ icon: "info", title: "Sesi Berakhir / Logout" });
  };

  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
    showToast({ icon: "info", title: "Role dialihkan ke: " + MOCK_USERS[role].roleLabel });
  };

  // Sidebar toggle state
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  // Chat sessions state
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(INITIAL_CHAT_SESSIONS);
  const [activeChatId, setActiveChatId] = useState<string>("chat-1");

  // AI typing status
  const [isAiTyping, setIsAiTyping] = useState<boolean>(false);

  // Sort & Filter state
  const [sortOption, setSortOption] = useState<SortOption>("priority");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "resolved">("all");
  const [selectedPlatformFilter, setSelectedPlatformFilter] = useState<string>("all");

  const activeChat = chatSessions.find((s) => s.id === activeChatId) || chatSessions[0];

  // Create New Chat session (with SweetAlert2 Toast)
  const createNewChat = () => {
    const newId = `chat-${Date.now()}`;
    const now = new Date();
    const timeString = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;

    const newTitle = `Pengujian Sesi #${Math.floor(1000 + Math.random() * 9000)}`;

    const newSession: ChatSession = {
      id: newId,
      title: newTitle,
      customerName: "Pengujian CS Staf",
      customerAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      platform: "Shopee",
      platformBadgeColor: "bg-orange-500/10 text-orange-600 border border-orange-200 dark:border-orange-900/40",
      priority: "medium",
      status: "active",
      isOnline: true,
      unreadCount: 0,
      pinned: false,
      lastMessage: "AI Bot siap menerima pengujian query dan intent.",
      lastMessageTime: timeString,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      messages: [
        {
          id: `msg-${Date.now()}-welcome`,
          senderId: "ai-bot",
          senderName: "AI Assistant Toko Husin",
          senderRole: "agent",
          text: "Halo Mas Ahmad (CS)! Backend AI Assistant Toko Husin siap menguji intent klasifikasi produk, SOP garansi keluhan, dan rekomendasi respons cepat. Silakan masukkan query percakapan.",
          timestamp: timeString,
          isIncoming: false,
          status: "read",
        },
      ],
      tags: ["Pengujian", "Aktif"],
    };

    setChatSessions((prev) => [newSession, ...prev]);
    setActiveChatId(newId);
    showToast({ icon: "success", title: "Sesi Pengujian Baru Berhasil Dibuat!" });
  };

  // Update Priority with SweetAlert2
  const updatePriority = (id: string, priority: ChatPriority, notify = true) => {
    setChatSessions((prev) =>
      prev.map((chat) => (chat.id === id ? { ...chat, priority } : chat))
    );
    if (notify) {
      const priorityLabel = priority === "high" ? "High (Tinggi)" : priority === "medium" ? "Medium (Sedang)" : "Low (Rendah)";
      showToast({ icon: "info", title: `Prioritas Diperbarui: ${priorityLabel}` });
    }
  };

  // Update Status with SweetAlert2
  const updateStatus = (id: string, status: ChatStatus, notify = true) => {
    setChatSessions((prev) =>
      prev.map((chat) => (chat.id === id ? { ...chat, status } : chat))
    );
    if (notify) {
      showToast({
        icon: "success",
        title: status === "resolved" ? "Sesi Ditandai Selesai (Resolved)" : "Sesi Dibuka Kembali (Active)",
      });
    }
  };

  // Rename Chat with SweetAlert2
  const renameChat = (id: string, newTitle: string, notify = true) => {
    if (!newTitle.trim()) return;
    setChatSessions((prev) =>
      prev.map((chat) => (chat.id === id ? { ...chat, title: newTitle.trim() } : chat))
    );
    if (notify) {
      showToast({ icon: "success", title: "Nama Sesi Berhasil Diubah!" });
    }
  };

  // Delete Chat with SweetAlert2
  const deleteChat = (id: string, notify = true) => {
    setChatSessions((prev) => {
      const remaining = prev.filter((chat) => chat.id !== id);
      if (activeChatId === id && remaining.length > 0) {
        setActiveChatId(remaining[0].id);
      }
      return remaining;
    });
    if (notify) {
      showToast({ icon: "success", title: "Sesi Chat Telah Dihapus" });
    }
  };

  // Send message from CS to AI Bot
  const sendMessage = (text: string) => {
    if (!text.trim() || !activeChat) return;

    const now = new Date();
    const timeString = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: "cs",
      text: text.trim(),
      timestamp: timeString,
      isIncoming: false,
      status: "sent",
    };

    setChatSessions((prev) =>
      prev.map((chat) => {
        if (chat.id === activeChat.id) {
          return {
            ...chat,
            lastMessage: text.trim(),
            lastMessageTime: timeString,
            updatedAt: now.toISOString(),
            messages: [...chat.messages, userMessage],
          };
        }
        return chat;
      })
    );

    // Trigger AI Typing indicator
    setIsAiTyping(true);

    // Simulated Backend AI prediction & response
    setTimeout(() => {
      const lower = text.toLowerCase();
      let replyText = "Query telah dievaluasi oleh backend AI Toko Husin. Respon rekomendasi telah disesuaikan dengan SOP katalog toko.";
      let detectedIntent = "Pengecekan Umum / FAQ Toko";
      let detectedEntities: { label: string; value: string }[] | undefined = undefined;

      if (lower.includes("stok") || lower.includes("ready") || lower.includes("kurma") || lower.includes("sukari") || lower.includes("ajwa")) {
        detectedIntent = "Intent: Cek Stok Produk";
        detectedEntities = [
          { label: "PRODUK", value: "Kurma Sukari Al-Qassim" },
          { label: "STATUS GUDANG", value: "Ready 48 Box (1kg)" },
          { label: "HARGA", value: "Rp 85.000 / Box" },
        ];
        replyText = "Hasil Prediksi Backend: Stok Kurma Sukari Al-Qassim kemasan 1kg saat ini tersedia 48 box di rak utama. Produk segar, tanpa pemanis buatan, dan siap dikirim dengan ekstra bubble wrap gratis!";
      } else if (lower.includes("rusak") || lower.includes("bocor") || lower.includes("keluhan") || lower.includes("komplain") || lower.includes("ongkir")) {
        detectedIntent = "Intent: Eskalasi Keluhan (Tinggi)";
        detectedEntities = [
          { label: "KATEGORI", value: "Kerusakan Fisik Barang / Paket Bocor" },
          { label: "KEBIJAKAN", value: "Garansi 100% Penggantian Baru" },
          { label: "ACTION", value: "Buka Tiket Resi Pengganti" },
        ];
        replyText = "Hasil Prediksi Backend: Keluhan dikategorikan Prioritas Tinggi. Sistem merekomendasikan penerbitan garansi 100% barang baru tanpa biaya tambahan setelah konfirmasi bukti unboxing.";
      } else if (lower.includes("kirim") || lower.includes("jadwal") || lower.includes("pick-up") || lower.includes("ekspedisi")) {
        detectedIntent = "Intent: Kebijakan Pengiriman";
        detectedEntities = [
          { label: "CUT-OFF", value: "15.00 WIB" },
          { label: "KURIR", value: "J&T, SiCepat, Kargo" },
        ];
        replyText = "Hasil Prediksi Backend: Batas waktu order reguler adalah pukul 15.00 WIB. Pesanan sebelum cut-off dipastikan berangkat di hari yang sama.";
      } else if (lower.includes("grosir") || lower.includes("diskon") || lower.includes("sajadah")) {
        detectedIntent = "Intent: Skema Grosir B2B";
        detectedEntities = [
          { label: "MINIMAL ORDER", value: "20 Pcs (1 Kodi)" },
          { label: "POTONGAN", value: "Diskon 15% + Pouch Gratis" },
        ];
        replyText = "Hasil Prediksi Backend: Untuk kuantiti 20 pcs ke atas, sistem mengizinkan diskon grosir 15% plus bonus pouch sajadah per buah.";
      }

      const agentReply: Message = {
        id: `msg-${Date.now()}-agent`,
        senderId: "ai-bot",
        senderName: "AI Assistant Toko Husin",
        senderRole: "agent",
        text: replyText,
        timestamp: timeString,
        isIncoming: false,
        status: "read",
        detectedIntent,
        detectedEntities,
      };

      setChatSessions((latest) =>
        latest.map((c) => {
          if (c.id === activeChat.id) {
            return {
              ...c,
              lastMessage: replyText,
              lastMessageTime: timeString,
              updatedAt: new Date().toISOString(),
              messages: [...c.messages, agentReply],
            };
          }
          return c;
        })
      );

      // Stop AI Typing indicator
      setIsAiTyping(false);
    }, 1200);
  };

  // Filter & Sort computation
  const sortedAndFilteredSessions = useMemo(() => {
    // 1. Filter
    const filtered = chatSessions.filter((session) => {
      const matchSearch =
        session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus =
        statusFilter === "all" ? true : session.status === statusFilter;

      return matchSearch && matchStatus;
    });

    // 2. Sort
    return [...filtered].sort((a, b) => {
      if (sortOption === "priority") {
        const priorityWeight: Record<ChatPriority, number> = {
          high: 3,
          medium: 2,
          low: 1,
        };
        const diff = priorityWeight[b.priority] - priorityWeight[a.priority];
        if (diff !== 0) return diff;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }

      if (sortOption === "newest") {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }

      if (sortOption === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }

      if (sortOption === "date") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }

      return 0;
    });
  }, [chatSessions, searchQuery, statusFilter, sortOption]);

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        isAuthenticated,
        currentUser,
        currentRole,
        login,
        logout,
        switchRole,
        isSidebarOpen,
        setIsSidebarOpen,
        toggleSidebar,
        chatSessions,
        activeChatId,
        activeChat,
        setActiveChatId,
        createNewChat,
        sendMessage,
        isAiTyping,
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
        // Aliases for compatibility
        contacts: chatSessions,
        activeContact: activeChat,
        activeContactId: activeChatId,
        setActiveContactId: setActiveChatId,
        filteredContacts: sortedAndFilteredSessions,
        selectedPlatformFilter,
        setSelectedPlatformFilter,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
