/**
 * Mock User Data
 * Sample users for development and testing
 */

import { UserDTO } from '../api/dto';

export const MOCK_USERS: UserDTO[] = [
  {
    id: 'user-1',
    phone: '0901234567',
    name: 'Nguyễn Văn An',
    email: 'nguyenvanan@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?u=user1',
    createdAt: Date.now() - 90 * 24 * 60 * 60 * 1000, // 90 days ago
    updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'user-2',
    phone: '0912345678',
    name: 'Trần Thị Bình',
    email: 'tranthibinh@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?u=user2',
    createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'user-3',
    phone: '0923456789',
    name: 'Lê Văn Châu',
    email: 'levanchau@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?u=user3',
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
  },
];

// Current mock user (for testing)
export const CURRENT_MOCK_USER = MOCK_USERS[0];

// Mock OTP for testing
export const MOCK_OTP = '123456';

// Mock token
export const MOCK_AUTH_TOKEN = 'mock-jwt-token-' + Date.now();
