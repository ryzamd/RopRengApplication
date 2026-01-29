import { Platform } from 'react-native';

export const IS_IOS = Platform.OS === 'ios';
export const IS_ANDROID = Platform.OS === 'android';
export const IS_WEB = Platform.OS === 'web';

export const onPlatform = <T>(options: { ios?: () => T; android?: () => T; web?: () => T; default?: () => T }): T | undefined => {
    if (IS_IOS && options.ios) return options.ios();
    if (IS_ANDROID && options.android) return options.android();
    if (IS_WEB && options.web) return options.web();
    if (options.default) return options.default();
    return undefined;
};

export const selectPlatform = <T>(specifics: { ios?: T; android?: T; web?: T; default?: T }): T | undefined => {
    return Platform.select(specifics);
};
