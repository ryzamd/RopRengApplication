import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AppIcon } from '../../../components/shared/AppIcon';
import { ORDER_TEXT } from '../OrderConstants';
import { orderStyles } from '../styles';

export function OrderHeader() {
  return (
    <View style={orderStyles.header}>
      <View style={orderStyles.headerLeft}>
        <AppIcon name="grid-outline" size="sm" />
        <Text style={orderStyles.headerTitle}>{ORDER_TEXT.HEADER_TITLE}</Text>
        <AppIcon name="chevron-down-outline" size="sm" />
      </View>
      
      <View style={orderStyles.headerRight}>
        <TouchableOpacity>
          <AppIcon name="search-outline" size="sm" />
        </TouchableOpacity>
        <TouchableOpacity>
          <AppIcon name="heart-outline" size="sm" />
        </TouchableOpacity>
      </View>
    </View>
  );
}