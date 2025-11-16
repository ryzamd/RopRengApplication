/**
 * Mock Category Data
 * Sample product categories for development and testing
 */

import { CategoryDTO } from '../api/dto';

export const MOCK_CATEGORIES: CategoryDTO[] = [
  {
    id: 'cat-1',
    name: 'Cà phê',
    description: 'Các loại cà phê truyền thống và hiện đại',
    imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400',
    isActive: true,
    displayOrder: 1,
    createdAt: Date.now() - 180 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'cat-2',
    name: 'Trà sữa',
    description: 'Trà sữa đa dạng với nhiều topping',
    imageUrl: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=400',
    isActive: true,
    displayOrder: 2,
    createdAt: Date.now() - 180 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'cat-3',
    name: 'Trà trái cây',
    description: 'Trà trái cây tươi mát, giải nhiệt',
    imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
    isActive: true,
    displayOrder: 3,
    createdAt: Date.now() - 180 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'cat-4',
    name: 'Bánh ngọt',
    description: 'Bánh ngọt, bánh mì, snack',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
    isActive: true,
    displayOrder: 4,
    createdAt: Date.now() - 180 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'cat-5',
    name: 'Đồ uống đặc biệt',
    description: 'Smoothie, sinh tố, nước ép',
    imageUrl: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400',
    isActive: true,
    displayOrder: 5,
    createdAt: Date.now() - 180 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
  },
];
