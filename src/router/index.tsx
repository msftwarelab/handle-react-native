import {useNavigation, useUserData} from '@/hooks';
import {useCallback, useEffect, useState} from 'react';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {
  Address,
  Cart,
  CheckID,
  Checkout,
  Confirm,
  Favorites,
  Loading,
  MoreInfo,
  OrderConfirmation,
  OrderDetails,
  ProductList,
  SearchScreen,
  SingleProduct,
  SquadOnboarding,
  Welcome,
} from '@/routes';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from '@/types';
import {Tabs} from './Tabs';
import Title from './Title';
import {EventDetails} from '@/routes/EventDetails';
import {BackButton} from '@/components';
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import {checkPushPermissions} from '@/api';
import {Theme} from '@/constants';
import {createNavigationContainerRef} from '@react-navigation/native';
import {Alert, Image, Linking, StatusBar} from 'react-native';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import VersionCheck from 'react-native-version-check';
import SupportWebview from '@/routes/Profile/SupportWebview';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * The main app stack
 * @returns {JSX.Element}
 */
export function AppStack(): JSX.Element {
  const navigation = useNavigation();
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>();
  const userData = useUserData();

  const handleLogin = useCallback(
    async (u: FirebaseAuthTypes.User) => {
      // Initialize Firebase services
      await Promise.allSettled([
        crashlytics().setUserId(u.uid),
        analytics()
          .setUserId(u.uid)
          .then(() => analytics().logEvent('user_login', {user_id: u.uid})),
        checkPushPermissions()
          .then(() =>
            messaging().isDeviceRegisteredForRemoteMessages
              ? Promise.resolve()
              : messaging().registerDeviceForRemoteMessages(),
          )
          .then(() => messaging().getToken())
          .then(pushToken =>
            firestore().collection('users').doc(u.uid).update({pushToken}),
          ),
      ]).catch(e => crashlytics().recordError(e));

      // Handle navigation
      await userData.refetch().then(res => {
        if (
          res.data &&
          res.data.exists &&
          res.data.data()?.school &&
          res.data.data()?.school !== '' &&
          res.data.data()?.displayName
        ) {
          analytics().setUserProperties({
            school: res.data?.data()?.school,
          });
          navigation.navigate('Tabs');
        } else {
          navigation.navigate('MoreInfo');
        }
      });
    },
    [navigation, userData],
  );

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async u =>
      VersionCheck.needUpdate().then(async version => {
        if (version?.isNeeded) {
          Alert.alert(
            'Update Available',
            'A new version of the app is available. Please update to continue using the app.',
            [
              {
                text: 'Update',
                onPress: () => Linking.openURL(version?.storeUrl),
              },
            ],
          ),
            {cancelable: false};
        } else {
          setUser(u);
          if (!u) {
            navigation.navigate('Welcome');
          } else {
            handleLogin(u);
          }
        }
      }),
    );
    return () => unsubscribe();
  }, [handleLogin, navigation]);

  // Render application stack
  return (
    <Stack.Navigator
      initialRouteName="Loading"
      screenOptions={{
        headerShown: false,
        headerShadowVisible: false,
        headerTintColor: Theme.main.primary,
        headerLeft: () => <BackButton />,
        headerBackVisible: false,
      }}>
      <Stack.Screen name="Loading" component={Loading} />
      <Stack.Group>
        <Stack.Screen
          name="Welcome"
          options={{gestureEnabled: false}}
          component={Welcome}
        />
        <Stack.Screen
          name="Confirm"
          options={{gestureEnabled: false}}
          component={Confirm}
        />
        <Stack.Screen
          name="MoreInfo"
          options={{gestureEnabled: false}}
          component={MoreInfo}
        />
      </Stack.Group>
      {user && (
        <Stack.Group>
          <Stack.Screen
            options={{gestureEnabled: false}}
            name="Tabs"
            component={Tabs}
          />
        </Stack.Group>
      )}

      {user && (
        <Stack.Group>
          <Stack.Screen
            name="Favorites"
            component={Favorites}
            options={{
              headerTitle: () => (
                <Title backgroundColor={Theme.main.secondary}>Favorites</Title>
              ),
              headerStyle: {
                backgroundColor: Theme.main.secondary,
              },
              headerTintColor: 'white',
              headerShown: true,
              headerTitleAlign: 'center',
              headerLeft: () => <BackButton white />,
            }}
          />
          <Stack.Screen
            name="Cart"
            component={Cart}
            options={{
              headerTitle: () => <Title invert> My cart</Title>,
              headerShown: true,
              headerTitleAlign: 'center',
            }}
          />
          <Stack.Screen
            name="ProductList"
            component={ProductList}
            options={props => ({
              headerTitle: () => (
                <Title invert>{props.route.params.name}</Title>
              ),
              headerShown: true,
              headerTitleAlign: 'center',
            })}
          />
          <Stack.Screen
            name="Checkout"
            component={Checkout}
            options={{
              headerTitle: () => <Title invert>Checkout</Title>,
              headerShown: true,
              headerTitleAlign: 'center',
            }}
          />
          <Stack.Screen
            name="OrderConfirmation"
            component={OrderConfirmation}
            options={{
              headerTitle: () => (
                <>
                  <StatusBar backgroundColor={Theme.main.secondary} />
                  <Image
                    source={require('@/assets/img/wordmark.png')}
                    style={{
                      width: '50%',
                      height: 32,
                      resizeMode: 'contain',
                    }}
                  />
                </>
              ),
              headerShown: true,
              headerTitleAlign: 'center',
              headerBackVisible: false,
              headerLeft: () => null,
              headerStyle: {
                backgroundColor: Theme.main.secondary,
              },
            }}
          />
          <Stack.Screen name="OrderDetails" component={OrderDetails} />
          <Stack.Screen name="SquadOnboarding" component={SquadOnboarding} />
          <Stack.Screen name="SupportWebview" component={SupportWebview} />
          <Stack.Screen name="EventDetails" component={EventDetails} />
          <Stack.Screen
            name="SingleProduct"
            component={SingleProduct}
            options={{
              headerShown: true,
              headerTitle: () => (
                <Title invert backgroundColor={Theme.common.offWhite} />
              ),
              headerStyle: {
                backgroundColor: Theme.common.offWhite,
              },
            }}
          />

          <Stack.Screen name="SearchScreen" component={SearchScreen} />
          <Stack.Screen
            name="Address"
            component={Address}
            options={{
              headerTitle: () => <Title invert>Address</Title>,
              headerShown: true,
              headerTitleAlign: 'center',
            }}
          />
          <Stack.Screen
            name="CheckID"
            component={CheckID}
            options={{
              headerTitle: () => (
                <Title invert backgroundColor={Theme.common.offWhite}>
                  ID Verification
                </Title>
              ),
              headerShown: true,
              headerTitleAlign: 'center',
              headerStyle: {backgroundColor: Theme.common.offWhite},
            }}
          />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}
