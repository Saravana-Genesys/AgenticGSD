# AgenticGSD - Project Structure

Complete overview of the project architecture and file organization.

## 📁 File Structure

```
AgenticGSD/
│
├── 📄 Configuration Files
│   ├── package.json              # Dependencies and scripts
│   ├── tsconfig.json             # TypeScript configuration
│   ├── next.config.js            # Next.js configuration
│   ├── tailwind.config.js        # Tailwind CSS configuration
│   ├── postcss.config.js         # PostCSS configuration
│   ├── .gitignore                # Git ignore rules
│   └── .env.local.example        # Environment variables template
│
├── 📂 app/                       # Next.js 14 App Router
│   ├── layout.tsx                # Root layout with header
│   ├── page.tsx                  # Home page (main entry)
│   ├── globals.css               # Global styles with Tailwind
│   │
│   └── 📂 api/                   # API Routes
│       ├── 📂 vapi/
│       │   ├── create-squad/     # Squad creation endpoint
│       │   │   └── route.ts
│       │   └── webhook/          # Vapi webhook handler
│       │       └── route.ts
│       │
│       └── 📂 bookings/
│           ├── availability/     # Check available slots
│           │   └── route.ts
│           └── create/           # Create booking
│               └── route.ts
│
├── 📂 components/                # React Components
│   ├── VoicePlayground.tsx      # Main orchestrator component
│   ├── AudioVisualizer.tsx      # Audio wave visualization
│   ├── ChatPanel.tsx            # Conversation transcript
│   ├── VideoPanel.tsx           # User video feed
│   ├── ControlPanel.tsx         # Call controls
│   └── AgentStatus.tsx          # Agent flow visualization
│
├── 📂 hooks/                     # Custom React Hooks
│   ├── useVapi.ts               # Vapi SDK integration
│   ├── useMediaStream.ts        # Camera/microphone handling
│   └── useChat.ts               # Chat state management
│
├── 📂 lib/                       # Utility Libraries
│   ├── types.ts                 # TypeScript type definitions
│   ├── vapi-client.ts           # Vapi client utilities
│   └── microsoft-bookings.ts    # Microsoft Graph API integration
│
└── 📚 Documentation
    ├── README.md                # Full project documentation
    ├── QUICKSTART.md            # Quick start guide
    ├── VAPI_SETUP.md            # Vapi configuration guide
    └── PROJECT_STRUCTURE.md     # This file
```

## 🔧 Core Components

### VoicePlayground (Main Orchestrator)
**File:** `components/VoicePlayground.tsx`

The central component that coordinates all functionality:
- Manages Vapi connection
- Handles media streams
- Coordinates chat messages
- Controls call lifecycle

**Props:**
- `vapiPublicKey`: Vapi public API key
- `ramAssistantId`: Ram's assistant ID (default entry point)

### AudioVisualizer
**File:** `components/AudioVisualizer.tsx`

Real-time audio visualization with agent status:
- Animated wave bars that respond to speech
- Current agent name and role
- Speaking/listening indicator
- Color-coded by agent

### ChatPanel
**File:** `components/ChatPanel.tsx`

Full conversation transcript:
- All messages from all agents
- Transfer notifications with arrow indicators
- Timestamp for each message
- Auto-scroll to latest message
- Color-coded by agent

### VideoPanel
**File:** `components/VideoPanel.tsx`

User video and audio monitoring:
- WebRTC video feed
- Camera on/off indicator
- Real-time microphone level meter
- Gradient audio visualization

### ControlPanel
**File:** `components/ControlPanel.tsx`

Call control buttons:
- Start/End call button
- Microphone toggle (mute/unmute)
- Camera toggle (on/off)
- Disabled states during transitions

### AgentStatus
**File:** `components/AgentStatus.tsx`

Visual agent flow:
- Shows all three agents (Ram → Sam → Sita)
- Highlights current active agent
- Call status indicator
- Agent progression tracker

## 🎣 Custom Hooks

### useVapi
**File:** `hooks/useVapi.ts`

Vapi SDK integration:
- `callStatus`: Current call state
- `currentAgent`: Active agent name
- `messages`: All messages from Vapi
- `startCall()`: Initiate call with assistant
- `endCall()`: Terminate active call
- `isSpeaking`: Agent speaking state

**Events Handled:**
- call-start
- call-end
- message (transcripts)
- speech-start / speech-end
- error
- volume-level

### useMediaStream
**File:** `hooks/useMediaStream.ts`

WebRTC media handling:
- `stream`: MediaStream object
- `audioEnabled`: Microphone state
- `videoEnabled`: Camera state
- `audioLevel`: Current audio level (0-1)
- `toggleAudio()`: Mute/unmute
- `toggleVideo()`: Camera on/off
- `startStream()`: Request media access
- `stopStream()`: Release media devices

### useChat
**File:** `hooks/useChat.ts`

Chat state management:
- `messages`: All chat messages
- `addMessage()`: Add new message
- `clearMessages()`: Reset chat
- `scrollToBottom()`: Auto-scroll
- `messagesEndRef`: Scroll target ref

## 🌐 API Routes

### POST /api/vapi/create-squad
Creates a Vapi squad with Ram, Sam, and Sita.

