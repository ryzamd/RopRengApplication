/**
 * Mock Store Data
 * Sample stores for development and testing
 */

import { StoreDTO } from '../api/dto';

export const MOCK_STORES: StoreDTO[] = [
  {
    id: 'store-1',
    name: 'RopReng Quận 1',
    address: '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM',
    latitude: 10.7756,
    longitude: 106.7019,
    phone: '0281234567',
    isActive: true,
    operatingHours: {
      openTime: '07:00',
      closeTime: '22:00',
    },
    createdAt: Date.now() - 365 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'store-2',
    name: 'RopReng Quận 3',
    address: '456 Võ Văn Tần, Phường 6, Quận 3, TP.HCM',
    latitude: 10.7826,
    longitude: 106.6897,
    phone: '0281234568',
    isActive: true,
    operatingHours: {
      openTime: '07:00',
      closeTime: '23:00',
    },
    createdAt: Date.now() - 330 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 20 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'store-3',
    name: 'RopReng Bình Thạnh',
    address: '789 Điện Biên Phủ, Phường 15, Quận Bình Thạnh, TP.HCM',
    latitude: 10.8018,
    longitude: 106.7124,
    phone: '0281234569',
    isActive: true,
    operatingHours: {
      openTime: '06:30',
      closeTime: '22:30',
    },
    createdAt: Date.now() - 300 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'store-4',
    name: 'RopReng Quận 7',
    address: '101 Nguyễn Thị Thập, Phường Tân Phú, Quận 7, TP.HCM',
    latitude: 10.7295,
    longitude: 106.7192,
    phone: '0281234570',
    isActive: true,
    operatingHours: {
      openTime: '07:00',
      closeTime: '22:00',
    },
    createdAt: Date.now() - 270 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'store-5',
    name: 'RopReng Thủ Đức',
    address: '202 Võ Văn Ngân, Phường Linh Chiểu, TP. Thủ Đức, TP.HCM',
    latitude: 10.8509,
    longitude: 106.7717,
    phone: '0281234571',
    isActive: true,
    operatingHours: {
      openTime: '06:00',
      closeTime: '23:00',
    },
    createdAt: Date.now() - 240 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'store-6',
    name: 'RopReng Tân Bình',
    address: '303 Cộng Hòa, Phường 13, Quận Tân Bình, TP.HCM',
    latitude: 10.7995,
    longitude: 106.6499,
    phone: '0281234572',
    isActive: false, // Temporarily closed for renovation
    operatingHours: {
      openTime: '07:00',
      closeTime: '22:00',
    },
    createdAt: Date.now() - 210 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
  },
];

// Default store for mock orders
export const DEFAULT_MOCK_STORE = MOCK_STORES[0];
