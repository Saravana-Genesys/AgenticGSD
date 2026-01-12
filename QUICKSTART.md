# Quick Start Guide

Get AgenticGSD up and running in 10 minutes!

## Step 1: Install Dependencies (2 min)

```bash
npm install
# or
yarn install
```

## Step 2: Set Up Vapi Account (5 min)

1. **Sign up at [Vapi.ai](https://vapi.ai)**
   - Create a free account
   - Navigate to Dashboard

2. **Get Your API Keys**
   - Go to Settings → API Keys
   - Copy your **Public Key**
   - Copy your **Private Key**

3. **Create Two Assistants** (Ram & Sam)

> **Note:** For now, we'll set up just Ram (L1) and Sam (L2). You can add Sita (Booking Agent) later if needed.

   ### Ram (L1 Agent)
   - Name: `Ram`
   - Model: `gpt-4o` (or `gpt-4`)
   - Voice Provider: `ElevenLabs`
   - System Prompt:
     ```
     You are Ram, the L1 IT support agent and first point of contact. 
     Handle basic IT issues like password resets and software installation. 
     Transfer complex issues to Sam, and booking requests to Sita.
     ```
   - Add **Handoff Tool** with destinations to Sam and Sita
   - Copy the **Assistant ID**

   ### Sam (L2 Agent)
   - Name: `Sam`
   - Model: `gpt-4o`
   - Voice Provider: `ElevenLabs`
   - System Prompt:
     ```
     You are Sam, L2 technical specialist. You receive full context from Ram. 
     Handle complex technical issues like servers, networks, and databases.
     Transfer to Sita if human intervention needed.
     ```
   - Add **Handoff Tool** with destination to Sita
   - Copy the **Assistant ID**

4. **Create a Squad** ⭐ **IMPORTANT**

   Now that you have two assistants, create a Squad to connect them:

   - In Vapi Dashboard, click **"Squads"** in the left sidebar
   - Click **"+ Create Squad"** or **"+ Add Assistant"**
   - Add your assistants in order:
     1. **Start Node**: Add Ram (this will be the first agent)
     2. Add Sam
   
   - **Configure Handoff Tool in Ram:**
     - Click on Ram node
     - Under "Handoff Tools" click **"+ Add"**
     - Add handoff destination to **Sam** with description:
       ```
       Transfer to Sam for complex technical issues like servers, networks, databases, 
       advanced debugging, or any problem requiring advanced technical expertise.
       ```
   
   - **Sam doesn't need handoff tools** (he's the final agent in this setup)
   
   - **Save the Squad** and copy the **Squad ID**

> **Optional:** You can add Sita (Booking Agent) later by editing the Squad and adding handoff tools from Ram and Sam to Sita.

## Step 3: Configure Environment Variables (1 min)

Create `.env.local` in the project root:

```env
# Copy these from Vapi Dashboard
NEXT_PUBLIC_VAPI_PUBLIC_KEY=pk_xxxxxxxx
VAPI_PRIVATE_KEY=sk_xxxxxxxx

# RECOMMENDED: Use Squad ID (from Squad you created with Ram & Sam)
NEXT_PUBLIC_VAPI_SQUAD_ID=squad_xxxxxxxx

# OR use individual assistant (if not using Squad)
# NEXT_PUBLIC_RAM_ASSISTANT_ID=asst_xxxxxxxx

# Individual Assistant IDs (for reference)
NEXT_PUBLIC_SAM_ASSISTANT_ID=asst_xxxxxxxx

# Optional - Add Sita later if you need booking functionality
# NEXT_PUBLIC_SITA_ASSISTANT_ID=asst_xxxxxxxx
# MICROSOFT_BOOKINGS_BUSINESS_ID=
```

> **Important:** Use `NEXT_PUBLIC_VAPI_SQUAD_ID` for multi-agent flows. The Squad handles orchestration automatically according to [Vapi Squads documentation](https://docs.vapi.ai/squads).

## Step 4: Run the Application (1 min)

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000)

## Step 5: Test It Out! (1 min)

1. **Allow Camera/Microphone** when prompted
2. **Click "Connect with Ram"**
3. **Test the flow:**
   - Say: *"Hi, I need help with my password"*
   - Ram should respond and help you
   - Try: *"Actually, I have a complex database replication error"*
   - Ram should transfer you to Sam
   - Sam should acknowledge the context and help with the advanced issue

## 🎉 You're Done!

Your multi-agent IT support system is now running!

## 🐛 Troubleshooting

### "Configuration Required" page shows

- Check that `.env.local` exists in project root
- Verify all environment variables are set
- Restart the dev server after adding `.env.local`

### Camera/Microphone not working

- Check browser permissions
- Use Chrome/Edge for best compatibility
- Ensure you're on `localhost` or `https://` (not `http://`)

### Call not connecting

- Verify your Vapi Public Key is correct
- Check that Ram Assistant ID is valid
- Open browser console for error messages

### No voice response

- Check ElevenLabs voice is configured in Vapi
- Verify your Vapi account has credits
- Ensure microphone is unmuted in browser

## 📚 Next Steps

1. **Customize Agent Prompts** - Make them specific to your use case
2. **Configure Microsoft Bookings** - Enable real appointment scheduling
3. **Add Custom Functions** - Extend Sita's booking capabilities
4. **Deploy to Production** - Use Vercel for easy deployment
5. **Monitor Usage** - Check Vapi dashboard for call analytics

## 🆘 Need Help?

- Check the full [README.md](./README.md)
- Review [Vapi Documentation](https://docs.vapi.ai)
- Check browser console for errors
- Verify all environment variables are set correctly

---

**Pro Tip:** Start with simple queries to test each agent, then try complex scenarios to see the handoff magic! ✨
