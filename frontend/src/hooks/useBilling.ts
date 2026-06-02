"use client";

import { useState, useCallback } from "react";
import {
  checkout,
  addServiceUsage,
  recordRoomInspection,
  CheckoutRequest,
  CheckoutResponse,
  AddServiceRequest,
  AddServiceResponse,
  RecordInspectionRequest,
  RecordInspectionResponse,
} from "@/lib/api/billing";

interface UseBillingState {
  loading: boolean;
  error: string | null;
  lastAddedService: AddServiceResponse | null;
  lastInspection: RecordInspectionResponse | null;
}

export function useBilling() {
  const [state, setState] = useState<UseBillingState>({
    loading: false,
    error: null,
    lastAddedService: null,
    lastInspection: null,
  });

  const performCheckout = useCallback(
    async (request: CheckoutRequest): Promise<CheckoutResponse | null> => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const response = await checkout(request);
        if (response.code >= 400 || !response.result) {
          const errorMsg = response.message || "Lỗi checkout không xác định";
          setState((prev) => ({ ...prev, loading: false, error: errorMsg }));
          throw new Error(errorMsg);
        }
        setState((prev) => ({
          ...prev,
          loading: false,
          error: null,
        }));
        return response.result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Lỗi checkout không xác định";
        setState((prev) => ({ ...prev, loading: false, error: errorMessage }));
        throw err;
      }
    },
    []
  );

  const addService = useCallback(
    async (request: AddServiceRequest): Promise<AddServiceResponse | null> => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const response = await addServiceUsage(request);
        if (response.code >= 400 || !response.result) {
          const errorMsg = response.message || "Lỗi thêm dịch vụ không xác định";
          setState((prev) => ({ ...prev, loading: false, error: errorMsg }));
          throw new Error(errorMsg);
        }
        setState((prev) => ({
          ...prev,
          loading: false,
          error: null,
          lastAddedService: response.result,
        }));
        return response.result;
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

  const recordInspection = useCallback(
    async (
      request: RecordInspectionRequest
    ): Promise<RecordInspectionResponse | null> => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const response = await recordRoomInspection(request);
        if (response.code >= 400 || !response.result) {
          const errorMsg = response.message || "Lỗi ghi nhận kiểm kê không xác định";
          setState((prev) => ({ ...prev, loading: false, error: errorMsg }));
          throw new Error(errorMsg);
        }
        setState((prev) => ({
          ...prev,
          loading: false,
          error: null,
          lastInspection: response.result,
        }));
        return response.result;
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
    performCheckout,
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
