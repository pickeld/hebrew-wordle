import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  Assistant_400Regular,
  Assistant_600SemiBold,
  Assistant_700Bold,
} from '@expo-google-fonts/assistant';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { COLORS } from '../constants/theme';
import { initializeAds, loadInterstitial, loadRewarded } from '../admob/ads';
import { useAuthStore } from '../store/useAuthStore';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Assistant_400Regular,
    Assistant_600SemiBold,
    Assistant_700Bold,
  });
  const initAuth = useAuthStore((s) => s.initAuth);

  useEffect(() => {
    const unsub = initAuth();
    initializeAds().then(() => {
      loadInterstitial();
      loadRewarded();
    });
    return unsub;
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={COLORS.accent} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: COLORS.background } }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaProvider>
  );
}
