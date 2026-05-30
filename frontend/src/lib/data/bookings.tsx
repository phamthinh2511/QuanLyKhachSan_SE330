import { Booking } from "@/types/booking";

const today = new Date().toISOString().split("T")[0];

export const mockBookings: Booking[] = [];