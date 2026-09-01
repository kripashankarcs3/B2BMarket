import { api, type ApiResponse } from './api-client';
import type { Chat, Message } from '@/types';

export interface SendMessageRequest {
  conversationId: string;
  content: string;
  type?: 'text' | 'image' | 'file';
  fileUrl?: string;
}

export const messagesService = {
  async getConversations(): Promise<Chat[]> {
    const response = await api.get<ApiResponse<Chat[]>>('/api/messages/conversations');
    return response.data;
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    const response = await api.get<ApiResponse<Message[]>>(`/api/messages/conversations/${conversationId}`);
    return response.data;
  },

  async send(data: SendMessageRequest): Promise<Message> {
    const response = await api.post<ApiResponse<Message>>('/api/messages', data);
    return response.data;
  },

  async createConversation(supplierId: string, productId?: string): Promise<Chat> {
    const response = await api.post<ApiResponse<Chat>>('/api/messages/conversations', { supplierId, productId });
    return response.data;
  },
};
