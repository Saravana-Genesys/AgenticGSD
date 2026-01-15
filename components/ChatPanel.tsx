'use client';

import React from 'react';
import { type ChatMessage, type Message } from '@/lib/types';

interface ChatPanelProps {
  messages: ChatMessage[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ messages, messagesEndRef }) => {
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex flex-col h-full glass-effect rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-genesys-orange/10">
        <h3 className="text-lg font-semibold text-white">AgenticGSD</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-600 text-center text-sm">
              Click "Start Call" to begin
            </p>
          </div>
        ) : (
          messages.map((message) => {
            if ('type' in message && message.type === 'transfer') {
              // Hide transfer indicators for generic UI
              return null;
            } else {
              // TypeScript type narrowing: we know this is a Message, not TransferMessage
              const msg = message as Message;
              const isUser = msg.role === 'user';

              return (
                <div
                  key={msg.id}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                      isUser
                        ? 'genesys-gradient text-white rounded-br-md'
                        : 'bg-dark-accent text-gray-100 rounded-bl-md'
                    }`}
                  >
                    {!isUser && (
                      <div
                        className="text-xs font-medium mb-1 text-genesys-orange"
                      >
                        AgenticGSD
                      </div>
                    )}
                    <div className="text-sm leading-relaxed">{msg.content}</div>
                    <div className={`text-xs mt-1 ${isUser ? 'text-white/60' : 'text-gray-500'}`}>
                      {formatTime(msg.timestamp)}
                    </div>
                  </div>
                </div>
              );
            }
          })
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
