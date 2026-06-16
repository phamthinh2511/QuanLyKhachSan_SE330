/**
 * @file Custom hook for managing booking data and related actions.
 */
import { useState, useEffect, useCallback } from "react";
import { Booking } from "@/types/booking";
import {
  getAllBookings,
  submitBookingForm,
  deleteBooking,
  updateBooking,
  checkInBooking,
  checkOutBooking,
  BookingRequestPayload,
} from "@/lib/api/bookings";

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllBookings();
      setBookings(data.result || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra khi tải danh sách đặt phòng");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const createBooking = async (bookingData: BookingRequestPayload) => {
    try {
      await submitBookingForm(bookingData);
      // After a successful action, refetch the entire list to ensure data consistency
      await fetchBookings();
    } catch (err) {
      console.error("Failed to create booking:", err);
      throw err; // Re-throw to be caught by the component
    }
  };

  const editBooking = async (id: number, bookingData: BookingRequestPayload) => {
    try {
      await updateBooking(id, bookingData);
      await fetchBookings();
    } catch (err) {
      console.error("Failed to update booking:", err);
      throw err;
    }
  };

  const removeBooking = async (id: number) => {
    try {
      await deleteBooking(id);
      // Optimistic update: remove from state immediately
      // setBookings((prev) => prev.filter((b) => b.id !== id));
      // Or refetch for consistency
      await fetchBookings();
    } catch (err) {
      console.error("Failed to delete booking:", err);
      throw err;
    }
  };

  const processCheckIn = async (bookingId: number, maNhanVien: number) => {
    try {
      await checkInBooking(bookingId, maNhanVien);
      await fetchBookings();
    } catch (err) {
      console.error("Failed to process check-in:", err);
      throw err;
    }
  };
  
  const processCheckOut = async (bookingId: number, paymentMethod: string) => {
    try {
      await checkOutBooking(bookingId, paymentMethod);
      await fetchBookings();
    } catch (err) {
      console.error("Failed to process check-out:", err);
      throw err;
    }
  };

  return {
    bookings,
    loading,
    error,
    refetch: fetchBookings,
    createBooking,
    editBooking,
    removeBooking,
    processCheckIn,
    processCheckOut,
  };
}
