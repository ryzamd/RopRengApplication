import { CartRepository } from '@/src/infrastructure/db/sqlite/repositories/CartRepository';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useCallback, useMemo } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { logout } from '../../../state/slices/auth';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { ACCOUNT_MENU, MORE_STRINGS, SUPPORT_MENU } from './MoreConstants';
import { MenuSectionData } from './MoreInterfaces';
import { MenuSection } from './components/MenuSection';
import { MoreHeader } from './components/MoreHeader';
import { UtilityGrid } from './components/UtilityGrid';
import { VersionFooter } from './components/VersionFooter';
import { styles } from './styles';

export default function MoreScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const db = useSQLiteContext();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const accountMenuSection: MenuSectionData = useMemo(() => {
    if (isAuthenticated) {
      return ACCOUNT_MENU;
    } else {
      return {
        title: 'Tài khoản',
        items: [
          { id: 'login', label: 'Đăng nhập', icon: 'log-in-outline' },
          { id: 'register', label: 'Đăng ký', icon: 'person-add-outline' },
        ],
      };
    }
  }, [isAuthenticated]);

  const handleLogout = useCallback(async () => {
    console.log('[MoreScreen] Processing logout...');
    
    // 1. Clear SQLite Cart (Side Effect)
    if (user?.uuid) {
        try {
            const cartRepo = new CartRepository(db);
            await cartRepo.clearAllCartsForUser(user?.uuid);
            console.log('[MoreScreen] SQLite cart cleared');
        } catch (error) {
            console.error('[MoreScreen] Failed to clear SQLite cart', error);
        }
    }

    dispatch(logout());
    
    // 3. Navigation (Optional: redirect to welcome or stay here)
    // router.replace('/');
  }, [dispatch, user?.uuid, db]);

  const handleMenuPress = useCallback((id: string) => {
    console.log(`[MoreScreen] Menu pressed: ${id}, Auth: ${isAuthenticated}`);
    switch (id) {
      case 'logout':
        Alert.alert(
          MORE_STRINGS.LOGOUT_CONFIRM_TITLE,
          MORE_STRINGS.LOGOUT_CONFIRM_MSG,
          [
            { text: MORE_STRINGS.CANCEL, style: 'cancel' },
            {
              text: MORE_STRINGS.AGREE,
              style: 'destructive',
              onPress: handleLogout,
            },
          ]
        );
        break;
      
      case 'login':
        router.push('../(auth)/login');
        break;

      case 'register':
        router.push('../(auth)/register');
        break;

      case 'profile':
        if (isAuthenticated) {
            console.log('Navigate to Profile');
        }
        break;

      case 'history':
        if (isAuthenticated) {
          router.push('../order-history');
        } else {
          router.push('../(auth)/login');
        }
        break;

      default:
        break;
    }
  }, [handleLogout, isAuthenticated, router]);

  return (
    <View style={styles.container}>
      <MoreHeader />
      <ScrollView showsVerticalScrollIndicator={false}>
        <UtilityGrid onItemPress={handleMenuPress} />
        <MenuSection section={SUPPORT_MENU} onItemPress={handleMenuPress} />
        <MenuSection section={accountMenuSection} onItemPress={handleMenuPress} />
        <VersionFooter />
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}