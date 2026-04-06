import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { theme, typography, spacing, borderRadius, shadows } from '../constants/theme';
import { formatPrice } from '../constants/config';
import { useApp } from '../contexts/AppContext';
import { usePublicData } from '../hooks/useSupabaseData';
import { getImageSource } from '../constants/assets';
import * as Haptics from 'expo-haptics';

export default function ProductDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addToCart } = useApp();
  const { products } = usePublicData();
  const [quantity, setQuantity] = useState(1);
  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <SafeAreaView edges={['top']} style={styles.container}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: theme.textSecondary }}>Produit introuvable</Text>
          <Pressable onPress={() => router.back()} style={{ marginTop: 16, padding: 12 }}>
            <Text style={{ color: theme.primary, fontWeight: '600' }}>Retour</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const inStock = product.stockQuantity > 0;

  const handleAddToCart = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addToCart(product, quantity);
    Alert.alert(
      'Ajouté au panier !',
      `${quantity}x ${product.name}`,
      [
        { text: 'Continuer', style: 'cancel' },
        { text: 'Voir le panier', onPress: () => router.push('/cart') },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Image */}
        <View style={styles.imageContainer}>
          <Image source={getImageSource(product.imageUrl)} style={styles.productImage} contentFit="cover" />
          <SafeAreaView edges={['top']} style={styles.topBar}>
            <Pressable style={styles.iconBtn} onPress={() => { Haptics.selectionAsync(); router.back(); }}>
              <MaterialIcons name="arrow-back" size={24} color={theme.textPrimary} />
            </Pressable>
            <Pressable style={styles.iconBtn} onPress={() => { Haptics.selectionAsync(); router.push('/cart'); }}>
              <MaterialIcons name="shopping-cart" size={24} color={theme.textPrimary} />
            </Pressable>
          </SafeAreaView>
          {product.isFeatured && (
            <View style={styles.featuredTag}>
              <MaterialIcons name="star" size={14} color={theme.textPrimary} />
              <Text style={styles.featuredTagText}>VEDETTE</Text>
            </View>
          )}
        </View>

        {/* Info */}
        <View style={styles.content}>
          <Text style={styles.brand}>{product.brand}</Text>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>

          {/* Stock */}
          <View style={[styles.stockBadge, { backgroundColor: inStock ? theme.successLight : theme.errorLight }]}>
            <View style={[styles.stockDot, { backgroundColor: inStock ? theme.success : theme.error }]} />
            <Text style={[styles.stockText, { color: inStock ? theme.success : theme.error }]}>
              {inStock ? `En stock (${product.stockQuantity})` : 'Rupture de stock'}
            </Text>
          </View>

          {/* Category */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Catégorie</Text>
            <View style={styles.catBadge}>
              <Text style={styles.catBadgeText}>{product.category}</Text>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>

          {/* Quantity Selector */}
          {inStock && (
            <>
              <Text style={styles.sectionTitle}>Quantité</Text>
              <View style={styles.quantityRow}>
                <Pressable
                  style={[styles.qtyBtn, quantity <= 1 && styles.qtyBtnDisabled]}
                  onPress={() => { if (quantity > 1) { Haptics.selectionAsync(); setQuantity(q => q - 1); } }}
                >
                  <MaterialIcons name="remove" size={22} color={quantity <= 1 ? theme.textMuted : theme.textPrimary} />
                </Pressable>
                <Text style={styles.qtyValue}>{quantity}</Text>
                <Pressable
                  style={[styles.qtyBtn, quantity >= product.stockQuantity && styles.qtyBtnDisabled]}
                  onPress={() => {
                    if (quantity < product.stockQuantity) {
                      Haptics.selectionAsync();
                      setQuantity(q => q + 1);
                    }
                  }}
                >
                  <MaterialIcons name="add" size={22} color={quantity >= product.stockQuantity ? theme.textMuted : theme.textPrimary} />
                </Pressable>
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
        <View>
          <Text style={styles.bottomTotal}>{formatPrice(product.price * quantity)}</Text>
          <Text style={styles.bottomQty}>{quantity} article{quantity > 1 ? 's' : ''}</Text>
        </View>
        <Pressable
          style={[styles.addBtn, !inStock && styles.addBtnDisabled]}
          onPress={inStock ? handleAddToCart : undefined}
        >
          <MaterialIcons name="shopping-cart" size={20} color={theme.textOnPrimary} />
          <Text style={styles.addBtnText}>{inStock ? 'Ajouter au panier' : 'Indisponible'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  imageContainer: { position: 'relative', aspectRatio: 1, backgroundColor: '#F5F0ED' },
  productImage: { width: '100%', height: '100%' },
  topBar: {
    position: 'absolute', top: 0, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingTop: spacing.sm,
  },
  iconBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center', justifyContent: 'center',
    ...shadows.card,
  },
  featuredTag: {
    position: 'absolute', bottom: 16, left: 16,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: theme.accent, paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: borderRadius.full,
  },
  featuredTagText: { fontSize: 11, fontWeight: '700', color: theme.textPrimary, letterSpacing: 0.5 },

  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl },
  brand: { fontSize: 13, fontWeight: '700', color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 0.8 },
  name: { ...typography.h1, color: theme.textPrimary, marginTop: 4, marginBottom: 8 },
  price: { ...typography.priceLarge, color: theme.primary, marginBottom: spacing.lg },

  stockBadge: {
    alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: borderRadius.full, marginBottom: spacing.xl,
  },
  stockDot: { width: 8, height: 8, borderRadius: 4 },
  stockText: { fontSize: 13, fontWeight: '600' },

  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  detailLabel: { ...typography.bodyBold, color: theme.textSecondary },
  catBadge: { backgroundColor: theme.primarySoft, paddingHorizontal: 12, paddingVertical: 4, borderRadius: borderRadius.full },
  catBadgeText: { fontSize: 13, fontWeight: '600', color: theme.primary },

  sectionTitle: { ...typography.h3, color: theme.textPrimary, marginBottom: spacing.md, marginTop: spacing.md },
  description: { ...typography.body, color: theme.textSecondary, lineHeight: 24 },

  quantityRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  qtyBtn: {
    width: 44, height: 44, borderRadius: 22, borderWidth: 1.5,
    borderColor: theme.border, alignItems: 'center', justifyContent: 'center',
  },
  qtyBtnDisabled: { borderColor: theme.borderLight, backgroundColor: theme.borderLight },
  qtyValue: { fontSize: 22, fontWeight: '700', color: theme.textPrimary, minWidth: 40, textAlign: 'center' },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.lg, paddingTop: spacing.lg,
    backgroundColor: theme.surface, borderTopWidth: 1, borderTopColor: theme.border,
    ...shadows.cardElevated,
  },
  bottomTotal: { ...typography.price, color: theme.textPrimary },
  bottomQty: { fontSize: 13, color: theme.textMuted, marginTop: 2 },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: theme.primary, paddingHorizontal: 24, paddingVertical: 14,
    borderRadius: borderRadius.full, ...shadows.button,
  },
  addBtnDisabled: { backgroundColor: theme.textMuted },
  addBtnText: { ...typography.button, color: theme.textOnPrimary },
});
