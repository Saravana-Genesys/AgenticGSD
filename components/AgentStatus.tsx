'use client';

import React from 'react';
import { type CallStatus } from '@/lib/types';

interface AgentStatusProps {
  currentAgent: string;
  callStatus: CallStatus;
}

export const AgentStatus: React.FC<AgentStatusProps> = ({
  currentAgent,
  callStatus,
}) => {
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(callStatus)} ${callStatus === 'active' ? 'animate-pulse' : ''}`} />
          <span className="text-sm font-medium text-gray-300">{getStatusText(callStatus)}</span>
        </div>
        
        {callStatus === 'active' && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">
              Speaking with{' '}
              <span className="font-semibold text-genesys-orange">
                AgenticGSD Support Team
              </span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
