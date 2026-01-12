'use client';

import { VoicePlayground } from '@/components/VoicePlayground';

export default function Home() {
  const vapiPublicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || '';
  const squadId = process.env.NEXT_PUBLIC_VAPI_SQUAD_ID || '';
  const ramAssistantId = process.env.NEXT_PUBLIC_RAM_ASSISTANT_ID || '';

  // Use Ram's Assistant ID for now (Squad needs server-side API)
  // Squad ID is used for server-side calls, Web SDK uses Assistant ID
  const assistantOrSquadId = ramAssistantId || squadId;
  
  console.log('Vapi Config:', {
    publicKey: vapiPublicKey ? '✓ Set' : '✗ Missing',
    squadId: squadId ? '✓ Set' : '✗ Missing',
    ramId: ramAssistantId ? '✓ Set' : '✗ Missing',
    using: assistantOrSquadId
  });

  if (!vapiPublicKey || !assistantOrSquadId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto p-8 glass-effect rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-red-400">Configuration Required</h2>
          <div className="space-y-4 text-gray-300">
            <p>
              Please configure your environment variables in <code className="bg-dark-accent px-2 py-1 rounded">.env.local</code>:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>NEXT_PUBLIC_VAPI_PUBLIC_KEY (required)</li>
              <li>NEXT_PUBLIC_VAPI_SQUAD_ID (recommended) OR NEXT_PUBLIC_RAM_ASSISTANT_ID</li>
            </ul>
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded">
              <p className="text-sm text-blue-300">
                <strong>Getting Started:</strong>
              </p>
              <ol className="list-decimal list-inside mt-2 space-y-1 text-xs text-blue-200">
                <li>Sign up for Vapi at <a href="https://vapi.ai" className="underline" target="_blank" rel="noopener noreferrer">vapi.ai</a></li>
                <li>Create three assistants: Ram (L1), Sam (L2), and Sita (Booking)</li>
                <li>
                  <strong>Create a Squad</strong> in Vapi Dashboard:
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li>Add Ram as first member (Start Node)</li>
                    <li>Add handoff tools from Ram → Sam and Ram → Sita</li>
                    <li>Add handoff tool from Sam → Sita</li>
                    <li>Copy the Squad ID</li>
                  </ul>
                </li>
                <li>Add NEXT_PUBLIC_VAPI_SQUAD_ID to your <code className="bg-dark-accent px-1 rounded">.env.local</code></li>
                <li>Restart the development server</li>
              </ol>
            </div>
            <div className="mt-4 p-4 bg-purple-500/10 border border-purple-500/30 rounded">
              <p className="text-xs text-purple-300">
                💡 <strong>Tip:</strong> Using a Squad ID is recommended as it handles multi-agent orchestration automatically. 
                See <a href="https://docs.vapi.ai/squads" className="underline" target="_blank" rel="noopener noreferrer">Vapi Squads Documentation</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <VoicePlayground 
      vapiPublicKey={vapiPublicKey} 
      assistantOrSquadId={assistantOrSquadId}
      isSquad={!!squadId}
    />
  );
}
