import Vapi from '@vapi-ai/web';
import type { VapiConfig } from './types';

let vapiInstance: Vapi | null = null;

export const getVapiClient = (config: VapiConfig): Vapi => {
  if (!vapiInstance) {
    vapiInstance = new Vapi(config.publicKey);
  }
  return vapiInstance;
};

export const createSquadConfig = (
  ramId: string,
  samId: string,
  sitaId: string
) => {
  return {
    members: [
      {
        assistantId: ramId, // FIRST = DEFAULT ENTRY POINT
        assistantOverrides: {
          name: 'Ram',
        },
      },
      {
        assistantId: samId,
        assistantOverrides: {
          name: 'Sam',
        },
      },
      {
        assistantId: sitaId,
        assistantOverrides: {
          name: 'Sita',
        },
      },
    ],
    memberOverrides: {
      firstMessageMode: 'assistant-speaks-first', // Ram greets user
    },
  };
};

export const cleanupVapiClient = () => {
  if (vapiInstance) {
    vapiInstance = null;
  }
};
