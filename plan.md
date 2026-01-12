# AgenticGSD - Development Plan

## Project Overview
Next.js application with Vapi API multi-agent orchestration for IT support desk with L1 (Ram), L2 (Sam), and Booking Agent (Sita) using ElevenLabs voices and Microsoft Bookings integration.

**Key Features:**
- End user always starts with Ram (L1 Agent) as default entry point
- Intelligent routing between agents based on issue complexity
- Full context preservation - all agents have access to complete conversation history
- Seamless handoffs with conversation continuity

## Architecture

### Tech Stack
- **Frontend**: Next.js 14 (App Router)
- **UI Framework**: React + Tailwind CSS
- **Voice API**: Vapi.ai
- **Voice Provider**: ElevenLabs
- **Booking Integration**: Microsoft Graph API (Bookings)
- **Real-time Communication**: Vapi Web SDK
- **Video/Audio**: WebRTC (getUserMedia API)

### Agent Structure (Vapi Squad)
```
Squad Flow:
User → Ram (L1 Agent - DEFAULT ENTRY) → Sam (L2 Agent) → Sita (Booking Agent)
                    ↓                           ↓
                    └─────────────────────────→ Sita (Booking Agent)

1. Ram (L1 Agent) - Default entry point for all users
   - Handles: Basic IT issues, password resets, account lockouts, software installation
   - Routes to Sam: When issue requires advanced technical expertise
   - Routes to Sita: When user needs human consultation or product discussion

2. Sam (L2 Agent) - Advanced technical support
   - Handles: Server issues, network diagnostics, database problems, complex debugging
   - Routes to Sita: When issue requires human intervention or cannot be resolved remotely

3. Sita (Booking Agent) - Appointment scheduling
   - Handles: Scheduling with human consultants, product discussions, consultancy bookings
   - Final agent in the chain

Context Preservation:
- All agents receive full conversation history during handoffs
- Context engineering ensures smooth transitions without repetition
- Each agent aware of previous interactions and user's issue
```

### User Journey Example

```
┌──────────────────────────────────────────────────────────────────┐
│ User Starts Call                                                  │
│ ↓                                                                 │
│ [RAM - L1 AGENT] ← ALWAYS STARTS HERE                           │
│ • "Hi, I'm Ram. How can I help with your IT issue?"             │
│ • Handles: Password resets, basic troubleshooting                │
│ • Context: Collects initial issue details                        │
│                                                                   │
│ Decision Point:                                                   │
│ ├─→ Basic Issue? → Ram resolves → END CALL                      │
│ ├─→ Complex Issue? → Transfer to Sam                            │
│ └─→ Needs Human? → Transfer to Sita                             │
└──────────────────────────────────────────────────────────────────┘
                    ↓ (Complex Issue)
┌──────────────────────────────────────────────────────────────────┐
│ [SAM - L2 AGENT]                                                 │
│ • "Hi, I'm Sam. I see you're having [issue from Ram's context]" │
│ • Receives: Full conversation with Ram, issue details            │
│ • Handles: Server issues, network config, database problems      │
│ • Context: Knows what Ram already tried                          │
│                                                                   │
│ Decision Point:                                                   │
│ ├─→ Resolved? → END CALL                                         │
│ └─→ Needs Human Engineer? → Transfer to Sita                     │
└──────────────────────────────────────────────────────────────────┘
                    ↓ (Needs Consultation)
┌──────────────────────────────────────────────────────────────────┐
│ [SITA - BOOKING AGENT]                                           │
│ • "Hi, I'm Sita. I understand you need consultation for [issue]"│
│ • Receives: Complete context from Ram and/or Sam                 │
│ • Handles: Scheduling with human consultants                     │
│ • Context: Knows full issue history, troubleshooting attempted   │
│                                                                   │
│ Actions:                                                          │
│ • Checks Microsoft Bookings availability                         │
│ • Collects user details (name, email, phone)                     │
│ • Schedules appointment                                           │
│ • Confirms booking → END CALL                                     │
└──────────────────────────────────────────────────────────────────┘
```

## Development Phases

### Phase 1: Project Setup
**Files to Create:**
- `package.json` - Dependencies
- `next.config.js` - Next.js configuration
- `.env.local.example` - Environment variables template
- `tailwind.config.js` - Tailwind configuration
- `tsconfig.json` - TypeScript configuration

**Dependencies:**
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@vapi-ai/web": "^2.0.0",
    "@microsoft/microsoft-graph-client": "^3.0.0",
    "@azure/msal-browser": "^3.0.0",
    "axios": "^1.6.0",
    "lucide-react": "^0.300.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/node": "^20.10.0",
    "@types/react": "^18.2.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

