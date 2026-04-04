import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { theme, typography, spacing, borderRadius, shadows } from '../constants/theme';
import { formatPrice, getDayName, formatTime } from '../constants/config';
import { getServiceById, timeSlots } from '../services/mockData';
import { useApp } from '../contexts/AppContext';
import * as Haptics from 'expo-haptics';

export default function BookingScreen() {
  const insets = useSafeAreaInsets();
  const { serviceId } = useLocalSearchParams<{ serviceId: string }>();
  const { addBooking } = useApp();
  const service = getServiceById(serviceId || '');

  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Generate next 14 days
  const dates = useMemo(() => {
    const result = [];
    for (let i = 0; i < 14; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      // Skip Sunday (0)
      if (date.getDay() !== 0) {
        result.push(date);
      }
    }
    return result.slice(0, 10);
  }, []);

  // Simulate some unavailable slots
  const unavailableSlots = useMemo(() => {
    const slots: string[] = [];
    const seed = selectedDateIndex * 3;
    if (seed % 2 === 0) slots.push('10:00', '14:30');
    if (seed % 3 === 0) slots.push('11:00', '16:00');
    return slots;
  }, [selectedDateIndex]);

  if (!service) {
    return (
      <SafeAreaView edges={['top']} style={styles.container}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: theme.textSecondary }}>Service introuvable</Text>
          <Pressable onPress={() => router.back()} style={{ marginTop: 16, padding: 12 }}>
            <Text style={{ color: theme.primary, fontWeight: '600' }}>Retour</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const handleConfirm = () => {
    if (!selectedTime) {
      Alert.alert('Attention', 'Veuillez sélectionner un créneau horaire.');
      return;
    }
    const selectedDate = dates[selectedDateIndex];
    addBooking({
      serviceId: service.id,
      serviceName: service.name,
      date: selectedDate.toISOString().split('T')[0],
      time: selectedTime,
      status: 'pending',
      totalPrice: service.price,
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      'Réservation confirmée ! ✨',
      `${service.name}\n${selectedDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} à ${formatTime(selectedTime)}\n\nVous recevrez une confirmation par SMS.`,
      [{ text: 'Parfait', onPress: () => router.dismiss() }]
    );
  };

  const selectedDate = dates[selectedDateIndex];

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => { Haptics.selectionAsync(); router.back(); }}>
          <MaterialIcons name="arrow-back" size={24} color={theme.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Réserver</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Service Summary */}
        <View style={styles.serviceSummary}>
          <LinearGradient
            colors={[theme.primarySoft, theme.backgroundSecondary]}
            style={styles.summaryCard}
          >
            <View style={styles.summaryIcon}>
              <MaterialIcons name="spa" size={24} color={theme.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.summaryName}>{service.name}</Text>
              <View style={styles.summaryMeta}>
                <Text style={styles.summaryPrice}>{formatPrice(service.price)}</Text>
                <Text style={styles.summaryDot}>•</Text>
                <Text style={styles.summaryDuration}>{service.durationMinutes} min</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Date Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choisir une date</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: spacing.sm }}
          >
            {dates.map((date, index) => {
              const isSelected = index === selectedDateIndex;
              const isToday = index === 0;
              return (
                <Pressable
                  key={index}
                  style={[styles.dateCard, isSelected && styles.dateCardActive]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setSelectedDateIndex(index);
                    setSelectedTime(null);
                  }}
                >
                  <Text style={[styles.dateDayName, isSelected && styles.dateTextActive]}>
                    {isToday ? "Auj." : getDayName(date)}
                  </Text>
                  <Text style={[styles.dateNumber, isSelected && styles.dateTextActive]}>
                    {date.getDate()}
                  </Text>
                  <Text style={[styles.dateMonth, isSelected && styles.dateTextActive]}>
                    {date.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '')}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Time Slots */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choisir un créneau</Text>
          <View style={styles.timeGrid}>
            {timeSlots.map(slot => {
              const isUnavailable = unavailableSlots.includes(slot);
              const isSelected = selectedTime === slot;
              return (
                <Pressable
                  key={slot}
                  style={[
                    styles.timeSlot,
                    isSelected && styles.timeSlotActive,
                    isUnavailable && styles.timeSlotDisabled,
                  ]}
                  onPress={() => {
                    if (!isUnavailable) {
                      Haptics.selectionAsync();
                      setSelectedTime(slot);
                    }
                  }}
                  disabled={isUnavailable}
                >
                  <Text
                    style={[
                      styles.timeSlotText,
                      isSelected && styles.timeSlotTextActive,
                      isUnavailable && styles.timeSlotTextDisabled,
                    ]}
                  >
                    {formatTime(slot)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Summary */}
        {selectedTime && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Résumé</Text>
            <View style={styles.summaryBlock}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Prestation</Text>
                <Text style={styles.summaryValue}>{service.name}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Date</Text>
                <Text style={styles.summaryValue}>
                  {selectedDate.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Heure</Text>
                <Text style={styles.summaryValue}>{formatTime(selectedTime)}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Durée</Text>
                <Text style={styles.summaryValue}>{service.durationMinutes} minutes</Text>
              </View>
              <View style={[styles.divider, { marginBottom: spacing.md }]} />
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>{formatPrice(service.price)}</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom CTA */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable
          style={[styles.confirmBtn, !selectedTime && styles.confirmBtnDisabled]}
          onPress={selectedTime ? handleConfirm : undefined}
        >
          <MaterialIcons name="check-circle" size={22} color={theme.textOnPrimary} />
          <Text style={styles.confirmBtnText}>Confirmer la réservation</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { ...typography.h3, color: theme.textPrimary },

  serviceSummary: { paddingHorizontal: spacing.lg, marginBottom: spacing.lg },
  summaryCard: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    padding: spacing.lg, borderRadius: borderRadius.lg,
  },
  summaryIcon: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: theme.primaryMedium, alignItems: 'center', justifyContent: 'center',
  },
  summaryName: { fontSize: 16, fontWeight: '600', color: theme.textPrimary },
  summaryMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  summaryPrice: { fontSize: 14, fontWeight: '700', color: theme.primary },
  summaryDot: { color: theme.textMuted, fontSize: 12 },
  summaryDuration: { fontSize: 13, color: theme.textSecondary },

  section: { paddingHorizontal: spacing.lg, marginBottom: spacing.xxl },
  sectionTitle: { ...typography.h3, color: theme.textPrimary, marginBottom: spacing.md },

  dateCard: {
    width: 68, paddingVertical: spacing.md, alignItems: 'center',
    borderRadius: borderRadius.lg, backgroundColor: theme.surface,
    borderWidth: 1.5, borderColor: theme.border,
  },
  dateCardActive: {
    backgroundColor: theme.primary, borderColor: theme.primary,
  },
  dateDayName: { fontSize: 12, fontWeight: '600', color: theme.textMuted, marginBottom: 4 },
  dateNumber: { fontSize: 22, fontWeight: '700', color: theme.textPrimary },
  dateMonth: { fontSize: 11, color: theme.textSecondary, marginTop: 2 },
  dateTextActive: { color: theme.textOnPrimary },

  timeGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm,
  },
  timeSlot: {
    paddingHorizontal: 16, paddingVertical: 12,
    borderRadius: borderRadius.md, backgroundColor: theme.surface,
    borderWidth: 1.5, borderColor: theme.border,
  },
  timeSlotActive: {
    backgroundColor: theme.primary, borderColor: theme.primary,
  },
  timeSlotDisabled: {
    backgroundColor: theme.borderLight, borderColor: theme.borderLight,
  },
  timeSlotText: { fontSize: 14, fontWeight: '600', color: theme.textPrimary },
  timeSlotTextActive: { color: theme.textOnPrimary },
  timeSlotTextDisabled: { color: theme.textMuted },

  summaryBlock: {
    backgroundColor: theme.surface, borderRadius: borderRadius.lg,
    padding: spacing.lg, ...shadows.card,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { fontSize: 14, color: theme.textSecondary },
  summaryValue: { fontSize: 14, fontWeight: '600', color: theme.textPrimary },
  divider: { height: 1, backgroundColor: theme.borderLight, marginVertical: spacing.md },
  totalLabel: { fontSize: 16, fontWeight: '700', color: theme.textPrimary },
  totalValue: { ...typography.price, color: theme.primary },

  bottomBar: {
    paddingHorizontal: spacing.lg, paddingTop: spacing.lg,
    backgroundColor: theme.surface, borderTopWidth: 1, borderTopColor: theme.border,
  },
  confirmBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: theme.primary, paddingVertical: 16, borderRadius: borderRadius.full,
    ...shadows.button,
  },
  confirmBtnDisabled: { backgroundColor: theme.textMuted },
  confirmBtnText: { ...typography.button, color: theme.textOnPrimary },
});
