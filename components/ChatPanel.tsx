'use client';

import React from 'react';
import { AGENTS, type ChatMessage, type AgentName } from '@/lib/types';
import { ArrowRight } from 'lucide-react';

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

  const getAgentData = (agentName: string | undefined) => {
    if (agentName && (agentName === 'Ram' || agentName === 'Sam')) {
      return AGENTS[agentName as AgentName];
    }
    return AGENTS['Ram'];
  };

  return (
    <div className="flex flex-col h-full glass-effect rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-genesys-orange/10">
        <h3 className="text-lg font-semibold text-white">Conversation</h3>
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
              const fromAgent = getAgentData(message.from);
              const toAgent = getAgentData(message.to);
              return (
                <div
                  key={message.id}
                  className="flex items-center justify-center gap-2 py-2 text-xs text-gray-500"
                >
                  <span style={{ color: fromAgent.color }}>{message.from}</span>
                  <ArrowRight size={12} className="text-genesys-orange" />
                  <span style={{ color: toAgent.color }}>{message.to}</span>
                </div>
              );
            } else {
              const isUser = message.role === 'user';
              const agent = getAgentData(message.agent);

              return (
                <div
                  key={message.id}
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
                        className="text-xs font-medium mb-1"
                        style={{ color: agent.color }}
                      >
                        {agent.name}
                      </div>
                    )}
                    <div className="text-sm leading-relaxed">{message.content}</div>
                    <div className={`text-xs mt-1 ${isUser ? 'text-white/60' : 'text-gray-500'}`}>
                      {formatTime(message.timestamp)}
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
