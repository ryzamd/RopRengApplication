/**
 * Mock API Service
 * Provides mock API responses when USE_MOCK_DATA is enabled
 * Simulates network delays and mimics real API behavior
 */

import {
  UserDTO,
  SendOTPRequest,
  SendOTPResponse,
  VerifyOTPRequest,
  VerifyOTPResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  ProductDTO,
  CategoryDTO,
  GetProductsRequest,
  GetProductsResponse,
  GetCategoriesResponse,
  StoreDTO,
  GetStoresResponse,
  GetNearbyStoresRequest,
  GetNearbyStoresResponse,
  OrderDTO,
  CreateOrderRequest,
  CreateOrderResponse,
  GetOrdersResponse,
  PaymentDTO,
  CreatePaymentRequest,
  CreatePaymentResponse,
} from '../api/dto';
import { PaymentMethod } from '../../domain/entities/payment/PaymentMethod';
import { PaymentStatus } from '../../domain/entities/payment/PaymentStatus';
import { OrderStatus } from '../../domain/entities/order/OrderStatus';
import {
  MOCK_USERS,
  CURRENT_MOCK_USER,
  MOCK_OTP,
  MOCK_AUTH_TOKEN,
  MOCK_CATEGORIES,
  MOCK_PRODUCTS,
  MOCK_STORES,
  MOCK_ORDERS,
  MOCK_PAYMENTS,
} from './index';

/**
 * Simulate network delay
 */
