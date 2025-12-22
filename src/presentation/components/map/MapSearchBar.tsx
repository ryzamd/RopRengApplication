import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GeocodingFeature, geocodingService } from '../../../infrastructure/location/GeocodingService';
import { BRAND_COLORS } from '../../theme/colors';
import { AppIcon } from '../shared/AppIcon';
import { MAP_CONFIG, MAP_TEXT } from './MapConstants';
import { SearchResult } from './MapInterfaces';
import * as Crypto from 'expo-crypto';

interface MapSearchBarProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
  initialAddress?: string;
  currentRegion?: { lat: number; lng: number };
}

export const MapSearchBar: React.FC<MapSearchBarProps> = ({onLocationSelect, initialAddress = '', currentRegion}) => {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState(initialAddress);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (initialAddress && !isFocused) {
      setQuery(initialAddress);
    }
  }, [initialAddress, isFocused]);

  const handleSearchTextChange = (text: string) => {
    setQuery(text);
    
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (text.length > 2) {
      setIsSearching(true);
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const features = await geocodingService.searchAddress(text, currentRegion);
          const mappedResults = features.map(mapFeatureToSearchResult);
          setResults(mappedResults);

        } catch (error) {
          console.error('Search component error:', error);
          setResults([]);

        } finally {
          setIsSearching(false);
        }
      }, MAP_CONFIG.AUTOCOMPLETE_DEBOUNCE_MS);
    } else {
      setResults([]);
      setIsSearching(false);
    }
  };

  const mapFeatureToSearchResult = (feature: GeocodingFeature): SearchResult => {
    const coordinates = feature.center || feature.geometry?.coordinates || [0, 0];
    
    const name = feature.properties?.name || feature.place_name?.split(',')[0];
    
    let fullAddress = feature.properties?.label || feature.place_name || '';
    if (!fullAddress && feature.properties) {
       const parts = [
         feature.properties.name,
         feature.properties.street,
         feature.properties.housenumber,
       ].filter(Boolean);
       fullAddress = parts.join(', ');
    }

    return {
      id: feature.id || Crypto.randomUUID(),
      title: name ? name.trim() : 'Địa điểm không tên',
      subtitle: fullAddress ? fullAddress.trim() : 'Đang cập nhật địa chỉ',
      latitude: coordinates[1],
      longitude: coordinates[0],
    };
  };

  const handleSelectItem = (item: SearchResult) => {
    Keyboard.dismiss();
    setQuery(item.subtitle);
    setResults([]);
    setIsFocused(false);
    
    onLocationSelect({
      lat: Number(item.latitude),
      lng: Number(item.longitude),
      address: item.subtitle || item.title,
    });
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    Keyboard.dismiss();
  };

  return (
    <View style={[styles.container, { top: insets.top + 10 }]}>
      <View style={styles.inputWrapper}>
        <AppIcon name="search" size={20} color={BRAND_COLORS.text.secondary} />
        <TextInput
          style={styles.input}
          placeholder={MAP_TEXT.SEARCH_PLACEHOLDER}
          value={query}
          onChangeText={handleSearchTextChange}
          onFocus={() => setIsFocused(true)}
          placeholderTextColor={BRAND_COLORS.text.secondary}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={handleClear} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <AppIcon name="close-circle" size={18} color={BRAND_COLORS.text.secondary} />
          </TouchableOpacity>
        )}
      </View>

      {(isFocused && (results.length > 0 || isSearching)) && (
        <View style={styles.resultsContainer}>
          {isSearching ? (
            <ActivityIndicator style={{ padding: 20 }} color={BRAND_COLORS.primary.xanhReu} />
          ) : (
            <FlatList
              data={results}
              keyExtractor={(item) => item.id}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.resultItem}
                  onPress={() => handleSelectItem(item)}
                >
                  <AppIcon name="location" size={20} color={BRAND_COLORS.text.secondary} />
                  <View style={styles.resultText}>
                    <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.subtitle} numberOfLines={2}>{item.subtitle}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 100,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BRAND_COLORS.background.default,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: BRAND_COLORS.border.light,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.text.primary,
  },
  resultsContainer: {
    marginTop: 8,
    backgroundColor: BRAND_COLORS.background.default,
    borderRadius: 12,
    maxHeight: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: BRAND_COLORS.border.light,
  },
  resultText: {
    marginLeft: 10,
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Bold',
    color: BRAND_COLORS.text.primary,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'SpaceGrotesk-Regular',
    color: BRAND_COLORS.text.secondary,
    marginTop: 2,
  },
});