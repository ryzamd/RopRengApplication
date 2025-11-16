/**
 * Payment Data Transfer Objects
 * DTOs for payment-related API requests/responses
 */

import { PaymentMethod } from '../../../domain/entities/payment/PaymentMethod';
import { PaymentStatus } from '../../../domain/entities/payment/PaymentStatus';

/**
 * Payment response from API
 */
export interface PaymentDTO {
  id: string;
  orderId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  vnpayData?: VNPayDataDTO;
  errorMessage?: string;
  paidAt?: number;
  refundedAt?: number;
  createdAt: number;
  updatedAt: number;
}

/**
 * VNPay transaction data
 */
export interface VNPayDataDTO {
  vnp_TxnRef: string; // Transaction reference
  vnp_TransactionNo?: string; // VNPay transaction number
  vnp_BankCode?: string; // Bank code
  vnp_CardType?: string; // Card type
  vnp_PayDate?: string; // Payment date
  vnp_ResponseCode?: string; // Response code
  vnp_SecureHash?: string; // Secure hash
}

/**
 * Create payment request
 */
export interface CreatePaymentRequest {
  orderId: string;
  method: PaymentMethod;
  returnUrl: string; // For VNPay redirect back
  ipAddress?: string;
}

/**
 * Create payment response
 */
export interface CreatePaymentResponse {
  payment: PaymentDTO;
  paymentUrl?: string; // VNPay payment URL (if method is VNPAY)
}

/**
 * Verify VNPay callback request
 */
export interface VerifyVNPayRequest {
  vnp_TxnRef: string;
  vnp_TransactionNo: string;
  vnp_Amount: string;
  vnp_BankCode: string;
  vnp_CardType: string;
  vnp_PayDate: string;
  vnp_ResponseCode: string;
  vnp_SecureHash: string;
  [key: string]: string; // VNPay sends many parameters
}

/**
 * Verify VNPay callback response
 */
export interface VerifyVNPayResponse {
  success: boolean;
  payment: PaymentDTO;
  message?: string;
}

/**
 * Check payment status request
 */
export interface CheckPaymentStatusRequest {
  orderId: string;
}

/**
 * Check payment status response
 */
export interface CheckPaymentStatusResponse {
  payment: PaymentDTO;
}

/**
 * Refund payment request
 */
export interface RefundPaymentRequest {
  paymentId: string;
  reason: string;
  amount?: number; // Partial refund if specified
}

/**
 * Refund payment response
 */
export interface RefundPaymentResponse {
  payment: PaymentDTO;
  refundTransactionId: string;
}
