import React from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { IAddressSuggestion } from '../../../domain/models/LocationModel';

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
          onChangeText={(text) => {
            setQuery(text);
            onSearch(text);
          }}
          returnKeyType="search"
        />
        {isLoading && <ActivityIndicator size="small" color={'#FF6600'} style={styles.loader} />}
      </View>

      {suggestions.length > 0 && (
        <View style={styles.resultsContainer}>
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.place_id}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => handleSelect(item)}
              >
                <Text style={styles.mainText}>{item.structured_formatting.main_text}</Text>
                <Text style={styles.subText} numberOfLines={1}>
                  {item.structured_formatting.secondary_text}
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
    left: 16,
    right: 16,
    zIndex: 10,
  } as ViewStyle,
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
  } as ViewStyle,
  iconContainer: { marginRight: 8 } as ViewStyle,
  input: { flex: 1, fontSize: 16, color: '#333' } as TextStyle,
  loader: { marginLeft: 8 } as ViewStyle,
  resultsContainer: {
    marginTop: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    maxHeight: 250,
    elevation: 4,
  } as ViewStyle,
  item: { padding: 12 } as ViewStyle,
  mainText: { fontSize: 14, fontWeight: '600', color: '#000' } as TextStyle,
  subText: { fontSize: 12, color: '#666', marginTop: 2 } as TextStyle,
  separator: { height: 1, backgroundColor: '#eee', marginHorizontal: 12 } as ViewStyle,
});