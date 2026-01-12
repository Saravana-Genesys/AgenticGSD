# Vapi Configuration Guide

Detailed guide for setting up your Vapi Squad with proper multi-agent orchestration.

## Overview

**Vapi Squads** is the recommended way to build multi-agent workflows. According to the [Vapi Squads documentation](https://docs.vapi.ai/squads), Squads let you break complex workflows into multiple specialized assistants that hand off to each other during a conversation.

You need to:
1. Create 3 individual assistants in Vapi Dashboard
2. Create a Squad and add these assistants as members
3. Configure handoff tools within the Squad interface

## Assistant 1: Ram (L1 Agent)

### Basic Settings
- **Name:** `Ram`
- **Model:** 
  - Provider: `openai`
  - Model: `gpt-4o` (recommended) or `gpt-4`
- **Voice:**
  - Provider: `11labs` (ElevenLabs)
  - Voice ID: Choose a professional male voice
  - Stability: `0.5`
  - Similarity: `0.75`

### System Prompt
```
You are Ram, the L1 IT support agent and first point of contact for all users. Greet users warmly and understand their IT issues. 

Handle basic IT problems:
- Password resets
- Account lockouts
- Software installation guidance
- Basic troubleshooting
- General IT questions

When to transfer:
- Transfer to Sam: Complex technical issues (servers, networks, databases, advanced debugging)
- Transfer to Sita: User requests human consultant, product discussion, or consultancy services

Be professional, friendly, and efficient. Always acknowledge the user's issue before transferring.
```

### Tools Configuration

Add **Handoff Tool**:

```json
{
  "type": "handoff",
  "destinations": [
    {
      "type": "assistant",
      "assistantId": "{{SAM_ASSISTANT_ID}}",
      "description": "Transfer to Sam when issue requires: server configuration, network diagnostics, database issues, advanced debugging, system errors, or any problem beyond basic troubleshooting.",
      "message": "Transferring user to L2 support. User has reported: {{issue_summary}}. Previous troubleshooting: {{actions_taken}}"
    },
    {
      "type": "assistant",
      "assistantId": "{{SITA_ASSISTANT_ID}}",
      "description": "Transfer to Sita when user requests to speak with human consultant, needs product discussion, or wants consultancy services.",
      "message": "User needs human consultation. Issue context: {{issue_summary}}. Reason for consultation: {{reason}}"
    }
  ]
}
```

**Note:** Replace `{{SAM_ASSISTANT_ID}}` and `{{SITA_ASSISTANT_ID}}` with actual IDs after creating those assistants.

---

## Assistant 2: Sam (L2 Agent)

### Basic Settings
- **Name:** `Sam`
- **Model:** 
  - Provider: `openai`
  - Model: `gpt-4o`
- **Voice:**
  - Provider: `11labs`
  - Voice ID: Choose a technical male voice
  - Stability: `0.5`
  - Similarity: `0.75`

### System Prompt
```
You are Sam, an L2 IT support specialist. You have full context of the user's conversation with Ram. Acknowledge what has been discussed and continue from there - DO NOT ask the user to repeat information.

Handle complex technical issues:
- Server problems and configuration
- Network diagnostics and troubleshooting
- Database issues and optimization
- Advanced system diagnostics
- Code debugging assistance
- Infrastructure problems

Provide detailed technical solutions with step-by-step guidance. Be thorough and technical while remaining clear.

When to transfer:
- Transfer to Sita: Issue cannot be resolved remotely, requires on-site support, needs human engineer intervention, or user requests human consultant.

Important: You already know the issue from Ram's context - start helping immediately.
```

### Tools Configuration

Add **Handoff Tool**:

```json
{
  "type": "handoff",
  "destinations": [
    {
      "type": "assistant",
      "assistantId": "{{SITA_ASSISTANT_ID}}",
      "description": "Transfer to Sita when issue cannot be resolved remotely, requires on-site support, needs human engineer intervention, or user requests human consultant.",
      "message": "User needs senior engineer consultation. Technical issue: {{detailed_issue}}. Troubleshooting performed: {{steps_taken}}. Current status: {{status}}"
    }
  ]
}
```

---

## Assistant 3: Sita (Booking Agent)

### Basic Settings
- **Name:** `Sita`
- **Model:** 
  - Provider: `openai`
  - Model: `gpt-4o`
- **Voice:**
  - Provider: `11labs`
  - Voice ID: Choose a professional female voice
  - Stability: `0.6`
  - Similarity: `0.80`

### System Prompt
```
You are Sita, a booking specialist. You have full context of the user's entire conversation with Ram and/or Sam. Acknowledge their issue and the help they've received so far.

Help users schedule appointments with human IT consultants for:
- In-depth technical consultancy
- Product discussions
- Complex issues requiring human expertise
- On-site support needs

Your process:
1. Acknowledge the issue and previous help received
2. Understand the consultation purpose
3. Ask for preferred date/time
4. Collect contact information:
   - Full name
   - Email address
   - Phone number
5. Confirm booking details
6. Use check_availability to find slots
7. Use create_booking to schedule
8. Provide confirmation

Be warm, accommodating, and efficient.
```

### Tools Configuration

Add **Function Tools**:

#### Tool 1: Check Availability

```json
{
  "type": "function",
  "function": {
    "name": "check_availability",
    "description": "Check available time slots in Microsoft Bookings for a specific date and service type",
    "parameters": {
      "type": "object",
      "properties": {
        "date": {
          "type": "string",
          "description": "Date in YYYY-MM-DD format"
        },
        "serviceType": {
          "type": "string",
          "description": "Type of consultation (e.g., 'Technical Consultation', 'Product Discussion')"
        }
      },
      "required": ["date"]
    }
  },
  "server": {
    "url": "https://your-domain.com/api/bookings/availability",
    "method": "POST"
  }
}
```

#### Tool 2: Create Booking

```json
{
  "type": "function",
  "function": {
    "name": "create_booking",
    "description": "Create an appointment in Microsoft Bookings",
    "parameters": {
      "type": "object",
      "properties": {
        "customerName": {
          "type": "string",
          "description": "Full name of the customer"
        },
        "customerEmail": {
          "type": "string",
          "description": "Email address of the customer"
        },
        "customerPhone": {
          "type": "string",
          "description": "Phone number of the customer"
        },
        "dateTime": {
          "type": "string",
          "description": "Appointment date and time in ISO format"
        },
        "serviceType": {
          "type": "string",
          "description": "Type of consultation"
        },
        "notes": {
          "type": "string",
          "description": "Additional notes about the issue or consultation needs"
        }
      },
      "required": ["customerName", "customerEmail", "dateTime"]
    }
  },
  "server": {
    "url": "https://your-domain.com/api/bookings/create",
    "method": "POST"
  }
}
```

**Note:** Replace `https://your-domain.com` with your actual deployment URL. For local testing, these endpoints will return mock data.

---

---

## Creating the Squad (RECOMMENDED APPROACH)

After creating all three assistants, you need to create a Squad to connect them.

### Option 1: Create Squad via Vapi Dashboard (Easiest)

1. **Navigate to Squads**
   - In Vapi Dashboard, click **"Squads"** in the left sidebar
   - Click **"+ Create Squad"** or **"+ Add Assistant"**

2. **Add Squad Members**
   - Click the **"Start Node"** button
   - Add **Ram** as the first member (this makes him the default entry point)
   - Click **"+ Add Assistant"** to add **Sam**
   - Click **"+ Add Assistant"** to add **Sita**

3. **Configure Ram's Handoff Tools**
   - Click on the **Ram** node in the Squad editor
   - Scroll to **"Handoff Tools"** section
   - Click **"+ Add"** to add handoff destinations
   
   **Add Handoff to Sam:**
   - Type: `assistant`
   - Assistant: Select **Sam** from dropdown
   - Description: 
     ```
     Transfer to Sam when issue requires: server configuration, network diagnostics, 
     database issues, advanced debugging, system errors, or any problem beyond basic troubleshooting.
     ```
   - Message (optional): `Transferring user to L2 support. User reported: {issue_summary}`
   
   **Add Handoff to Sita:**
   - Type: `assistant`
   - Assistant: Select **Sita** from dropdown
   - Description:
     ```
     Transfer to Sita when user requests to speak with human consultant, 
     needs product discussion, or wants consultancy services.
     ```
   - Message (optional): `User needs human consultation. Issue context: {issue_summary}`

4. **Configure Sam's Handoff Tool**
   - Click on the **Sam** node
   - Scroll to **"Handoff Tools"**
   - Click **"+ Add"**
   
   **Add Handoff to Sita:**
   - Type: `assistant`
   - Assistant: Select **Sita** from dropdown
   - Description:
     ```
     Transfer to Sita when issue cannot be resolved remotely, requires on-site support, 
     needs human engineer intervention, or user requests human consultant.
     ```
   - Message (optional): `User needs senior engineer consultation. Technical issue: {detailed_issue}`

5. **Save the Squad**
   - Click **"Save"** or **"Create Squad"**
   - Copy the **Squad ID** (format: `squad_xxxxxxxxx`)

6. **Update Your .env.local**
   ```env
   NEXT_PUBLIC_VAPI_SQUAD_ID=squad_xxxxxxxxx
   ```

### Option 2: Create Squad via API

```bash
curl -X POST https://api.vapi.ai/squad \
  -H "Authorization: Bearer YOUR_VAPI_PRIVATE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "members": [
      {
        "assistantId": "RAM_ASSISTANT_ID",
        "assistantOverrides": {
          "name": "Ram"
        }
      },
      {
        "assistantId": "SAM_ASSISTANT_ID",
        "assistantOverrides": {
          "name": "Sam"
        }
      },
      {
        "assistantId": "SITA_ASSISTANT_ID",
        "assistantOverrides": {
          "name": "Sita"
        }
      }
    ],
    "memberOverrides": {
      "firstMessageMode": "assistant-speaks-first"
    }
  }'
```

The response will include a Squad ID that you can use to start calls directly with the squad.

---

## Testing Configuration

### Test Ram → Sam Transfer

**User:** "Hi, I'm having database connection issues"
**Ram:** Helps with basic troubleshooting
**User:** "It's a complex replication problem"
**Ram:** *Should transfer to Sam*
**Sam:** "I understand you're having database replication issues..." (acknowledging context)

### Test Ram → Sita Transfer

**User:** "I need to discuss your enterprise plan"
**Ram:** *Should transfer to Sita*
**Sita:** "I'll help you schedule a consultation to discuss our enterprise plan..."

### Test Sam → Sita Transfer

**User:** "My server is completely down, I need someone on-site"
**Sam:** Attempts remote diagnostics
**Sam:** *Should transfer to Sita*
**Sita:** "I'll schedule an on-site visit for your server issue..."

---

## Important Notes

1. **First Assistant Speaks First:** Set `firstMessageMode: "assistant-speaks-first"` so Ram greets the user
2. **Context Preservation:** Vapi automatically passes full conversation history during handoffs
3. **Assistant IDs:** Keep track of all assistant IDs - you need them for handoff configuration
4. **Voice Selection:** Choose distinct voices for each agent to help users identify transitions
5. **Testing:** Test handoffs thoroughly in Vapi dashboard before deploying

---

## Troubleshooting

### Handoffs Not Working

- Verify assistant IDs are correct in handoff destinations
- Check that handoff tool is properly configured
- Ensure the model can understand when to transfer (GPT-4 recommended)

### Context Not Preserved

- Vapi handles this automatically - if context is missing, check your system prompts
- Make sure prompts mention "you have full context from previous conversation"

### Functions Not Called

- Verify server URLs are accessible from Vapi's servers
- Check function descriptions are clear and detailed
- Ensure required parameters are specified correctly

---

## Next Steps

1. Create all three assistants in Vapi Dashboard
2. Copy the assistant IDs to your `.env.local`
3. Configure handoff tools with correct destination IDs
4. Test each handoff path in Vapi playground
5. Deploy your Next.js app
6. Update function server URLs to your deployment URL

---

**Need Help?** Check [Vapi Documentation](https://docs.vapi.ai) or contact Vapi support.
