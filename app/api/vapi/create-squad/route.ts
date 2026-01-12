import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { ramId, samId, sitaId } = await request.json();

    if (!ramId || !samId || !sitaId) {
      return NextResponse.json(
        { error: 'Missing assistant IDs' },
        { status: 400 }
      );
    }

    const vapiPrivateKey = process.env.VAPI_PRIVATE_KEY;

    if (!vapiPrivateKey) {
      return NextResponse.json(
        { error: 'Vapi private key not configured' },
        { status: 500 }
      );
    }

    // Create squad configuration
    const squadConfig = {
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

    // Create squad via Vapi API
    const response = await fetch('https://api.vapi.ai/squad', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${vapiPrivateKey}`,
      },
      body: JSON.stringify(squadConfig),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Vapi API error:', error);
      return NextResponse.json(
        { error: 'Failed to create squad' },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      squad: data,
    });
  } catch (error) {
    console.error('Error creating squad:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
