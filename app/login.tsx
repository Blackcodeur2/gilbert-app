import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { theme, typography, spacing, borderRadius, shadows } from '../constants/theme';
import { useAuth } from '../hooks/useAuth';
import { AnimatedFadeIn, AnimatedScaleButton } from '../components/ui/AnimatedCard';
import * as Haptics from 'expo-haptics';

type AuthMode = 'login' | 'register';

export default function LoginScreen() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleSubmit = async () => {
    setError('');
    if (mode === 'login') {
      if (!email.trim() || !password.trim()) {
        setError('Veuillez remplir tous les champs');
        return;
      }
      if (!validateEmail(email)) {
        setError('Email invalide');
        return;
      }
      setLoading(true);
      const result = await login(email.trim(), password);
      setLoading(false);
      if (!result.success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setError(result.error || 'Erreur de connexion');
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } else {
      if (!fullName.trim() || !email.trim() || !phone.trim() || !password.trim()) {
        setError('Veuillez remplir tous les champs');
        return;
      }
      if (!validateEmail(email)) {
        setError('Email invalide');
        return;
      }
      if (password.length < 6) {
        setError('Le mot de passe doit contenir au moins 6 caractères');
        return;
      }
      if (password !== confirmPassword) {
        setError('Les mots de passe ne correspondent pas');
        return;
      }
      setLoading(true);
      const result = await register(fullName.trim(), email.trim(), phone.trim(), password);
      setLoading(false);
      if (!result.success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setError(result.error || "Erreur lors de l'inscription");
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
  };

  const switchMode = () => {
    Haptics.selectionAsync();
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/auth-bg.jpg')}
        style={StyleSheet.absoluteFillObject}
        contentFit="cover"
      />
      <LinearGradient
        colors={['rgba(255,250,247,0.3)', 'rgba(255,250,247,0.92)', 'rgba(255,250,247,1)']}
        locations={[0, 0.35, 0.55]}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Mock Login Badge */}
            <AnimatedFadeIn delay={0}>
              <View style={styles.mockBadge}>
                <MaterialIcons name="science" size={14} color={theme.warning} />
                <Text style={styles.mockBadgeText}>MOCK LOGIN</Text>
              </View>
            </AnimatedFadeIn>

            {/* Logo / Brand */}
            <AnimatedFadeIn delay={100}>
              <View style={styles.brandSection}>
                <View style={styles.logoCircle}>
                  <MaterialIcons name="spa" size={36} color={theme.textOnPrimary} />
                </View>
                <Text style={styles.brandName}>Gilbert Pro</Text>
                <Text style={styles.brandTagline}>Salon d'Onglerie</Text>
              </View>
            </AnimatedFadeIn>

            {/* Title */}
            <AnimatedFadeIn delay={200}>
              <Text style={styles.title}>
                {mode === 'login' ? 'Bon retour !' : 'Créer un compte'}
              </Text>
              <Text style={styles.subtitle}>
                {mode === 'login'
                  ? 'Connectez-vous pour accéder à vos réservations'
                  : 'Rejoignez-nous pour profiter de nos services'}
              </Text>
            </AnimatedFadeIn>

            {/* Error */}
            {error ? (
              <AnimatedFadeIn delay={0} direction="down">
                <View style={styles.errorBox}>
                  <MaterialIcons name="error-outline" size={18} color={theme.error} />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              </AnimatedFadeIn>
            ) : null}

            {/* Form */}
            <AnimatedFadeIn delay={300}>
              <View style={styles.form}>
                {mode === 'register' ? (
                  <View style={styles.inputWrapper}>
                    <MaterialIcons name="person" size={20} color={theme.textMuted} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Nom complet"
                      placeholderTextColor={theme.textMuted}
                      value={fullName}
                      onChangeText={setFullName}
                      autoCapitalize="words"
                      returnKeyType="next"
                      onSubmitEditing={() => emailRef.current?.focus()}
                    />
                  </View>
                ) : null}

                <View style={styles.inputWrapper}>
                  <MaterialIcons name="email" size={20} color={theme.textMuted} style={styles.inputIcon} />
                  <TextInput
                    ref={emailRef}
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor={theme.textMuted}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    returnKeyType="next"
                    onSubmitEditing={() => mode === 'register' ? phoneRef.current?.focus() : passwordRef.current?.focus()}
                  />
                </View>

                {mode === 'register' ? (
                  <View style={styles.inputWrapper}>
                    <MaterialIcons name="phone" size={20} color={theme.textMuted} style={styles.inputIcon} />
                    <TextInput
                      ref={phoneRef}
                      style={styles.input}
                      placeholder="Téléphone"
                      placeholderTextColor={theme.textMuted}
                      value={phone}
                      onChangeText={setPhone}
                      keyboardType="phone-pad"
                      returnKeyType="next"
                      onSubmitEditing={() => passwordRef.current?.focus()}
                    />
                  </View>
                ) : null}

                <View style={styles.inputWrapper}>
                  <MaterialIcons name="lock" size={20} color={theme.textMuted} style={styles.inputIcon} />
                  <TextInput
                    ref={passwordRef}
                    style={[styles.input, { flex: 1, paddingRight: 44 }]}
                    placeholder="Mot de passe"
                    placeholderTextColor={theme.textMuted}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    returnKeyType={mode === 'register' ? 'next' : 'done'}
                    onSubmitEditing={() => mode === 'register' ? confirmRef.current?.focus() : handleSubmit()}
                  />
                  <Pressable
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}
                    hitSlop={8}
                  >
                    <MaterialIcons
                      name={showPassword ? 'visibility-off' : 'visibility'}
                      size={20}
                      color={theme.textMuted}
                    />
                  </Pressable>
                </View>

                {mode === 'register' ? (
                  <View style={styles.inputWrapper}>
                    <MaterialIcons name="lock-outline" size={20} color={theme.textMuted} style={styles.inputIcon} />
                    <TextInput
                      ref={confirmRef}
                      style={styles.input}
                      placeholder="Confirmer le mot de passe"
                      placeholderTextColor={theme.textMuted}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={!showPassword}
                      returnKeyType="done"
                      onSubmitEditing={handleSubmit}
                    />
                  </View>
                ) : null}
              </View>
            </AnimatedFadeIn>

            {/* Mock Credentials Hint */}
            {mode === 'login' ? (
              <AnimatedFadeIn delay={400}>
                <View style={styles.hintBox}>
                  <MaterialIcons name="info-outline" size={16} color={theme.info} />
                  <Text style={styles.hintText}>
                    Identifiants test : test@example.com / 123456
                  </Text>
                </View>
              </AnimatedFadeIn>
            ) : null}

            {/* Submit Button */}
            <AnimatedFadeIn delay={500}>
              <AnimatedScaleButton
                onPress={handleSubmit}
                disabled={loading}
                style={styles.submitBtn}
              >
                <LinearGradient
                  colors={[theme.primary, theme.primaryDark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.submitGradient}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFF" size="small" />
                  ) : (
                    <>
                      <MaterialIcons
                        name={mode === 'login' ? 'login' : 'person-add'}
                        size={22}
                        color="#FFF"
                      />
                      <Text style={styles.submitText}>
                        {mode === 'login' ? 'Se connecter' : "S'inscrire"}
                      </Text>
                    </>
                  )}
                </LinearGradient>
              </AnimatedScaleButton>
            </AnimatedFadeIn>

            {/* Switch Mode */}
            <AnimatedFadeIn delay={600}>
              <Pressable style={styles.switchRow} onPress={switchMode}>
                <Text style={styles.switchText}>
                  {mode === 'login'
                    ? "Pas encore de compte ? "
                    : "Déjà un compte ? "}
                </Text>
                <Text style={styles.switchLink}>
                  {mode === 'login' ? "S'inscrire" : 'Se connecter'}
                </Text>
              </Pressable>
            </AnimatedFadeIn>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  scrollContent: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
  },

  mockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 6,
    backgroundColor: theme.warningLight,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    marginBottom: spacing.xl,
  },
  mockBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.warning,
    letterSpacing: 1,
  },

  brandSection: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    ...shadows.button,
  },
  brandName: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.textPrimary,
    letterSpacing: -0.5,
  },
  brandTagline: {
    fontSize: 14,
    color: theme.textSecondary,
    marginTop: 4,
  },

  title: {
    ...typography.h1,
    color: theme.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    ...typography.body,
    color: theme.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xxl,
  },

  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.errorLight,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },
  errorText: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.error,
    flex: 1,
  },

  form: { gap: spacing.md, marginBottom: spacing.lg },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: theme.border,
    paddingHorizontal: spacing.lg,
    minHeight: 52,
  },
  inputIcon: { marginRight: spacing.md },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: theme.textPrimary,
    paddingVertical: 14,
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },

  hintBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.infoLight,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xl,
  },
  hintText: {
    fontSize: 12,
    color: theme.info,
    flex: 1,
    fontWeight: '500',
  },

  submitBtn: {
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing.xl,
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: borderRadius.full,
  },
  submitText: {
    ...typography.button,
    color: '#FFF',
  },

  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  switchText: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  switchLink: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.primary,
  },
});
