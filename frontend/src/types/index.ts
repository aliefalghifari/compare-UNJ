export type UserRole = "customer" | "cs" | "owner";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleLabel: string;
  avatar: string;
  isOnline: boolean;
  storeName?: string;
  description?: string;
}

export type MessageStatus = "sent" | "delivered" | "read";
export type MessageSender = "cs" | "ai_bot" | "customer" | "agent";

export interface MessageProductAttachment {
  title: string;
  price: string;
  stock: number;
  imageUrl?: string;
  sku?: string;
}

export interface Message {
  id: string;
  sessionId?: string;
  senderId?: string;
  senderName: string;
  senderRole: MessageSender;
  text: string;
  timestamp: string;
  isIncoming: boolean; // false = CS / User; true = external
  status: MessageStatus;
  detectedIntent?: string;
  confidenceScore?: number;
  detectedEntities?: { label: string; value: string }[];
  attachment?: {
    type: "product" | "image" | "file";
    product?: MessageProductAttachment;
    fileName?: string;
    fileSize?: string;
  };
}

export const CHAT_PLATFORMS = [
  "Shopee",
  "TikTok Shop",
  "Tokopedia",
  "Lazada",
  "WhatsApp",
  "Instagram",
] as const;

export type DisplayPlatformType = (typeof CHAT_PLATFORMS)[number];

export type SupabasePlatformType =
  | "shopee"
  | "tokopedia"
  | "tiktok_shop"
  | "lazada"
  | "whatsapp"
  | "instagram";

export type PlatformType = DisplayPlatformType | SupabasePlatformType;
export type ChatPriority = "high" | "medium" | "low";
export type ChatStatus = "active" | "resolved";
export type SortOption = "priority" | "newest" | "oldest" | "date";

// Database Record in Supabase chat_sessions
export interface SupabaseChatSession {
  id: string;
  title: string;
  platform: SupabasePlatformType;
  priority: ChatPriority;
  status: ChatStatus;
  created_at: string;
  updated_at: string;
}

// Database Record in Supabase chat_messages
export interface SupabaseChatMessage {
  id: string;
  session_id: string;
  sender: "cs" | "ai_bot";
  message_text: string;
  detected_intent: string | null;
  confidence_score: number | null;
  extracted_entities: { label: string; value: string }[] | null;
  created_at: string;
}

// UI Chat Session with messages attached
export interface ChatSession {
  id: string;
  title: string;
  customerName: string;
  customerAvatar: string;
  platform: PlatformType;
  platformBadgeColor: string;
  priority: ChatPriority;
  status: ChatStatus;
  isOnline: boolean;
  unreadCount: number;
  pinned?: boolean;
  lastMessage: string;
  lastMessageTime: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
  orderInfo?: {
    orderId: string;
    productName: string;
    totalAmount: string;
    status: string;
  };
  tags?: string[];
}

// Backward compatibility alias
export type ChatContact = ChatSession;
