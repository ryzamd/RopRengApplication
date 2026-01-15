export const ORDER_HISTORY_API = {
  GET_HISTORY: (userUuid: string) => `/orders/history/${userUuid}`,
  GET_DETAIL: (orderId: number) => `/orders/${orderId}`,
} as const;