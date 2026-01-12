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
        return 'bg-yellow-500';
      case 'transferring':
        return 'bg-purple-500';
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
    <div className="glass-effect rounded-xl p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(callStatus)} ${callStatus === 'active' ? 'animate-pulse' : ''}`} />
          <span className="text-sm font-medium text-gray-200">{getStatusText(callStatus)}</span>
        </div>
      </div>

      {/* Agent Flow - Clean 2-agent display */}
      <div className="flex items-center justify-center gap-6">
        {agents.map((agent, index) => {
          const agentData = AGENTS[agent];
          const isActive = agent === currentAgent && callStatus === 'active';
          const isPast = agents.indexOf(currentAgent) > index;

          return (
            <React.Fragment key={agent}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? 'ring-4 ring-offset-2 ring-offset-dark-bg shadow-lg scale-110'
                      : isPast
                      ? 'opacity-50'
                      : callStatus === 'idle'
                      ? 'opacity-40'
                      : 'opacity-30'
                  }`}
                  style={{
                    backgroundColor: isActive ? agentData.color : `${agentData.color}30`,
                    ringColor: isActive ? agentData.color : 'transparent',
                  }}
                >
                  <span className={`text-lg font-bold ${isActive ? 'text-white' : 'text-gray-400'}`}>
                    {agent[0]}
                  </span>
                </div>
                <span
                  className={`text-sm mt-2 font-medium transition-all ${
                    isActive ? 'text-white' : 'text-gray-500'
                  }`}
                >
                  {agent}
                </span>
                <span className="text-xs text-gray-600">{agentData.role}</span>
              </div>

              {index < agents.length - 1 && (
                <div className={`flex items-center ${isPast || isActive ? 'text-gray-400' : 'text-gray-700'}`}>
                  <div className={`w-12 h-0.5 ${isPast ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-700'}`} />
                  <ArrowRight size={18} className="mx-1" />
                  <div className={`w-12 h-0.5 ${isPast ? 'bg-purple-500' : 'bg-gray-700'}`} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Current Agent Info - Only show when active */}
      {callStatus === 'active' && (
        <div className="mt-5 pt-4 border-t border-gray-800 text-center">
          <p className="text-sm text-gray-400">
            Speaking with{' '}
            <span className="font-semibold" style={{ color: AGENTS[currentAgent].color }}>
              {currentAgent}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};
