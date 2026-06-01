"use client";

import { useState, useCallback } from "react";
import {
  checkout,
  CheckoutRequest,
  CheckoutResponse,
} from "@/lib/api/billing";

interface UseBillingState {
  loading: boolean;
  error: string | null;
}

export function useBilling() {
  const [state, setState] = useState<UseBillingState>({
    loading: false,
    error: null,
  });

  const performCheckout = useCallback(
    async (request: CheckoutRequest): Promise<CheckoutResponse | null> => {
      setState({ loading: true, error: null });
      try {
        const response = await checkout(request);
        setState({ loading: false, error: null });
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Lỗi checkout không xác định";
        setState({ loading: false, error: errorMessage });
        throw err;
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    performCheckout,
    loading: state.loading,
    error: state.error,
    clearError,
  };
}
