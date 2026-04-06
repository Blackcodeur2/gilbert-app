import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { theme, typography, spacing, borderRadius, shadows } from '../constants/theme';
import { formatPrice } from '../constants/config';
import { useApp } from '../contexts/AppContext';
import { getImageSource } from '../constants/assets';
import * as Haptics from 'expo-haptics';

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const { cartItems, updateCartQuantity, removeFromCart, clearCart, cartTotal, cartItemCount } = useApp();

  const handleCheckout = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      'Commande envoyée ! 🎉',
      `Total : ${formatPrice(cartTotal)}\n${cartItemCount} article${cartItemCount > 1 ? 's' : ''}\n\nVous serez contacté pour la livraison.`,
      [{
        text: 'Parfait',
        onPress: () => {
          clearCart();
          router.dismiss();
        },
      }]
    );
  };

  const handleRemoveItem = (productId: string, name: string) => {
    Alert.alert('Retirer', `Retirer ${name} du panier ?`, [
      { text: 'Non', style: 'cancel' },
      {
        text: 'Oui',
        style: 'destructive',
        onPress: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          removeFromCart(productId);
        },
      },
    ]);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.closeBtn} onPress={() => router.dismiss()}>
          <MaterialIcons name="close" size={24} color={theme.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Mon Panier</Text>
        <View style={{ width: 44 }}>
          {cartItems.length > 0 && (
            <Pressable
              onPress={() => {
                Alert.alert('Vider le panier', 'Supprimer tous les articles ?', [
                  { text: 'Non', style: 'cancel' },
                  { text: 'Oui', style: 'destructive', onPress: () => { Haptics.selectionAsync(); clearCart(); } },
                ]);
              }}
            >
              <MaterialIcons name="delete-outline" size={24} color={theme.error} />
            </Pressable>
          )}
        </View>
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialIcons name="shopping-cart" size={64} color={theme.textMuted} />
          <Text style={styles.emptyTitle}>Panier vide</Text>
          <Text style={styles.emptySubtext}>
            Découvrez nos produits dans la boutique
          </Text>
          <Pressable
            style={styles.shopBtn}
            onPress={() => {
              Haptics.selectionAsync();
              router.dismiss();
              setTimeout(() => router.push('/(tabs)/shop'), 300);
            }}
          >
            <Text style={styles.shopBtnText}>Voir la boutique</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: insets.bottom + 180 }}
            showsVerticalScrollIndicator={false}
          >
            {cartItems.map((item) => (
              <View key={item.product.id} style={styles.cartItem}>
                <Image source={getImageSource(item.product.imageUrl)} style={styles.itemImage} contentFit="cover" />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemBrand}>{item.product.brand}</Text>
                  <Text style={styles.itemName} numberOfLines={2}>{item.product.name}</Text>
                  <Text style={styles.itemPrice}>{formatPrice(item.product.price)}</Text>
                  <View style={styles.qtyRow}>
                    <Pressable
                      style={styles.qtyBtn}
                      onPress={() => {
                        Haptics.selectionAsync();
                        updateCartQuantity(item.product.id, item.quantity - 1);
                      }}
                    >
                      <MaterialIcons name="remove" size={18} color={theme.textPrimary} />
                    </Pressable>
                    <Text style={styles.qtyValue}>{item.quantity}</Text>
                    <Pressable
                      style={styles.qtyBtn}
                      onPress={() => {
                        Haptics.selectionAsync();
                        updateCartQuantity(item.product.id, item.quantity + 1);
                      }}
                    >
                      <MaterialIcons name="add" size={18} color={theme.textPrimary} />
                    </Pressable>
                    <View style={{ flex: 1 }} />
                    <Pressable onPress={() => handleRemoveItem(item.product.id, item.product.name)}>
                      <MaterialIcons name="delete-outline" size={20} color={theme.error} />
                    </Pressable>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Bottom Summary */}
          <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
            <View style={styles.summarySection}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Sous-total</Text>
                <Text style={styles.summaryValue}>{formatPrice(cartTotal)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Livraison</Text>
                <Text style={[styles.summaryValue, { color: theme.success }]}>Gratuite</Text>
              </View>
              <View style={styles.totalDivider} />
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>{formatPrice(cartTotal)}</Text>
              </View>
            </View>
            <Pressable style={styles.checkoutBtn} onPress={handleCheckout}>
              <Text style={styles.checkoutText}>Commander • {formatPrice(cartTotal)}</Text>
            </Pressable>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: theme.border,
  },
  closeBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { ...typography.h3, color: theme.textPrimary },

  emptyState: {
    flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xxxl,
  },
  emptyTitle: { ...typography.h3, color: theme.textSecondary, marginTop: spacing.lg },
  emptySubtext: { ...typography.body, color: theme.textMuted, marginTop: 8, textAlign: 'center' },
  shopBtn: {
    marginTop: spacing.xxl, backgroundColor: theme.primary,
    paddingHorizontal: 32, paddingVertical: 14, borderRadius: borderRadius.full,
    ...shadows.button,
  },
  shopBtnText: { ...typography.button, color: theme.textOnPrimary },

  cartItem: {
    flexDirection: 'row', backgroundColor: theme.surface,
    borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.md,
    ...shadows.card,
  },
  itemImage: { width: 80, height: 80, borderRadius: borderRadius.md },
  itemInfo: { flex: 1, marginLeft: spacing.md },
  itemBrand: { fontSize: 10, fontWeight: '700', color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
  itemName: { fontSize: 14, fontWeight: '600', color: theme.textPrimary, marginTop: 2, marginBottom: 4 },
  itemPrice: { fontSize: 14, fontWeight: '700', color: theme.primary, marginBottom: 8 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  qtyBtn: {
    width: 32, height: 32, borderRadius: 16, borderWidth: 1.5,
    borderColor: theme.border, alignItems: 'center', justifyContent: 'center',
  },
  qtyValue: { fontSize: 16, fontWeight: '700', color: theme.textPrimary, minWidth: 24, textAlign: 'center' },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: spacing.lg, paddingTop: spacing.lg,
    backgroundColor: theme.surface, borderTopWidth: 1, borderTopColor: theme.border,
    ...shadows.cardElevated,
  },
  summarySection: { marginBottom: spacing.lg },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  summaryLabel: { fontSize: 14, color: theme.textSecondary },
  summaryValue: { fontSize: 14, fontWeight: '600', color: theme.textPrimary },
  totalDivider: { height: 1, backgroundColor: theme.border, marginVertical: spacing.sm },
  totalLabel: { fontSize: 17, fontWeight: '700', color: theme.textPrimary },
  totalValue: { ...typography.price, color: theme.primary },
  checkoutBtn: {
    backgroundColor: theme.primary, paddingVertical: 16,
    borderRadius: borderRadius.full, alignItems: 'center',
    ...shadows.button,
  },
  checkoutText: { ...typography.button, color: theme.textOnPrimary },
});