**Environment Variables:**
```
NEXT_PUBLIC_VAPI_PUBLIC_KEY=
VAPI_PRIVATE_KEY=
NEXT_PUBLIC_ELEVENLABS_API_KEY=
AZURE_CLIENT_ID=
AZURE_TENANT_ID=
AZURE_CLIENT_SECRET=
MICROSOFT_BOOKINGS_BUSINESS_ID=
```

### Phase 2: Vapi Squad Configuration

**Squad Structure:**
- Ram is ALWAYS the first agent (specified as first member in squad.members array)
- Context preservation enabled for all handoffs via Vapi's squad architecture
- Each agent receives full conversation history during transitions

**Agent Configurations:**

#### Ram (L1 Agent - DEFAULT ENTRY POINT)
```json
{
  "name": "Ram",
  "voice": {
    "provider": "11labs",
    "voiceId": "male-professional-voice-id"
  },
  "model": {
    "provider": "openai",
    "model": "gpt-4o",
    "messages": [
      {
        "role": "system",
        "content": "You are Ram, the L1 IT support agent and first point of contact for all users. Greet users warmly and understand their IT issues. Handle basic IT problems: password resets, account lockouts, software installation guidance, basic troubleshooting. If the issue requires advanced technical knowledge, seamlessly transfer to Sam (L2 Agent). If the user needs to speak with a human consultant or discuss products, transfer to Sita. Be professional, friendly, and efficient. Always acknowledge the user's issue before transferring."
      }
    ]
  },
  "tools": [
    {
      "type": "handoff",
      "destinations": [
        {
          "type": "assistant",
          "assistantId": "sam-l2-agent-id",
          "description": "Transfer to Sam when issue requires: server configuration, network diagnostics, database issues, advanced debugging, system errors, or any problem beyond basic troubleshooting. Say: 'Let me connect you with Sam, our L2 specialist who can help with this technical issue.'",
          "message": "Transferring user to L2 support. User has reported: {issue summary}. Previous troubleshooting: {actions taken}"
        },
        {
          "type": "assistant",
          "assistantId": "sita-booking-agent-id",
          "description": "Transfer to Sita when user requests to speak with human consultant, needs product discussion, or wants consultancy services. Say: 'Let me connect you with Sita who can schedule a consultation for you.'",
          "message": "User needs human consultation. Issue context: {issue summary}. Reason for consultation: {reason}"
        }
      ]
    }
  ]
}
```

#### Sam (L2 Agent)
```json
{
  "name": "Sam",
  "voice": {
    "provider": "11labs",
    "voiceId": "male-technical-voice-id"
  },
  "model": {
    "provider": "openai",
    "model": "gpt-4o",
    "messages": [
      {
        "role": "system",
        "content": "You are Sam, an L2 IT support specialist. You have full context of the user's conversation with Ram. Acknowledge what has been discussed and continue from there. Handle complex technical issues: server problems, network configuration, database troubleshooting, advanced system diagnostics, code debugging, infrastructure issues. Provide detailed technical solutions with step-by-step guidance. If the issue cannot be resolved remotely or requires human intervention, transfer to Sita for scheduling. Be thorough and technical while remaining clear."
      }
    ]
  },
  "tools": [
    {
      "type": "handoff",
      "destinations": [
        {
          "type": "assistant",
          "assistantId": "sita-booking-agent-id",
          "description": "Transfer to Sita when issue cannot be resolved remotely, requires on-site support, needs human engineer intervention, or user requests human consultant. Say: 'I'll connect you with Sita to schedule time with our senior engineer.'",
          "message": "User needs senior engineer consultation. Technical issue: {detailed issue}. Troubleshooting performed: {steps taken}. Current status: {status}"
        }
      ]
    }
  ]
}
```

#### Sita (Booking Agent)
```json
{
  "name": "Sita",
  "voice": {
    "provider": "11labs",
    "voiceId": "female-professional-voice-id"
  },
  "model": {
    "provider": "openai",
    "model": "gpt-4o",
    "messages": [
      {
        "role": "system",
        "content": "You are Sita, a booking specialist. You have full context of the user's entire conversation with Ram and/or Sam. Acknowledge their issue and the help they've received so far. Help users schedule appointments with human IT consultants for in-depth consultancy, product discussions, or complex issues requiring human expertise. Ask for preferred date/time, collect contact information (name, email, phone), understand the consultation purpose, and confirm bookings through Microsoft Bookings. Be warm, accommodating, and efficient."
      }
    ]
  },
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "check_availability",
        "description": "Check available time slots in Microsoft Bookings",
        "parameters": {
          "type": "object",
          "properties": {
            "date": {"type": "string"},
            "serviceType": {"type": "string"}
          }
        }
      },
      "server": {
        "url": "https://your-domain.com/api/bookings/availability"
      }
    },
    {
      "type": "function",
      "function": {
        "name": "create_booking",
        "description": "Create appointment in Microsoft Bookings",
        "parameters": {
          "type": "object",
          "properties": {
            "customerName": {"type": "string"},
            "customerEmail": {"type": "string"},
            "customerPhone": {"type": "string"},
            "dateTime": {"type": "string"},
            "serviceType": {"type": "string"},
            "notes": {"type": "string"}
          }
        }
      },
      "server": {
        "url": "https://your-domain.com/api/bookings/create"
      }
    }
  ]
}
```

