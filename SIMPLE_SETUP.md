# Simple 2-Agent Setup (Ram + Sam)

Quick guide to get started with just Ram (L1) and Sam (L2) agents.

## Why Start with 2 Agents?

Starting with just Ram and Sam is perfect for:
- ✅ Quick testing and validation
- ✅ Simpler configuration
- ✅ Learning how Vapi Squads work
- ✅ Focus on core L1 → L2 support flow

You can always add Sita (Booking Agent) later!

## Setup Steps

### 1. Create Two Assistants in Vapi

#### Ram (L1 Agent) - Basic Support

**System Prompt:**
```
You are Ram, the L1 IT support agent and first point of contact for all users. 
Greet users warmly and understand their IT issues.

You handle:
- Password resets
- Account lockouts
- Software installation guidance
- Basic troubleshooting
- General IT questions

When to transfer to Sam:
- Complex technical issues (servers, networks, databases)
- Advanced debugging needs
- System errors beyond basic troubleshooting
- Any problem requiring deep technical expertise

Always acknowledge the user's issue and what you've tried before transferring.
Be professional, friendly, and efficient.
```

**Settings:**
- Model: GPT-4o
- Voice: ElevenLabs (professional male voice)

#### Sam (L2 Agent) - Advanced Support

**System Prompt:**
```
You are Sam, an L2 IT support specialist. You have full context of the user's 
conversation with Ram - acknowledge what has been discussed and continue from there. 
DO NOT ask the user to repeat information.

You handle:
- Server problems and configuration
- Network diagnostics and troubleshooting
- Database issues and optimization
- Advanced system diagnostics
- Code debugging assistance
- Infrastructure problems
- Complex technical issues

Provide detailed technical solutions with step-by-step guidance. 
Be thorough and technical while remaining clear.

You're the final escalation point in this setup, so resolve issues completely.
```

**Settings:**
- Model: GPT-4o
- Voice: ElevenLabs (technical male voice, different from Ram)

### 2. Create a Squad

1. **Go to Squads** in Vapi Dashboard
2. **Create new Squad**
3. **Add Ram** as Start Node (first member)
4. **Add Sam** as second member

### 3. Configure Handoff Tool (Ram → Sam)

Click on **Ram** node in Squad editor:

**Handoff Tool Configuration:**
```
Type: Assistant
Destination: Sam
Description: Transfer to Sam when the issue requires advanced technical expertise 
including server configuration, network diagnostics, database problems, advanced 
debugging, system errors, infrastructure issues, or any technical problem beyond 
basic L1 troubleshooting. Always collect initial details before transferring.

Message: Transferring to L2 support. User issue: {brief_summary}. 
Basic troubleshooting attempted: {steps_taken}
```

### 4. Environment Variables

Create `.env.local`:

```env
# Required
NEXT_PUBLIC_VAPI_PUBLIC_KEY=pk_your_public_key
NEXT_PUBLIC_VAPI_SQUAD_ID=squad_your_squad_id

# Private key for API routes (optional for now)
VAPI_PRIVATE_KEY=sk_your_private_key
```

### 5. Run and Test

```bash
npm run dev
```

Open http://localhost:3000 and test:

**Test Scenario 1: Basic Issue (Ram handles)**
```
You: "Hi, I forgot my password"
Ram: "I can help you reset your password..."
[Ram resolves the issue]
```

**Test Scenario 2: Complex Issue (Ram → Sam)**
```
You: "My database keeps timing out"
Ram: "Let me help with that. What error are you seeing?"
You: "Connection timeout on port 5432, PostgreSQL"
Ram: "This requires advanced troubleshooting. Let me connect you to Sam."
[Transfer happens with full context]
Sam: "Hi, I understand you're having PostgreSQL connection timeouts on port 5432. 
Let me help diagnose this..."
```

## Visual Flow

```
┌──────────────────────────────────────┐
│  User Connects                        │
│         ↓                             │
│  [RAM - L1 AGENT] ← Entry Point      │
│    • Basic IT Support                 │
│    • Password resets                  │
│    • Simple troubleshooting           │
│         ↓                             │
│  Decision:                            │
│    ├─→ Simple? → Ram resolves         │
│    └─→ Complex? → Transfer to Sam     │
│                    ↓                  │
│  [SAM - L2 AGENT]                    │
│    • Advanced technical support       │
│    • Has full context from Ram        │
│    • Deep troubleshooting             │
│         ↓                             │
│  Issue Resolved → End Call            │
└──────────────────────────────────────┘
```

## Key Points

### Context Preservation
- ✅ Sam automatically receives full conversation history with Ram
- ✅ No need for user to repeat information
- ✅ Seamless handoff experience

### Handoff Triggers
Ram should transfer to Sam when:
- Issue involves servers, databases, networks
- User mentions technical terms (ports, configs, logs)
- Basic troubleshooting steps don't work
- Issue requires code/system-level debugging

### Testing Tips

**Good test phrases that trigger handoff:**
- "My server won't start"
- "Database connection errors"
- "Network configuration issues"
- "Application keeps crashing with error code..."
- "I need help debugging my API"

**Phrases Ram should handle:**
- "I forgot my password"
- "Can't log into my account"
- "How do I install software X?"
- "Where can I find...?"

## Adding Sita Later

When you're ready to add booking functionality:

1. Create **Sita** assistant in Vapi
2. Edit your Squad
3. Add Sita as third member
4. Add handoff tools:
   - Ram → Sita (for human consultation requests)
   - Sam → Sita (when issue requires on-site help)
5. Update Squad ID in `.env.local`

## Troubleshooting

### Ram not transferring to Sam
- Check handoff tool description is clear and specific
- Make sure you're using GPT-4 or GPT-4o (better instruction following)
- Test with explicit requests: "I need advanced help with..."

### Context not preserved
- Verify you're using Squad ID (not individual assistant ID)
- Check Sam's prompt mentions "full context from Ram"
- This should work automatically with Vapi Squads

### Can't connect to call
- Verify Squad ID is correct in `.env.local`
- Check Vapi public key is valid
- Allow camera/microphone permissions in browser

## Next Steps

Once this is working:
1. ✅ Customize Ram and Sam's prompts for your specific use case
2. ✅ Test various scenarios and refine handoff descriptions
3. ✅ Add Sita for booking functionality when needed
4. ✅ Deploy to production (Vercel recommended)

---

**Simple, focused, and ready to scale!** 🚀
