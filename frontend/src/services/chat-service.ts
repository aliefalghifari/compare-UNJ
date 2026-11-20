import { supabase } from "@/lib/supabase";
import {
  ChatPriority,
  ChatSession,
  ChatStatus,
  Message,
  PlatformType,
  SupabaseChatMessage,
  SupabaseChatSession,
  SupabasePlatformType,
} from "@/types";

// Helper to normalize platform name for display
export function formatPlatformName(platform: string): string {
  switch (platform?.toLowerCase()) {
    case "shopee":
      return "Shopee";
    case "tiktok_shop":
    case "tiktok":
      return "TikTok Shop";
    case "tokopedia":
      return "Tokopedia";
    case "lazada":
      return "Lazada";
    case "whatsapp":
      return "WhatsApp";
    case "instagram":
      return "Instagram";
    default:
      return "Shopee";
  }
}

// Helper to normalize platform for Supabase enum
export function toSupabasePlatform(platform: string): SupabasePlatformType {
  const p = platform?.toLowerCase().replace(/\s+/g, "_") || "";
  if (p === "tokopedia") return "tokopedia";
  if (p.includes("tiktok")) return "tiktok_shop";
  if (p === "lazada") return "lazada";
  if (p === "whatsapp") return "whatsapp";
  if (p === "instagram") return "instagram";
  return "shopee";
}

// Helper for platform badge color
export function getPlatformBadgeColor(platform: string): string {
  switch (platform?.toLowerCase()) {
    case "shopee":
      return "bg-orange-500/10 text-orange-600 border border-orange-200 dark:border-orange-900/40";
    case "tiktok_shop":
    case "tiktok":
      return "bg-neutral-900/10 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700";
    case "tokopedia":
      return "bg-emerald-500/10 text-emerald-600 border border-emerald-200 dark:border-emerald-900/40";
    case "lazada":
      return "bg-blue-500/10 text-blue-600 border border-blue-200 dark:border-blue-900/40";
    case "whatsapp":
      return "bg-emerald-500/10 text-emerald-600 border border-emerald-200 dark:border-emerald-900/40";
    case "instagram":
      return "bg-pink-500/10 text-pink-600 border border-pink-200 dark:border-pink-900/40";
    default:
      return "bg-slate-500/10 text-slate-600 border border-slate-200";
  }
}

// Helper to format ISO time to HH:mm
export function formatTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    return `${String(d.getHours()).padStart(2, "0")}:${String(
      d.getMinutes()
    ).padStart(2, "0")}`;
  } catch {
    return "Baru saja";
  }
}

/**
 * 1. GET ALL CHAT SESSIONS (Read)
 * Fetches all sessions from Supabase chat_sessions along with their messages
 */
export async function getChatSessions(): Promise<ChatSession[]> {
  const { data, error } = await supabase
    .from("chat_sessions")
    .select(`
      *,
      chat_messages (*)
    `)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching chat sessions from Supabase:", error);
    throw error;
  }

  if (!data || data.length === 0) {
    return [];
  }

  return (data as (SupabaseChatSession & { chat_messages?: SupabaseChatMessage[] })[]).map((row) => {
    const rawMsgs = (row.chat_messages || []).sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    const messages: Message[] = rawMsgs.map((msg) => ({
      id: msg.id,
      sessionId: msg.session_id,
      senderId: msg.sender === "cs" ? "user-cs-1" : "ai-bot",
      senderName: msg.sender === "cs" ? "Ahmad Rizky (CS)" : "AI Assistant Toko Husin",
      senderRole: msg.sender === "cs" ? "cs" : "agent",
      text: msg.message_text,
      timestamp: formatTime(msg.created_at),
      isIncoming: false,
      status: "read",
      detectedIntent: msg.detected_intent || undefined,
      confidenceScore: msg.confidence_score ? Number(msg.confidence_score) : undefined,
      detectedEntities: msg.extracted_entities || undefined,
    }));

    const lastMsg = messages[messages.length - 1];

    return {
      id: row.id,
      title: row.title || "Sesi Chat Baru",
      customerName: `Pengujian CS (${formatPlatformName(row.platform)})`,
      customerAvatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      platform: formatPlatformName(row.platform) as PlatformType,
      platformBadgeColor: getPlatformBadgeColor(row.platform),
      priority: row.priority || "medium",
      status: row.status || "active",
      isOnline: true,
      unreadCount: 0,
      pinned: row.priority === "high",
      lastMessage: lastMsg ? lastMsg.text : "Sesi terhubung dengan database Supabase.",
      lastMessageTime: lastMsg ? lastMsg.timestamp : formatTime(row.updated_at || row.created_at),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      messages,
      tags: [formatPlatformName(row.platform), row.priority],
    };
  });
}

/**
 * 2. CREATE CHAT SESSION (Create)
 * Inserts a new record into Supabase chat_sessions
 */
export async function createChatSession(payload: {
  title?: string;
  platform?: PlatformType | SupabasePlatformType;
  priority?: ChatPriority;
  status?: ChatStatus;
}): Promise<ChatSession> {
  const sbPlatform = toSupabasePlatform(payload.platform || "shopee");
  const priority = payload.priority || "medium";
  const status = payload.status || "active";
  const title = payload.title || `Pengujian Sesi #${Math.floor(1000 + Math.random() * 9000)}`;

  const { data, error } = await supabase
    .from("chat_sessions")
    .insert({
      title,
      platform: sbPlatform,
      priority,
      status,
    })
    .select()
    .single();

  if (error || !data) {
    console.error("Error creating chat session in Supabase:", error);
    throw error;
  }

  const row = data as SupabaseChatSession;

  return {
    id: row.id,
    title: row.title,
    customerName: `Pengujian CS (${formatPlatformName(row.platform)})`,
    customerAvatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    platform: formatPlatformName(row.platform) as PlatformType,
    platformBadgeColor: getPlatformBadgeColor(row.platform),
    priority: row.priority,
    status: row.status,
    isOnline: true,
    unreadCount: 0,
    pinned: row.priority === "high",
    lastMessage: "Sesi chat baru dibuat di Supabase.",
    lastMessageTime: formatTime(row.created_at),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    messages: [],
    tags: [formatPlatformName(row.platform), row.priority],
  };
}

