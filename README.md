# AgenticGSD - Multi-Agent IT Support System

A Next.js application with Vapi AI multi-agent orchestration for IT support desk featuring three specialized agents: Ram (L1), Sam (L2), and Sita (Booking Agent).

## 🌟 Features

- **Multi-Agent Orchestration**: Seamless handoffs between L1 and L2 agents (Booking agent optional)
- **Full Context Preservation**: All agents have access to complete conversation history via Vapi Squads
- **Real-time Voice Communication**: Powered by Vapi.ai and ElevenLabs
- **Video Support**: WebRTC-based video conferencing
- **Smart Routing**: Intelligent agent transfers based on issue complexity
- **Microsoft Bookings Integration**: Optional - Add Sita for appointment scheduling later
- **Beautiful UI**: Modern glassmorphism design with real-time visualizations

## 🏗️ Architecture

### Agent Flow

```
User → Ram (L1 Agent) → Sam (L2 Agent)
         [DEFAULT]        [Complex Technical]
                              ↓
                      [Resolves Issue]
```

**Simple 2-Agent Setup (Recommended to start):**

**Ram (L1 Agent)** - Default Entry Point
- Handles basic IT issues
- Password resets, account lockouts
- Software installation guidance
- Routes to Sam for complex technical issues

**Sam (L2 Agent)** - Technical Specialist
- Advanced technical troubleshooting
- Server and network diagnostics
- Database problems
- Complex debugging
- Final escalation point