async function delay(ms: number = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Mock API Service
 */
export class MockApiService {
  // User API
  public static async sendOTP(
    request: SendOTPRequest
  ): Promise<SendOTPResponse> {
    await delay();
    return {
      success: true,
      message: `OTP đã được gửi đến số ${request.phone}. Sử dụng mã: ${MOCK_OTP}`,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    };
  }

  public static async verifyOTP(
    request: VerifyOTPRequest
  ): Promise<VerifyOTPResponse> {
    await delay();

    if (request.otp !== MOCK_OTP) {
      throw new Error('Mã OTP không chính xác');
    }

    // Find or create user
    let user = MOCK_USERS.find((u) => u.phone === request.phone);
    if (!user) {
      user = {
        id: 'user-' + Date.now(),
        phone: request.phone,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
    }

    return {
      success: true,
      token: MOCK_AUTH_TOKEN,
      user,
    };
  }

  public static async getCurrentUser(): Promise<UserDTO> {
    await delay();
    return CURRENT_MOCK_USER;
  }

  public static async updateProfile(
    request: UpdateUserRequest
  ): Promise<UpdateUserResponse> {
    await delay();
    const updatedUser = {
      ...CURRENT_MOCK_USER,
      ...request,
      updatedAt: Date.now(),
    };
    return { user: updatedUser };
  }

  // Product API
  public static async getProducts(
    request?: GetProductsRequest
  ): Promise<GetProductsResponse> {
    await delay();

    let products = [...MOCK_PRODUCTS];

    // Filter by category
    if (request?.categoryId) {
      products = products.filter((p) => p.categoryId === request.categoryId);
    }

    // Search
    if (request?.search) {
      const query = request.search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query)
      );
    }

    // Pagination
    const limit = request?.limit || 50;
    const offset = request?.offset || 0;
    const paginatedProducts = products.slice(offset, offset + limit);

    return {
      products: paginatedProducts,
      total: products.length,
    };
  }

  public static async getProductById(productId: string): Promise<ProductDTO> {
    await delay();
    const product = MOCK_PRODUCTS.find((p) => p.id === productId);
    if (!product) {
      throw new Error('Không tìm thấy sản phẩm');
    }
    return product;
  }

  public static async getCategories(): Promise<GetCategoriesResponse> {
    await delay();
    return { categories: MOCK_CATEGORIES };
  }

  // Store API
  public static async getStores(): Promise<GetStoresResponse> {
    await delay();
    return { stores: MOCK_STORES.filter((s) => s.isActive) };
  }

  public static async getStoreById(storeId: string): Promise<StoreDTO> {
    await delay();
    const store = MOCK_STORES.find((s) => s.id === storeId);
    if (!store) {
      throw new Error('Không tìm thấy cửa hàng');
    }
    return store;
  }

  public static async getNearbyStores(
    request: GetNearbyStoresRequest
  ): Promise<GetNearbyStoresResponse> {
    await delay();

    // Simple distance calculation (Haversine formula)
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const R = 6371; // Earth radius in km

    const storesWithDistance = MOCK_STORES.filter((s) => s.isActive).map(
      (store) => {
        const dLat = toRad(store.latitude - request.latitude);
        const dLon = toRad(store.longitude - request.longitude);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(toRad(request.latitude)) *
            Math.cos(toRad(store.latitude)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        return { ...store, distance };
      }
    );

    // Filter by radius and sort by distance
    const nearbyStores = storesWithDistance
      .filter((s) => s.distance <= request.radiusKm)
      .sort((a, b) => a.distance - b.distance);

    return { stores: nearbyStores };
  }

  // Order API
  public static async createOrder(
    request: CreateOrderRequest
  ): Promise<CreateOrderResponse> {
    await delay(500); // Simulate longer operation

    const orderId = 'order-' + Date.now();

    // Calculate totals
    const items = request.items.map((item) => {
      const product = MOCK_PRODUCTS.find((p) => p.id === item.productId);
      if (!product) {
        throw new Error(`Sản phẩm ${item.productId} không tồn tại`);
      }

      return {
        productId: item.productId,
        productName: product.name,
        quantity: item.quantity,
        unitPrice: product.price,
        subtotal: product.price * item.quantity,
        selectedOptions: item.selectedOptions,
      };
    });

    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const deliveryFee = request.deliveryAddress ? 15000 : 0;
    const discount = 0;
    const total = subtotal + deliveryFee - discount;

    const order: OrderDTO = {
      id: orderId,
      userId: CURRENT_MOCK_USER.id,
      storeId: request.storeId,
      items,
      subtotal,
      deliveryFee,
      discount,
      total,
      status: OrderStatus.PENDING,
      deliveryAddress: request.deliveryAddress,
      deliveryTime: request.deliveryTime,
      notes: request.notes,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    return {
      order,
      paymentUrl: `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_TxnRef=${orderId}`,
    };
  }

  public static async getOrders(): Promise<GetOrdersResponse> {
    await delay();
    return {
      orders: MOCK_ORDERS,
      total: MOCK_ORDERS.length,
    };
  }

  public static async getOrderById(orderId: string): Promise<OrderDTO> {
    await delay();
    const order = MOCK_ORDERS.find((o) => o.id === orderId);
    if (!order) {
      throw new Error('Không tìm thấy đơn hàng');
    }
    return order;
  }

  // Payment API
  public static async createPayment(
    request: CreatePaymentRequest
  ): Promise<CreatePaymentResponse> {
    await delay(500);

    const order = MOCK_ORDERS.find((o) => o.id === request.orderId);
    if (!order) {
      throw new Error('Không tìm thấy đơn hàng');
    }

    const paymentId = 'payment-' + Date.now();

    const payment: PaymentDTO = {
      id: paymentId,
      orderId: request.orderId,
      amount: order.total,
      method: request.method,
      status:
        request.method === PaymentMethod.CASH
          ? PaymentStatus.PENDING
          : PaymentStatus.PENDING,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    let paymentUrl: string | undefined;
    if (request.method === PaymentMethod.VNPAY) {
      paymentUrl = `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_TxnRef=${request.orderId}&vnp_Amount=${order.total * 100}`;
    }

    return {
      payment,
      paymentUrl,
    };
  }

  public static async getPaymentByOrderId(
    orderId: string
  ): Promise<PaymentDTO> {
    await delay();
    const payment = MOCK_PAYMENTS.find((p) => p.orderId === orderId);
    if (!payment) {
      throw new Error('Không tìm thấy thanh toán');
    }
    return payment;
  }

  public static async getPaymentHistory(): Promise<PaymentDTO[]> {
    await delay();
    return MOCK_PAYMENTS;
  }
}
