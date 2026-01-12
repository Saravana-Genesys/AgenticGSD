# Vapi Squad Setup Guide

Quick visual guide to setting up your Squad in Vapi Dashboard.

## What is a Vapi Squad?

According to [Vapi's Squad documentation](https://docs.vapi.ai/squads), Squads are designed for multi-assistant conversations where specialized assistants hand off to each other during a call. This is the **recommended approach** for AgenticGSD.

## Why Use Squads?

✅ **Better Performance** - Focused assistants with specific roles  
✅ **Lower Costs** - Shorter prompts consume fewer tokens  
✅ **Reduced Latency** - Smaller contexts process faster  
✅ **Less Hallucination** - Clear, focused instructions per agent  
✅ **Automatic Context** - Full conversation history preserved during handoffs  

## Visual Setup Guide

### Step 1: Create Individual Assistants

First, create three assistants in Vapi Dashboard:

1. **Ram** (L1 Agent) - Basic IT support
2. **Sam** (L2 Agent) - Advanced technical support  
3. **Sita** (Booking Agent) - Appointment scheduling

> See `VAPI_SETUP.md` for detailed assistant configurations

### Step 2: Create a Squad

**Navigate to Squads:**
```
Vapi Dashboard → Left Sidebar → Squads → + Create Squad
```

### Step 3: Add Squad Members

The interface will look similar to your screenshot:

```
┌─────────────────────────────────────────────────────┐
│  ▶ Start Node                                       │
│                                                     │
│  ┌──────────────┐                                  │
│  │  👤 Ram      │────────┐                         │
│  │  L1 Agent    │        │                         │
│  │              │        ▼                         │
│  │  Handoff:    │   ┌──────────────┐              │
│  │  ✓ to Sam    │   │  👤 Sam      │              │
│  │  ✓ to Sita   │   │  L2 Agent    │              │
│  └──────────────┘   │              │              │
│                     │  Handoff:    │              │
│                     │  ✓ to Sita   │              │
│                     └──────────────┘              │
│                            │                       │
│                            ▼                       │
│                     ┌──────────────┐              │
│                     │  👤 Sita     │              │
│                     │  Booking     │              │
│                     │  Agent       │              │
│                     └──────────────┘              │
└─────────────────────────────────────────────────────┘
```

**Add Members:**
1. Click **"Start Node"** → Select **Ram** (first member = default entry)
2. Click **"+ Add Assistant"** → Select **Sam**
3. Click **"+ Add Assistant"** → Select **Sita**

### Step 4: Configure Handoff Tools

This is what you're seeing in your screenshot! Each assistant needs handoff tools configured.

#### Ram's Handoff Tools:

Click on the **Ram node** → Scroll to **"Handoff Tools"** → Click **"+ Add"**

**Handoff 1: Ram → Sam**
```
Type: assistant
Assistant: Sam
Description: Transfer to Sam for complex technical issues like server problems, 
network configuration, database troubleshooting, advanced system diagnostics, 
or any issue beyond basic L1 support.

Message: Transferring to L2 support. User issue: {issue_summary}
```

**Handoff 2: Ram → Sita**
```
Type: assistant
Assistant: Sita  
Description: Transfer to Sita when user requests human consultant, 
product discussion, or consultancy booking.

Message: User needs consultation. Context: {issue_summary}
```

#### Sam's Handoff Tool:

Click on the **Sam node** → **"Handoff Tools"** → **"+ Add"**

**Handoff: Sam → Sita**
```
Type: assistant
Assistant: Sita
Description: Transfer to Sita when issue requires on-site support, 
human engineer intervention, or cannot be resolved remotely.

Message: User needs senior engineer. Technical details: {issue}. Steps taken: {troubleshooting}
```

#### Sita's Configuration:

Sita is the final agent - no handoff tools needed (unless you want to add more agents).

### Step 5: Save and Get Squad ID

1. Click **"Save"** or **"Create Squad"** button
2. Copy the **Squad ID** (looks like: `squad_abc123xyz`)
3. You'll see it in the Squad list

### Step 6: Update Environment Variables

Add the Squad ID to your `.env.local`:

```env
NEXT_PUBLIC_VAPI_PUBLIC_KEY=pk_your_public_key
NEXT_PUBLIC_VAPI_SQUAD_ID=squad_abc123xyz  # ← This is what you need!
```

### Step 7: Test Your Squad

1. Start your Next.js app: `npm run dev`
2. Open http://localhost:3000
3. Click **"Connect with Ram"**
4. Test the flow:
   - Say: *"I need help with my password"* → Ram helps
   - Say: *"Actually, I have a database replication error"* → Transfers to Sam
   - Say: *"I need someone on-site to fix this"* → Transfers to Sita

## Important Notes

### Context Preservation

According to [Vapi's documentation](https://docs.vapi.ai/squads), context is **automatically preserved** during handoffs:

- ✅ Full conversation history passed to new agent
- ✅ No need to repeat information
- ✅ New agent knows everything discussed previously

### First Member = Entry Point

Per the [Vapi docs](https://docs.vapi.ai/squads):
> "The first member is the assistant that will start the call."

That's why Ram must be the first member in your Squad!

### Handoff Tool Descriptions

The descriptions you write are **critical** - they tell the AI model **when** to trigger the handoff. Be specific:

✅ Good: "Transfer to Sam when issue involves server errors, database problems, or network configuration"  
❌ Bad: "Transfer to Sam for technical stuff"

### Testing Handoffs

Test each path:
- Ram → Sam (complex tech issue)
- Ram → Sita (booking request)
- Sam → Sita (requires human help)

Watch the console logs and chat panel to verify context is preserved!

## Troubleshooting

### "Handoff tools not configured" error

- Make sure you clicked **"+ Add"** under Handoff Tools for each agent
- Verify you selected the correct destination assistant
- Add a clear description for when to handoff

### Context not preserved during handoff

- This should work automatically with Squads
- Check your assistant system prompts mention "you have full context"
- Verify you're using the Squad ID (not individual assistant ID)

### Agent not transferring

- Check handoff tool descriptions are clear and specific
- Use GPT-4 or GPT-4o (better instruction following)
- Test with explicit user requests: "I want to speak with a specialist"

## Next Steps

Once your Squad is working:

1. ✅ Customize agent prompts for your specific use case
2. ✅ Add custom functions to Sita for real booking integration
3. ✅ Deploy to production (Vercel recommended)
4. ✅ Monitor calls in Vapi Dashboard analytics

---

**Resources:**
- [Vapi Squads Documentation](https://docs.vapi.ai/squads)
- [Vapi Handoff Tools](https://docs.vapi.ai/tools/handoff)
- [Vapi API Reference](https://docs.vapi.ai/api-reference/squads/create-squad)

**Need Help?** Check the Vapi Discord or documentation for Squad-specific questions.
