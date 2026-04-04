import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider } from '../contexts/AuthContext';
import { ReviewProvider } from '../contexts/ReviewContext';
import { AppProvider } from '../contexts/AppContext';
import { AlertProvider } from '@/template';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';

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
