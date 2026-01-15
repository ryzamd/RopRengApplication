import { Router } from 'expo-router';
import { PendingAuthAction } from '../../domain/services/AuthActionService';

export class AuthActionNavigator {
  constructor(private readonly router: Router) {}

  execute(action: PendingAuthAction): void {
    const { type, context } = action;

    switch (type) {
      case 'PURCHASE':
        if (context.productId) {
          this.router.dismissAll();
          this.router.replace({
            pathname: '/(tabs)/stores',
            params: {
              productId: context.productId,
              mode: 'select'
            },
          });
        } else {
          this.navigateToHome();
        }
        break;

      case 'VIEW_STORE':
        this.router.dismissAll();
        this.router.replace({
          pathname: '/(tabs)/stores',
          params: { storeId: context.storeId },
        });
        break;

      case 'CLAIM_PROMO':
        this.router.dismissAll();
        this.router.replace({
          pathname: '/(tabs)/order',
          params: { promo: context.promoCode },
        });
        break;

      case 'BROWSE_CATEGORY':
        this.router.dismissAll();
        this.router.replace({
          pathname: '/(tabs)/search',
          params: { categoryId: context.categoryId },
        });
        break;

      case 'VIEW_COLLECTION':
        this.router.dismissAll();
        this.router.replace({
          pathname: '/(tabs)',
          params: { collectionId: context.collectionId },
        });
        break;

      default:
        this.navigateToHome();
    }
  }

  private navigateToHome(): void {
    this.router.dismissAll();
    this.router.replace('/(tabs)');
  }
}