**Request:**
```json
{
  "ramId": "asst_xxx",
  "samId": "asst_xxx",
  "sitaId": "asst_xxx"
}
```

**Response:**
```json
{
  "success": true,
  "squad": { "id": "squad_xxx" }
}
```

### POST /api/vapi/webhook
Handles Vapi webhooks for function calls and events.

**Events:**
- function-call
- status-update
- transcript
- conversation-update
- hang

### POST /api/bookings/availability
Check available time slots.

**Request:**
```json
{
  "date": "2024-01-15",
  "serviceType": "IT Consultation"
}
```

### POST /api/bookings/create
Create a new booking.

**Request:**
```json
{
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "+1234567890",
  "startDateTime": "2024-01-15T10:00:00Z",
  "endDateTime": "2024-01-15T11:00:00Z",
  "serviceType": "IT Consultation",
  "notes": "Server issues"
}
```

## 📦 Dependencies

### Core
- **next**: ^14.0.0 - React framework
- **react**: ^18.2.0 - UI library
- **react-dom**: ^18.2.0 - React DOM renderer

### APIs
- **@vapi-ai/web**: ^2.0.0 - Vapi SDK
- **@microsoft/microsoft-graph-client**: ^3.0.0 - MS Graph API
- **@azure/msal-browser**: ^3.0.0 - Azure authentication
- **axios**: ^1.6.0 - HTTP client

### UI
- **lucide-react**: ^0.300.0 - Icon library
- **tailwindcss**: ^3.4.0 - CSS framework

### Dev
- **typescript**: ^5.3.0
- **@types/node**: ^20.10.0
- **@types/react**: ^18.2.0

## 🎨 Styling System

### Tailwind Configuration
**File:** `tailwind.config.js`

**Custom Colors:**
- `dark-bg`: #0a0a0a (main background)
- `dark-secondary`: #1a1a1a (secondary bg)
- `dark-accent`: #2a2a2a (accent bg)
- `accent-primary`: #3b82f6 (blue - Ram)
- `accent-secondary`: #8b5cf6 (purple - Sam)

**Custom Animations:**
- `pulse-slow`: 3s pulse effect
- `wave`: 1.5s wave animation

### Global Styles
**File:** `app/globals.css`

**Custom Classes:**
- `.glass-effect`: Glassmorphism effect
- `.agent-transition`: Smooth transitions
- `.wave-bar`: Audio bar animation
- `.status-pulse`: Status indicator pulse

## 🔐 Environment Variables

### Required
- `NEXT_PUBLIC_VAPI_PUBLIC_KEY`: Vapi public key
- `VAPI_PRIVATE_KEY`: Vapi private key (server-side)
- `NEXT_PUBLIC_RAM_ASSISTANT_ID`: Ram's assistant ID

### Optional
- `NEXT_PUBLIC_SAM_ASSISTANT_ID`: Sam's assistant ID
- `NEXT_PUBLIC_SITA_ASSISTANT_ID`: Sita's assistant ID
- `NEXT_PUBLIC_ELEVENLABS_API_KEY`: ElevenLabs key
- `AZURE_CLIENT_ID`: Azure app client ID
- `AZURE_TENANT_ID`: Azure tenant ID
- `AZURE_CLIENT_SECRET`: Azure secret
- `MICROSOFT_BOOKINGS_BUSINESS_ID`: Bookings business ID

## 🚀 Scripts

```json
{
  "dev": "next dev",          // Start development server
  "build": "next build",      // Build for production
  "start": "next start",      // Start production server
  "lint": "next lint"         // Run ESLint
}
```

## 📊 Data Flow

```
User Action
    ↓
VoicePlayground Component
    ↓
    ├─→ useVapi Hook → Vapi SDK → Assistants (Ram/Sam/Sita)
    ├─→ useMediaStream Hook → WebRTC → Camera/Mic
    └─→ useChat Hook → Message State
         ↓
    UI Components (Audio, Video, Chat, Controls)
         ↓
    User sees/hears response
```

## 🔄 Agent Handoff Flow

```
1. User connects → Ram (L1) is active
2. Ram determines transfer needed
3. Ram calls handoff tool with destination
4. Vapi transfers call with full context
5. New agent (Sam/Sita) receives conversation history
6. UI updates (AgentStatus, ChatPanel show transfer)
7. New agent continues conversation seamlessly
```

## 🎯 Key Features Implemented

✅ Multi-agent orchestration with Vapi Squad
✅ Real-time voice communication
✅ Video conferencing with WebRTC
✅ Audio visualization
✅ Full conversation transcript
✅ Context preservation across handoffs
✅ Intelligent agent routing
✅ Microsoft Bookings integration (API ready)
✅ Responsive UI with glassmorphism design
✅ TypeScript type safety
✅ Error handling
✅ Browser compatibility

## 📝 Next Development Steps

1. **Deploy to Vercel/Production**
2. **Configure Microsoft Bookings** (if needed)
3. **Customize Agent Prompts** for your use case
4. **Add Analytics** (Vapi dashboard provides call metrics)
5. **Implement Real Authentication** (if needed)
6. **Add Call Recording** (Vapi supports this)
7. **Custom Branding** (colors, logos, etc.)

---

**Project Status:** ✅ Complete and ready for deployment!
