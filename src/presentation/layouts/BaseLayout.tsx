import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

export interface BaseLayoutProps {
    children: React.ReactNode;
    testID?: string;
    style?: StyleProp<ViewStyle>;
}

/**
 * BaseLayout serves as the common ancestor for all layouts.
 * It provides a common type definition and can be used for global wrappers in the future.
 */
export function BaseLayout({ children }: BaseLayoutProps) {
    return <>{children}</>;
}
