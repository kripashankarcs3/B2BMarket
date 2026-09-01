'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messagesService } from '@/lib/services/messages.service';

export function useConversations() {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: () => messagesService.getConversations(),
    staleTime: 15_000,
  });
}

export function useConversationMessages(conversationId: string | null) {
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => messagesService.getMessages(conversationId!),
    enabled: !!conversationId,
    staleTime: 10_000,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: messagesService.send,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}
