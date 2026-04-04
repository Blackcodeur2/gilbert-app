import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { theme, typography, spacing, borderRadius, shadows } from '../../constants/theme';
import { config, formatPrice, getStatusLabel } from '../../constants/config';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../hooks/useAuth';
import { AnimatedFadeIn, AnimatedScaleButton } from '../../components/ui/AnimatedCard';
import * as Haptics from 'expo-haptics';

const statusColors: Record<string, string> = {
  pending: theme.statusPending,
  confirmed: theme.statusConfirmed,
  cancelled: theme.statusCancelled,
  completed: theme.statusCompleted,
};

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { profile, bookings, cancelBooking } = useApp();
  const { user, logout } = useAuth();

  const displayName = user?.fullName || profile.fullName;
  const displayEmail = user?.email || profile.email;

  const handleCancelBooking = (id: string) => {
    Alert.alert(
      'Annuler la réservation',
      'Voulez-vous vraiment annuler cette réservation ?',
      [
        { text: 'Non', style: 'cancel' },
        {
          text: 'Oui, annuler',
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            cancelBooking(id);
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Voulez-vous vraiment vous déconnecter ?',
      [
        { text: 'Non', style: 'cancel' },
        {
          text: 'Oui',
          style: 'destructive',
          onPress: async () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            await logout();
          },
        },
      ]
    );
  };

  const activeBookings = bookings.filter(b => b.status !== 'cancelled');

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <AnimatedFadeIn delay={0}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={[theme.primary, theme.primaryDark]}
                style={styles.avatar}
              >
                <Text style={styles.avatarText}>
                  {displayName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </Text>
              </LinearGradient>
            </View>
            <Text style={styles.profileName}>{displayName}</Text>
            <Text style={styles.profileEmail}>{displayEmail}</Text>
            <Text style={styles.profilePhone}>{user?.phone || profile.phone}</Text>
          </View>
        </AnimatedFadeIn>

        {/* Loyalty Points */}
        <AnimatedFadeIn delay={150}>
          <View style={styles.section}>
            <LinearGradient
              colors={[theme.primary, theme.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.loyaltyCard}
            >
              <View style={styles.loyaltyTop}>
                <View>
                  <Text style={styles.loyaltyLabel}>POINTS DE FIDÉLITÉ</Text>
                  <Text style={styles.loyaltyPoints}>{profile.loyaltyPoints}</Text>
                </View>
                <View style={styles.loyaltyIcon}>
                  <MaterialIcons name="card-giftcard" size={28} color="rgba(255,255,255,0.9)" />
                </View>
              </View>
              <View style={styles.loyaltyBottom}>
                <MaterialIcons name="info-outline" size={14} color="rgba(255,255,255,0.6)" />
                <Text style={styles.loyaltyHint}>Cumulez 500 pts = 5 000 FCFA de réduction</Text>
              </View>
            </LinearGradient>
          </View>
        </AnimatedFadeIn>

        {/* Bookings */}
        <AnimatedFadeIn delay={300}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mes Réservations</Text>
            {activeBookings.length === 0 ? (
              <View style={styles.emptyState}>
                <MaterialIcons name="event-note" size={48} color={theme.textMuted} />
                <Text style={styles.emptyText}>Aucune réservation</Text>
                <Text style={styles.emptySubtext}>Réservez votre première prestation !</Text>
              </View>
            ) : (
              activeBookings.map(booking => (
                <View key={booking.id} style={styles.bookingCard}>
                  <View style={styles.bookingTop}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.bookingService}>{booking.serviceName}</Text>
                      <View style={styles.bookingMeta}>
                        <MaterialIcons name="event" size={14} color={theme.textSecondary} />
                        <Text style={styles.bookingDate}>
                          {new Date(booking.date).toLocaleDateString('fr-FR', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          })}
                        </Text>
                        <MaterialIcons name="schedule" size={14} color={theme.textSecondary} />
                        <Text style={styles.bookingDate}>{booking.time.replace(':', 'h')}</Text>
                      </View>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: statusColors[booking.status] + '20' }]}>
                      <View style={[styles.statusDot, { backgroundColor: statusColors[booking.status] }]} />
                      <Text style={[styles.statusText, { color: statusColors[booking.status] }]}>
                        {getStatusLabel(booking.status)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.bookingBottom}>
                    <Text style={styles.bookingPrice}>{formatPrice(booking.totalPrice)}</Text>
                    {(booking.status === 'pending' || booking.status === 'confirmed') ? (
                      <Pressable onPress={() => handleCancelBooking(booking.id)} hitSlop={8}>
                        <Text style={styles.cancelText}>Annuler</Text>
                      </Pressable>
                    ) : null}
                  </View>
                </View>
              ))
            )}
          </View>
        </AnimatedFadeIn>

        {/* Menu Items */}
        <AnimatedFadeIn delay={450}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Paramètres</Text>
            <View style={styles.menuCard}>
              {[
                { icon: 'person', label: 'Modifier le profil', sub: 'Nom, téléphone, email' },
                { icon: 'notifications', label: 'Notifications', sub: 'Gérer les rappels' },
                { icon: 'help-outline', label: 'Aide & Contact', sub: config.phone },
                { icon: 'info-outline', label: 'À propos', sub: `${config.appName} v1.0` },
              ].map((item, index) => (
                <React.Fragment key={item.label}>
                  {index > 0 ? <View style={styles.menuDivider} /> : null}
                  <Pressable style={styles.menuRow}>
                    <View style={[styles.menuIcon, { backgroundColor: theme.primarySoft }]}>
                      <MaterialIcons name={item.icon as any} size={20} color={theme.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.menuLabel}>{item.label}</Text>
                      <Text style={styles.menuSub}>{item.sub}</Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={22} color={theme.textMuted} />
                  </Pressable>
                </React.Fragment>
              ))}
            </View>
          </View>
        </AnimatedFadeIn>

        {/* Logout */}
        <AnimatedFadeIn delay={550}>
          <View style={[styles.section, { marginBottom: spacing.xxl }]}>
            <AnimatedScaleButton onPress={handleLogout} style={styles.logoutButton}>
              <MaterialIcons name="logout" size={20} color={theme.error} />
              <Text style={styles.logoutText}>Se déconnecter</Text>
            </AnimatedScaleButton>
          </View>
        </AnimatedFadeIn>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  profileHeader: { alignItems: 'center', paddingVertical: spacing.xxl, paddingHorizontal: spacing.lg },
  avatarContainer: { marginBottom: spacing.md },
  avatar: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 28, fontWeight: '700', color: theme.textOnPrimary },
  profileName: { ...typography.h2, color: theme.textPrimary },
  profileEmail: { ...typography.body, color: theme.textSecondary, marginTop: 4 },
  profilePhone: { ...typography.caption, color: theme.textMuted, marginTop: 2 },

  section: { paddingHorizontal: spacing.lg, marginBottom: spacing.xl },
  sectionTitle: { ...typography.sectionTitle, color: theme.textPrimary, marginBottom: spacing.md },

  loyaltyCard: { borderRadius: borderRadius.xl, padding: spacing.xl },
  loyaltyTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  loyaltyLabel: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.7)', letterSpacing: 1 },
  loyaltyPoints: { fontSize: 42, fontWeight: '700', color: '#FFF', marginTop: 4 },
  loyaltyIcon: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center',
  },
  loyaltyBottom: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.15)',
  },
  loyaltyHint: { fontSize: 12, color: 'rgba(255,255,255,0.6)' },

  bookingCard: {
    backgroundColor: theme.surface, borderRadius: borderRadius.lg,
    padding: spacing.lg, marginBottom: spacing.md, ...shadows.card,
  },
  bookingTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  bookingService: { fontSize: 15, fontWeight: '600', color: theme.textPrimary, marginBottom: 6 },
  bookingMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  bookingDate: { fontSize: 13, color: theme.textSecondary, marginRight: 8 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 4, borderRadius: borderRadius.full },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, fontWeight: '600' },
  bookingBottom: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: theme.borderLight,
  },
  bookingPrice: { ...typography.priceSmall, color: theme.primary },
  cancelText: { fontSize: 13, fontWeight: '600', color: theme.error },

  emptyState: {
    alignItems: 'center', paddingVertical: spacing.xxxl,
    backgroundColor: theme.surface, borderRadius: borderRadius.lg,
  },
  emptyText: { ...typography.bodyBold, color: theme.textSecondary, marginTop: spacing.md },
  emptySubtext: { ...typography.caption, color: theme.textMuted, marginTop: 4 },

  menuCard: { backgroundColor: theme.surface, borderRadius: borderRadius.lg, padding: spacing.lg, ...shadows.card },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm },
  menuIcon: { width: 40, height: 40, borderRadius: borderRadius.md, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { fontSize: 15, fontWeight: '600', color: theme.textPrimary },
  menuSub: { fontSize: 12, color: theme.textMuted, marginTop: 2 },
  menuDivider: { height: 1, backgroundColor: theme.borderLight, marginLeft: 52 },

  logoutButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm,
    paddingVertical: 14, borderRadius: borderRadius.lg,
    borderWidth: 1.5, borderColor: theme.error, backgroundColor: theme.errorLight,
  },
  logoutText: { fontSize: 15, fontWeight: '600', color: theme.error },
});
