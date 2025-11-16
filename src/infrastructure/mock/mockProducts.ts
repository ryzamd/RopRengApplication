/**
 * Mock Product Data
 * Sample products with options for development and testing
 */

import { ProductDTO, ProductOptionDTO } from '../api/dto';

// Common size options
const SIZE_OPTION: ProductOptionDTO = {
  id: 'opt-size',
  productId: '', // Will be set per product
  name: 'Kích cỡ',
  type: 'single',
  required: true,
  values: [
    { id: 'size-s', optionId: 'opt-size', value: 'Nhỏ (S)', priceModifier: 0 },
    { id: 'size-m', optionId: 'opt-size', value: 'Vừa (M)', priceModifier: 5000 },
    { id: 'size-l', optionId: 'opt-size', value: 'Lớn (L)', priceModifier: 10000 },
  ],
};

// Common ice options
const ICE_OPTION: ProductOptionDTO = {
  id: 'opt-ice',
  productId: '',
  name: 'Đá',
  type: 'single',
  required: true,
  values: [
    { id: 'ice-100', optionId: 'opt-ice', value: '100%', priceModifier: 0 },
    { id: 'ice-70', optionId: 'opt-ice', value: '70%', priceModifier: 0 },
    { id: 'ice-50', optionId: 'opt-ice', value: '50%', priceModifier: 0 },
    { id: 'ice-30', optionId: 'opt-ice', value: '30%', priceModifier: 0 },
    { id: 'ice-0', optionId: 'opt-ice', value: 'Không đá', priceModifier: 0 },
  ],
};

// Common sugar options
const SUGAR_OPTION: ProductOptionDTO = {
  id: 'opt-sugar',
  productId: '',
  name: 'Đường',
  type: 'single',
  required: true,
  values: [
    { id: 'sugar-100', optionId: 'opt-sugar', value: '100%', priceModifier: 0 },
    { id: 'sugar-70', optionId: 'opt-sugar', value: '70%', priceModifier: 0 },
    { id: 'sugar-50', optionId: 'opt-sugar', value: '50%', priceModifier: 0 },
    { id: 'sugar-30', optionId: 'opt-sugar', value: '30%', priceModifier: 0 },
    { id: 'sugar-0', optionId: 'opt-sugar', value: 'Không đường', priceModifier: 0 },
  ],
};

// Topping options for milk tea
const TOPPING_OPTION: ProductOptionDTO = {
  id: 'opt-topping',
  productId: '',
  name: 'Topping',
  type: 'multiple',
  required: false,
  values: [
    { id: 'top-pearl', optionId: 'opt-topping', value: 'Trân châu đen', priceModifier: 8000 },
    { id: 'top-jelly', optionId: 'opt-topping', value: 'Thạch dừa', priceModifier: 8000 },
    { id: 'top-pudding', optionId: 'opt-topping', value: 'Pudding', priceModifier: 10000 },
    { id: 'top-aloe', optionId: 'opt-topping', value: 'Nha đam', priceModifier: 8000 },
    { id: 'top-cheese', optionId: 'opt-topping', value: 'Kem cheese', priceModifier: 15000 },
  ],
};

