import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { theme, typography, spacing, borderRadius, shadows } from '../constants/theme';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../hooks/useAuth';
import * as Haptics from 'expo-haptics';

export default function EditProfileScreen() {
  const { profile, updateProfile } = useApp();
  const { user, updateUser } = useAuth();
  
  const [fullName, setFullName] = useState(user?.fullName || profile.fullName);
  const [phone, setPhone] = useState(user?.phone || profile.phone);
  const [email, setEmail] = useState(user?.email || profile.email);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!fullName.trim() || !phone.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      // Met à jour l'état Global (qui met à jour Supabase)
      await updateProfile({ fullName, phone });
      
      // Met à jour l'état Auth (local)
      if (updateUser) {
        updateUser({ fullName, phone });
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Succès', 'Votre profil a été mis à jour', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Erreur', 'Impossible de mettre à jour le profil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={theme.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Modifier le profil</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.avatarSection}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>
                {fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.changeAvatarText}>Utilisez votre nom pour l&apos;avatar</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nom complet</Text>
              <View style={styles.inputWrapper}>
                <MaterialIcons name="person" size={20} color={theme.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Votre nom"
                  autoCapitalize="words"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email (Non modifiable)</Text>
              <View style={[styles.inputWrapper, styles.disabledInput]}>
                <MaterialIcons name="email" size={20} color={theme.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={email}
                  editable={false}
                  placeholder="votre@email.com"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Téléphone</Text>
              <View style={styles.inputWrapper}>
                <MaterialIcons name="phone" size={20} color={theme.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="+225..."
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <Pressable
              onPress={handleSave}
              disabled={loading}
              style={[styles.saveButton, loading && styles.disabledButton]}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <>
                  <MaterialIcons name="check" size={20} color="#FFF" />
                  <Text style={styles.saveButtonText}>Enregistrer les modifications</Text>
                </>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { ...typography.h3, color: theme.textPrimary },
  scrollContent: { paddingHorizontal: spacing.xl, paddingVertical: spacing.xl },
  
  avatarSection: { alignItems: 'center', marginBottom: spacing.xl },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  avatarText: { fontSize: 36, fontWeight: '700', color: theme.textOnPrimary },
  changeAvatarText: { marginTop: 12, fontSize: 13, color: theme.textMuted },

  form: { gap: spacing.lg },
  inputGroup: { gap: 8 },
  label: { fontSize: 13, fontWeight: '600', color: theme.textMuted, marginLeft: 4 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.border,
    paddingHorizontal: spacing.lg,
    height: 56,
  },
  inputIcon: { marginRight: spacing.md },
  input: { flex: 1, fontSize: 15, color: theme.textPrimary, fontWeight: '500' },
  disabledInput: { backgroundColor: theme.background, borderColor: 'transparent' },
  
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.primary,
    paddingVertical: 16,
    borderRadius: borderRadius.full,
    gap: 10,
    marginTop: spacing.xl,
    ...shadows.button,
  },
  disabledButton: { opacity: 0.7 },
  saveButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
