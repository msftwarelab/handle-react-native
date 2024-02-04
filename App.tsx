import 'react-native-reanimated';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {QueryClientProvider, QueryClient} from '@tanstack/react-query';
import {StripeProvider} from '@stripe/stripe-react-native';
import {AppStack, navigationRef} from '@/router';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {enableLatestRenderer} from 'react-native-maps';
import {useEffect, useState} from 'react';
import SplashScreen from 'react-native-splash-screen';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import {NotificationToast} from '@/components';
import {AnimatePresence} from 'moti';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {
  STRIPE_MERCHANT_IDENTIFIER,
  STRIPE_PUBLISHABLE_KEY_LIVE,
  STRIPE_PUBLISHABLE_KEY_TEST,
} from '@/keys';
import {NotificationsProvider} from '@/context';
import {LogBox} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import functions from '@react-native-firebase/functions';
import auth from '@react-native-firebase/auth';
import * as Sentry from '@sentry/react-native';
import { Adjust, AdjustEvent, AdjustConfig } from 'react-native-adjust';

Sentry.init({
  dsn: 'https://2575c7cb6c196769f082fa0d5c1f08cb@o914489.ingest.sentry.io/4506659575824384',
});

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const queryClient = new QueryClient();
enableLatestRenderer();

// Use Firebase Emulator if in development
// if (__DEV__) {
//   console.log('Using Firebase Emulator');
//   firestore().useEmulator('localhost', 8080);
// functions().useEmulator('localhost', 5001);
//   auth().useEmulator('http://localhost:9099');
// }

/**
 * The main app component
 * @returns {JSX.Element}
 */
export default function App(): JSX.Element {
  const [notification, setNotification] =
    useState<FirebaseMessagingTypes.Notification>();

  useEffect(() => {
    const adjustConfig = new AdjustConfig("u51wkukv61hc", AdjustConfig.EnvironmentSandbox);
    Adjust.create(adjustConfig);
    SplashScreen.hide();
    messaging().onMessage(async remoteMessage => {
      setNotification(remoteMessage.notification);
      setTimeout(() => {
        setNotification(undefined);
      }, 5000);
    });
    return () => {
      Adjust.componentWillUnmount();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StripeProvider
          publishableKey={
            __DEV__ ? STRIPE_PUBLISHABLE_KEY_TEST : STRIPE_PUBLISHABLE_KEY_LIVE
          }
          merchantIdentifier={STRIPE_MERCHANT_IDENTIFIER}>
          <BottomSheetModalProvider>
            <NotificationsProvider>
              <NavigationContainer ref={navigationRef}>
                <AppStack />
                <AnimatePresence>
                  {!!notification && <NotificationToast {...notification} />}
                </AnimatePresence>
              </NavigationContainer>
            </NotificationsProvider>
          </BottomSheetModalProvider>
        </StripeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