### Phase 3: UI Implementation

**Component Structure:**
```
app/
├── layout.tsx
├── page.tsx
├── globals.css
├── api/
│   ├── vapi/
│   │   ├── create-squad/route.ts
│   │   └── webhook/route.ts
│   └── bookings/
│       ├── availability/route.ts
│       └── create/route.ts
├── components/
│   ├── VoicePlayground.tsx (main component)
│   ├── AudioVisualizer.tsx
│   ├── ChatPanel.tsx
│   ├── VideoPanel.tsx
│   ├── ControlPanel.tsx
│   └── AgentStatus.tsx
├── lib/
│   ├── vapi-client.ts
│   ├── microsoft-bookings.ts
│   └── types.ts
└── hooks/
    ├── useVapi.ts
    ├── useMediaStream.ts
    └── useChat.ts
```

**UI Layout (Based on Reference Image):**
```
┌─────────────────────────────────────────────────────────────┐
│  AgenticGSD - IT Support                                     │
├────────────────┬────────────────────┬───────────────────────┤
│                │                    │                        │
│  AGENT AUDIO   │      CHAT         │   CAMERA               │
│                │                    │                        │
│  [Visualizer]  │  [Chat Messages]  │   [User Video]         │
│  [Wave Form]   │  Ram: Hello...    │   [Camera Feed]        │
│                │  User: I need...  │                        │
│  Agent: Ram    │  Ram: I can...    │   MICROPHONE           │
│  Status: 🔴    │  → Transferred    │   [Audio Level]        │
│                │  Sam: I can...    │   [Mic Indicator]      │
│  [Controls]    │                    │                        │
│  🎤 ⏸️ 📞      │  [Auto Scroll]    │   [Start Call Btn]    │
│                │                    │   "Connect with Ram"   │
└────────────────┴────────────────────┴───────────────────────┘
```

**Key UI Features:**
1. **Agent Audio Panel**: 
   - Real-time audio visualizer showing agent speaking
   - Current agent name displayed (Ram → Sam → Sita)
   - Status indicator (🔴 Active, 🟡 Transferring, 🟢 Connected)
   
2. **Chat Panel**: 
   - Full conversation transcript with all agents
   - Agent name prefixes (Ram:, Sam:, Sita:)
   - Transfer notifications (→ Transferred to Sam)
   - Shows conversation continuity across handoffs
   - Auto-scroll to latest messages
   
3. **Camera Panel**: 
   - User video feed
   - Microphone levels visualization
   - Call controls (start/end)
   - Default CTA: "Connect with Ram" (L1 Agent)
   
4. **Agent Status Display**: 
   - Current active agent highlighted
   - Visual indicator of agent transitions
   - Handoff notifications with context

### Phase 4: Core Features Implementation

#### 1. Vapi Integration (`lib/vapi-client.ts`)
- Initialize Vapi client with public key
- Create squad with Ram as first member (default entry)
- Handle squad member transitions with full context
- Process real-time transcription for all agents
- Manage call lifecycle
- Track conversation history across agent handoffs
- Listen for assistant-changed events to update UI

#### 2. Media Handling (`hooks/useMediaStream.ts`)
- Camera access via getUserMedia
- Microphone input handling
- Audio level monitoring
- Video stream management

#### 3. Chat System (`components/ChatPanel.tsx`)
- Display full conversation transcript from all agents
- Clearly label messages by agent (Ram:, Sam:, Sita:, User:)
- Show agent transition notifications (e.g., "→ Connecting you to Sam...")
- Highlight context continuity across handoffs
- Auto-scroll to latest messages
- Show timestamps for message flow tracking

#### 4. Audio Visualization (`components/AudioVisualizer.tsx`)
- Real-time waveform display
- Speaking indicator
- Agent audio visualization

