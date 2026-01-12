'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { getVapiClient } from '@/lib/vapi-client';
import type { CallStatus, AgentName, Message, TransferMessage } from '@/lib/types';

interface UseVapiReturn {
  callStatus: CallStatus;
  currentAgent: AgentName;
  messages: (Message | TransferMessage)[];
  startCall: (assistantId: string) => Promise<void>;
  endCall: () => void;
  isSpeaking: boolean;
}

export const useVapi = (publicKey: string): UseVapiReturn => {
  const [callStatus, setCallStatus] = useState<CallStatus>('idle');
  const [currentAgent, setCurrentAgent] = useState<AgentName>('Ram');
  const [messages, setMessages] = useState<(Message | TransferMessage)[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const vapiRef = useRef<any>(null);

  useEffect(() => {
    if (publicKey && !vapiRef.current) {
      vapiRef.current = getVapiClient({ publicKey });

      // Call started
      vapiRef.current.on('call-start', () => {
        console.log('Call started');
        setCallStatus('active');
        setCurrentAgent('Ram'); // Always starts with Ram
      });

      // Call ended
      vapiRef.current.on('call-end', () => {
        console.log('Call ended');
        setCallStatus('ended');
        setIsSpeaking(false);
      });

      // Message received
      vapiRef.current.on('message', (message: any) => {
        console.log('Message received:', message);

        if (message.type === 'transcript' && message.transcript) {
          const newMessage: Message = {
            id: `${Date.now()}-${Math.random()}`,
            role: message.role || 'assistant',
            content: message.transcript,
            timestamp: new Date(),
            agent: currentAgent,
          };

          // Only add final transcripts to avoid duplicates
          if (message.transcriptType === 'final') {
            setMessages((prev) => [...prev, newMessage]);
          }
        }
      });

      // Speech started
      vapiRef.current.on('speech-start', () => {
        console.log('Speech started');
        setIsSpeaking(true);
      });

      // Speech ended
      vapiRef.current.on('speech-end', () => {
        console.log('Speech ended');
        setIsSpeaking(false);
      });

      // Error handling
      vapiRef.current.on('error', (error: any) => {
        console.error('Vapi error:', error);
        setCallStatus('error');
      });

      // Volume level (for visualization)
      vapiRef.current.on('volume-level', (level: number) => {
        // This can be used for audio visualization
        // You can expose this via a separate state if needed
      });
    }

    return () => {
      // Cleanup on unmount
      if (vapiRef.current) {
        vapiRef.current.stop();
      }
    };
  }, [publicKey, currentAgent]);

  const startCall = useCallback(async (assistantId: string) => {
    if (!vapiRef.current) {
      console.error('Vapi client not initialized');
      return;
    }

    if (!assistantId) {
      console.error('No assistant ID provided');
      setCallStatus('error');
      return;
    }

    try {
      setCallStatus('connecting');
      setMessages([]); // Clear previous messages
      
      console.log('🚀 Starting call with Assistant ID:', assistantId);
      
      // Start with the assistant ID directly
      await vapiRef.current.start(assistantId);
      
      console.log('✅ Call initiated successfully');
    } catch (error: any) {
      console.error('❌ Error starting call:', error);
      console.error('Error message:', error?.message || 'Unknown error');
      console.error('Error details:', JSON.stringify(error, null, 2));
      setCallStatus('error');
    }
  }, []);

  const endCall = useCallback(() => {
    if (!vapiRef.current) return;

    try {
      vapiRef.current.stop();
      setCallStatus('ended');
      setIsSpeaking(false);
    } catch (error) {
      console.error('Error ending call:', error);
    }
  }, []);

  return {
    callStatus,
    currentAgent,
    messages,
    startCall,
    endCall,
    isSpeaking,
  };
};
