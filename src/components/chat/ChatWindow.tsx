'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Paperclip, X, ChevronLeft } from 'lucide-react';
import { cn, formatRelativeTime } from '@/lib/utils';
import type { Chat, Message } from '@/types';

interface ChatWindowProps {
  chat: Chat;
  onClose?: () => void;
  minimized?: boolean;
  currentUserId: string;
}

export function ChatWindow({ chat, onClose, minimized = false, currentUserId }: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState(chat.messages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const msg: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUserId,
      senderName: 'You',
      senderAvatar: '',
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      type: 'text',
    };
    setMessages((prev) => [...prev, msg]);
    setNewMessage('');
  };

  const otherParticipant = chat.participants.find((p) => p.id !== currentUserId);

  return (
    <div className="flex flex-col h-full bg-white rounded-[16px] border border-ink-100 elev overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-ink-100 bg-white">
        {onClose && (
          <button onClick={onClose} className="p-1 rounded-full hover:bg-ink-50 transition-smooth">
            <ChevronLeft size={18} className="text-ink-500" />
          </button>
        )}
        <div className="w-9 h-9 rounded-full bg-ink-100 overflow-hidden shrink-0">
          {otherParticipant?.avatar ? (
            <img src={otherParticipant.avatar} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm font-medium text-ink-500">
              {otherParticipant?.name?.[0] || '?'}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-ink-900 truncate">{otherParticipant?.name}</p>
          {chat.productName && (
            <p className="text-xs text-ink-400 truncate">Re: {chat.productName}</p>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-ink-50/50">
        {messages.map((msg, i) => {
          const isCurrentUser = msg.senderId === currentUserId;
          const showAvatar = i === 0 || messages[i - 1]?.senderId !== msg.senderId;

          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn('flex gap-3', isCurrentUser && 'flex-row-reverse')}
            >
              {showAvatar && (
                <div className={cn('w-8 h-8 rounded-full bg-ink-100 overflow-hidden shrink-0', isCurrentUser && 'order-1')}>
                  {msg.senderAvatar ? (
                    <img src={msg.senderAvatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-medium text-ink-500">
                      {msg.senderName[0]}
                    </div>
                  )}
                </div>
              )}
              {!showAvatar && <div className="w-8 shrink-0" />}
              <div className={cn('max-w-[75%]', isCurrentUser && 'text-right')}>
                {showAvatar && (
                  <p className={cn('text-xs text-ink-400 mb-1', isCurrentUser && 'text-right')}>
                    {msg.senderName}
                  </p>
                )}
                <div
                  className={cn(
                    'px-4 py-2.5 text-sm leading-relaxed',
                    isCurrentUser
                      ? 'bg-brand-600 text-white rounded-[16px] rounded-tr-[4px]'
                      : 'bg-white border border-ink-100 text-ink-900 rounded-[16px] rounded-tl-[4px]'
                  )}
                >
                  {msg.content}
                </div>
                <p className={cn('text-[10px] text-ink-400 mt-1', isCurrentUser && 'text-right')}>
                  {formatRelativeTime(msg.timestamp)}
                </p>
              </div>
            </motion.div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-ink-100">
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full hover:bg-ink-50 transition-smooth">
            <Paperclip size={18} className="text-ink-400" />
          </button>
          <div className="flex-1 flex items-center gap-2 bg-ink-50 rounded-[14px] px-4 py-2">
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Type a message..."
              className="flex-1 text-sm bg-transparent outline-none text-ink-900 placeholder:text-ink-400"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="p-2.5 rounded-full bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
