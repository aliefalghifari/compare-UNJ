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
  senderRole: UserRole;
  text: string;
  timestamp: string;
  isIncoming: boolean; // relative to the current perspective
  status: MessageStatus;
  attachment?: {
    type: "product" | "image" | "file";
    product?: MessageProductAttachment;
    fileName?: string;
    fileSize?: string;
  };
}

export type PlatformType = "Shopee" | "TikTok Shop" | "Lazada" | "WhatsApp";

export interface ChatContact {
  id: string;
  name: string;
  avatar: string;
  platform: PlatformType;
  platformBadgeColor: string;
  isOnline: boolean;
  statusText: string;
  unreadCount: number;
  pinned?: boolean;
  lastMessage: string;
  lastMessageTime: string;
  messages: Message[];
  orderInfo?: {
    orderId: string;
    productName: string;
    totalAmount: string;
    status: string;
  };
}

