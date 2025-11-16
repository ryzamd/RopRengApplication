/**
 * Mock Payment Data
 * Sample payments for development and testing
 */

import { PaymentDTO } from '../api/dto';
import { PaymentMethod } from '../../domain/entities/payment/PaymentMethod';
import { PaymentStatus } from '../../domain/entities/payment/PaymentStatus';
import { MOCK_ORDERS } from './mockOrders';

export const MOCK_PAYMENTS: PaymentDTO[] = [
  {
    id: 'payment-1',
    orderId: MOCK_ORDERS[0].id,
    amount: MOCK_ORDERS[0].total,
    method: PaymentMethod.VNPAY,
    status: PaymentStatus.SUCCESS,
    transactionId: 'VNP-' + Date.now() + '-1',
    vnpayData: {
      vnp_TxnRef: 'REF-' + MOCK_ORDERS[0].id,
      vnp_TransactionNo: '14123456',
      vnp_BankCode: 'NCB',
      vnp_CardType: 'ATM',
      vnp_PayDate: new Date(MOCK_ORDERS[0].createdAt).toISOString(),
      vnp_ResponseCode: '00',
      vnp_SecureHash: 'mock-hash-1234567890abcdef',
    },
    paidAt: MOCK_ORDERS[0].createdAt + 2 * 60 * 1000,
    createdAt: MOCK_ORDERS[0].createdAt,
    updatedAt: MOCK_ORDERS[0].createdAt + 2 * 60 * 1000,
  },
  {
    id: 'payment-2',
    orderId: MOCK_ORDERS[1].id,
    amount: MOCK_ORDERS[1].total,
    method: PaymentMethod.CASH,
    status: PaymentStatus.SUCCESS,
    paidAt: MOCK_ORDERS[1].updatedAt,
    createdAt: MOCK_ORDERS[1].createdAt,
    updatedAt: MOCK_ORDERS[1].updatedAt,
  },
  {
    id: 'payment-3',
    orderId: MOCK_ORDERS[2].id,
    amount: MOCK_ORDERS[2].total,
    method: PaymentMethod.VNPAY,
    status: PaymentStatus.SUCCESS,
    transactionId: 'VNP-' + Date.now() + '-3',
    vnpayData: {
      vnp_TxnRef: 'REF-' + MOCK_ORDERS[2].id,
      vnp_TransactionNo: '14123458',
      vnp_BankCode: 'VIETCOMBANK',
      vnp_CardType: 'ATM',
      vnp_PayDate: new Date(MOCK_ORDERS[2].createdAt).toISOString(),
      vnp_ResponseCode: '00',
      vnp_SecureHash: 'mock-hash-abcdef1234567890',
    },
    paidAt: MOCK_ORDERS[2].createdAt + 3 * 60 * 1000,
    createdAt: MOCK_ORDERS[2].createdAt,
    updatedAt: MOCK_ORDERS[2].createdAt + 3 * 60 * 1000,
  },
  {
    id: 'payment-4',
    orderId: MOCK_ORDERS[3].id,
    amount: MOCK_ORDERS[3].total,
    method: PaymentMethod.VNPAY,
    status: PaymentStatus.SUCCESS,
    transactionId: 'VNP-' + Date.now() + '-4',
    vnpayData: {
      vnp_TxnRef: 'REF-' + MOCK_ORDERS[3].id,
      vnp_TransactionNo: '14123459',
      vnp_BankCode: 'TECHCOMBANK',
      vnp_CardType: 'ATM',
      vnp_PayDate: new Date(MOCK_ORDERS[3].createdAt).toISOString(),
      vnp_ResponseCode: '00',
      vnp_SecureHash: 'mock-hash-1122334455667788',
    },
    paidAt: MOCK_ORDERS[3].createdAt + 1 * 60 * 1000,
    createdAt: MOCK_ORDERS[3].createdAt,
    updatedAt: MOCK_ORDERS[3].createdAt + 1 * 60 * 1000,
  },
  {
    id: 'payment-5',
    orderId: MOCK_ORDERS[4].id,
    amount: MOCK_ORDERS[4].total,
    method: PaymentMethod.VNPAY,
    status: PaymentStatus.PENDING,
    transactionId: 'VNP-' + Date.now() + '-5',
    vnpayData: {
      vnp_TxnRef: 'REF-' + MOCK_ORDERS[4].id,
      vnp_SecureHash: 'mock-hash-pending-payment',
    },
    createdAt: MOCK_ORDERS[4].createdAt,
    updatedAt: MOCK_ORDERS[4].createdAt,
  },
];

// Mock payment that will fail (for testing error handling)
export const MOCK_FAILED_PAYMENT: PaymentDTO = {
  id: 'payment-failed-1',
  orderId: 'order-test-failed',
  amount: 100000,
  method: PaymentMethod.VNPAY,
  status: PaymentStatus.FAILED,
  errorMessage: 'Giao dịch bị từ chối bởi ngân hàng',
  vnpayData: {
    vnp_TxnRef: 'REF-failed-test',
    vnp_ResponseCode: '24',
    vnp_SecureHash: 'mock-hash-failed',
  },
  createdAt: Date.now() - 10 * 60 * 1000,
  updatedAt: Date.now() - 9 * 60 * 1000,
};
