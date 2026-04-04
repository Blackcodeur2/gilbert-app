import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { FlashList } from '@shopify/flash-list';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { theme, typography, spacing, borderRadius, shadows } from '../../constants/theme';
import { formatPrice } from '../../constants/config';
import { products, productCategories, type Product } from '../../services/mockData';
import { useApp } from '../../contexts/AppContext';
import * as Haptics from 'expo-haptics';

export default function ShopScreen() {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const { addToCart, cartItemCount } = useApp();

  const filteredProducts = selectedCategory === 'Tous'
    ? products
    : products.filter(p => p.category === selectedCategory);

  const handleAddToCart = useCallback((product: Product) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addToCart(product, 1);
    Alert.alert('Ajouté !', `${product.name} a été ajouté au panier.`);
  }, [addToCart]);

  const renderProduct = useCallback(({ item }: { item: Product }) => {
    return (
      <Pressable
        style={styles.productCard}
        onPress={() => {
          Haptics.selectionAsync();
          router.push(`/product-detail?id=${item.id}`);
        }}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.imageUrl }} style={styles.productImage} contentFit="cover" />
          {item.isFeatured && (
            <View style={styles.featuredBadge}>
              <Text style={styles.featuredText}>VEDETTE</Text>
            </View>
          )}
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productBrand}>{item.brand}</Text>
          <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
          <View style={styles.productBottom}>
            <Text style={styles.productPrice}>{formatPrice(item.price)}</Text>
            <Pressable
              style={styles.addButton}
              onPress={(e) => {
                e.stopPropagation?.();
                handleAddToCart(item);
              }}
              hitSlop={4}
            >
              <MaterialIcons name="add" size={18} color={theme.textOnPrimary} />
            </Pressable>
          </View>
        </View>
      </Pressable>
    );
  }, [handleAddToCart]);

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Boutique</Text>
          <Text style={styles.headerSubtitle}>{products.length} produits disponibles</Text>
        </View>
        <Pressable
          style={styles.cartButton}
          onPress={() => {
            Haptics.selectionAsync();
            router.push('/cart');
          }}
        >
          <MaterialIcons name="shopping-cart" size={24} color={theme.textPrimary} />
          {cartItemCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartItemCount > 9 ? '9+' : cartItemCount}</Text>
            </View>
          )}
        </Pressable>
      </View>

      {/* Category Chips */}
      <View style={{ height: 48 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.sm }}
        >
          {productCategories.map(cat => (
            <Pressable
              key={cat}
              style={[styles.chip, selectedCategory === cat && styles.chipActive]}
              onPress={() => { Haptics.selectionAsync(); setSelectedCategory(cat); }}
            >
              <Text style={[styles.chipText, selectedCategory === cat && styles.chipTextActive]}>
                {cat}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Products Grid */}
      <View style={{ flex: 1, marginTop: spacing.md }}>
        <FlashList
          data={filteredProducts}
          renderItem={renderProduct}
          estimatedItemSize={260}
          numColumns={2}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: insets.bottom + 16 }}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  headerTitle: {
    ...typography.h1,
    color: theme.textPrimary,
  },
  headerSubtitle: {
    ...typography.caption,
    color: theme.textSecondary,
    marginTop: 4,
  },
  cartButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: theme.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: theme.primary,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },

  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: theme.surface,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: theme.border,
  },
  chipActive: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.textSecondary,
  },
  chipTextActive: {
    color: theme.textOnPrimary,
  },

  productCard: {
    flex: 1,
    backgroundColor: theme.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginHorizontal: 6,
    ...shadows.card,
  },
  imageContainer: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    aspectRatio: 1,
  },
  featuredBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: theme.accent,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
  },
  featuredText: {
    fontSize: 9,
    fontWeight: '700',
    color: theme.textPrimary,
    letterSpacing: 0.5,
  },
  productInfo: {
    padding: spacing.md,
  },
  productBrand: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  productName: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.textPrimary,
    marginTop: 3,
    marginBottom: 8,
    lineHeight: 17,
  },
  productBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.primary,
  },
  addButton: {
    width: 30,
    height: 30,
    borderRadius: borderRadius.full,
    backgroundColor: theme.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
