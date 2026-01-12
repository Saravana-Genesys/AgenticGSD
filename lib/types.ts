// Agent types (Ram L1 + Sam L2)
export type AgentName = 'Ram' | 'Sam';

export interface Agent {
  name: AgentName;
  role: string;
  description: string;
  color: string;
}

// Message types
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  agent?: AgentName;
}

export interface TransferMessage {
  id: string;
  type: 'transfer';
  from: AgentName;
  to: AgentName;
  timestamp: Date;
  context?: string;
}

export type ChatMessage = Message | TransferMessage;

// Call status
export type CallStatus = 'idle' | 'connecting' | 'active' | 'transferring' | 'ended' | 'error';

// Vapi types
export interface VapiConfig {
  publicKey: string;
  assistantId?: string;
}

export interface VapiMessage {
  type: string;
  role?: 'user' | 'assistant';
  transcript?: string;
  transcriptType?: 'partial' | 'final';
}

export interface VapiCallData {
  status: string;
  messages?: VapiMessage[];
  call?: {
    id: string;
    status: string;
  };
}

export interface AssistantChangedEvent {
  assistant: {
    id: string;
    name: string;
  };
  previous?: {
    id: string;
    name: string;
  };
}

// Microsoft Bookings types
export interface BookingService {
  id: string;
  displayName: string;
  description?: string;
  defaultDuration: string;
}

export interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}

export interface BookingAppointment {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceId: string;
  startDateTime: string;
  endDateTime: string;
  notes?: string;
}

export interface BookingResponse {
  success: boolean;
  appointmentId?: string;
  message?: string;
  error?: string;
}

// Audio/Video types
export interface MediaStreamState {
  audioEnabled: boolean;
  videoEnabled: boolean;
  stream: MediaStream | null;
  audioLevel: number;
}

// Agent status
export interface AgentStatus {
  currentAgent: AgentName;
  status: CallStatus;
  transferring: boolean;
}

// Genesys Brand Colors
export const AGENTS: Record<AgentName, Agent> = {
  Ram: {
    name: 'Ram',
    role: 'L1 Support',
    description: 'Basic IT support & triage',
    color: '#FF4F1F', // Genesys Orange
  },
  Sam: {
    name: 'Sam',
    role: 'L2 Specialist',
    description: 'Advanced technical support',
    color: '#FF7D5C', // Genesys Coral
  },
};
