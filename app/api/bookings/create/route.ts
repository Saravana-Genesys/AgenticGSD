import { NextResponse } from 'next/server';
import { createBooking } from '@/lib/microsoft-bookings';
import type { BookingAppointment } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const appointmentData: BookingAppointment = await request.json();

    // Validate required fields
    if (
      !appointmentData.customerName ||
      !appointmentData.customerEmail ||
      !appointmentData.startDateTime
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const businessId = process.env.MICROSOFT_BOOKINGS_BUSINESS_ID;

    if (!businessId) {
      return NextResponse.json(
        { error: 'Microsoft Bookings not configured' },
        { status: 500 }
      );
    }

    // In production, get access token and call Microsoft Graph API
    // const accessToken = await getAccessToken();
    // const booking = await createBooking(accessToken, businessId, appointmentData);

    // Mock booking creation
    const bookingId = `BOOKING-${Date.now()}`;

    console.log('Booking created:', {
      bookingId,
      customer: appointmentData.customerName,
      email: appointmentData.customerEmail,
      dateTime: appointmentData.startDateTime,
    });

    return NextResponse.json({
      success: true,
      bookingId,
      message: 'Appointment successfully scheduled',
      appointment: {
        id: bookingId,
        customerName: appointmentData.customerName,
        customerEmail: appointmentData.customerEmail,
        startDateTime: appointmentData.startDateTime,
        endDateTime: appointmentData.endDateTime,
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
