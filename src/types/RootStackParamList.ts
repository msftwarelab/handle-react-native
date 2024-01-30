import {FirebaseAuthTypes} from '@react-native-firebase/auth';

// RootStackParamList is a type that represents the parameters that can be passed to each screen
export type RootStackParamList = {
  // Onboarding
  Loading: undefined;
  Welcome: undefined;
  Confirm: {confirmation: FirebaseAuthTypes.ConfirmationResult};
  MoreInfo: undefined;

  // Tabs
  Tabs: undefined;
  Home: undefined;
  Search: undefined;
  PastOrders: undefined;
  Profile: undefined;

  // Main
  Favorites: undefined;
  Cart: undefined;
  ProductList: {slug: string; name: string};
  Checkout: undefined;
  OrderDetails: {orderID: string};
  SquadOnboarding: undefined;
  SupportWebview: undefined;
  EventDetails: {id: string};
  SingleProduct: {id: string};
  SearchScreen: undefined;
  Address: {next?: 'Checkout' | undefined};
  CheckID: undefined;
  OrderConfirmation: {
    prices:
      | Partial<{
          subtotal: number;
          discount: number;
          storeCredit: number;
          deliveryFee: number;
          tax: number;
          total: number;
        }>
      | undefined;
    tip: number;
  };
};
