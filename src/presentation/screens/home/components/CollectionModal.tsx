import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TouchableWithoutFeedback, Image } from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useModalBottomSheetAnimation } from '../../../hooks/animations';
import { BRAND_COLORS } from '../../../theme/colors';
import { Collection } from '../HomeInterfaces';
import { HOME_LAYOUT } from '../HomeLayout';
import { ProductCard } from '../../welcome/components/ProductCard';

interface CollectionModalProps {
  collection: Collection | null;
  onClose: () => void;
}

export function CollectionModal({ collection, onClose }: CollectionModalProps) {
  const { modalHeight, animatedModalStyle, animatedBackdropStyle, dismiss } = useModalBottomSheetAnimation({
    heightPercentage: HOME_LAYOUT.COLLECTION_MODAL_HEIGHT_PERCENTAGE,
    onExitComplete: onClose,
  });

  if (!collection) return null;

  return (
    <View style={styles.container}>
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, animatedBackdropStyle]}>
        <TouchableWithoutFeedback onPress={dismiss}>
          <View style={styles.backdropTouchable} />
        </TouchableWithoutFeedback>
      </Animated.View>

      {/* Modal */}
      <Animated.View style={[styles.modalWrapper, { height: modalHeight }, animatedModalStyle]}>
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
          {/* Close button */}
          <TouchableOpacity style={styles.closeButton} onPress={dismiss}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>

          {/* Content */}
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Image source={{ uri: collection.bannerImage }} style={styles.bannerImage} />
            
            <View style={styles.content}>
              <Text style={styles.title}>{collection.title}</Text>
              <Text style={styles.description}>{collection.description}</Text>

              {collection.promoCode && (
                <View style={styles.promoCodeContainer}>
                  <Text style={styles.promoCodeLabel}>Mã khuyến mãi:</Text>
                  <Text style={styles.promoCode}>{collection.promoCode}</Text>
                </View>
              )}

              {collection.purchaseConditions && (
                <Text style={styles.conditions}>{collection.purchaseConditions}</Text>
              )}

              <Text style={styles.itemsTitle}>Sản phẩm trong bộ sưu tập ({collection.items.length})</Text>
              <View style={styles.productsGrid}>
                {collection.items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdropTouchable: {
    flex: 1,
  },
  modalWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: BRAND_COLORS.background.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  safeArea: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(96, 106, 55, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 14,
    color: BRAND_COLORS.primary.xanhReu,
    fontFamily: 'SpaceGrotesk-Bold',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  bannerImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.primary.xanhReu,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.primary.xanhReu,
    lineHeight: 24,
    marginBottom: 16,
  },
  promoCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BRAND_COLORS.primary.beSua,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  promoCodeLabel: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.primary.xanhReu,
    marginRight: 8,
  },
  promoCode: {
    fontSize: 18,
    fontFamily: 'SpaceMono-Bold',
    color: BRAND_COLORS.secondary.nauEspresso,
  },
  conditions: {
    fontSize: 12,
    fontFamily: 'SpaceGrotesk-Medium',
    color: '#666666',
    marginBottom: 20,
  },
  itemsTitle: {
    fontSize: 18,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.primary.xanhReu,
    marginBottom: 12,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});