export const MOCK_PRODUCTS: ProductDTO[] = [
  // Cà phê
  {
    id: 'prod-1',
    name: 'Cà phê đen đá',
    description: 'Cà phê đen truyền thống, đậm đà',
    price: 25000,
    categoryId: 'cat-1',
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400',
    isAvailable: true,
    options: [
      { ...SIZE_OPTION, productId: 'prod-1', id: 'prod-1-opt-size' },
      { ...ICE_OPTION, productId: 'prod-1', id: 'prod-1-opt-ice' },
      { ...SUGAR_OPTION, productId: 'prod-1', id: 'prod-1-opt-sugar' },
    ],
    createdAt: Date.now() - 120 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'prod-2',
    name: 'Bạc xỉu',
    description: 'Cà phê sữa đá ngọt dịu',
    price: 30000,
    categoryId: 'cat-1',
    imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400',
    isAvailable: true,
    options: [
      { ...SIZE_OPTION, productId: 'prod-2', id: 'prod-2-opt-size' },
      { ...ICE_OPTION, productId: 'prod-2', id: 'prod-2-opt-ice' },
      { ...SUGAR_OPTION, productId: 'prod-2', id: 'prod-2-opt-sugar' },
    ],
    createdAt: Date.now() - 120 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'prod-3',
    name: 'Cappuccino',
    description: 'Cà phê Ý với sữa béo ngậy',
    price: 45000,
    categoryId: 'cat-1',
    imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400',
    isAvailable: true,
    options: [
      { ...SIZE_OPTION, productId: 'prod-3', id: 'prod-3-opt-size' },
      { ...ICE_OPTION, productId: 'prod-3', id: 'prod-3-opt-ice' },
    ],
    createdAt: Date.now() - 120 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
  },

  // Trà sữa
  {
    id: 'prod-4',
    name: 'Trà sữa truyền thống',
    description: 'Trà sữa Đài Loan nguyên bản',
    price: 35000,
    categoryId: 'cat-2',
    imageUrl: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=400',
    isAvailable: true,
    options: [
      { ...SIZE_OPTION, productId: 'prod-4', id: 'prod-4-opt-size' },
      { ...ICE_OPTION, productId: 'prod-4', id: 'prod-4-opt-ice' },
      { ...SUGAR_OPTION, productId: 'prod-4', id: 'prod-4-opt-sugar' },
      { ...TOPPING_OPTION, productId: 'prod-4', id: 'prod-4-opt-topping' },
    ],
    createdAt: Date.now() - 100 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'prod-5',
    name: 'Trà sữa matcha',
    description: 'Trà sữa matcha Nhật Bản thơm ngon',
    price: 40000,
    categoryId: 'cat-2',
    imageUrl: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400',
    isAvailable: true,
    options: [
      { ...SIZE_OPTION, productId: 'prod-5', id: 'prod-5-opt-size' },
      { ...ICE_OPTION, productId: 'prod-5', id: 'prod-5-opt-ice' },
      { ...SUGAR_OPTION, productId: 'prod-5', id: 'prod-5-opt-sugar' },
      { ...TOPPING_OPTION, productId: 'prod-5', id: 'prod-5-opt-topping' },
    ],
    createdAt: Date.now() - 100 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'prod-6',
    name: 'Trà sữa socola',
    description: 'Trà sữa socola đậm đà',
    price: 40000,
    categoryId: 'cat-2',
    imageUrl: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400',
    isAvailable: true,
    options: [
      { ...SIZE_OPTION, productId: 'prod-6', id: 'prod-6-opt-size' },
      { ...ICE_OPTION, productId: 'prod-6', id: 'prod-6-opt-ice' },
      { ...SUGAR_OPTION, productId: 'prod-6', id: 'prod-6-opt-sugar' },
      { ...TOPPING_OPTION, productId: 'prod-6', id: 'prod-6-opt-topping' },
    ],
    createdAt: Date.now() - 100 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
  },

  // Trà trái cây
  {
    id: 'prod-7',
    name: 'Trà đào cam sả',
    description: 'Trà đào cam sả giải nhiệt',
    price: 38000,
    categoryId: 'cat-3',
    imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
    isAvailable: true,
    options: [
      { ...SIZE_OPTION, productId: 'prod-7', id: 'prod-7-opt-size' },
      { ...ICE_OPTION, productId: 'prod-7', id: 'prod-7-opt-ice' },
      { ...SUGAR_OPTION, productId: 'prod-7', id: 'prod-7-opt-sugar' },
    ],
    createdAt: Date.now() - 80 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'prod-8',
    name: 'Trà chanh dây',
    description: 'Trà chanh dây chua ngọt',
    price: 35000,
    categoryId: 'cat-3',
    imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400',
    isAvailable: true,
    options: [
      { ...SIZE_OPTION, productId: 'prod-8', id: 'prod-8-opt-size' },
      { ...ICE_OPTION, productId: 'prod-8', id: 'prod-8-opt-ice' },
      { ...SUGAR_OPTION, productId: 'prod-8', id: 'prod-8-opt-sugar' },
    ],
    createdAt: Date.now() - 80 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
  },

  // Bánh ngọt
  {
    id: 'prod-9',
    name: 'Bánh croissant bơ',
    description: 'Bánh croissant Pháp giòn tan',
    price: 28000,
    categoryId: 'cat-4',
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400',
    isAvailable: true,
    createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'prod-10',
    name: 'Bánh tiramisu',
    description: 'Bánh tiramisu Ý nguyên bản',
    price: 45000,
    categoryId: 'cat-4',
    imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400',
    isAvailable: true,
    createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
  },

  // Đồ uống đặc biệt
  {
    id: 'prod-11',
    name: 'Smoothie xoài',
    description: 'Smoothie xoài tươi mát',
    price: 42000,
    categoryId: 'cat-5',
    imageUrl: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400',
    isAvailable: true,
    options: [
      { ...SIZE_OPTION, productId: 'prod-11', id: 'prod-11-opt-size' },
      { ...SUGAR_OPTION, productId: 'prod-11', id: 'prod-11-opt-sugar' },
    ],
    createdAt: Date.now() - 40 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'prod-12',
    name: 'Sinh tố bơ',
    description: 'Sinh tố bơ béo ngậy',
    price: 45000,
    categoryId: 'cat-5',
    imageUrl: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400',
    isAvailable: true,
    options: [
      { ...SIZE_OPTION, productId: 'prod-12', id: 'prod-12-opt-size' },
      { ...SUGAR_OPTION, productId: 'prod-12', id: 'prod-12-opt-sugar' },
    ],
    createdAt: Date.now() - 40 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
  },
];
