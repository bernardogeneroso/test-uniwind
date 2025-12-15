import './global.css';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { HeroUINativeProvider } from 'heroui-native';
import { createStore, Provider as ProviderJotai } from 'jotai';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { SafeAreaListener } from 'react-native-safe-area-context';
import { Uniwind } from 'uniwind';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

const jotaiStore = createStore();

const JotaiProvider = ({ children }: { children: React.ReactNode }) => {
  // return children;

  return (
    <ProviderJotai store={jotaiStore}>
      {children}
    </ProviderJotai>
  )
}

function RootLayoutNav() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaListener
        onChange={({ insets }) => {
          Uniwind.updateInsets(insets)
        }}
      >
        <HeroUINativeProvider>
          <JotaiProvider>
            <Stack screenOptions={{ headerShown: false }}>
              {/* App shell */}
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

              {/* Modal & not-found (já tinhas isto provavelmente) */}
              <Stack.Screen
                name="modal"
                options={{ presentation: 'modal' }}
              />
              <Stack.Screen name="+not-found" />
            </Stack>
          </JotaiProvider>
        </HeroUINativeProvider>
      </SafeAreaListener>
    </GestureHandlerRootView>
  );
}
