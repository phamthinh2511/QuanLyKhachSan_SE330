import { apiClient } from "./client";

export interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

/**
 * DTO cho request Thêm Dịch vụ Phát sinh
 */
export interface AddServiceRequest {
  maPhieuThue: number;
  maDichVu: number;
  maPhong: number;
  soLuong: number;
  donGia: number;
}

/**
 * DTO cho response Thêm Dịch vụ Phát sinh
 */
export interface AddServiceResponse {
  id: number;
  thanhTien: number;
  message: string;
}

/**
 * DTO cho request Ghi nhận Kiểm kê Phòng
 */
export interface RecordInspectionRequest {
  maPhieuThue: number;
  maPhong: number;
  maNhanVien: number;
  tinhTrang: string;
  tienBoiThuong: number;
}

/**
 * DTO cho response Ghi nhận Kiểm kê Phòng
 */
export interface RecordInspectionResponse {
  id: number;
  message: string;
}

/**
 * DTO chi tiết cho response Checkout
 */
export interface InvoiceDetail {
  loaiChiPhi: string;
  thanhTien: number;
}

/**
 * DTO cho request Checkout
 */
export interface CheckoutRequest {
  maPhieuThue: number;
  maNhanVien: number;
}

/**
 * DTO cho response Checkout
 */
export interface CheckoutResponse {
  maHoaDon: number;
  tienPhong: number;
  tienDichVu: number;
  tienPhat: number;
  tongTien: number;
  chiTietHoaDon: InvoiceDetail[];
  message: string;
}

/**
 * API 1: Thêm Dịch vụ Phát sinh
 * POST /api/billing/add-service
 * 
 * Ghi nhận khách gọi thêm dồ ăn, giặt ủi...
 */
export async function addServiceUsage(
  request: AddServiceRequest
): Promise<ApiResponse<AddServiceResponse>> {
  return apiClient<ApiResponse<AddServiceResponse>>("/api/billing/add-service", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

/**
 * API 2: Ghi nhận Kiểm kê Phòng
 * POST /api/billing/record-inspection
 * 
 * Ghi nhận kiểm kê khi khách rời đi (nếu khách làm hỏng TV, làm mất chìa khóa...)
 */
export async function recordRoomInspection(
  request: RecordInspectionRequest
): Promise<ApiResponse<RecordInspectionResponse>> {
  return apiClient<ApiResponse<RecordInspectionResponse>>("/api/billing/record-inspection", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

/**
 * API 3: Check-out (⭐ CỐT LÕI)
 * POST /api/billing/checkout
 * 
 * Hàm này sẽ gom tiền từ CtPhieuthuephong + Sudungdichvu + Kiemkephong
 * để chốt ra tổng tiền và xuất Hóa đơn cuối cùng
 * 
 * Response bao gồm:
 * - tienPhong: tiền phòng từ CtPhieuthuephong
 * - tienDichVu: tổng tiền dịch vụ từ Sudungdichvu
 * - tienPhat: tổng tiền phạt/bồi thường từ Kiemkephong
 * - tongTien: tổng cộng = tienPhong + tienDichVu + tienPhat
 * - chiTietHoaDon: chi tiết từng loại chi phí
 */
export async function checkout(
  request: CheckoutRequest
): Promise<ApiResponse<CheckoutResponse>> {
  return apiClient<ApiResponse<CheckoutResponse>>("/api/billing/checkout", {
    method: "POST",
    body: JSON.stringify(request),
  });
}
