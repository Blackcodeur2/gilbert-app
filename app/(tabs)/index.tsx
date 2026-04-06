import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Dimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { theme, typography, spacing, borderRadius, shadows } from '../../constants/theme';
import { config, formatPrice } from '../../constants/config';
import { usePublicData } from '../../hooks/useSupabaseData';
import { AnimatedCard, AnimatedFadeIn, AnimatedScaleButton } from '../../components/ui/AnimatedCard';
import { StarRating } from '../../components/ui/StarRating';
import { useReviews } from '../../hooks/useReviews';
import { getImageSource } from '../../constants/assets';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { getAverageRating, getReviewCount } = useReviews();
  const { services, products, gallery, categories } = usePublicData();

  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || '';

  const featuredServices = services.filter(s => s.isFeatured);
  const featuredProducts = products.filter(p => p.isFeatured);
  const featuredGallery = gallery.filter(g => g.isFeatured);

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Banner */}
        <AnimatedFadeIn delay={0}>
          <Pressable
            style={styles.heroBanner}
            onPress={() => {
              Haptics.selectionAsync();
              router.push('/(tabs)/services');
            }}
          >
            <Image
              source={getImageSource('hero-banner.jpg')}
              style={StyleSheet.absoluteFillObject}
              contentFit="cover"
            />
            <LinearGradient
              colors={['rgba(45,27,46,0.15)', 'rgba(45,27,46,0.7)']}
              style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.heroContent}>
              <View style={styles.heroTag}>
                <MaterialIcons name="spa" size={14} color={theme.accent} />
                <Text style={styles.heroTagText}>SALON D&apos;ONGLERIE</Text>
              </View>
              <Text style={styles.heroTitle}>Gilbert Pro</Text>
              <Text style={styles.heroSubtitle}>{config.appDescription}</Text>
              <AnimatedScaleButton
                onPress={() => {
                  Haptics.selectionAsync();
                  router.push('/(tabs)/services');
                }}
                style={styles.heroCta}
              >
                <Text style={styles.heroCtaText}>Réserver maintenant</Text>
                <MaterialIcons name="arrow-forward" size={18} color={theme.textOnPrimary} />
              </AnimatedScaleButton>
            </View>
          </Pressable>
        </AnimatedFadeIn>

        {/* Welcome */}
        <AnimatedFadeIn delay={150}>
          <View style={styles.section}>
            <View style={styles.welcomeRow}>
              <View style={styles.welcomeIcon}>
                <MaterialIcons name="auto-awesome" size={20} color={theme.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.welcomeTitle}>Bienvenue chez {config.appName}</Text>
                <Text style={styles.welcomeText}>
                  Sublimez vos ongles avec nos services professionnels. Pose gel, nail art, soins — nous réalisons toutes vos envies beauté.
                </Text>
              </View>
            </View>
          </View>
        </AnimatedFadeIn>

        {/* Featured Services */}
        <AnimatedFadeIn delay={250}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nos Prestations Vedettes</Text>
            <Pressable onPress={() => { Haptics.selectionAsync(); router.push('/(tabs)/services'); }}>
              <Text style={styles.seeAllText}>Voir tout</Text>
            </Pressable>
          </View>
        </AnimatedFadeIn>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.md }}
          style={{ marginBottom: spacing.xxl }}
        >
          {featuredServices.map((service, idx) => {
            const avg = getAverageRating(service.id);
            const count = getReviewCount(service.id);
            return (
              <AnimatedCard
                key={service.id}
                index={idx}
                delay={300 + idx * 80}
                style={styles.serviceCard}
                onPress={() => {
                  Haptics.selectionAsync();
                  router.push(`/service-detail?id=${service.id}`);
                }}
              >
                <Image source={getImageSource(service.imageUrl)} style={styles.serviceImage} contentFit="cover" />
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceCat} numberOfLines={1}>
                    {getCategoryName(service.categoryId)}
                  </Text>
                  <Text style={styles.serviceName} numberOfLines={2}>{service.name}</Text>
                  {count > 0 ? (
                    <View style={styles.ratingRow}>
                      <StarRating rating={avg} size={14} />
                      <Text style={styles.ratingText}>{avg.toFixed(1)} ({count})</Text>
                    </View>
                  ) : null}
                  <View style={styles.serviceBottom}>
                    <Text style={styles.servicePrice}>{formatPrice(service.price)}</Text>
                    <View style={styles.durationTag}>
                      <MaterialIcons name="schedule" size={12} color={theme.textSecondary} />
                      <Text style={styles.durationText}>{service.durationMinutes} min</Text>
                    </View>
                  </View>
                </View>
              </AnimatedCard>
            );
          })}
        </ScrollView>

        {/* Featured Products */}
        <AnimatedFadeIn delay={500}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Notre Boutique</Text>
            <Pressable onPress={() => { Haptics.selectionAsync(); router.push('/(tabs)/shop'); }}>
              <Text style={styles.seeAllText}>Voir tout</Text>
            </Pressable>
          </View>
        </AnimatedFadeIn>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.md }}
          style={{ marginBottom: spacing.xxl }}
        >
          {featuredProducts.map((product, idx) => (
            <AnimatedCard
              key={product.id}
              index={idx}
              delay={550 + idx * 80}
              style={styles.productCard}
              onPress={() => {
                Haptics.selectionAsync();
                router.push(`/product-detail?id=${product.id}`);
              }}
            >
              <Image source={getImageSource(product.imageUrl)} style={styles.productImage} contentFit="cover" />
              <Text style={styles.productBrand}>{product.brand}</Text>
              <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
              <Text style={styles.productPrice}>{formatPrice(product.price)}</Text>
            </AnimatedCard>
          ))}
        </ScrollView>

        {/* Gallery Preview */}
        <AnimatedFadeIn delay={700}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nos Réalisations</Text>
            <Pressable onPress={() => { Haptics.selectionAsync(); router.push('/(tabs)/gallery'); }}>
              <Text style={styles.seeAllText}>Voir tout</Text>
            </Pressable>
          </View>
        </AnimatedFadeIn>
        <View style={styles.galleryGrid}>
          {featuredGallery.slice(0, 6).map((item, idx) => (
            <AnimatedCard key={item.id} index={idx} delay={750 + idx * 60} style={styles.galleryItem}>
              <Image source={getImageSource(item.imageUrl)} style={styles.galleryImage} contentFit="cover" />
              <LinearGradient
                colors={['transparent', 'rgba(45,27,46,0.6)']}
                style={styles.galleryOverlay}
              />
              <Text style={styles.galleryTitle} numberOfLines={1}>{item.title}</Text>
            </AnimatedCard>
          ))}
        </View>

        {/* Contact Section */}
        <AnimatedFadeIn delay={900}>
          <View style={styles.contactSection}>
            <Text style={styles.sectionTitle}>Nous Retrouver</Text>
            <View style={styles.contactCard}>
              <View style={styles.contactRow}>
                <View style={[styles.contactIcon, { backgroundColor: theme.primarySoft }]}>
                  <MaterialIcons name="location-on" size={20} color={theme.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.contactLabel}>Adresse</Text>
                  <Text style={styles.contactValue}>{config.address}</Text>
                </View>
              </View>
              <View style={styles.contactDivider} />
              <View style={styles.contactRow}>
                <View style={[styles.contactIcon, { backgroundColor: theme.primarySoft }]}>
                  <MaterialIcons name="phone" size={20} color={theme.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.contactLabel}>Téléphone</Text>
                  <Text style={styles.contactValue}>{config.phone}</Text>
                </View>
              </View>
              <View style={styles.contactDivider} />
              <View style={styles.contactRow}>
                <View style={[styles.contactIcon, { backgroundColor: theme.primarySoft }]}>
                  <MaterialIcons name="schedule" size={20} color={theme.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.contactLabel}>Horaires</Text>
                  <Text style={styles.contactValue}>{config.openingHours}</Text>
                </View>
              </View>
            </View>
          </View>
        </AnimatedFadeIn>
      </ScrollView>
    </SafeAreaView>
  );
}

