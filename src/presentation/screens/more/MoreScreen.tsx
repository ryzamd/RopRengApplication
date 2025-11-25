import { router } from 'expo-router';
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
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const accountMenuSection: MenuSectionData = useMemo(() => {
    if (isAuthenticated) {
      return ACCOUNT_MENU;
    } else {
      return {
        title: 'Tài khoản',
        items: [
          {
            id: 'login',
            label: 'Đăng nhập',
            icon: 'log-in-outline'
          },
          {
            id: 'register',
            label: 'Đăng ký',
            icon: 'person-add-outline'
          },
        ],
      };
    }
  }, [isAuthenticated]);

  const handleMenuPress = useCallback((id: string) => {
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
              onPress: () => {
                dispatch(logout());
              },
            },
          ]
        );
        break;
      
      case 'login':
        router.push('/login');
        break;

      case 'register':
        router.push('/login');
        break;

      case 'profile':
        if (isAuthenticated) {
            console.log('Navigate to Profile');
        }
        break;

      default:
        console.log(`Menu pressed: ${id}`);
        break;
    }
  }, [dispatch, isAuthenticated]);

  return (
    <View style={styles.container}>
      <MoreHeader />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <UtilityGrid />
        
        <MenuSection section={SUPPORT_MENU} onItemPress={handleMenuPress} />
        
        <MenuSection section={accountMenuSection} onItemPress={handleMenuPress} />

        <VersionFooter />
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}