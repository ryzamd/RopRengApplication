export type AuthActionType = | 'PURCHASE' | 'VIEW_STORE' | 'CLAIM_PROMO' | 'BROWSE_CATEGORY' | 'VIEW_COLLECTION';

export interface AuthActionContext {
  productId?: string;
  storeId?: string;
  promoCode?: string;
  categoryId?: string;
  collectionId?: string;
  actionId?: string;
  returnTo?: string;
}

export interface PendingAuthAction {
  type: AuthActionType;
  context: AuthActionContext;
  expiresAt: number;
  timestamp: number;
}

export class AuthActionService {
  private static readonly EXPIRY_DURATION_MS = 5 * 60 * 1000;

  static create(type: AuthActionType, context: AuthActionContext): PendingAuthAction {

    const now = Date.now();
    
    return {
      type,
      context,
      expiresAt: now + this.EXPIRY_DURATION_MS,
      timestamp: now,
    };
  }

  static isExpired(action: PendingAuthAction): boolean {
    return Date.now() >= action.expiresAt;
  }

  static validate(action: PendingAuthAction): {
    isValid: boolean;
    reason?: string;
  } {
    if (this.isExpired(action)) {
      return { isValid: false, reason: 'Action expired' };
    }

    switch (action.type) {
      case 'PURCHASE':
        if (!action.context.productId) {
          return { isValid: false, reason: 'Missing productId' };
        }
        break;
      case 'VIEW_STORE':
        if (!action.context.storeId) {
          return { isValid: false, reason: 'Missing storeId' };
        }
        break;
      case 'CLAIM_PROMO':
        if (!action.context.promoCode) {
          return { isValid: false, reason: 'Missing promoCode' };
        }
        break;
      case 'BROWSE_CATEGORY':
        if (!action.context.categoryId) {
          return { isValid: false, reason: 'Missing categoryId' };
        }
        break;
      case 'VIEW_COLLECTION':
        if (!action.context.collectionId) {
          return { isValid: false, reason: 'Missing collectionId' };
        }
        break;
    }

    return { isValid: true };
  }
}