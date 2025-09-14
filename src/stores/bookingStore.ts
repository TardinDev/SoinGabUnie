import { create } from 'zustand';
import type { Booking } from '../types';

interface BookingState {
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => void;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
  getBookingById: (id: string) => Booking | undefined;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],

  addBooking: (bookingData) => {
    const booking: Booking = {
      ...bookingData,
      id: `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      bookings: [...state.bookings, booking],
    }));
  },

  updateBookingStatus: (id, status) => {
    set((state) => ({
      bookings: state.bookings.map((booking) =>
        booking.id === id ? { ...booking, status } : booking
      ),
    }));
  },

  getBookingById: (id) => {
    return get().bookings.find((booking) => booking.id === id);
  },
}));