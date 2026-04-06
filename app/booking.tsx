import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Alert, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { theme, typography, spacing, borderRadius, shadows } from '../constants/theme';
import { formatPrice, getDayName, formatTime, timeSlots } from '../constants/config';
import { useApp } from '../contexts/AppContext';
import { usePublicData } from '../hooks/useSupabaseData';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../services/supabase';
import { getImageSource } from '../constants/assets';
import * as Haptics from 'expo-haptics';

export default function BookingScreen() {
  const insets = useSafeAreaInsets();
  const { serviceId } = useLocalSearchParams<{ serviceId: string }>();
  const { addBooking } = useApp();
  const { services } = usePublicData();
  const { user } = useAuth();
  const service = services.find(s => s.id === serviceId);

  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<'Samira' | 'Gilbert pro' | 'Divine' | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'cash' | 'orange_money' | 'mtn_money' | 'card'>('cash');
  const [notes, setNotes] = useState('');
  const [unavailableSlots, setUnavailableSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const professionals = [
    { id: 'Samira', name: 'Samira', specialist: 'Nail Art', imageName: 'photo_samira.jpeg' },
    { id: 'Gilbert pro', name: 'Gilbert pro', specialist: 'Pose Gel', imageName: 'photo_gilbert.jpeg' },
    { id: 'Divine', name: 'Divine', specialist: 'Manucure Russe', imageName: 'photo_divine.jpeg' },
  ] as const;

  const paymentMethods = [
    { id: 'cash', name: 'Espèces', icon: 'payments' },
    { id: 'orange_money', name: 'Orange Money', icon: 'smartphone', color: '#FF6600' },
    { id: 'mtn_money', name: 'MTN MoMo', icon: 'smartphone', color: '#FFCC00' },
    { id: 'card', name: 'Carte Bancaire', icon: 'credit-card' },
  ] as const;

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

  const selectedDate = dates[selectedDateIndex];

  // Fetch unavailable slots from Supabase whenever the date changes
  React.useEffect(() => {
    let isMounted = true;
    const fetchSlots = async () => {
      setIsLoadingSlots(true);
      const dateStr = selectedDate.toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('bookings')
        .select('booking_time')
        .eq('booking_date', dateStr)
        .neq('status', 'cancelled');
        
      if (isMounted) {
        if (data) {
          // Supabase TIME is returned as "HH:MM:SS" but our UI uses "HH:MM"
          const bookedTimes = data.map(b => b.booking_time.substring(0, 5));
          setUnavailableSlots(bookedTimes);
        } else {
          setUnavailableSlots([]);
        }
        setIsLoadingSlots(false);
      }
    };
    
    fetchSlots();
    return () => { isMounted = false; };
  }, [selectedDateIndex, selectedDate]);

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

  const handleConfirm = async () => {
    if (!selectedTime) {
      Alert.alert('Attention', 'Veuillez sélectionner un créneau horaire.');
      return;
    }
    if (!selectedProfessional) {
      Alert.alert('Attention', 'Veuillez choisir un professionnel.');
      return;
    }
    if (!user) {
      Alert.alert('Connexion requise', 'Vous devez être connecté pour réserver.', [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Se connecter', onPress: () => router.push('/login') }
      ]);
      return;
    }

    const selectedDate = dates[selectedDateIndex];
    
    // Simulation de paiement mobile si nécessaire
    if (selectedPaymentMethod === 'orange_money' || selectedPaymentMethod === 'mtn_money') {
      setIsProcessingPayment(true);
      // Simuler un délai de traitement
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsProcessingPayment(false);
      
      const confirmed = await new Promise(resolve => {
        Alert.alert(
          'Confirmation de paiement',
          `Voulez-vous simuler le paiement de ${formatPrice(service.price)} via ${selectedPaymentMethod === 'orange_money' ? 'Orange Money' : 'MTN MoMo'} ?`,
          [
            { text: 'Annuler', onPress: () => resolve(false), style: 'cancel' },
            { text: 'Confirmer le paiement', onPress: () => resolve(true) }
          ]
        );
      });
      
      if (!confirmed) return;
    }

    const success = await addBooking({
      serviceId: service.id,
      serviceName: service.name,
      date: selectedDate.toISOString().split('T')[0],
      time: selectedTime,
      status: 'pending',
      paymentMethod: selectedPaymentMethod,
      paymentStatus: (selectedPaymentMethod === 'orange_money' || selectedPaymentMethod === 'mtn_money') ? 'paid' : 'unpaid',
      professional: selectedProfessional,
      notes: notes,
      totalPrice: service.price,
    });

    if (success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        'Réservation confirmée ! ✨',
        `${service.name}\n${selectedDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} à ${formatTime(selectedTime)}\n\nVous recevrez une confirmation par SMS.`,
        [{ text: 'Parfait', onPress: () => router.dismiss() }]
      );
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Erreur', 'Impossible de confirmer la réservation pour le moment.');
    }
  };

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
            {isLoadingSlots ? (
              <Text style={{ color: theme.textSecondary }}>Vérification des disponibilités...</Text>
            ) : (
              timeSlots.map(slot => {
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
            })
            )}
          </View>
        </View>

        {/* Professional Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choisir un professionnel</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.md }}>
            {professionals.map((prof) => {
              const isSelected = selectedProfessional === prof.id;
              return (
                <Pressable
                  key={prof.id}
                  style={[styles.profCard, isSelected && styles.profCardActive]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setSelectedProfessional(prof.id);
                  }}
                >
                  <View style={[styles.profAvatar, isSelected && styles.profAvatarActive]}>
                    {prof.imageName ? (
                      <Image 
                        source={getImageSource(prof.imageName)} 
                        style={styles.profAvatarImg} 
                        contentFit="cover" 
                      />
                    ) : (
                      <MaterialIcons name="person" size={24} color={isSelected ? theme.textOnPrimary : theme.textMuted} />
                    )}
                  </View>
                  <Text style={[styles.profName, isSelected && styles.profTextActive]}>{prof.name}</Text>
                  <Text style={[styles.profSpecialist, isSelected && styles.profTextActive]}>{prof.specialist}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Payment Method Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mode de paiement</Text>
          <View style={styles.paymentGrid}>
            {paymentMethods.map((method) => {
              const isSelected = selectedPaymentMethod === method.id;
              return (
                <Pressable
                  key={method.id}
                  style={[styles.paymentCard, isSelected && styles.paymentCardActive]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setSelectedPaymentMethod(method.id);
                  }}
                >
                  <MaterialIcons 
                    name={method.icon as any} 
                    size={24} 
                    color={isSelected ? theme.textOnPrimary : (('color' in method ? method.color : undefined) || theme.textSecondary)} 
                  />
                  <Text style={[styles.paymentMethodName, isSelected && styles.paymentTextActive]}>{method.name}</Text>
                  {isSelected && <MaterialIcons name="check-circle" size={18} color={theme.textOnPrimary} style={styles.checkIcon} />}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes particulières (facultatif)</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Ex: Précisions sur votre pose, allergies, etc."
            placeholderTextColor={theme.textMuted}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
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
                <Text style={styles.summaryLabel}>Professionnel</Text>
                <Text style={styles.summaryValue}>{selectedProfessional || 'Non sélectionné'}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Paiement</Text>
                <Text style={styles.summaryValue}>
                  {paymentMethods.find(m => m.id === selectedPaymentMethod)?.name}
                </Text>
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
          style={[styles.confirmBtn, (!selectedTime || !selectedProfessional || isProcessingPayment) && styles.confirmBtnDisabled]}
          onPress={(selectedTime && selectedProfessional && !isProcessingPayment) ? handleConfirm : undefined}
          disabled={!selectedTime || !selectedProfessional || isProcessingPayment}
        >
          {isProcessingPayment ? (
            <ActivityIndicator color={theme.textOnPrimary} />
          ) : (
            <>
              <MaterialIcons name="check-circle" size={22} color={theme.textOnPrimary} />
              <Text style={styles.confirmBtnText}>Confirmer la réservation</Text>
            </>
          )}
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
  
  profCard: {
    width: 120,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: theme.surface,
    borderWidth: 1.5,
    borderColor: theme.border,
    alignItems: 'center',
    gap: 4,
  },
  profCardActive: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  profAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: theme.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    overflow: 'hidden',
  },
  profAvatarImg: {
    width: '100%',
    height: '100%',
  },
  profAvatarActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  profName: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  profSpecialist: {
    fontSize: 11,
    color: theme.textSecondary,
  },
  profTextActive: {
    color: theme.textOnPrimary,
  },

  paymentGrid: {
    gap: spacing.sm,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    backgroundColor: theme.surface,
    borderWidth: 1.5,
    borderColor: theme.border,
    gap: spacing.md,
  },
  paymentCardActive: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  paymentMethodName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: theme.textPrimary,
  },
  paymentTextActive: {
    color: theme.textOnPrimary,
  },
  checkIcon: {
    marginLeft: 8,
  },

  notesInput: {
    backgroundColor: theme.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: theme.border,
    padding: spacing.lg,
    fontSize: 14,
    color: theme.textPrimary,
    minHeight: 100,
  },
});
