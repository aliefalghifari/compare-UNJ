"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ChatContact, Message, UserProfile, UserRole } from "@/types";
import { INITIAL_CONTACTS, MOCK_USERS } from "@/data/mock-data";

interface AppContextType {
  // Theme state
  theme: "light" | "dark";
  toggleTheme: () => void;

  // Auth state
  isAuthenticated: boolean;
  currentUser: UserProfile;
  currentRole: UserRole;
  login: (role: UserRole, email?: string) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;

  // Chat state
  contacts: ChatContact[];
  activeContactId: string;
  activeContact: ChatContact | undefined;
  setActiveContactId: (id: string) => void;
  sendMessage: (text: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedPlatformFilter: string;
  setSelectedPlatformFilter: (platform: string) => void;
  filteredContacts: ChatContact[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Theme state with lazy initialization to prevent setState in effect
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

  // Sync theme with document element
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    try {
      localStorage.setItem("app_theme", nextTheme);
    } catch {
      // ignore in environments with restricted storage
    }
  };

  // State Login / Auth
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentRole, setCurrentRole] = useState<UserRole>("cs");
  const [customEmail, setCustomEmail] = useState<string | null>(null);

  // Derived current user based on current role and custom email
  const currentUser: UserProfile = {
    ...MOCK_USERS[currentRole],
    ...(customEmail ? { email: customEmail } : {}),
  };

  // Contacts and active conversation
  const [contacts, setContacts] = useState<ChatContact[]>(INITIAL_CONTACTS);
  const [activeContactId, setActiveContactId] = useState<string>("contact-1");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPlatformFilter, setSelectedPlatformFilter] = useState<string>("all");

  const login = (role: UserRole, email?: string) => {
    setCurrentRole(role);
    if (email && email.trim()) {
      setCustomEmail(email.trim());
    } else {
      setCustomEmail(null);
    }
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
  };

  const activeContact = contacts.find((c) => c.id === activeContactId) || contacts[0];

  // Mark as read when selecting contact
  const handleSelectContact = (id: string) => {
    setActiveContactId(id);
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
    );
  };

  // Send message locally
  const sendMessage = (text: string) => {
    if (!text.trim() || !activeContact) return;

    const now = new Date();
    const timeString = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      text: text.trim(),
      timestamp: timeString,
      isIncoming: false, // User sending the message
      status: "delivered",
    };

    setContacts((prevContacts) =>
      prevContacts.map((contact) => {
        if (contact.id === activeContact.id) {
          return {
            ...contact,
            lastMessage: text.trim(),
            lastMessageTime: timeString,
            messages: [...contact.messages, newMessage],
          };
        }
        return contact;
      })
    );

    // Simulated reply for CS/Owner view
    if (currentUser.role === "cs" || currentUser.role === "owner") {
      setTimeout(() => {
        const simulatedReply: Message = {
          id: `reply-${Date.now()}`,
          senderId: activeContact.id,
          senderName: activeContact.name,
          senderRole: "customer",
          text: "Baik kak, terima kasih banyak atas respon cepatnya! 🙏",
          timestamp: timeString,
          isIncoming: true,
          status: "read",
        };

        setContacts((latest) =>
          latest.map((c) => {
            if (c.id === activeContact.id) {
              return {
                ...c,
                lastMessage: simulatedReply.text,
                lastMessageTime: timeString,
                messages: [...c.messages, simulatedReply],
              };
            }
            return c;
          })
        );
      }, 1500);
    }
  };

  // Filtered contacts based on search query and platform tab
  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPlatform =
      selectedPlatformFilter === "all" ||
      contact.platform.toLowerCase() === selectedPlatformFilter.toLowerCase() ||
      (selectedPlatformFilter === "unread" && contact.unreadCount > 0);

    return matchesSearch && matchesPlatform;
  });

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
        contacts,
        activeContactId,
        activeContact,
        setActiveContactId: handleSelectContact,
        sendMessage,
        searchQuery,
        setSearchQuery,
        selectedPlatformFilter,
        setSelectedPlatformFilter,
        filteredContacts,
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
