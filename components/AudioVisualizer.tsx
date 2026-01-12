'use client';

import React from 'react';
import { AGENTS, type AgentName } from '@/lib/types';

interface AudioVisualizerProps {
  currentAgent: AgentName;
  isSpeaking: boolean;
  audioLevel?: number;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  currentAgent,
  isSpeaking,
}) => {
  const agent = AGENTS[currentAgent];
  const bars = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="flex flex-col items-center justify-center h-full glass-effect rounded-xl p-6">
      {/* Agent Avatar */}
      <div 
        className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${
          isSpeaking ? 'scale-110 shadow-2xl' : ''
        }`}
        style={{ 
          backgroundColor: agent.color,
          boxShadow: isSpeaking ? `0 0 40px ${agent.color}50` : 'none'
        }}
      >
        <span className="text-3xl font-bold text-white">{currentAgent[0]}</span>
      </div>

      {/* Agent Name */}
      <h3 className="text-2xl font-bold mb-1" style={{ color: agent.color }}>
        {agent.name}
      </h3>
      <p className="text-sm text-gray-500 mb-8">{agent.role}</p>

      {/* Audio Wave Visualizer */}
      <div className="flex items-end justify-center gap-1 h-20 mb-6">
        {bars.map((i) => {
          const baseHeight = 15;
          const height = isSpeaking
            ? baseHeight + Math.random() * 65
            : baseHeight;
          const delay = i * 0.03;
          
          return (
            <div
              key={i}
              className="w-1.5 rounded-full transition-all"
              style={{
                height: `${height}%`,
                backgroundColor: agent.color,
                opacity: isSpeaking ? 0.6 + Math.random() * 0.4 : 0.25,
                transitionDuration: isSpeaking ? '100ms' : '300ms',
                animationDelay: `${delay}s`,
              }}
            />
          );
        })}
      </div>

      {/* Status */}
      <div className="flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full ${isSpeaking ? 'animate-pulse' : ''}`}
          style={{ backgroundColor: isSpeaking ? agent.color : '#666' }}
        />
        <span className="text-sm text-gray-400">
          {isSpeaking ? 'Speaking...' : 'Listening...'}
        </span>
      </div>
    </div>
  );
};
