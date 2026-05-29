import { apiClient } from "./client";
import { Booking } from "@/types/booking";

export interface BookingRequestPayload {
  maKhachHangId: number;
  maPhongId: number;
  maNhanVienId?: number;
  ngayNhan?: string;
  ngayTra: string;
  donGia: number;
  loaiHinh: "DAT_TRUOC" | "THUE_TRUC_TIEP";
  role?: string;
  trangThai?: string;
  soKhach?: number;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  result?: T;
}

export interface CustomerResponse {
  id: number;
  name: string;
  phone?: string;
  gender?: string;
  birthday?: string;
  address?: string;
  email?: string;
  idCard?: string;
  type?: string;
}

// KHỚP CHÍNH XÁC VỚI LoaiPhongResponseDto Ở BACKEND
export interface LoaiPhongResponseDto {
  id: number;
  tenLoaiPhong: string;
  donGia: number; // Đổi từ giaNgay thành donGia theo DTO Java của bạn
  moTa?: string;
  sucChuaToiDa?: number;
}

export interface RoomResponse {
  id: number;
  maLoaiPhong: LoaiPhongResponseDto; // Chứa đối tượng DTO loại phòng lồng bên trong
  trangThai: string;
  soTang: number;
  sucChua: number;
}

export async function submitBookingForm(payload: BookingRequestPayload): Promise<ApiResponse<void>> {
  return apiClient<ApiResponse<void>>("/api/bookings/submit", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getAllBookings(): Promise<Booking[]> {
  return apiClient<Booking[]>("/api/bookings/all");
}

export async function getAllCustomers(): Promise<CustomerResponse[]> {
  return apiClient<CustomerResponse[]>("/api/customers");
}

export async function getAllRooms(): Promise<RoomResponse[]> {
  return apiClient<RoomResponse[]>("/api/rooms");
}
export async function deleteBooking(id: number): Promise<ApiResponse<void>> {
  return apiClient<ApiResponse<void>>(`/api/bookings/${id}`, {
    method: "DELETE",
  });
}
export async function updateBooking(id: number, payload: BookingRequestPayload): Promise<ApiResponse<void>> {
  return apiClient<ApiResponse<void>>(`/api/bookings/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
export async function checkInBooking(bookingId: number): Promise<any> {
  return apiClient<any>("/api/bookings/check-in", {
    method: "POST",
    body: JSON.stringify({ maDatPhong: bookingId, maNhanVien: 1 }),
  });
}
export async function checkOutBooking(bookingId: number): Promise<ApiResponse<void>> {
  return apiClient<ApiResponse<void>>("/api/bookings/check-out", {
    method: "POST",
    body: JSON.stringify({ bookingId }),
  });
}