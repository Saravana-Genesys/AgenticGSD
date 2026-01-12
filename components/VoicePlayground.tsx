'use client';

import React, { useEffect } from 'react';
import { useVapi } from '@/hooks/useVapi';
import { useMediaStream } from '@/hooks/useMediaStream';
import { useChat } from '@/hooks/useChat';
import { AudioVisualizer } from './AudioVisualizer';
import { ChatPanel } from './ChatPanel';
import { VideoPanel } from './VideoPanel';
import { ControlPanel } from './ControlPanel';
import { AgentStatus } from './AgentStatus';

interface VoicePlaygroundProps {
  vapiPublicKey: string;
  assistantOrSquadId: string;
  isSquad?: boolean;
}

export const VoicePlayground: React.FC<VoicePlaygroundProps> = ({
  vapiPublicKey,
  assistantOrSquadId,
}) => {
  const { callStatus, currentAgent, messages: vapiMessages, startCall, endCall, isSpeaking } = useVapi(vapiPublicKey);
  
  const {
    stream,
    audioEnabled,
    videoEnabled,
    audioLevel,
    toggleAudio,
    toggleVideo,
    startStream,
    stopStream,
    error: mediaError,
  } = useMediaStream();

  const { messages, addMessage, clearMessages, messagesEndRef } = useChat();

  // Initialize media stream on mount (once only)
  useEffect(() => {
    let mounted = true;
    
    const initStream = async () => {
      if (mounted) {
        await startStream();
      }
    };
    
    initStream();
    
    return () => {
      mounted = false;
      stopStream();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - run once on mount only

  // Sync Vapi messages with chat
  useEffect(() => {
    if (vapiMessages.length > 0) {
      const latestMessage = vapiMessages[vapiMessages.length - 1];
      // Check if message is already in chat to avoid duplicates
      const isDuplicate = messages.some(msg => 
        'content' in msg && 
        'content' in latestMessage && 
        msg.content === latestMessage.content && 
        msg.timestamp.getTime() === latestMessage.timestamp.getTime()
      );
      
      if (!isDuplicate) {
        addMessage(latestMessage);
      }
    }
  }, [vapiMessages, addMessage, messages]);

  const handleStartCall = async () => {
    clearMessages();
    await startCall(assistantOrSquadId);
  };

  const handleEndCall = () => {
    endCall();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-bg to-black pb-8">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg genesys-gradient flex items-center justify-center shadow-lg shadow-genesys-orange/30">
              <span className="text-white font-bold">G</span>
            </div>
            <h1 className="text-2xl font-bold genesys-text-gradient">
              Genesys AgenticGSD
            </h1>
          </div>
          <span className="text-sm text-gray-500 hidden sm:block">AI IT Support</span>
        </div>

        {/* Agent Status - Compact */}
        <div className="mb-6">
          <AgentStatus currentAgent={currentAgent} callStatus={callStatus} />
        </div>

        {/* Main Grid Layout - 3 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
          {/* Left - Agent Audio */}
          <div className="h-[450px]">
            <AudioVisualizer
              currentAgent={currentAgent}
              isSpeaking={isSpeaking}
              audioLevel={audioLevel}
            />
          </div>

          {/* Center - Chat */}
          <div className="h-[450px]">
            <ChatPanel messages={messages} messagesEndRef={messagesEndRef} />
          </div>

          {/* Right - Video */}
          <div className="h-[450px]">
            <VideoPanel
              stream={stream}
              videoEnabled={videoEnabled}
              audioLevel={audioLevel}
            />
          </div>
        </div>

        {/* Control Panel */}
        <ControlPanel
          callStatus={callStatus}
          audioEnabled={audioEnabled}
          videoEnabled={videoEnabled}
          onStartCall={handleStartCall}
          onEndCall={handleEndCall}
          onToggleAudio={toggleAudio}
          onToggleVideo={toggleVideo}
        />

        {/* Media Error - Subtle */}
        {mediaError && !mediaError.includes('Audio-only') && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
            {mediaError}
          </div>
        )}
      </div>
    </div>
  );
};
