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

export interface MessageProductAttachment {
  title: string;
  price: string;
  stock: number;
  imageUrl?: string;
  sku?: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: "customer" | "cs" | "agent" | "system";
  text: string;
  timestamp: string;
  isIncoming: boolean; // Incoming = from customer / external; false = from user / CS / assistant
  status: MessageStatus;
  detectedIntent?: string;
  detectedEntities?: { label: string; value: string }[];
  attachment?: {
    type: "product" | "image" | "file";
    product?: MessageProductAttachment;
    fileName?: string;
    fileSize?: string;
  };
}

export type PlatformType = "Shopee" | "TikTok Shop" | "Lazada" | "WhatsApp";
export type ChatPriority = "high" | "medium" | "low";
export type ChatStatus = "active" | "resolved";
export type SortOption = "priority" | "newest" | "oldest" | "date";

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
  createdAt: string; // ISO string or timestamp
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
