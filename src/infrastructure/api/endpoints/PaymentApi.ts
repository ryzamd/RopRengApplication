/**
 * Payment API
 * API endpoints for payment-related operations including VNPay integration
 */

import { apiClient } from '../ApiClient';
import {
  PaymentDTO,
  CreatePaymentRequest,
  CreatePaymentResponse,
  VerifyVNPayRequest,
  VerifyVNPayResponse,
  CheckPaymentStatusRequest,
  CheckPaymentStatusResponse,
  RefundPaymentRequest,
  RefundPaymentResponse,
} from '../dto';

export class PaymentApi {
  private static readonly BASE_PATH = '/payments';
  private static readonly VNPAY_PATH = '/payments/vnpay';

  /**
   * Create payment for order
   */
  public static async createPayment(
    request: CreatePaymentRequest
  ): Promise<CreatePaymentResponse> {
    const response = await apiClient.post<CreatePaymentResponse>(
      this.BASE_PATH,
      request
    );
    return response.data;
  }

  /**
   * Get payment by ID
   */
  public static async getPaymentById(paymentId: string): Promise<PaymentDTO> {
    const response = await apiClient.get<PaymentDTO>(
      `${this.BASE_PATH}/${paymentId}`
    );
    return response.data;
  }

  /**
   * Get payment by order ID
   */
  public static async getPaymentByOrderId(
    orderId: string
  ): Promise<PaymentDTO> {
    const response = await apiClient.get<PaymentDTO>(
      `${this.BASE_PATH}/order/${orderId}`
    );
    return response.data;
  }

  /**
   * Check payment status
   */
  public static async checkPaymentStatus(
    request: CheckPaymentStatusRequest
  ): Promise<CheckPaymentStatusResponse> {
    const response = await apiClient.post<CheckPaymentStatusResponse>(
      `${this.BASE_PATH}/status`,
      request
    );
    return response.data;
  }

  /**
   * Create VNPay payment URL
   */
  public static async createVNPayPayment(
    orderId: string,
    returnUrl: string,
    ipAddress?: string
  ): Promise<CreatePaymentResponse> {
    const response = await apiClient.post<CreatePaymentResponse>(
      `${this.VNPAY_PATH}/create`,
      {
        orderId,
        returnUrl,
        ipAddress,
      }
    );
    return response.data;
  }

  /**
   * Verify VNPay callback
   */
  public static async verifyVNPayCallback(
    request: VerifyVNPayRequest
  ): Promise<VerifyVNPayResponse> {
    const response = await apiClient.post<VerifyVNPayResponse>(
      `${this.VNPAY_PATH}/callback`,
      request
    );
    return response.data;
  }

  /**
   * Query VNPay transaction status
   */
  public static async queryVNPayTransaction(
    transactionRef: string
  ): Promise<PaymentDTO> {
    const response = await apiClient.get<PaymentDTO>(
      `${this.VNPAY_PATH}/query/${transactionRef}`
    );
    return response.data;
  }

  /**
   * Refund payment
   */
  public static async refundPayment(
    request: RefundPaymentRequest
  ): Promise<RefundPaymentResponse> {
    const response = await apiClient.post<RefundPaymentResponse>(
      `${this.BASE_PATH}/refund`,
      request
    );
    return response.data;
  }

  /**
   * Get user's payment history
   */
  public static async getPaymentHistory(): Promise<PaymentDTO[]> {
    const response = await apiClient.get<{ payments: PaymentDTO[] }>(
      `${this.BASE_PATH}/history`
    );
    return response.data.payments;
  }

  /**
   * Get pending payments
   */
  public static async getPendingPayments(): Promise<PaymentDTO[]> {
    const response = await apiClient.get<{ payments: PaymentDTO[] }>(
      `${this.BASE_PATH}/pending`
    );
    return response.data.payments;
  }
}