**Optional: Sita (Booking Agent)** - Add Later for Scheduling
- Schedules consultations with human experts
- Manages Microsoft Bookings integration
- Handles product discussions
- Can be added by editing your Squad

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Vapi.ai account ([Sign up](https://vapi.ai))
- ElevenLabs account ([Sign up](https://elevenlabs.io))
- Microsoft Azure account (for Bookings integration - optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd AgenticGSD
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Create a Vapi Squad**

   According to [Vapi's Squad documentation](https://docs.vapi.ai/squads), Squads are the recommended way for multi-agent conversations:
   
   - Create three assistants (Ram, Sam, Sita) in Vapi Dashboard
   - Go to **Squads** section and create a new Squad
   - Add assistants as members (Ram first as entry point)
   - Configure handoff tools between agents
   - Copy the Squad ID

   See `SQUAD_SETUP.md` for a detailed visual guide.

4. **Configure environment variables**
   
   Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

   Fill in your credentials:
   ```env
   # Vapi Configuration
   NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_vapi_public_key
   VAPI_PRIVATE_KEY=your_vapi_private_key

   # Squad ID (RECOMMENDED for multi-agent flows)
   NEXT_PUBLIC_VAPI_SQUAD_ID=squad_xxxxxxxx

   # OR Individual Assistant ID (if not using Squad)
   NEXT_PUBLIC_RAM_ASSISTANT_ID=ram_assistant_id

   # ElevenLabs (Optional - configured in Vapi)
   NEXT_PUBLIC_ELEVENLABS_API_KEY=your_elevenlabs_key

   # Microsoft Azure (Optional - for Bookings)
   AZURE_CLIENT_ID=your_azure_client_id
   AZURE_TENANT_ID=your_azure_tenant_id
   AZURE_CLIENT_SECRET=your_azure_client_secret
   MICROSOFT_BOOKINGS_BUSINESS_ID=your_bookings_business_id
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📋 Vapi Configuration

### Understanding Vapi Squads

**Vapi Squads** is the recommended approach for multi-agent workflows. According to the [official documentation](https://docs.vapi.ai/squads):

> Squads let you break complex workflows into multiple specialized assistants that hand off to each other during a conversation.

**Benefits:**
- ✅ Lower hallucination rates (focused assistants)
- ✅ Reduced costs (shorter prompts = fewer tokens)  
- ✅ Better latency (smaller contexts process faster)
- ✅ Automatic context preservation during handoffs

### Creating Assistants

First, create three individual assistants in the Vapi dashboard:

#### 1. Ram (L1 Agent)

**System Prompt:**
```
You are Ram, the L1 IT support agent and first point of contact for all users. Greet users warmly and understand their IT issues. Handle basic IT problems: password resets, account lockouts, software installation guidance, basic troubleshooting. If the issue requires advanced technical knowledge, seamlessly transfer to Sam (L2 Agent). If the user needs to speak with a human consultant or discuss products, transfer to Sita. Be professional, friendly, and efficient. Always acknowledge the user's issue before transferring.
```

**Voice Provider:** ElevenLabs (male professional voice)

**Tools:** Configure handoff tool with destinations to Sam and Sita

#### 2. Sam (L2 Agent)

**System Prompt:**
```
You are Sam, an L2 IT support specialist. You have full context of the user's conversation with Ram. Acknowledge what has been discussed and continue from there. Handle complex technical issues: server problems, network configuration, database troubleshooting, advanced system diagnostics, code debugging, infrastructure issues. Provide detailed technical solutions with step-by-step guidance. If the issue cannot be resolved remotely or requires human intervention, transfer to Sita for scheduling. Be thorough and technical while remaining clear.
```

**Voice Provider:** ElevenLabs (male technical voice)

**Tools:** Configure handoff tool with destination to Sita

#### 3. Sita (Booking Agent)

**System Prompt:**
```
You are Sita, a booking specialist. You have full context of the user's entire conversation with Ram and/or Sam. Acknowledge their issue and the help they've received so far. Help users schedule appointments with human IT consultants for in-depth consultancy, product discussions, or complex issues requiring human expertise. Ask for preferred date/time, collect contact information (name, email, phone), understand the consultation purpose, and confirm bookings through Microsoft Bookings. Be warm, accommodating, and efficient.
```

**Voice Provider:** ElevenLabs (female professional voice)

**Tools:** 
- `check_availability` function
- `create_booking` function

### Creating the Squad

After creating individual assistants, **create a Squad** in Vapi Dashboard:

1. **Navigate to Squads** in the left sidebar
2. **Create a new Squad**
3. **Add members** in this order:
   - Ram (first = default entry point)
   - Sam
   - Sita
4. **Configure handoff tools:**
   - Ram → Sam (complex technical issues)
   - Ram → Sita (booking requests)
   - Sam → Sita (requires human intervention)
5. **Save and copy the Squad ID**

See `SQUAD_SETUP.md` for a detailed visual guide with screenshots.

**Squad Structure:**
```json
{
  "members": [
    { 
      "assistantId": "ram-id",
      "handoffTools": [
        { "destination": "sam-id", "description": "Complex tech issues" },
        { "destination": "sita-id", "description": "Human consultation" }
      ]
    },
    { 
      "assistantId": "sam-id",
      "handoffTools": [
        { "destination": "sita-id", "description": "Requires human help" }
      ]
    },
    { "assistantId": "sita-id" }
  ],
  "memberOverrides": {
    "firstMessageMode": "assistant-speaks-first"
  }
}
```

## 🎨 UI Components

- **AudioVisualizer**: Real-time audio wave visualization with agent status
- **ChatPanel**: Full conversation transcript with agent transitions
- **VideoPanel**: User video feed with audio level monitoring
- **ControlPanel**: Call controls (start/end, audio/video toggle)
- **AgentStatus**: Visual flow of agent progression

## 🔧 Project Structure

```
AgenticGSD/
├── app/
│   ├── api/
│   │   ├── vapi/
│   │   │   ├── create-squad/route.ts
│   │   │   └── webhook/route.ts
│   │   └── bookings/
│   │       ├── availability/route.ts
│   │       └── create/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── VoicePlayground.tsx
│   ├── AudioVisualizer.tsx
│   ├── ChatPanel.tsx
│   ├── VideoPanel.tsx
│   ├── ControlPanel.tsx
│   └── AgentStatus.tsx
├── hooks/
│   ├── useVapi.ts
│   ├── useMediaStream.ts
│   └── useChat.ts
├── lib/
│   ├── types.ts
│   ├── vapi-client.ts
│   └── microsoft-bookings.ts
└── package.json
```

## 🔐 Security Considerations

- API keys are stored in environment variables
- Private keys are only used server-side
- WebRTC requires HTTPS in production
- Microsoft Graph API uses OAuth 2.0

## 📱 Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari (with WebRTC support)

**Note:** Camera and microphone permissions are required.

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

```bash
# Or use Vercel CLI
vercel --prod
```

### Environment Variables in Production

Make sure to set all required environment variables in your deployment platform.

## 🧪 Testing

Test the complete flow:

1. ✅ User starts with Ram (L1 Agent)
2. ✅ Ram handles basic IT queries
3. ✅ Ram transfers to Sam for complex issues
4. ✅ Sam receives full context
5. ✅ Sam handles advanced technical issues
6. ✅ Sam transfers to Sita when needed
7. ✅ Sita schedules appointments
8. ✅ All context is preserved throughout

## 📖 API Documentation

### Vapi Webhook

**Endpoint:** `/api/vapi/webhook`

Handles Vapi events including:
- Function calls (`check_availability`, `create_booking`)
- Call status updates
- Transcripts

### Bookings API

**Check Availability:** `POST /api/bookings/availability`
```json
{
  "date": "2024-01-15",
  "serviceType": "IT Consultation"
}
```

**Create Booking:** `POST /api/bookings/create`
```json
{
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "+1234567890",
  "startDateTime": "2024-01-15T10:00:00Z",
  "endDateTime": "2024-01-15T11:00:00Z",
  "serviceType": "IT Consultation",
  "notes": "Database performance issues"
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 📚 Additional Documentation

- **`SIMPLE_SETUP.md`** ⭐ **START HERE** - 2-agent setup (Ram + Sam only)
- **`QUICKSTART.md`** - Get up and running in 10 minutes
- **`SQUAD_SETUP.md`** - Visual guide to creating Vapi Squads
- **`VAPI_SETUP.md`** - Detailed assistant and Squad configuration (includes 3-agent setup)
- **`PROJECT_STRUCTURE.md`** - Complete architecture overview

## 🆘 Support

For issues and questions:
- Check the [Vapi Squads Documentation](https://docs.vapi.ai/squads)
- Check the [Vapi Handoff Tools](https://docs.vapi.ai/tools/handoff)
- Review the [Microsoft Graph API docs](https://docs.microsoft.com/en-us/graph/api/resources/bookingbusiness)
- Open an issue on GitHub

## 🙏 Acknowledgments

- [Vapi.ai](https://vapi.ai) for the voice AI platform
- [ElevenLabs](https://elevenlabs.io) for voice synthesis
- [Microsoft Graph API](https://docs.microsoft.com/en-us/graph/) for Bookings integration
- [Next.js](https://nextjs.org) for the framework

---

Built with ❤️ using Next.js, Vapi AI, and modern web technologies.
