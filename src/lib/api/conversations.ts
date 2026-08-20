// src/lib/api/conversations.ts
// Client for /api/conversations — the Pincer memory backend's stored
// exchanges. Plain async functions (no react-query) because Chat.tsx drives
// its state imperatively around a streaming loop.

import { apiFetch } from "@/lib/api/voice";

export interface ConversationMessage {
  role: "user" | "assistant" | string;
  content: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  category: string;
  tags: string[];
  preview: string;
  messages: ConversationMessage[];
  created_at: string;
}

export interface ConversationList {
  conversations: Conversation[];
  total?: number;
  limit: number;
  offset: number;
}

export function listConversations(userId: string, limit = 20): Promise<ConversationList> {
  return apiFetch(`/api/conversations?user_id=${encodeURIComponent(userId)}&limit=${limit}`);
}

export function getConversation(convId: string): Promise<Conversation> {
  return apiFetch(`/api/conversations/${encodeURIComponent(convId)}`);
}
