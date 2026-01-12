import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log('Vapi webhook received:', body);

    // Handle different webhook events
    switch (body.type) {
      case 'function-call':
        return handleFunctionCall(body);
      
      case 'assistant-request':
        console.log('Assistant request:', body);
        break;
      
      case 'status-update':
        console.log('Status update:', body.status);
        break;
      
      case 'transcript':
        console.log('Transcript:', body.transcript);
        break;
      
      case 'hang':
        console.log('Call ended');
        break;
      
      case 'conversation-update':
        console.log('Conversation update:', body);
        break;
      
      default:
        console.log('Unknown webhook type:', body.type);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleFunctionCall(body: any) {
  const { functionCall } = body;

  if (!functionCall) {
    return NextResponse.json({ error: 'No function call data' }, { status: 400 });
  }

  console.log('Function called:', functionCall.name);
  console.log('Parameters:', functionCall.parameters);

  // Handle different function calls
  switch (functionCall.name) {
    case 'check_availability':
      return await checkAvailability(functionCall.parameters);
    
    case 'create_booking':
      return await createBooking(functionCall.parameters);
    
    default:
      return NextResponse.json(
        { error: 'Unknown function' },
        { status: 400 }
      );
  }
}

async function checkAvailability(params: any) {
  // This would call the Microsoft Bookings API
  // For now, return mock data
  try {
    const { date, serviceType } = params;

    // In production, call Microsoft Graph API here
    const mockSlots = [
      { start: '09:00', end: '10:00', available: true },
      { start: '10:00', end: '11:00', available: true },
      { start: '14:00', end: '15:00', available: true },
    ];

    return NextResponse.json({
      result: {
        date,
        serviceType,
        slots: mockSlots,
      },
    });
  } catch (error) {
    console.error('Error checking availability:', error);
    return NextResponse.json(
      { error: 'Failed to check availability' },
      { status: 500 }
    );
  }
}

async function createBooking(params: any) {
  try {
    const { customerName, customerEmail, customerPhone, dateTime, serviceType, notes } = params;

    // In production, call Microsoft Graph API here
    // For now, return mock success
    const bookingId = `BOOKING-${Date.now()}`;

    console.log('Booking created:', {
      bookingId,
      customerName,
      customerEmail,
      dateTime,
      serviceType,
    });

    return NextResponse.json({
      result: {
        success: true,
        bookingId,
        message: `Appointment scheduled for ${customerName} on ${dateTime}`,
      },
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}
