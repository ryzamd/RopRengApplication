import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import * as Crypto from 'expo-crypto';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DeliveryAddress } from '../../../domain/entities/DeliveryAddress';
import { GeocodingFeature, geocodingService } from '../../../infrastructure/location/GeocodingService';
import { BRAND_COLORS } from '../../theme/colors';
import { AppIcon } from '../shared/AppIcon';
import { MAP_CONFIG, MAP_TEXT } from './MapConstants';
import { AddressSearchModalProps, SearchResult } from './MapInterfaces';
import { MAP_LAYOUT } from './MapLayout';

export function AddressSearchModal({
  visible,
  onClose,
  onSelectAddress,
}: AddressSearchModalProps) {
  const insets = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Refs for debounce
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const snapPoints = useMemo(() => ['90%'], []);

  // Handle visibility
  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
      setSearchQuery('');
      setSearchResults([]);
    }
  }, [visible]);

  const performSearch = useCallback(
    async (query: string) => {
      setIsSearching(true);
      try {
        const results = await geocodingService.searchAddress(query);
        
        const mappedResults: SearchResult[] = results
          .map(mapFeatureToSearchResult)
          .slice(0, MAP_CONFIG.MAX_SEARCH_RESULTS);

        setSearchResults(mappedResults);
      } catch (error) {
        console.error('[AddressSearchModal] Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, []
  );

  // Handle Search Logic
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.length > 2) {
      searchTimeoutRef.current = setTimeout(() => {
        performSearch(searchQuery);
      }, MAP_CONFIG.AUTOCOMPLETE_DEBOUNCE_MS);
    } else {
      setSearchResults([]);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, performSearch]);

  const mapFeatureToSearchResult = (feature: GeocodingFeature): SearchResult => {
    let coordinates: number[] = [];

    if (feature.center && Array.isArray(feature.center) && feature.center.length >= 2) {
      coordinates = feature.center;
    } else if (
      feature.geometry &&
      feature.geometry.coordinates &&
      Array.isArray(feature.geometry.coordinates) &&
      feature.geometry.coordinates.length >= 2
    ) {
      coordinates = feature.geometry.coordinates;
    }

    // GeoJSON standard: [longitude, latitude]
    const longitude = coordinates[0] || 0;
    const latitude = coordinates[1] || 0;

    // Safely extract title
    const nameFromProp = feature.properties?.name;
    const nameFromPlace = feature.place_name ? feature.place_name.split(',')[0] : '';
    const title = nameFromProp || nameFromPlace || 'Không xác định';

    return {
      id: feature.id || Crypto.randomUUID(),
      title: title.trim(),
      subtitle: feature.place_name?.trim() || '',
      latitude,
      longitude,
    };
  };

  const handleSelectResult = useCallback(
    (result: SearchResult) => {
      const address = new DeliveryAddress(
        Crypto.randomUUID(),
        result.latitude,
        result.longitude,
        result.subtitle,
        false,
        ''
      );

      onSelectAddress(address);
      bottomSheetRef.current?.dismiss();
    },
    [onSelectAddress]
  );

  const renderBackdrop = useCallback(
    (props: BottomSheetDefaultBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.5}
        pressBehavior="close"
      />
    ),
    []
  );

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        onClose();
      }
    },
    [onClose]
  );

  const handleClose = () => bottomSheetRef.current?.dismiss();

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      enableDismissOnClose={true}
      enableDynamicSizing={false}
      backdropComponent={renderBackdrop}
      onChange={handleSheetChanges}
      topInset={insets.top}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <BottomSheetTextInput
            style={styles.searchInput}
            placeholder={MAP_TEXT.SEARCH_PLACEHOLDER}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus={true}
            returnKeyType="search"
            placeholderTextColor={BRAND_COLORS.text.secondary}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClose}
            activeOpacity={0.7}
          >
            <AppIcon name="close" size={24} color={BRAND_COLORS.text.secondary} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <BottomSheetScrollView
          contentContainerStyle={styles.resultsContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {isSearching ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={BRAND_COLORS.primary.xanhReu} />
              <Text style={styles.loadingText}>{MAP_TEXT.SEARCH_LOADING}</Text>
            </View>
          ) : searchResults.length > 0 ? (
            searchResults.map((result) => (
              <TouchableOpacity
                key={result.id}
                style={styles.resultItem}
                onPress={() => handleSelectResult(result)}
                activeOpacity={0.7}
              >
                <AppIcon
                  name="location"
                  size={MAP_LAYOUT.RESULT_ICON_SIZE}
                  color={BRAND_COLORS.primary.xanhReu}
                />
                <View style={styles.resultTextContainer}>
                  <Text style={styles.resultTitle} numberOfLines={1}>
                    {result.title}
                  </Text>
                  <Text style={styles.resultSubtitle} numberOfLines={2}>
                    {result.subtitle}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : searchQuery.length > 2 ? (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>{MAP_TEXT.SEARCH_NO_RESULTS}</Text>
            </View>
          ) : null}
        </BottomSheetScrollView>
      </View>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND_COLORS.background.default,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: BRAND_COLORS.border.light,
  },
  searchInput: {
    flex: 1,
    height: MAP_LAYOUT.SEARCH_INPUT_HEIGHT,
    backgroundColor: BRAND_COLORS.background.default,
    borderRadius: MAP_LAYOUT.SEARCH_INPUT_BORDER_RADIUS,
    paddingHorizontal: MAP_LAYOUT.SEARCH_INPUT_PADDING,
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.text.primary,
    borderWidth: 1,
    borderColor: BRAND_COLORS.border.light,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.text.secondary,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center', // Center vertically for better look
    padding: MAP_LAYOUT.RESULT_ITEM_PADDING,
    gap: MAP_LAYOUT.RESULT_ITEM_GAP,
    borderBottomWidth: 1,
    borderBottomColor: BRAND_COLORS.border.light,
    backgroundColor: BRAND_COLORS.background.default,
  },
  resultTextContainer: {
    flex: 1,
  },
  resultTitle: {
    fontSize: MAP_LAYOUT.RESULT_TITLE_FONT_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.text.primary,
    marginBottom: 4,
  },
  resultSubtitle: {
    fontSize: MAP_LAYOUT.RESULT_SUBTITLE_FONT_SIZE,
    fontFamily: 'SpaceGrotesk-Regular', // Usually subtitle is Regular
    color: BRAND_COLORS.text.secondary,
    lineHeight: 20,
  },
  noResultsContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.text.secondary,
  },
});