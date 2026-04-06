import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider } from '../contexts/AuthContext';
import { ReviewProvider } from '../contexts/ReviewContext';
import { AppProvider } from '../contexts/AppContext';
import { AlertProvider } from '@/template';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Image } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import Animated, { 
  FadeIn, 
  FadeOut, 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  runOnJS 
} from 'react-native-reanimated';
import { theme } from '../constants/theme';
import { config } from '../constants/config';
import { useState } from 'react';

// Empêche l'écran de démarrage natif de se cacher automatiquement
SplashScreen.preventAutoHideAsync();

function AuthGate() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    const inAuth = segments[0] === 'login';
    if (!isAuthenticated && !inAuth) {
      router.replace('/login');
    } else if (isAuthenticated && inAuth) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={loadStyles.loader}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="service-detail" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="product-detail" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="booking" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="cart" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
    </Stack>
  );
}

const loadStyles = StyleSheet.create({
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.background },
});

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Empêche l'écran de démarrage natif de se cacher trop tôt
        await SplashScreen.preventAutoHideAsync();
        // Simuler un chargement (ex: polices, données Supabase initiales)
        await new Promise(resolve => setTimeout(resolve, 2500));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return (
      <Animated.View 
        exiting={FadeOut.duration(500)}
        style={splashStyles.container}
      >
        <Animated.Image
          source={require('../assets/images/app_logo.jpeg')}
          style={splashStyles.logo}
          entering={FadeIn.delay(200).duration(1000)}
        />
        <Animated.Text 
          entering={FadeIn.delay(800).duration(800)}
          style={splashStyles.tagline}
        >
          {config.appTagline}
        </Animated.Text>
        <ActivityIndicator 
          size="small" 
          color={theme.primary} 
          style={{ marginTop: 50 }} 
        />
      </Animated.View>
    );
  }

  return (
    <AlertProvider>
      <SafeAreaProvider>
        <AuthProvider>
          <ReviewProvider>
            <AppProvider>
              <StatusBar style="dark" />
              <AuthGate />
            </AppProvider>
          </ReviewProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </AlertProvider>
  );
}

const splashStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.background,
  },
  logo: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: theme.primarySoft,
  },
  title: {
    marginTop: 24,
    fontSize: 28,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  tagline: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '500',
    color: theme.textSecondary,
    letterSpacing: 1.2,
  },
});
