import { NextResponse } from 'next/server';
import { getAvailableTimeSlots } from '@/lib/microsoft-bookings';

export async function POST(request: Request) {
  try {
    const { date, serviceType } = await request.json();

    if (!date) {
      return NextResponse.json(
        { error: 'Date is required' },
        { status: 400 }
      );
    }

    // Get access token from request or session
    // For now, we'll return mock data
    // In production, you'd authenticate and call the Microsoft Graph API

    const businessId = process.env.MICROSOFT_BOOKINGS_BUSINESS_ID;

    if (!businessId) {
      return NextResponse.json(
        { error: 'Microsoft Bookings not configured' },
        { status: 500 }
      );
    }

    // Mock availability data
    // In production: const slots = await getAvailableTimeSlots(accessToken, businessId, serviceType, date);
    const slots = [
      { start: '09:00 AM', end: '10:00 AM', available: true },
      { start: '10:00 AM', end: '11:00 AM', available: true },
      { start: '11:00 AM', end: '12:00 PM', available: false },
      { start: '02:00 PM', end: '03:00 PM', available: true },
      { start: '03:00 PM', end: '04:00 PM', available: true },
    ];

    return NextResponse.json({
      success: true,
      date,
      serviceType,
      slots,
    });
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    );
  }
}
