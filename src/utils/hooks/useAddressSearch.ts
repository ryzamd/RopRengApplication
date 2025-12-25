import { useState, useCallback, useRef, useEffect } from 'react';
import { Alert } from 'react-native';
import * as Crypto from 'expo-crypto';
import { IAddressSuggestion } from '../../domain/models/LocationModel';
import { GoongGeocodingRepository } from '../../infrastructure/repositories/GoongGeocodingRepository';
import { AppError } from '../../core/errors/AppErrors';

const repository = new GoongGeocodingRepository();

export const useAddressSearch = () => {
  const [suggestions, setSuggestions] = useState<IAddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sessionToken = useRef<string>("");

  const refreshSessionToken = useCallback(() => {
    sessionToken.current = Crypto.randomUUID();
  }, []);

  useEffect(() => {
    refreshSessionToken();
  }, [refreshSessionToken]);

  const onSearch = useCallback((text: string) => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    if (!text || text.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    
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

  const onSelectAddress = useCallback((item: IAddressSuggestion) => {
    setSuggestions([]);
    return item;
  }, []);

  return {
    suggestions,
    isLoading,
    onSearch,
    onSelectAddress,
    sessionToken: sessionToken.current,
    refreshSessionToken
  };
};