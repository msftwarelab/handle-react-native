import React, {useCallback, useState} from 'react';
import {View, Pressable, Alert, ScrollView} from 'react-native';
import {useStripe} from '@stripe/stripe-react-native';
import {BoldText, FullScreenLoadingOverlay} from '@/components';
import functions from '@react-native-firebase/functions';
import {useQuery} from '@tanstack/react-query';
import {QueryKey, Theme} from '@/constants';
import {useNavigation, useUserData} from '@/hooks';
import PopPayModal from './PopPayModal';
import Map from './Map';
import Apartment from './Apartment';
import PaymentMethod from './PaymentMethod';
import Tip from './Tip';
import Prices from './Prices';
import Discount from './Discount';
import Stripe from 'stripe';
import SquadUpsell from '@/components/SquadUpsell';

/**
 * Checkout screen
 * @returns {JSX.Element}
 */
export function Checkout(): JSX.Element {
  const userData = useUserData();
  const navigation = useNavigation();

  const [tip, setTip] = useState(2);
  const [PopPayOrderID, setPopPayOrderID] = useState('');
  const [showPopPay, setShowPopPay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('CC');
  const [discountData, setDiscountData] = useState(
    userData.data?.data()?.squad ? 'SQUADPURCHASE' : null,
  );

  const {initPaymentSheet, presentPaymentSheet} = useStripe();
  const getPopIDDiscount = functions().httpsCallable('getPopIDDiscount');
  const poppayDiscount = useQuery([QueryKey.POPPAY_DISCOUNT], () =>
    getPopIDDiscount(),
  );
  const fetchPaymentSheetParameters = functions().httpsCallable('checkoutV2');
  const getPrices = functions().httpsCallable('getPrices');
  const prices = useQuery(
    [QueryKey.PRICES, discountData],
    () => getPrices({discount: discountData}),
    {
      enabled: discountData !== undefined,
    },
  );

  /**
   * Handles the success of the checkout process
   */
  const onSuccess = useCallback(
    () =>
      navigation.navigate('OrderConfirmation', {
        prices: prices.data?.data,
        tip,
      }),
    [navigation, prices.data?.data, tip],
  );

  /**
   * Handles the checkout process
   */
  const checkout = useCallback(async () => {
    setLoading(true);

    // Fetch the payment sheet parameters
    const paymentSheetParameters = await fetchPaymentSheetParameters({
      method: paymentMethod === 'CC' ? 'Stripe' : 'PopPay',
      tip: Number(tip),
      discountCode: discountData ? discountData : null,
    })
      .then(res => res.data)
      .catch(error => {
        Alert.alert(
          'Sorry, we ran into an issue!',
          error.message ?? 'Internal Server Error',
        );
        setLoading(false);
      });
    if (!paymentSheetParameters) {
      return;
    } else if (paymentSheetParameters.success === false) {
      Alert.alert(
        'Sorry, we ran into an issue!',
        paymentSheetParameters.message,
      );
      setLoading(false);
      return;
    }
    const {
      customerID,
      ephemeralKey,
      paymentIntent,
      orderID,
    }: {
      customerID: string;
      ephemeralKey: Stripe.EphemeralKey;
      paymentIntent: Stripe.PaymentIntent;
      orderID: string;
    } = paymentSheetParameters;

    // PopPay
    if (paymentMethod !== 'CC') {
      setPopPayOrderID(orderID);
      setShowPopPay(true);
      setLoading(false);
      return;
    }

    // Initialize the payment sheet
    const {error: initPaymentSheetError} = await initPaymentSheet({
      merchantDisplayName: 'Handle Delivery',
      customerId: customerID,
      customerEphemeralKeySecret: ephemeralKey.secret,
      paymentIntentClientSecret: paymentIntent.client_secret as any,
      applePay: {
        merchantCountryCode: 'US',
      },
      googlePay: {
        merchantCountryCode: 'US',
      },
    });

    // Error handling for initializing the payment sheet
    if (initPaymentSheetError) {
      Alert.alert(
        'Sorry, we ran into an issue!',
        initPaymentSheetError.code + ': ' + initPaymentSheetError.message,
      );
      setLoading(false);
      return;
    }

    // Present the payment sheet
    const {error: presentPaymentSheetError} = await presentPaymentSheet();
    setLoading(false);

    // Error handling for presenting the payment sheet
    if (presentPaymentSheetError) {
      Alert.alert(
        'Sorry, we ran into an issue!',
        presentPaymentSheetError.code + ': ' + presentPaymentSheetError.message,
      );
      return;
    }

    // Resolve
    onSuccess();
  }, [
    paymentMethod,
    tip,
    onSuccess,
    discountData,
    fetchPaymentSheetParameters,
    initPaymentSheet,
    presentPaymentSheet,
  ]);

  // Render the component
  return (
    <>
      {loading === true ? <FullScreenLoadingOverlay /> : <></>}
      <View
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'white',
          paddingHorizontal: 20,
        }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Map />
          <Apartment />
          <Tip tip={tip} setTip={setTip} />
          <PaymentMethod
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            poppayDiscount={poppayDiscount.data?.data.discount ?? 0}
          />
          <Discount setDiscountData={setDiscountData} />
          <SquadUpsell source="checkout" />
          <Prices prices={prices.data?.data} tip={tip} />
          <Pressable
            onPress={() => {
              Alert.alert(
                "Let's double check...",
                'This order will be delivered to ' +
                  userData.data?.data()?.address +
                  '.',
                [
                  {
                    text: 'Go back',
                    style: 'cancel',
                  },
                  {
                    text: 'Confirm',
                    onPress: checkout,
                  },
                ],
              );
            }}
            style={{
              width: '100%',
              height: 56,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: Theme.text.primary,
              borderRadius: 62,
            }}>
            <BoldText style={{color: Theme.common.white, fontSize: 20}}>
              Checkout
            </BoldText>
          </Pressable>
          <View style={{height: 100}} />
        </ScrollView>
      </View>
      <PopPayModal
        id={PopPayOrderID}
        setModalVisible={setShowPopPay}
        modalVisible={showPopPay}
        onSuccess={onSuccess}
      />
    </>
  );
}
