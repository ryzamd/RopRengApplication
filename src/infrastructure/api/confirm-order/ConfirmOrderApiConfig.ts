export const CONFIRM_ORDER_ENDPOINTS = {
  /**
   * Confirm order endpoint
   * @param id - Preorder ID
   * @returns Full endpoint path
   */
  CONFIRM: (id: number) => `/orders/confirm/${id}`,
};