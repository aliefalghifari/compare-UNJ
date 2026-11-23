"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import {
  CHAT_PLATFORMS,
  ChatPriority,
  ChatSession,
  ChatStatus,
  Message,
  PlatformType,
  SortOption,
  UserProfile,
  UserRole,
} from "@/types";
import { INITIAL_CHAT_SESSIONS, MOCK_USERS } from "@/data/mock-data";
import { showToast } from "@/lib/alerts";
import {
  createChatSession,
  deleteChatSession,
  formatTime,
  getPlatformBadgeColor,
  insertChatMessage,
  seedInitialSessionsIfEmpty,
  updateChatSession,
} from "@/services/chat-service";
import {
  buildAiReplyText,
  mapEntitiesToFrontend,
  pickTopIntent,
  predictIntent,
} from "@/services/backend-service";

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
  createNewChat: () => Promise<void>;
  sendMessage: (text: string) => Promise<void>;
  isLoadingSessions: boolean;

  // AI typing indicator
  isAiTyping: boolean;

  // Management operations with SweetAlert2 notifications
  updatePriority: (id: string, priority: ChatPriority, notify?: boolean) => Promise<void>;
  updateStatus: (id: string, status: ChatStatus, notify?: boolean) => Promise<void>;
  renameChat: (id: string, newTitle: string, notify?: boolean) => Promise<void>;
  deleteChat: (id: string, notify?: boolean) => Promise<void>;

  // Sort & Filter state
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: "all" | "active" | "resolved";
  setStatusFilter: (filter: "all" | "active" | "resolved") => void;
  dateRange: { from: string | null; to: string | null };
  setDateRange: (range: { from: string | null; to: string | null }) => void;

  // Processed sessions list
  sortedAndFilteredSessions: ChatSession[];

  // Backward compatibility alias for existing code
  contacts: ChatSession[];
  activeContact: ChatSession | undefined;
  activeContactId: string;
  setActiveContactId: (id: string) => void;
  filteredContacts: ChatSession[];
  selectedPlatformFilter: PlatformType | "all";
  setSelectedPlatformFilter: (platform: PlatformType | "all") => void;
  updatePlatform: (id: string, platform: PlatformType) => Promise<void>;
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
  const [activeChatId, setActiveChatId] = useState<string>(INITIAL_CHAT_SESSIONS[0]?.id || "chat-1");
  const [isLoadingSessions, setIsLoadingSessions] = useState<boolean>(true);

  // Load chat sessions from Supabase on mount
  useEffect(() => {
    let isMounted = true;

    async function initializeSupabaseSessions() {
      try {
        setIsLoadingSessions(true);
        // Seeds initial sessions if Supabase table is completely empty
        const sessions = await seedInitialSessionsIfEmpty(INITIAL_CHAT_SESSIONS);
        if (isMounted && sessions && sessions.length > 0) {
          setChatSessions(sessions);
          setActiveChatId(sessions[0].id);
        }
      } catch (err) {
        console.error("Error connecting to Supabase chat sessions:", err);
      } finally {
        if (isMounted) {
          setIsLoadingSessions(false);
        }
      }
    }

    initializeSupabaseSessions();

    return () => {
      isMounted = false;
    };
  }, []);

  // AI typing status
  const [isAiTyping, setIsAiTyping] = useState<boolean>(false);

  // Sort & Filter state
  const [sortOption, setSortOption] = useState<SortOption>("priority");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "resolved">("all");
  const [dateRange, setDateRange] = useState<{ from: string | null; to: string | null }>({ from: null, to: null });
  const [selectedPlatformFilter, setSelectedPlatformFilter] = useState<PlatformType | "all">("all");

  const activeChat = chatSessions.find((s) => s.id === activeChatId) || chatSessions[0];

  // 1. Create New Chat session (Create)
  const createNewChat = async () => {
    try {
      const newTitle = `Pengujian Sesi #${Math.floor(1000 + Math.random() * 9000)}`;

      // Insert into Supabase chat_sessions
      const newSession = await createChatSession({
        title: newTitle,
        platform: "shopee",
        priority: "medium",
        status: "active",
      });

      // Insert initial welcome message into Supabase chat_messages
      const welcomeMsg = await insertChatMessage({
        sessionId: newSession.id,
        sender: "ai_bot",
        messageText:
          "Halo Mas Ahmad (CS)! Backend AI Assistant Toko Husin siap menguji intent klasifikasi produk, SOP garansi keluhan, dan rekomendasi respons cepat. Silakan masukkan query percakapan.",
      });

      newSession.messages = [welcomeMsg];
      newSession.lastMessage = welcomeMsg.text;
      newSession.lastMessageTime = welcomeMsg.timestamp;

      setChatSessions((prev) => [newSession, ...prev]);
      setActiveChatId(newSession.id);
      showToast({ icon: "success", title: "Sesi Pengujian Baru Berhasil Dibuat!" });
    } catch (err) {
      console.error("Error creating chat session in Supabase:", err);
      showToast({ icon: "error", title: "Gagal membuat sesi di database" });
    }
  };

  // 2. Update Priority (Update)
  const updatePriority = async (id: string, priority: ChatPriority, notify = true) => {
    // Optimistic UI update
    setChatSessions((prev) =>
      prev.map((chat) => (chat.id === id ? { ...chat, priority } : chat))
    );
    if (notify) {
      const priorityLabel =
        priority === "high"
          ? "High (Tinggi)"
          : priority === "medium"
          ? "Medium (Sedang)"
          : "Low (Rendah)";
      showToast({ icon: "info", title: `Prioritas Diperbarui: ${priorityLabel}` });
    }
    try {
      await updateChatSession(id, { priority });
    } catch (err) {
      console.error("Failed to update priority in Supabase:", err);
    }
  };

  // 3. Update Platform Source
  const updatePlatform = async (id: string, platform: PlatformType) => {
    const badgeColor = getPlatformBadgeColor(platform);

    setChatSessions((prev) =>
      prev.map((chat) =>
        chat.id === id
          ? {
              ...chat,
              platform,
              platformBadgeColor: badgeColor,
              tags: [
                ...(chat.tags ?? []).filter(
                  (tag) => !CHAT_PLATFORMS.includes(tag as (typeof CHAT_PLATFORMS)[number])
                ),
                platform,
              ],
            }
          : chat
      )
    );
    showToast({ icon: "success", title: `Sumber chat diubah ke ${platform}` });
    try {
      await updateChatSession(id, { platform });
    } catch (err) {
      console.error("Failed to update platform in Supabase:", err);
    }
  };

  // 4. Update Status (Update)
  const updateStatus = async (id: string, status: ChatStatus, notify = true) => {
    // Optimistic UI update
    setChatSessions((prev) =>
      prev.map((chat) => (chat.id === id ? { ...chat, status } : chat))
    );
    if (notify) {
      showToast({
        icon: "success",
        title:
          status === "resolved"
            ? "Sesi Ditandai Selesai (Resolved)"
            : "Sesi Dibuka Kembali (Active)",
      });
    }
    try {
      await updateChatSession(id, { status });
    } catch (err) {
      console.error("Failed to update status in Supabase:", err);
    }
  };

  // 5. Rename Chat (Update)
  const renameChat = async (id: string, newTitle: string, notify = true) => {
    if (!newTitle.trim()) return;
    const trimmed = newTitle.trim();
    setChatSessions((prev) =>
      prev.map((chat) => (chat.id === id ? { ...chat, title: trimmed } : chat))
    );
    if (notify) {
      showToast({ icon: "success", title: "Nama Sesi Berhasil Diubah!" });
    }
    try {
      await updateChatSession(id, { title: trimmed });
    } catch (err) {
      console.error("Failed to rename chat in Supabase:", err);
    }
  };

  // 6. Delete Chat (Delete)
  const deleteChat = async (id: string, notify = true) => {
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
    try {
      await deleteChatSession(id);
    } catch (err) {
      console.error("Failed to delete chat in Supabase:", err);
    }
  };

  // 7. Send message from CS to AI Bot
  const sendMessage = async (text: string) => {
    if (!text.trim() || !activeChat) return;

    const trimmedText = text.trim();
    const now = new Date();
    const timeString = formatTime(now.toISOString());

    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      sessionId: activeChat.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: "cs",
      text: trimmedText,
      timestamp: timeString,
      isIncoming: false,
      status: "sent",
    };

    // Optimistically update message feed
    setChatSessions((prev) =>
      prev.map((chat) => {
        if (chat.id === activeChat.id) {
          return {
            ...chat,
            lastMessage: trimmedText,
            lastMessageTime: timeString,
            updatedAt: now.toISOString(),
            messages: [...chat.messages, userMessage],
          };
        }
        return chat;
      })
    );

    // Save CS message in Supabase
    try {
      const savedMsg = await insertChatMessage({
        sessionId: activeChat.id,
        sender: "cs",
        messageText: trimmedText,
      });
      // Update with persistent message ID
      setChatSessions((prev) =>
        prev.map((chat) => {
          if (chat.id === activeChat.id) {
            return {
              ...chat,
              messages: chat.messages.map((m) => (m.id === userMessage.id ? savedMsg : m)),
            };
          }
          return chat;
        })
      );
    } catch (err) {
      console.warn("Could not persist CS message to Supabase:", err);
    }

    // Trigger AI Typing indicator
    setIsAiTyping(true);

    // ── Real Backend AI call ─────────────────────────────────────────────
    try {
      const backendResult = await predictIntent(trimmedText, activeChat.id);

      const replyText = buildAiReplyText(backendResult);
      const detectedIntent = pickTopIntent(backendResult);
      const detectedEntities =
        backendResult.entities.length > 0
          ? mapEntitiesToFrontend(backendResult.entities)
          : undefined;

      let agentReply: Message = {
        id: `temp-agent-${Date.now()}`,
        sessionId: activeChat.id,
        senderId: "ai-bot",
        senderName: "AI Assistant Toko Husin",
        senderRole: "agent",
        text: replyText,
        timestamp: formatTime(new Date().toISOString()),
        isIncoming: false,
        status: "read",
        detectedIntent,
        detectedEntities,
      };

      try {
        const savedAgentMsg = await insertChatMessage({
          sessionId: activeChat.id,
          sender: "ai_bot",
          messageText: replyText,
          detectedIntent,
          confidenceScore: backendResult.intents?.[0]?.confidence ?? 0,
          extractedEntities: detectedEntities,
        });
        agentReply = savedAgentMsg;
      } catch (err) {
        console.warn("Could not persist AI message to Supabase:", err);
      }

      setChatSessions((latest) =>
        latest.map((c) => {
          if (c.id === activeChat.id) {
            return {
              ...c,
              lastMessage: replyText,
              lastMessageTime: agentReply.timestamp,
              updatedAt: new Date().toISOString(),
              messages: [...c.messages, agentReply],
            };
          }
          return c;
        })
      );
    } catch (backendErr) {
      // ── Fallback: backend offline / error ─────────────────────────────
      console.warn("Backend unreachable, using fallback response:", backendErr);

      const fallbackText =
        "⚠️ Backend AI tidak dapat dihubungi saat ini. Silakan coba lagi beberapa saat.";

      const fallbackMsg: Message = {
        id: `temp-agent-${Date.now()}`,
        sessionId: activeChat.id,
        senderId: "ai-bot",
        senderName: "AI Assistant Toko Husin",
        senderRole: "agent",
        text: fallbackText,
        timestamp: formatTime(new Date().toISOString()),
        isIncoming: false,
        status: "read",
        detectedIntent: "Backend Offline",
      };

      setChatSessions((latest) =>
        latest.map((c) => {
          if (c.id === activeChat.id) {
            return {
              ...c,
              lastMessage: fallbackText,
              lastMessageTime: fallbackMsg.timestamp,
              updatedAt: new Date().toISOString(),
              messages: [...c.messages, fallbackMsg],
            };
          }
          return c;
        })
      );
    } finally {
      // Stop AI Typing indicator
      setIsAiTyping(false);
    }
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

      const sessionDate = new Date(session.createdAt);
      const fromDate = dateRange.from ? new Date(`${dateRange.from}T00:00:00`) : null;
      const toDate = dateRange.to ? new Date(`${dateRange.to}T23:59:59.999`) : null;
      const matchDate = (!fromDate || sessionDate >= fromDate) && (!toDate || sessionDate <= toDate);
      const matchPlatform = selectedPlatformFilter === "all" || session.platform === selectedPlatformFilter;

      return matchSearch && matchStatus && matchDate && matchPlatform;
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
  }, [chatSessions, searchQuery, statusFilter, sortOption, dateRange, selectedPlatformFilter]);

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
        isLoadingSessions,
        isAiTyping,
        updatePriority,
        updatePlatform,
        updateStatus,
        renameChat,
        deleteChat,
        sortOption,
        setSortOption,
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        dateRange,
        setDateRange,
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
