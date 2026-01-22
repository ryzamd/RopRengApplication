import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { IAddressSuggestion } from '../../../domain/shared/types';

interface MapSearchBarProps {
  suggestions: IAddressSuggestion[];
  isLoading: boolean;
  onSearch: (text: string) => void;
  onSelectSuggestion: (item: IAddressSuggestion) => void;
  placeholder?: string;
  initialValue?: string;
}

export const MapSearchBar: React.FC<MapSearchBarProps> = ({
  suggestions,
  isLoading,
  onSearch,
  onSelectSuggestion,
  placeholder = "Tìm kiếm địa chỉ giao hàng...",
  initialValue
}) => {
  const [query, setQuery] = React.useState(initialValue || '');
  const [isFocused, setIsFocused] = React.useState(false);

  React.useEffect(() => {
    if (initialValue) setQuery(initialValue);
  }, [initialValue]);

  const handleSelect = (item: IAddressSuggestion) => {
    setQuery(item.description);
    onSelectSuggestion(item);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <View style={styles.iconContainer}>
          <Text>🔍</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={query}
          onFocus={() => {
            setIsFocused(true);
            if (query.length >= 2) onSearch(query);
          }}
          onBlur={() => setIsFocused(false)}
          onChangeText={(text) => {
            setQuery(text);
            onSearch(text);
          }}
          returnKeyType="search"
        />
        {isLoading && <ActivityIndicator size="small" color={'#FF6600'} style={styles.loader} />}
      </View>

      {suggestions.length > 0 && isFocused && (
        <View style={styles.resultsContainer}>
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.placeId}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => handleSelect(item)}
              >
                <Text style={styles.mainText}>{item.mainText}</Text>
                <Text style={styles.subText} numberOfLines={1}>
                  {item.secondaryText}
                </Text>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 64,
    right: 16,
    zIndex: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  iconContainer: { marginRight: 8 },
  input: { flex: 1, fontSize: 16, color: '#333' },
  loader: { marginLeft: 8 },
  resultsContainer: {
    marginTop: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    maxHeight: 250,
    elevation: 4,
  },
  item: { padding: 12 },
  mainText: { fontSize: 14, fontWeight: '600', color: '#000' },
  subText: { fontSize: 12, color: '#666', marginTop: 2 },
  separator: { height: 1, backgroundColor: '#eee', marginHorizontal: 12 },
});