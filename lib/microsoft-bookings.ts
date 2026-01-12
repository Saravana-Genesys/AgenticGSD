import { PublicClientApplication } from '@azure/msal-browser';
import { Client } from '@microsoft/microsoft-graph-client';
import type { BookingService, TimeSlot, BookingAppointment } from './types';

const msalConfig = {
  auth: {
    clientId: process.env.AZURE_CLIENT_ID || '',
    authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}`,
  },
};

let msalInstance: PublicClientApplication | null = null;

export const getMsalInstance = () => {
  if (!msalInstance) {
    msalInstance = new PublicClientApplication(msalConfig);
  }
  return msalInstance;
};

export const getGraphClient = async (accessToken: string): Promise<Client> => {
  return Client.init({
    authProvider: (done) => {
      done(null, accessToken);
    },
  });
};

export const authenticateWithMicrosoft = async () => {
  const msalInstance = getMsalInstance();
  await msalInstance.initialize();

  const loginRequest = {
    scopes: ['Bookings.Read.All', 'Bookings.ReadWrite.All'],
  };

  try {
    const response = await msalInstance.loginPopup(loginRequest);
    return response.accessToken;
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
};

export const getBookingServices = async (
  accessToken: string,
  businessId: string
): Promise<BookingService[]> => {
  const client = await getGraphClient(accessToken);

  try {
    const response = await client
      .api(`/solutions/bookingBusinesses/${businessId}/services`)
      .get();

    return response.value || [];
  } catch (error) {
    console.error('Error fetching booking services:', error);
    throw error;
  }
};

export const getAvailableTimeSlots = async (
  accessToken: string,
  businessId: string,
  serviceId: string,
  date: string
): Promise<TimeSlot[]> => {
  const client = await getGraphClient(accessToken);

  try {
    const response = await client
      .api(`/solutions/bookingBusinesses/${businessId}/getStaffAvailability`)
      .post({
        staffIds: [],
        serviceIds: [serviceId],
        startDateTime: {
          dateTime: `${date}T00:00:00`,
          timeZone: 'UTC',
        },
        endDateTime: {
          dateTime: `${date}T23:59:59`,
          timeZone: 'UTC',
        },
      });

    return response.value || [];
  } catch (error) {
    console.error('Error fetching availability:', error);
    throw error;
  }
};

export const createBooking = async (
  accessToken: string,
  businessId: string,
  appointment: BookingAppointment
): Promise<any> => {
  const client = await getGraphClient(accessToken);

  try {
    const bookingData = {
      '@odata.type': '#microsoft.graph.bookingAppointment',
      customerName: appointment.customerName,
      customerEmailAddress: appointment.customerEmail,
      customerPhone: appointment.customerPhone,
      serviceId: appointment.serviceId,
      startDateTime: {
        dateTime: appointment.startDateTime,
        timeZone: 'UTC',
      },
      endDateTime: {
        dateTime: appointment.endDateTime,
        timeZone: 'UTC',
      },
      customerNotes: appointment.notes || '',
    };

    const response = await client
      .api(`/solutions/bookingBusinesses/${businessId}/appointments`)
      .post(bookingData);

    return response;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};
