'use client';

import React from 'react';
import { AGENTS, type AgentName, type CallStatus } from '@/lib/types';
import { ArrowRight } from 'lucide-react';

interface AgentStatusProps {
  currentAgent: AgentName;
  callStatus: CallStatus;
}

export const AgentStatus: React.FC<AgentStatusProps> = ({
  currentAgent,
  callStatus,
}) => {
  const agents: AgentName[] = ['Ram', 'Sam'];

  const getStatusColor = (status: CallStatus) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'connecting':
        return 'bg-genesys-orange';
      case 'transferring':
        return 'bg-genesys-coral';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: CallStatus) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'connecting':
        return 'Connecting...';
      case 'transferring':
        return 'Transferring...';
      case 'ended':
        return 'Ended';
      case 'error':
        return 'Error';
      default:
        return 'Ready';
    }
  };

  return (
    <div className="glass-effect rounded-2xl p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(callStatus)} ${callStatus === 'active' ? 'animate-pulse' : ''}`} />
          <span className="text-sm font-medium text-gray-300">{getStatusText(callStatus)}</span>
        </div>
      </div>

      {/* Agent Flow */}
      <div className="flex items-center justify-center gap-8">
        {agents.map((agent, index) => {
          const agentData = AGENTS[agent];
          const isActive = agent === currentAgent && callStatus === 'active';
          const isPast = agents.indexOf(currentAgent) > index;

          return (
            <React.Fragment key={agent}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? 'genesys-glow-strong scale-110'
                      : isPast
                      ? 'opacity-50'
                      : callStatus === 'idle'
                      ? 'opacity-40'
                      : 'opacity-30'
                  }`}
                  style={{
                    background: isActive 
                      ? `linear-gradient(135deg, ${agentData.color} 0%, ${agentData.color}CC 100%)`
                      : `${agentData.color}20`,
                    border: isActive ? `2px solid ${agentData.color}` : '2px solid transparent',
                  }}
                >
                  <span className={`text-xl font-bold ${isActive ? 'text-white' : 'text-gray-400'}`}>
                    {agent[0]}
                  </span>
                </div>
                <span
                  className={`text-sm mt-3 font-semibold transition-all ${
                    isActive ? 'text-genesys-orange' : 'text-gray-500'
                  }`}
                >
                  {agent}
                </span>
                <span className="text-xs text-gray-600">{agentData.role}</span>
              </div>

              {index < agents.length - 1 && (
                <div className={`flex items-center ${isPast || isActive ? 'text-genesys-orange' : 'text-gray-700'}`}>
                  <div className={`w-16 h-0.5 ${isPast ? 'bg-gradient-to-r from-genesys-orange to-genesys-coral' : 'bg-gray-800'}`} />
                  <ArrowRight size={18} className="mx-2" />
                  <div className={`w-16 h-0.5 ${isPast ? 'bg-genesys-coral' : 'bg-gray-800'}`} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Active Agent Info */}
      {callStatus === 'active' && (
        <div className="mt-5 pt-4 border-t border-gray-800 text-center">
          <p className="text-sm text-gray-400">
            Speaking with{' '}
            <span className="font-semibold text-genesys-orange">
              {currentAgent}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};