/**
 * 3. UPDATE CHAT SESSION (Update)
 * Updates fields of a chat session in Supabase
 */
export async function updateChatSession(
  id: string,
  updates: {
    title?: string;
    priority?: ChatPriority;
    status?: ChatStatus;
    platform?: PlatformType | SupabasePlatformType;
  }
): Promise<SupabaseChatSession> {
  const payload: Partial<{
    title: string;
    priority: ChatPriority;
    status: ChatStatus;
    platform: SupabasePlatformType;
    updated_at: string;
  }> = {
    updated_at: new Date().toISOString(),
  };

  if (updates.title !== undefined) payload.title = updates.title;
  if (updates.priority !== undefined) payload.priority = updates.priority;
  if (updates.status !== undefined) payload.status = updates.status;
  if (updates.platform !== undefined) payload.platform = toSupabasePlatform(updates.platform);

  const { data, error } = await supabase
    .from("chat_sessions")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating chat session ${id} in Supabase:`, error);
    throw error;
  }

  return data as SupabaseChatSession;
}

/**
 * 4. DELETE CHAT SESSION (Delete)
 * Deletes a chat session and associated messages
 */
export async function deleteChatSession(id: string): Promise<void> {
  await supabase.from("chat_messages").delete().eq("session_id", id);
  const { error } = await supabase.from("chat_sessions").delete().eq("id", id);

  if (error) {
    console.error(`Error deleting chat session ${id} from Supabase:`, error);
    throw error;
  }
}

/**
 * 5. GET MESSAGES FOR A SESSION
 */
export async function getChatMessages(sessionId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error(`Error fetching messages for session ${sessionId}:`, error);
    throw error;
  }

  if (!data || data.length === 0) {
    return [];
  }

  return (data as SupabaseChatMessage[]).map((msg) => ({
    id: msg.id,
    sessionId: msg.session_id,
    senderId: msg.sender === "cs" ? "user-cs-1" : "ai-bot",
    senderName: msg.sender === "cs" ? "Ahmad Rizky (CS)" : "AI Assistant Toko Husin",
    senderRole: msg.sender === "cs" ? "cs" : "agent",
    text: msg.message_text,
    timestamp: formatTime(msg.created_at),
    isIncoming: false,
    status: "read",
    detectedIntent: msg.detected_intent || undefined,
    confidenceScore: msg.confidence_score ? Number(msg.confidence_score) : undefined,
    detectedEntities: msg.extracted_entities || undefined,
  }));
}

/**
 * 6. INSERT A MESSAGE
 */
export async function insertChatMessage(payload: {
  sessionId: string;
  sender: "cs" | "ai_bot";
  messageText: string;
  detectedIntent?: string;
  confidenceScore?: number;
  extractedEntities?: { label: string; value: string }[];
}): Promise<Message> {
  const { data, error } = await supabase
    .from("chat_messages")
    .insert({
      session_id: payload.sessionId,
      sender: payload.sender,
      message_text: payload.messageText,
      detected_intent: payload.detectedIntent || null,
      confidence_score: payload.confidenceScore || null,
      extracted_entities: payload.extractedEntities || [],
    })
    .select()
    .single();

  if (error || !data) {
    console.error("Error inserting chat message to Supabase:", error);
    throw error;
  }

  // Update session updated_at
  await supabase
    .from("chat_sessions")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", payload.sessionId);

  const msg = data as SupabaseChatMessage;

  return {
    id: msg.id,
    sessionId: msg.session_id,
    senderId: msg.sender === "cs" ? "user-cs-1" : "ai-bot",
    senderName: msg.sender === "cs" ? "Ahmad Rizky (CS)" : "AI Assistant Toko Husin",
    senderRole: msg.sender === "cs" ? "cs" : "agent",
    text: msg.message_text,
    timestamp: formatTime(msg.created_at),
    isIncoming: false,
    status: "read",
    detectedIntent: msg.detected_intent || undefined,
    confidenceScore: msg.confidence_score ? Number(msg.confidence_score) : undefined,
    detectedEntities: msg.extracted_entities || undefined,
  };
}

/**
 * 7. SEED INITIAL SESSIONS (if Supabase chat_sessions table is empty)
 */
export async function seedInitialSessionsIfEmpty(
  initialData: ChatSession[]
): Promise<ChatSession[]> {
  try {
    const existing = await getChatSessions();
    if (existing.length > 0) {
      return existing;
    }

    console.log("Supabase chat_sessions is empty. Seeding initial data...");

    for (const session of initialData) {
      const created = await createChatSession({
        title: session.title,
        platform: session.platform,
        priority: session.priority,
        status: session.status,
      });

      for (const msg of session.messages) {
        await insertChatMessage({
          sessionId: created.id,
          sender: msg.senderRole === "cs" ? "cs" : "ai_bot",
          messageText: msg.text,
          detectedIntent: msg.detectedIntent,
          confidenceScore: 0.95,
          extractedEntities: msg.detectedEntities,
        });
      }
    }

    return await getChatSessions();
  } catch (err) {
    console.error("Error seeding initial sessions to Supabase:", err);
    return [];
  }
}