#### 5. Microsoft Bookings Integration (`lib/microsoft-bookings.ts`)
- MSAL authentication
- Fetch available time slots
- Create bookings via Graph API
- Handle booking confirmations

#### 6. Context Preservation Implementation
**How it works:**
- Vapi's Squad architecture automatically preserves context during handoffs
- Full conversation history passed to each new agent
- No need to repeat information - agents acknowledge previous discussions
- Message history maintained in state across all agent transitions

**Implementation:**
```typescript
// In useVapi hook
const [conversationHistory, setConversationHistory] = useState([]);
const [currentAgent, setCurrentAgent] = useState('Ram'); // Always starts with Ram

vapi.on('message', (message) => {
  setConversationHistory(prev => [...prev, {
    agent: currentAgent,
    text: message.transcript,
    timestamp: new Date(),
    role: message.role // 'assistant' or 'user'
  }]);
});

vapi.on('assistant-changed', (event) => {
  const newAgent = event.assistant.name; // Ram, Sam, or Sita
  setCurrentAgent(newAgent);
  setConversationHistory(prev => [...prev, {
    type: 'transfer',
    from: currentAgent,
    to: newAgent,
    timestamp: new Date()
  }]);
});
```

### Phase 5: API Routes

#### `/api/vapi/create-squad/route.ts`
- Create Vapi squad configuration
- Return assistant IDs
- Handle squad initialization

**Squad Initialization Example:**
```typescript
// IMPORTANT: Ram must be first member (index 0) - this is the default entry point
const squad = {
  members: [
    {
      assistantId: "ram-l1-assistant-id", // FIRST = DEFAULT ENTRY
      assistantOverrides: {
        // Any overrides for Ram
      }
    },
    {
      assistantId: "sam-l2-assistant-id",
      assistantOverrides: {
        // Any overrides for Sam
      }
    },
    {
      assistantId: "sita-booking-assistant-id",
      assistantOverrides: {
        // Any overrides for Sita
      }
    }
  ],
  memberOverrides: {
    // Global overrides for all agents (e.g., consistent voice settings)
    firstMessageMode: "assistant-speaks-first" // Ram greets user
  }
};
```

#### `/api/vapi/webhook/route.ts`
- Handle Vapi webhooks
- Process function calls
- Log conversation events

#### `/api/bookings/availability/route.ts`
- Authenticate with Microsoft Graph
- Query Bookings API for available slots
- Return formatted availability

#### `/api/bookings/create/route.ts`
- Authenticate with Microsoft Graph
- Create appointment in Microsoft Bookings
- Send confirmation email
- Return booking details

### Phase 6: Styling & Polish

**Design System:**
- Dark theme with accent colors
- Modern glassmorphism effects
- Smooth animations for agent transitions
- Responsive design for mobile/tablet/desktop

**Key Animations:**
- Agent handoff transitions
- Audio wave animations
- Status indicator pulses
- Button hover effects

### Phase 7: Testing & Deployment

**Testing Checklist:**
- [ ] User always starts with Ram (L1 Agent) as default
- [ ] Ram handles basic IT queries (password reset, software install)
- [ ] Ram correctly identifies when to transfer to Sam (complex issues)
- [ ] Ram correctly identifies when to transfer to Sita (human consultation)
- [ ] Sam receives full context of Ram's conversation
- [ ] Sam doesn't ask user to repeat information
- [ ] Sam handles advanced technical issues
- [ ] Sam transfers to Sita when needed
- [ ] Sita receives complete context from Ram and/or Sam
- [ ] Sita acknowledges previous discussion before booking
- [ ] Sita successfully checks availability via Microsoft Bookings
- [ ] Sita creates bookings with all context included
- [ ] Video/audio streams work properly
- [ ] Chat transcript shows all agents' messages
- [ ] Agent transitions display clearly in UI
- [ ] Transfer notifications appear in chat
- [ ] Current agent indicator updates correctly
- [ ] UI is responsive across devices

**Deployment:**
- Vercel deployment (recommended for Next.js)
- Environment variables configuration
- Domain setup
- SSL certificate

## Context Preservation Architecture

### How Vapi Squads Maintain Context

Vapi automatically preserves conversation context during agent handoffs:

1. **Automatic Context Transfer**: When Ram transfers to Sam, Vapi automatically includes the full conversation history
2. **No Manual Implementation Required**: The squad architecture handles context preservation natively
3. **Message History**: All previous messages (user + assistant) are available to the new agent
4. **Variable Extraction**: Can extract specific variables during handoff for structured data passing

