"use client";

import { useState, useCallback } from "react";
import {
  addServiceUsage,
  recordRoomInspection,
  AddServiceRequest,
  AddServiceResponse,
  RecordInspectionRequest,
  RecordInspectionResponse,
} from "@/lib/api/billing";

interface UseBillingServicesState {
  loading: boolean;
  error: string | null;
  lastAddedService: AddServiceResponse | null;
  lastInspection: RecordInspectionResponse | null;
}

/**
 * Hook để quản lý các dịch vụ phát sinh và kiểm kê phòng
 * Được sử dụng trong quá trình checkout
 */
export function useBillingServices() {
  const [state, setState] = useState<UseBillingServicesState>({
    loading: false,
    error: null,
    lastAddedService: null,
    lastInspection: null,
  });

  /**
   * Thêm dịch vụ phát sinh (đồ ăn, giặt ủi, v.v.)
   * - maPhieuThue: Mã phiếu thuê
   * - maDichVu: Mã dịch vụ
   * - maPhong: Mã phòng
   * - soLuong: Số lượng
   * - donGia: Đơn giá
   */
  const addService = useCallback(
    async (request: AddServiceRequest): Promise<AddServiceResponse | null> => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const response = await addServiceUsage(request);
        if (response.message.startsWith("Lỗi")) {
          const errorMsg = response.message;
          setState((prev) => ({ ...prev, loading: false, error: errorMsg }));
          throw new Error(errorMsg);
        }
        setState((prev) => ({
          ...prev,
          loading: false,
          error: null,
          lastAddedService: response,
        }));
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Lỗi thêm dịch vụ không xác định";
        setState((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));
        throw err;
      }
    },
    []
  );

  /**
   * Ghi nhận kiểm kê phòng (nếu có hỏng hóc, làm mất đồ...)
   * - maPhieuThue: Mã phiếu thuê
   * - maPhong: Mã phòng
   * - maNhanVien: Mã nhân viên kiểm kê
   * - tinhTrang: Tình trạng phòng (vd: "Phòng bình thường" hoặc "Hỏng TV")
   * - tienBoiThuong: Tiền bồi thường (nếu có hỏng)
   */
  const recordInspection = useCallback(
    async (
      request: RecordInspectionRequest
    ): Promise<RecordInspectionResponse | null> => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const response = await recordRoomInspection(request);
        if (response.message.startsWith("Lỗi")) {
          const errorMsg = response.message;
          setState((prev) => ({ ...prev, loading: false, error: errorMsg }));
          throw new Error(errorMsg);
        }
        setState((prev) => ({
          ...prev,
          loading: false,
          error: null,
          lastInspection: response,
        }));
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Lỗi ghi nhận kiểm kê không xác định";
        setState((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));
        throw err;
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const resetState = useCallback(() => {
    setState({
      loading: false,
      error: null,
      lastAddedService: null,
      lastInspection: null,
    });
  }, []);

  return {
    addService,
    recordInspection,
    loading: state.loading,
    error: state.error,
    lastAddedService: state.lastAddedService,
    lastInspection: state.lastInspection,
    clearError,
    resetState,
  };
}
