import { MOCK_PRODUCTS } from './mockProducts';

export interface StoreMenu {
  storeId: string;
  availableProductIds: string[];
}

function getRandomProducts(percentage: number): string[] {
  const count = Math.floor(MOCK_PRODUCTS.length * percentage);
  const shuffled = [...MOCK_PRODUCTS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((p) => p.id);
}

function getRandomNProducts(n: number): string[] {
  const shuffled = [...MOCK_PRODUCTS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n).map((p) => p.id);
}

export const MOCK_STORE_MENUS: StoreMenu[] = [
  {
    storeId: 'store-1',
    availableProductIds: getRandomProducts(0.7),
  },
  {
    storeId: 'store-2',
    availableProductIds: getRandomProducts(0.7),
  },
  {
    storeId: 'store-3',
    availableProductIds: getRandomProducts(0.7),
  },
  {
    storeId: 'store-4',
    availableProductIds: getRandomProducts(0.7),
  },
  {
    storeId: 'store-5',
    availableProductIds: getRandomProducts(0.7),
  },
  {
    storeId: 'store-6',
    availableProductIds: getRandomProducts(0.7),
  },
  {
    storeId: 'store-7',
    availableProductIds: getRandomProducts(0.7),
  },
  {
    storeId: 'store-8',
    availableProductIds: getRandomProducts(0.7),
  },
  {
    storeId: 'store-9',
    availableProductIds: getRandomProducts(0.7),
  },
  // ERROR CASE STORES: Only 15 products
  {
    storeId: 'store-10',
    availableProductIds: getRandomNProducts(15),
  },
  {
    storeId: 'store-11',
    availableProductIds: getRandomNProducts(15),
  },
];

export class StoreMenuService {

  static isProductAvailable(storeId: string, productId: string): boolean {
    const menu = MOCK_STORE_MENUS.find((m) => m.storeId === storeId);
    if (!menu) return false;
    return menu.availableProductIds.includes(productId);
  }

  static getStoresWithProduct(productId: string): string[] {
    return MOCK_STORE_MENUS
      .filter((menu) => menu.availableProductIds.includes(productId))
      .map((menu) => menu.storeId);
  }

  static getStoreProducts(storeId: string): string[] {
    const menu = MOCK_STORE_MENUS.find((m) => m.storeId === storeId);
    return menu?.availableProductIds || [];
  }
}