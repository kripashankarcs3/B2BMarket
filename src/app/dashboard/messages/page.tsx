'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageCircle, ChevronRight } from 'lucide-react';
import { useConversations } from '@/hooks/useMessages';
import { useAuth } from '@/contexts/auth-context';
import { ChatWindow } from '@/components/chat';
import { cn, formatRelativeTime } from '@/lib/utils';

export default function MessagesPage() {
  const { user } = useAuth();
  const { data: chats = [], isLoading } = useConversations();
  const [activeChat, setActiveChat] = useState<string | null>(chats[0]?.id || null);

  const currentChat = chats.find((c) => c.id === activeChat);

  if (isLoading) {
    return (
      <div className="pt-28 pb-16 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-24 sm:pt-28 pb-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Link href="/dashboard" className="text-sm text-ink-400 hover:text-brand-600 transition-smooth inline-flex items-center gap-1 mb-4">
            <ChevronRight size={14} className="rotate-180" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-ink-900">Messages</h1>
          <p className="text-sm text-ink-400 mt-1">Chat with suppliers</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white border border-ink-100 rounded-[16px] elev-sm overflow-hidden">
              <div className="p-4 border-b border-ink-100">
                <h3 className="text-sm font-semibold text-ink-900">Conversations</h3>
              </div>
              <div className="divide-y divide-ink-50 max-h-[600px] overflow-y-auto">
                {chats.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <MessageCircle size={24} className="mx-auto text-ink-200 mb-2" />
                    <p className="text-sm text-ink-400">No conversations yet</p>
                  </div>
                ) : (
                  chats.map((chat) => {
                    const otherParticipant = chat.participants.find((p) => p.id !== user?.id);
                    return (
                      <button
                        key={chat.id}
                        onClick={() => setActiveChat(chat.id)}
                        className={cn(
                          'w-full text-left p-4 hover:bg-ink-50 transition-smooth',
                          activeChat === chat.id && 'bg-brand-600/5'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-ink-50 flex items-center justify-center overflow-hidden shrink-0">
                            {otherParticipant?.avatar ? (
                              <img src={otherParticipant.avatar} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-sm font-medium text-ink-500">
                                {otherParticipant?.name?.charAt(0) || '?'}
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-ink-900 truncate">
                                {otherParticipant?.name || 'Unknown'}
                              </p>
                              {chat.lastMessage && (
                                <span className="text-xs text-ink-400 shrink-0 ml-2">
                                  {formatRelativeTime(chat.lastMessage.timestamp)}
                                </span>
                              )}
                            </div>
                            {chat.lastMessage && (
                              <p className="text-xs text-ink-500 truncate mt-0.5">
                                {chat.lastMessage.content}
                              </p>
                            )}
                          </div>
                          {chat.unread > 0 && (
                            <div className="w-5 h-5 rounded-full bg-brand-600 flex items-center justify-center shrink-0">
                              <span className="text-[10px] font-semibold text-white">{chat.unread}</span>
                            </div>
                          )}
                        </div>
                        {chat.productName && (
                          <p className="text-[11px] text-ink-400 mt-2 ml-[52px]">
                            Regarding: {chat.productName}
                          </p>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {currentChat && user ? (
              <ChatWindow chat={currentChat} currentUserId={user.id} />
            ) : (
              <div className="bg-white border border-ink-100 rounded-[16px] elev-sm p-12 text-center h-full flex items-center justify-center">
                <div>
                  <MessageCircle size={40} className="mx-auto text-ink-200 mb-4" />
                  <h3 className="text-base font-semibold text-ink-900 mb-1">Select a conversation</h3>
                  <p className="text-sm text-ink-400">Choose a conversation to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
