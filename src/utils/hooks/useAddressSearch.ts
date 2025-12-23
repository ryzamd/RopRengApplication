import * as Crypto from 'expo-crypto';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { AppError } from '../../core/errors/AppErrors';
import { IAddressSuggestion } from '../../domain/models/LocationModel';
import { GoongGeocodingRepository } from '../../infrastructure/repositories/GoongGeocodingRepository';

const repository = new GoongGeocodingRepository();

export const useAddressSearch = () => {
  const [suggestions, setSuggestions] = useState<IAddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sessionToken = useRef<string>("");

  const refreshSessionToken = () => {
    sessionToken.current = Crypto.randomUUID();
  };

  // Init token khi mount
  useEffect(() => {
    refreshSessionToken();
  }, []);

  const onSearch = useCallback((text: string) => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    if (!text || text.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    
    // Debounce 500ms
    debounceTimeout.current = setTimeout(async () => {
      try {
        const results = await repository.searchAddress(text, sessionToken.current);
        setSuggestions(results);
      } catch (error: any) {
        setSuggestions([]);
        if (error instanceof AppError && error.code === 'QUOTA_EXCEEDED') {
            Alert.alert('Thông báo', error.message);
        }
      } finally {
        setIsLoading(false);
      }
    }, 500);
  }, []);

  // Gọi hàm này khi user chọn 1 item từ list -> Reset token cho phiên mới
  const onSelectAddress = useCallback((item: IAddressSuggestion) => {
    setSuggestions([]);
    refreshSessionToken();
    return item;
  }, []);

  return {
    suggestions,
    isLoading,
    onSearch,
    onSelectAddress,
  };
};