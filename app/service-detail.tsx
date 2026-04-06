import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { theme, typography, spacing, borderRadius, shadows } from '../constants/theme';
import { formatPrice } from '../constants/config';
import { useApp } from '../contexts/AppContext';
import { usePublicData } from '../hooks/useSupabaseData';
import { useReviews } from '../hooks/useReviews';
import { useAuth } from '../hooks/useAuth';
import { AnimatedFadeIn, AnimatedScaleButton } from '../components/ui/AnimatedCard';
import { StarRating } from '../components/ui/StarRating';
import { getImageSource } from '../constants/assets';
import { useAlert } from '@/template';
import * as Haptics from 'expo-haptics';

export default function ServiceDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { favoriteServiceIds, toggleFavoriteService } = useApp();
  const { getReviewsForService, getAverageRating, getReviewCount, addReview, getUserReviewForService } = useReviews();
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const { services, categories } = usePublicData();
  const service = services.find(s => s.id === id);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  if (!service) {
    return (
      <SafeAreaView edges={['top']} style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Service introuvable</Text>
          <Pressable onPress={() => router.back()} style={styles.backLink}>
            <Text style={styles.backLinkText}>Retour</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const isFav = favoriteServiceIds.includes(service.id);
  const categoryName = categories.find(c => c.id === service.categoryId)?.name || '';
  const reviews = getReviewsForService(service.id);
  const avgRating = getAverageRating(service.id);
  const reviewCount = getReviewCount(service.id);
  const userReview = user ? getUserReviewForService(service.id, user.id) : undefined;

  const handleSubmitReview = () => {
    if (!newComment.trim()) {
      showAlert('Attention', 'Veuillez écrire un commentaire.');
      return;
    }
    if (!user) return;
    addReview({
      serviceId: service.id,
      userId: user.id,
      userName: user.fullName,
      rating: newRating,
      comment: newComment.trim(),
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowReviewForm(false);
    setNewComment('');
    setNewRating(5);
    showAlert('Merci !', 'Votre avis a bien été publié.');
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Image */}
          <AnimatedFadeIn delay={0}>
            <View style={styles.heroContainer}>
              <Image source={getImageSource(service.imageUrl)} style={styles.heroImage} contentFit="cover" />
              <View style={styles.heroOverlay} />
              <SafeAreaView edges={['top']} style={styles.topBar}>
                <Pressable style={styles.iconButton} onPress={() => { Haptics.selectionAsync(); router.back(); }}>
                  <MaterialIcons name="arrow-back" size={24} color={theme.textPrimary} />
                </Pressable>
                <Pressable
                  style={styles.iconButton}
                  onPress={() => { Haptics.selectionAsync(); toggleFavoriteService(service.id); }}
                >
                  <MaterialIcons
                    name={isFav ? 'favorite' : 'favorite-border'}
                    size={24}
                    color={isFav ? theme.primary : theme.textPrimary}
                  />
                </Pressable>
              </SafeAreaView>
            </View>
          </AnimatedFadeIn>

          {/* Content */}
          <View style={styles.content}>
            <AnimatedFadeIn delay={100}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{categoryName}</Text>
              </View>
              <Text style={styles.serviceName}>{service.name}</Text>
              <Text style={styles.servicePrice}>{formatPrice(service.price)}</Text>
            </AnimatedFadeIn>

            {/* Info Cards */}
            <AnimatedFadeIn delay={200}>
              <View style={styles.infoRow}>
                <View style={styles.infoCard}>
                  <MaterialIcons name="schedule" size={22} color={theme.primary} />
                  <Text style={styles.infoValue}>{service.durationMinutes} min</Text>
                  <Text style={styles.infoLabel}>Durée</Text>
                </View>
                <View style={styles.infoCard}>
                  <MaterialIcons name="star" size={22} color={theme.accent} />
                  <Text style={styles.infoValue}>{reviewCount > 0 ? avgRating.toFixed(1) : '—'}</Text>
                  <Text style={styles.infoLabel}>{reviewCount > 0 ? `${reviewCount} avis` : 'Aucun avis'}</Text>
                </View>
                <View style={styles.infoCard}>
                  <MaterialIcons name="people" size={22} color={theme.secondary} />
                  <Text style={styles.infoValue}>{Math.max(reviewCount * 8, 10)}+</Text>
                  <Text style={styles.infoLabel}>Clients</Text>
                </View>
              </View>
            </AnimatedFadeIn>

            {/* Description */}
            <AnimatedFadeIn delay={300}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.descriptionText}>{service.description}</Text>
            </AnimatedFadeIn>

            {/* What's included */}
            <AnimatedFadeIn delay={400}>
              <Text style={styles.sectionTitle}>Inclus dans la prestation</Text>
              {[
                'Consultation personnalisée',
                'Préparation et nettoyage des ongles',
                'Application professionnelle',
                "Finition et conseils d'entretien",
              ].map((item, index) => (
                <View key={index} style={styles.includeRow}>
                  <MaterialIcons name="check-circle" size={20} color={theme.success} />
                  <Text style={styles.includeText}>{item}</Text>
                </View>
              ))}
            </AnimatedFadeIn>

            {/* Reviews Section */}
            <AnimatedFadeIn delay={500}>
              <View style={styles.reviewsHeader}>
                <Text style={styles.sectionTitle}>Avis clients</Text>
                {reviewCount > 0 ? (
                  <View style={styles.avgBadge}>
                    <MaterialIcons name="star" size={16} color={theme.accent} />
                    <Text style={styles.avgText}>{avgRating.toFixed(1)}</Text>
                    <Text style={styles.avgCount}>({reviewCount})</Text>
                  </View>
                ) : null}
              </View>

              {/* Rating Breakdown */}
              {reviewCount > 0 ? (
                <View style={styles.ratingBreakdown}>
                  {[5, 4, 3, 2, 1].map(star => {
                    const count = reviews.filter(r => r.rating === star).length;
                    const pct = reviewCount > 0 ? (count / reviewCount) * 100 : 0;
                    return (
                      <View key={star} style={styles.breakdownRow}>
                        <Text style={styles.breakdownStar}>{star}</Text>
                        <MaterialIcons name="star" size={14} color={theme.accent} />
                        <View style={styles.breakdownBarBg}>
                          <View style={[styles.breakdownBarFill, { width: `${pct}%` }]} />
                        </View>
                        <Text style={styles.breakdownCount}>{count}</Text>
                      </View>
                    );
                  })}
                </View>
              ) : null}

              {/* Add Review Button */}
              {!userReview && !showReviewForm ? (
                <AnimatedScaleButton
                  onPress={() => { Haptics.selectionAsync(); setShowReviewForm(true); }}
                  style={styles.addReviewBtn}
                >
                  <MaterialIcons name="rate-review" size={20} color={theme.primary} />
                  <Text style={styles.addReviewText}>Laisser un avis</Text>
                </AnimatedScaleButton>
              ) : null}

              {userReview && !showReviewForm ? (
                <View style={styles.userReviewNote}>
                  <MaterialIcons name="check-circle" size={16} color={theme.success} />
                  <Text style={styles.userReviewNoteText}>Vous avez déjà laissé un avis</Text>
                </View>
              ) : null}

              {/* Review Form */}
              {showReviewForm ? (
                <View style={styles.reviewForm}>
                  <Text style={styles.formLabel}>Votre note</Text>
                  <StarRating rating={newRating} size={32} gap={8} interactive onRate={setNewRating} />

                  <Text style={[styles.formLabel, { marginTop: spacing.lg }]}>Votre commentaire</Text>
                  <TextInput
                    style={styles.reviewInput}
                    placeholder="Partagez votre expérience..."
                    placeholderTextColor={theme.textMuted}
                    value={newComment}
                    onChangeText={setNewComment}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />

                  <View style={styles.formActions}>
                    <Pressable
                      style={styles.cancelBtn}
                      onPress={() => { setShowReviewForm(false); setNewComment(''); }}
                    >
                      <Text style={styles.cancelBtnText}>Annuler</Text>
                    </Pressable>
                    <AnimatedScaleButton onPress={handleSubmitReview} style={styles.submitReviewBtn}>
                      <Text style={styles.submitReviewText}>Publier</Text>
                    </AnimatedScaleButton>
                  </View>
                </View>
              ) : null}

              {/* Review List */}
              {reviews.slice(0, 5).map((review, idx) => (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewTop}>
                    <View style={styles.reviewAvatar}>
                      <Text style={styles.reviewAvatarText}>
                        {review.userName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.reviewName}>{review.userName}</Text>
                      <Text style={styles.reviewDate}>
                        {new Date(review.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric', month: 'long', year: 'numeric',
                        })}
                      </Text>
                    </View>
                    <StarRating rating={review.rating} size={14} />
                  </View>
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                </View>
              ))}

              {reviews.length === 0 ? (
                <View style={styles.noReviews}>
                  <MaterialIcons name="chat-bubble-outline" size={36} color={theme.textMuted} />
                  <Text style={styles.noReviewsText}>Aucun avis pour le moment</Text>
                  <Text style={styles.noReviewsSub}>Soyez le premier à laisser un avis !</Text>
                </View>
              ) : null}
            </AnimatedFadeIn>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom CTA */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
        <View>
          <Text style={styles.bottomPrice}>{formatPrice(service.price)}</Text>
          <Text style={styles.bottomDuration}>{service.durationMinutes} minutes</Text>
        </View>
        <AnimatedScaleButton
          onPress={() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            router.push(`/booking?serviceId=${service.id}`);
          }}
          style={styles.bookButton}
        >
          <MaterialIcons name="event" size={20} color={theme.textOnPrimary} />
          <Text style={styles.bookButtonText}>Réserver</Text>
        </AnimatedScaleButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  errorContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { ...typography.body, color: theme.textSecondary },
  backLink: { marginTop: 16, padding: 12 },
  backLinkText: { color: theme.primary, fontWeight: '600' },

  heroContainer: { height: 300, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.05)' },
  topBar: {
    position: 'absolute', top: 0, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingTop: spacing.sm,
  },
  iconButton: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center', justifyContent: 'center', ...shadows.card,
  },

  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl },
  categoryBadge: {
    alignSelf: 'flex-start', backgroundColor: theme.primarySoft,
    paddingHorizontal: 12, paddingVertical: 4, borderRadius: borderRadius.full, marginBottom: spacing.sm,
  },
  categoryText: { fontSize: 12, fontWeight: '700', color: theme.primary, textTransform: 'uppercase', letterSpacing: 0.5 },
  serviceName: { ...typography.h1, color: theme.textPrimary, marginBottom: 8 },
  servicePrice: { ...typography.priceLarge, color: theme.primary, marginBottom: spacing.xl },

  infoRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.xxl },
  infoCard: {
    flex: 1, backgroundColor: theme.surface, borderRadius: borderRadius.lg,
    padding: spacing.lg, alignItems: 'center', ...shadows.card,
  },
  infoValue: { fontSize: 18, fontWeight: '700', color: theme.textPrimary, marginTop: 8 },
  infoLabel: { fontSize: 12, color: theme.textMuted, marginTop: 2 },

  sectionTitle: { ...typography.h3, color: theme.textPrimary, marginBottom: spacing.md, marginTop: spacing.lg },
  descriptionText: { ...typography.body, color: theme.textSecondary },

  includeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  includeText: { ...typography.body, color: theme.textPrimary },

  // Reviews
  reviewsHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginTop: spacing.lg, marginBottom: spacing.md,
  },
  avgBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: theme.backgroundSecondary,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: borderRadius.full,
  },
  avgText: { fontSize: 14, fontWeight: '700', color: theme.textPrimary },
  avgCount: { fontSize: 12, color: theme.textMuted },

  ratingBreakdown: {
    backgroundColor: theme.surface, borderRadius: borderRadius.lg,
    padding: spacing.lg, marginBottom: spacing.lg, ...shadows.card,
  },
  breakdownRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  breakdownStar: { fontSize: 13, fontWeight: '600', color: theme.textPrimary, width: 14, textAlign: 'right' },
  breakdownBarBg: {
    flex: 1, height: 6, backgroundColor: theme.borderLight, borderRadius: 3, overflow: 'hidden',
  },
  breakdownBarFill: { height: 6, backgroundColor: theme.accent, borderRadius: 3 },
  breakdownCount: { fontSize: 12, color: theme.textMuted, width: 20, textAlign: 'right' },

  addReviewBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderWidth: 1.5, borderColor: theme.primary, borderRadius: borderRadius.full,
    paddingVertical: 12, marginBottom: spacing.xl,
  },
  addReviewText: { fontSize: 14, fontWeight: '600', color: theme.primary },

  userReviewNote: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: theme.successLight, padding: spacing.md,
    borderRadius: borderRadius.md, marginBottom: spacing.xl,
  },
  userReviewNoteText: { fontSize: 13, fontWeight: '500', color: theme.success },

  reviewForm: {
    backgroundColor: theme.surface, borderRadius: borderRadius.lg,
    padding: spacing.lg, marginBottom: spacing.xl, ...shadows.card,
  },
  formLabel: { fontSize: 14, fontWeight: '600', color: theme.textPrimary, marginBottom: spacing.sm },
  reviewInput: {
    borderWidth: 1.5, borderColor: theme.border, borderRadius: borderRadius.md,
    padding: spacing.md, fontSize: 15, color: theme.textPrimary,
    minHeight: 100, lineHeight: 22,
  },
  formActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: spacing.md, marginTop: spacing.lg },
  cancelBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: borderRadius.full },
  cancelBtnText: { fontSize: 14, fontWeight: '600', color: theme.textSecondary },
  submitReviewBtn: {
    backgroundColor: theme.primary, paddingHorizontal: 24,
    paddingVertical: 10, borderRadius: borderRadius.full,
  },
  submitReviewText: { fontSize: 14, fontWeight: '600', color: '#FFF' },

  reviewCard: {
    backgroundColor: theme.surface, borderRadius: borderRadius.lg,
    padding: spacing.lg, marginBottom: spacing.md, ...shadows.card,
  },
  reviewTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  reviewAvatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: theme.primaryMedium, alignItems: 'center', justifyContent: 'center',
  },
  reviewAvatarText: { fontSize: 13, fontWeight: '700', color: theme.primary },
  reviewName: { fontSize: 14, fontWeight: '600', color: theme.textPrimary },
  reviewDate: { fontSize: 11, color: theme.textMuted, marginTop: 1 },
  reviewComment: { ...typography.body, color: theme.textSecondary, lineHeight: 22 },

  noReviews: {
    alignItems: 'center', paddingVertical: spacing.xxl,
    backgroundColor: theme.surface, borderRadius: borderRadius.lg, marginBottom: spacing.md,
  },
  noReviewsText: { ...typography.bodyBold, color: theme.textSecondary, marginTop: spacing.md },
  noReviewsSub: { ...typography.caption, color: theme.textMuted, marginTop: 4 },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.lg, paddingTop: spacing.lg,
    backgroundColor: theme.surface, borderTopWidth: 1, borderTopColor: theme.border,
    ...shadows.cardElevated,
  },
  bottomPrice: { ...typography.price, color: theme.textPrimary },
  bottomDuration: { fontSize: 13, color: theme.textMuted, marginTop: 2 },
  bookButton: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: theme.primary, paddingHorizontal: 28, paddingVertical: 14,
    borderRadius: borderRadius.full, ...shadows.button,
  },
  bookButtonText: { ...typography.button, color: theme.textOnPrimary },
});
