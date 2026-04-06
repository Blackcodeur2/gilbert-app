import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { FlashList as RealFlashList } from '@shopify/flash-list';
const FlashList: any = RealFlashList;
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { theme, typography, spacing, borderRadius, shadows } from '../../constants/theme';
import { formatPrice } from '../../constants/config';
import { type Service } from '../../services/types';
import { usePublicData } from '../../hooks/useSupabaseData';
import { AnimatedFadeIn } from '../../components/ui/AnimatedCard';
import { StarRating } from '../../components/ui/StarRating';
import { useReviews } from '../../hooks/useReviews';
import { getImageSource } from '../../constants/assets';
import * as Haptics from 'expo-haptics';
import { useApp } from '../../contexts/AppContext';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function ServiceRow({ item, categoryName, isFav, onToggleFav, avgRating, reviewCount }: {
  item: Service; categoryName: string; isFav: boolean; onToggleFav: () => void; avgRating: number; reviewCount: number;
}) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      style={[styles.serviceRow, animStyle]}
      onPress={() => { Haptics.selectionAsync(); router.push(`/service-detail?id=${item.id}`); }}
      onPressIn={() => { scale.value = withSpring(0.97, { damping: 15, stiffness: 300 }); }}
      onPressOut={() => { scale.value = withSpring(1, { damping: 15, stiffness: 300 }); }}
    >
      <Image source={getImageSource(item.imageUrl)} style={styles.serviceImg} contentFit="cover" />
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceCategory}>
          {categoryName}
        </Text>
        <Text style={styles.serviceName} numberOfLines={1}>{item.name}</Text>
        {reviewCount > 0 ? (
          <View style={styles.ratingRow}>
            <StarRating rating={avgRating} size={13} />
            <Text style={styles.ratingText}>{avgRating.toFixed(1)} ({reviewCount})</Text>
          </View>
        ) : null}
        <View style={styles.serviceMeta}>
          <Text style={styles.servicePrice}>{formatPrice(item.price)}</Text>
          <View style={styles.durationBadge}>
            <MaterialIcons name="schedule" size={12} color={theme.textSecondary} />
            <Text style={styles.durationText}>{item.durationMinutes} min</Text>
          </View>
        </View>
      </View>
      <View style={styles.serviceActions}>
        <Pressable onPress={() => { Haptics.selectionAsync(); onToggleFav(); }} hitSlop={8}>
          <MaterialIcons
            name={isFav ? 'favorite' : 'favorite-border'}
            size={22}
            color={isFav ? theme.primary : theme.textMuted}
          />
        </Pressable>
        <MaterialIcons name="chevron-right" size={24} color={theme.textMuted} />
      </View>
    </AnimatedPressable>
  );
}

export default function ServicesScreen() {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { favoriteServiceIds, toggleFavoriteService } = useApp();
  const { getAverageRating, getReviewCount } = useReviews();
  const { services, categories } = usePublicData();

  const filteredServices = selectedCategory === 'all'
    ? services
    : services.filter(s => s.categoryId === selectedCategory);

  const renderService = useCallback(({ item }: { item: Service }) => {
    const isFav = favoriteServiceIds.includes(item.id);
    const categoryName = categories.find(c => c.id === item.categoryId)?.name || '';
    return (
      <ServiceRow
        item={item}
        categoryName={categoryName}
        isFav={isFav}
        onToggleFav={() => toggleFavoriteService(item.id)}
        avgRating={getAverageRating(item.id)}
        reviewCount={getReviewCount(item.id)}
      />
    );
  }, [categories, favoriteServiceIds, toggleFavoriteService, getAverageRating, getReviewCount]);

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Header */}
      <AnimatedFadeIn delay={0}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Nos Prestations</Text>
          <Text style={styles.headerSubtitle}>{services.length} services disponibles</Text>
        </View>
      </AnimatedFadeIn>

      {/* Category Chips */}
      <View style={{ height: 48 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.sm }}
        >
          <Pressable
            style={[styles.chip, selectedCategory === 'all' && styles.chipActive]}
            onPress={() => { Haptics.selectionAsync(); setSelectedCategory('all'); }}
          >
            <Text style={[styles.chipText, selectedCategory === 'all' && styles.chipTextActive]}>Tous</Text>
          </Pressable>
          {categories.map(cat => (
            <Pressable
              key={cat.id}
              style={[styles.chip, selectedCategory === cat.id && styles.chipActive]}
              onPress={() => { Haptics.selectionAsync(); setSelectedCategory(cat.id); }}
            >
              <MaterialIcons
                name={cat.iconName as any}
                size={16}
                color={selectedCategory === cat.id ? theme.textOnPrimary : theme.textSecondary}
              />
              <Text style={[styles.chipText, selectedCategory === cat.id && styles.chipTextActive]}>{cat.name}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Services List */}
      <View style={{ flex: 1, marginTop: spacing.md }}>
        <FlashList
          data={filteredServices}
          renderItem={renderService}
          estimatedItemSize={110}
          keyExtractor={(item: any) => item.id}
          contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: insets.bottom + 16 }}
          ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.lg },
  headerTitle: { ...typography.h1, color: theme.textPrimary },
  headerSubtitle: { ...typography.caption, color: theme.textSecondary, marginTop: 4 },

  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 16, paddingVertical: 8,
    backgroundColor: theme.surface, borderRadius: borderRadius.full,
    borderWidth: 1, borderColor: theme.border,
  },
  chipActive: { backgroundColor: theme.primary, borderColor: theme.primary },
  chipText: { fontSize: 13, fontWeight: '600', color: theme.textSecondary },
  chipTextActive: { color: theme.textOnPrimary },

  serviceRow: {
    flexDirection: 'row', backgroundColor: theme.surface,
    borderRadius: borderRadius.lg, overflow: 'hidden', ...shadows.card,
  },
  serviceImg: { width: 90, height: 100 },
  serviceInfo: { flex: 1, padding: spacing.md, justifyContent: 'center' },
  serviceCategory: {
    fontSize: 10, fontWeight: '700', color: theme.primary,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 3,
  },
  serviceName: { fontSize: 15, fontWeight: '600', color: theme.textPrimary, marginBottom: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  ratingText: { fontSize: 11, color: theme.textSecondary, fontWeight: '500' },
  serviceMeta: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  servicePrice: { fontSize: 14, fontWeight: '700', color: theme.primaryDark },
  durationBadge: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  durationText: { fontSize: 12, color: theme.textSecondary },
  serviceActions: { paddingRight: spacing.md, alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
});