const GALLERY_GAP = 8;
const GALLERY_ITEM_W = (SCREEN_WIDTH - spacing.lg * 2 - GALLERY_GAP * 2) / 3;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },

  heroBanner: { height: 260, justifyContent: 'flex-end', overflow: 'hidden' },
  heroContent: { padding: spacing.xl },
  heroTag: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  heroTagText: { fontSize: 11, fontWeight: '700', color: theme.accent, letterSpacing: 1.5 },
  heroTitle: { fontSize: 36, fontWeight: '700', color: theme.textOnDark, letterSpacing: -0.5 },
  heroSubtitle: { fontSize: 15, color: 'rgba(255,255,255,0.85)', marginTop: 4, marginBottom: 16 },
  heroCta: {
    flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start',
    backgroundColor: theme.primary, paddingHorizontal: 20, paddingVertical: 12,
    borderRadius: borderRadius.full, gap: 8, ...shadows.button,
  },
  heroCtaText: { color: theme.textOnPrimary, fontWeight: '600', fontSize: 14 },

  section: { paddingHorizontal: spacing.lg, paddingVertical: spacing.xl },
  welcomeRow: { flexDirection: 'row', gap: spacing.md },
  welcomeIcon: {
    width: 40, height: 40, borderRadius: borderRadius.md,
    backgroundColor: theme.primarySoft, alignItems: 'center', justifyContent: 'center', marginTop: 2,
  },
  welcomeTitle: { ...typography.h3, color: theme.textPrimary, marginBottom: 6 },
  welcomeText: { ...typography.body, color: theme.textSecondary },

  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.lg, marginBottom: spacing.md,
  },
  sectionTitle: { ...typography.sectionTitle, color: theme.textPrimary },
  seeAllText: { fontSize: 14, fontWeight: '600', color: theme.primary },

  serviceCard: {
    width: 180, backgroundColor: theme.surface,
    borderRadius: borderRadius.lg, overflow: 'hidden', ...shadows.card,
  },
  serviceImage: { width: 180, height: 120 },
  serviceInfo: { padding: spacing.md },
  serviceCat: {
    fontSize: 11, fontWeight: '600', color: theme.primary,
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4,
  },
  serviceName: { fontSize: 14, fontWeight: '600', color: theme.textPrimary, marginBottom: 6, lineHeight: 18 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  ratingText: { fontSize: 11, color: theme.textSecondary, fontWeight: '500' },
  serviceBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  servicePrice: { ...typography.priceSmall, color: theme.primary, fontSize: 14 },
  durationTag: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  durationText: { fontSize: 11, color: theme.textSecondary },

  productCard: {
    width: 150, backgroundColor: theme.surface,
    borderRadius: borderRadius.lg, overflow: 'hidden', padding: spacing.md, ...shadows.card,
  },
  productImage: { width: 126, height: 126, borderRadius: borderRadius.md, marginBottom: spacing.sm },
  productBrand: {
    fontSize: 11, fontWeight: '600', color: theme.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  productName: { fontSize: 13, fontWeight: '600', color: theme.textPrimary, marginTop: 2, marginBottom: 6, lineHeight: 17 },
  productPrice: { fontSize: 14, fontWeight: '700', color: theme.primary },

  galleryGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: GALLERY_GAP,
    paddingHorizontal: spacing.lg, marginBottom: spacing.xxl,
  },
  galleryItem: {
    width: GALLERY_ITEM_W, height: GALLERY_ITEM_W,
    borderRadius: borderRadius.md, overflow: 'hidden',
  },
  galleryImage: { width: '100%', height: '100%' },
  galleryOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%' },
  galleryTitle: { position: 'absolute', bottom: 6, left: 6, right: 6, fontSize: 10, fontWeight: '600', color: theme.textOnDark },

  contactSection: { paddingHorizontal: spacing.lg, marginBottom: spacing.lg },
  contactCard: {
    backgroundColor: theme.surface, borderRadius: borderRadius.lg,
    padding: spacing.lg, marginTop: spacing.md, ...shadows.card,
  },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  contactIcon: { width: 40, height: 40, borderRadius: borderRadius.full, alignItems: 'center', justifyContent: 'center' },
  contactLabel: { fontSize: 11, fontWeight: '600', color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
  contactValue: { fontSize: 14, fontWeight: '500', color: theme.textPrimary, marginTop: 2 },
  contactDivider: { height: 1, backgroundColor: theme.borderLight, marginVertical: spacing.md, marginLeft: 52 },
});