**Example Flow:**
```
User: "My database isn't connecting"
Ram: "I'll help you with that. What error are you seeing?"
User: "Connection timeout on port 5432"
Ram: "This requires advanced troubleshooting. Let me connect you to Sam."
[HANDOFF TO SAM - Full context automatically transferred]
Sam: "Hi, I understand you're having database connection timeout issues on port 5432. Let me help you diagnose this..."
```

**Key Points:**
- Sam doesn't ask "What's the issue?" - he already knows
- Context includes: user's issue, error details, Ram's assessment
- Seamless continuation of conversation
- No information loss during transfer

### Implementation in Code

The Vapi SDK handles this automatically. You just need to:
```typescript
// Listen for agent changes
vapi.on('assistant-changed', (event) => {
  console.log(`Transferred from ${event.previous} to ${event.current}`);
  // Update UI to show new agent
  setCurrentAgent(event.current.name);
});

// All messages automatically include full context
vapi.on('message', (message) => {
  // Message includes conversation history
  // New agent has access to everything discussed
});
```

## Implementation Order

1. **Setup** (30 min)
   - Initialize Next.js project
   - Install dependencies
   - Configure environment variables

2. **Vapi Configuration** (1 hour)
   - Create assistants in Vapi dashboard
   - Configure squad with handoff tools
   - Test basic conversation flow

3. **UI Foundation** (2 hours)
   - Build main layout
   - Create component structure
   - Implement basic styling

4. **Vapi Integration** (2 hours)
   - Implement useVapi hook
   - Connect to Vapi Web SDK
   - Handle call lifecycle

5. **Media Features** (1.5 hours)
   - Camera/microphone access
   - Audio visualization
   - Video display

6. **Chat System** (1 hour)
   - Transcript display
   - Agent status tracking
   - Message rendering

7. **Microsoft Bookings** (2 hours)
   - MSAL setup
   - Graph API integration
   - Availability/booking functions

8. **API Routes** (1.5 hours)
   - Squad creation endpoint
   - Webhook handler
   - Bookings endpoints

9. **Polish & Testing** (2 hours)
   - Styling refinements
   - Bug fixes
   - Cross-browser testing

**Total Estimated Time: 13.5 hours**

## API Keys Required

1. **Vapi.ai**
   - Sign up at https://vapi.ai
   - Get Public Key and Private Key
   - Create assistants in dashboard

2. **ElevenLabs**
   - Sign up at https://elevenlabs.io
   - Get API key
   - Note voice IDs to use

3. **Microsoft Azure**
   - Create Azure AD app registration
   - Get Client ID, Tenant ID, Client Secret
   - Add Microsoft Graph permissions (Bookings.Read.All, Bookings.ReadWrite.All)
   - Get Microsoft Bookings Business ID

## File Creation Order

1. `package.json`
2. `tsconfig.json`
3. `next.config.js`
4. `tailwind.config.js`
5. `.env.local.example`
6. `app/globals.css`
7. `app/layout.tsx`
8. `lib/types.ts`
9. `lib/vapi-client.ts`
10. `lib/microsoft-bookings.ts`
11. `hooks/useVapi.ts`
12. `hooks/useMediaStream.ts`
13. `hooks/useChat.ts`
14. `components/AudioVisualizer.tsx`
15. `components/ChatPanel.tsx`
16. `components/VideoPanel.tsx`
17. `components/ControlPanel.tsx`
18. `components/AgentStatus.tsx`
19. `components/VoicePlayground.tsx`
20. `app/api/vapi/create-squad/route.ts`
21. `app/api/vapi/webhook/route.ts`
22. `app/api/bookings/availability/route.ts`
23. `app/api/bookings/create/route.ts`
24. `app/page.tsx`
25. `README.md`

## Notes

### Critical Requirements
- **Default Entry Point**: Ram (L1 Agent) is ALWAYS the first agent user connects with
- **Context Preservation**: Vapi Squad architecture automatically maintains full conversation history across all handoffs
- **No Repetition**: Agents must acknowledge previous discussions, never ask user to repeat information
- **Intelligent Routing**: Agent transitions based on issue complexity, not user choice

### Technical Notes
- Squad configuration ensures context is preserved during handoffs via Vapi's built-in mechanism
- First member in `squad.members` array is the default/starting agent (Ram)
- ElevenLabs voices should be selected for professional, clear tone
- Microsoft Graph API requires proper OAuth scopes (Bookings.Read.All, Bookings.ReadWrite.All)
- Real-time audio visualization enhances user experience
- Agent transitions should be announced prominently in chat
- All sensitive data (API keys, tokens) handled server-side only
- WebRTC requires HTTPS in production environment
- Consider using Vapi's `memberOverrides` to ensure consistent voice/settings across all agents
