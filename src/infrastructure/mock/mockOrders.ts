/**
 * Mock Order Data
 * Sample orders for development and testing
 */

import { OrderDTO, OrderItemDTO, DeliveryAddressDTO } from '../api/dto';
import { OrderStatus } from '../../domain/entities/order/OrderStatus';
import { CURRENT_MOCK_USER } from './mockUsers';
import { DEFAULT_MOCK_STORE } from './mockStores';
import { MOCK_PRODUCTS } from './mockProducts';

const MOCK_DELIVERY_ADDRESS: DeliveryAddressDTO = {
  street: '123 Lê Lợi',
  ward: 'Phường Bến Thành',
  district: 'Quận 1',
  city: 'TP. Hồ Chí Minh',
  coordinates: {
    latitude: 10.7723,
    longitude: 106.6989,
  },
};

export const MOCK_ORDERS: OrderDTO[] = [
  {
    id: 'order-1',
    userId: CURRENT_MOCK_USER.id,
    storeId: DEFAULT_MOCK_STORE.id,
    items: [
      {
        productId: MOCK_PRODUCTS[0].id,
        productName: MOCK_PRODUCTS[0].name,
        quantity: 2,
        unitPrice: MOCK_PRODUCTS[0].price,
        subtotal: MOCK_PRODUCTS[0].price * 2,
        selectedOptions: {
          'Kích cỡ': 'Vừa (M)',
          'Đá': '70%',
          'Đường': '50%',
        },
      },
      {
        productId: MOCK_PRODUCTS[3].id,
        productName: MOCK_PRODUCTS[3].name,
        quantity: 1,
        unitPrice: MOCK_PRODUCTS[3].price,
        subtotal: MOCK_PRODUCTS[3].price,
        selectedOptions: {
          'Kích cỡ': 'Lớn (L)',
          'Đá': '100%',
          'Đường': '70%',
          'Topping': 'Trân châu đen, Kem cheese',
        },
      },
    ],
    subtotal: MOCK_PRODUCTS[0].price * 2 + MOCK_PRODUCTS[3].price,
    deliveryFee: 15000,
    discount: 0,
    total: MOCK_PRODUCTS[0].price * 2 + MOCK_PRODUCTS[3].price + 15000,
    status: OrderStatus.COMPLETED,
    deliveryAddress: MOCK_DELIVERY_ADDRESS,
    deliveryTime: Date.now() - 2 * 24 * 60 * 60 * 1000,
    notes: 'Giao hàng trước 10h sáng',
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'order-2',
    userId: CURRENT_MOCK_USER.id,
    storeId: DEFAULT_MOCK_STORE.id,
    items: [
      {
        productId: MOCK_PRODUCTS[1].id,
        productName: MOCK_PRODUCTS[1].name,
        quantity: 1,
        unitPrice: MOCK_PRODUCTS[1].price,
        subtotal: MOCK_PRODUCTS[1].price,
        selectedOptions: {
          'Kích cỡ': 'Lớn (L)',
          'Đá': '50%',
          'Đường': '30%',
        },
      },
      {
        productId: MOCK_PRODUCTS[8].id,
        productName: MOCK_PRODUCTS[8].name,
        quantity: 1,
        unitPrice: MOCK_PRODUCTS[8].price,
        subtotal: MOCK_PRODUCTS[8].price,
      },
    ],
    subtotal: MOCK_PRODUCTS[1].price + MOCK_PRODUCTS[8].price,
    deliveryFee: 0, // Pickup
    discount: 10000, // Voucher
    total: MOCK_PRODUCTS[1].price + MOCK_PRODUCTS[8].price - 10000,
    status: OrderStatus.COMPLETED,
    notes: 'Lấy tại cửa hàng',
    createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'order-3',
    userId: CURRENT_MOCK_USER.id,
    storeId: DEFAULT_MOCK_STORE.id,
    items: [
      {
        productId: MOCK_PRODUCTS[6].id,
        productName: MOCK_PRODUCTS[6].name,
        quantity: 3,
        unitPrice: MOCK_PRODUCTS[6].price,
        subtotal: MOCK_PRODUCTS[6].price * 3,
        selectedOptions: {
          'Kích cỡ': 'Vừa (M)',
          'Đá': '100%',
          'Đường': '100%',
        },
      },
    ],
    subtotal: MOCK_PRODUCTS[6].price * 3,
    deliveryFee: 20000,
    discount: 0,
    total: MOCK_PRODUCTS[6].price * 3 + 20000,
    status: OrderStatus.DELIVERING,
    deliveryAddress: MOCK_DELIVERY_ADDRESS,
    deliveryTime: Date.now() + 30 * 60 * 1000, // 30 minutes from now
    notes: 'Gọi trước khi đến',
    createdAt: Date.now() - 1 * 60 * 60 * 1000,
    updatedAt: Date.now() - 15 * 60 * 1000,
  },
  {
    id: 'order-4',
    userId: CURRENT_MOCK_USER.id,
    storeId: DEFAULT_MOCK_STORE.id,
    items: [
      {
        productId: MOCK_PRODUCTS[4].id,
        productName: MOCK_PRODUCTS[4].name,
        quantity: 2,
        unitPrice: MOCK_PRODUCTS[4].price,
        subtotal: MOCK_PRODUCTS[4].price * 2,
        selectedOptions: {
          'Kích cỡ': 'Lớn (L)',
          'Đá': '70%',
          'Đường': '50%',
          'Topping': 'Trân châu đen, Pudding',
        },
      },
    ],
    subtotal: MOCK_PRODUCTS[4].price * 2,
    deliveryFee: 15000,
    discount: 5000,
    total: MOCK_PRODUCTS[4].price * 2 + 15000 - 5000,
    status: OrderStatus.PREPARING,
    deliveryAddress: MOCK_DELIVERY_ADDRESS,
    deliveryTime: Date.now() + 60 * 60 * 1000, // 1 hour from now
    createdAt: Date.now() - 30 * 60 * 1000,
    updatedAt: Date.now() - 10 * 60 * 1000,
  },
  {
    id: 'order-5',
    userId: CURRENT_MOCK_USER.id,
    storeId: DEFAULT_MOCK_STORE.id,
    items: [
      {
        productId: MOCK_PRODUCTS[10].id,
        productName: MOCK_PRODUCTS[10].name,
        quantity: 1,
        unitPrice: MOCK_PRODUCTS[10].price,
        subtotal: MOCK_PRODUCTS[10].price,
        selectedOptions: {
          'Kích cỡ': 'Vừa (M)',
          'Đường': '70%',
        },
      },
      {
        productId: MOCK_PRODUCTS[9].id,
        productName: MOCK_PRODUCTS[9].name,
        quantity: 2,
        unitPrice: MOCK_PRODUCTS[9].price,
        subtotal: MOCK_PRODUCTS[9].price * 2,
      },
    ],
    subtotal: MOCK_PRODUCTS[10].price + MOCK_PRODUCTS[9].price * 2,
    deliveryFee: 0,
    discount: 0,
    total: MOCK_PRODUCTS[10].price + MOCK_PRODUCTS[9].price * 2,
    status: OrderStatus.PENDING,
    notes: 'Chờ xác nhận',
    createdAt: Date.now() - 5 * 60 * 1000,
    updatedAt: Date.now() - 5 * 60 * 1000,
  },
];
