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
  const bars = Array.from({ length: 28 }, (_, i) => i);

  return (
    <div className="flex flex-col items-center justify-center h-full glass-effect rounded-2xl p-6">
      {/* Generic Avatar */}
      <div 
        className={`w-24 h-24 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 ${
          isSpeaking ? 'scale-110 genesys-glow-strong' : ''
        }`}
        style={{ 
          background: 'linear-gradient(135deg, #FF4F1F 0%, #FF7D5CCC 100%)',
        }}
      >
        <span className="text-4xl font-bold text-white">G</span>
      </div>

      {/* Generic Name */}
      <h3 className="text-2xl font-bold text-genesys-orange mb-1">
        AgenticGSD
      </h3>
      <p className="text-sm text-gray-500 mb-8">AI Support Team</p>

      {/* Audio Wave Visualizer */}
      <div className="flex items-end justify-center gap-1 h-16 mb-6">
        {bars.map((i) => {
          const baseHeight = 12;
          const height = isSpeaking
            ? baseHeight + Math.random() * 70
            : baseHeight;
          
          return (
            <div
              key={i}
              className="w-1 rounded-full transition-all"
              style={{
                height: `${height}%`,
                background: isSpeaking 
                  ? 'linear-gradient(to top, #FF4F1F, #FF7D5C80)'
                  : '#333',
                opacity: isSpeaking ? 0.6 + Math.random() * 0.4 : 0.3,
                transitionDuration: isSpeaking ? '80ms' : '300ms',
              }}
            />
          );
        })}
      </div>

      {/* Status */}
      <div className="flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full ${isSpeaking ? 'status-pulse' : ''}`}
          style={{ backgroundColor: isSpeaking ? '#FF4F1F' : '#555' }}
        />
        <span className="text-sm text-gray-400">
          {isSpeaking ? 'Speaking...' : 'Listening...'}
        </span>
      </div>
    </div>
  );
};
