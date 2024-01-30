import {
  View,
  Dimensions,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useEffect, useState} from 'react';
import {BoldText, CustomIcon, Gutter, RegularText} from '@/components';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {
  initPaymentSheet,
  presentPaymentSheet,
} from '@stripe/stripe-react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useDocumentSnapshot, useUserData} from '@/hooks';
import {QueryKey} from '@/constants';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '@/types';
import functions from '@react-native-firebase/functions';
import VerifiedTicket from './VerifiedTicket';
import FastImage from 'react-native-fast-image';

/**
 * The event details screen
 * @returns {JSX.Element}
 */
export function EventDetails({
  route,
}: NativeStackScreenProps<RootStackParamList, 'EventDetails'>): JSX.Element {
  const userData = useUserData();
  const {id} = route.params;
  const event = useDocumentSnapshot(
    [QueryKey.EVENT, id],
    `universities/${userData.data?.data()?.school}/events/${id}`,
    {
      enabled: !userData.isLoading && !!userData.data?.data()?.school,
    },
  );
  const [hasTicket, setHasTicket] = useState(false);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const confirmTicketPurchase = functions().httpsCallable(
    'confirmTicketPurchase',
  );
  const purchaseTicketCF = functions().httpsCallable('purchaseTicket');

  useEffect(() => {
    updateHasTicket();
  }, [userData]);

  function updateHasTicket() {
    if (
      userData.data?.data()?.tickets &&
      userData.data?.data()?.tickets?.indexOf(id) !== -1 &&
      !hasTicket
    ) {
      setHasTicket(true);
    }
  }

  async function purchaseTicket() {
    if (loading) {
      return;
    }
    setLoading(true);

    let res = await purchaseTicketCF({eventID: id});

    const {error} = await initPaymentSheet({
      customerId: res.data.customer,
      customerEphemeralKeySecret: res.data.ephemeralKey.secret,
      paymentIntentClientSecret: res.data.paymentIntent.client_secret,
      applePay: {
        merchantCountryCode: 'US',
      },
      googlePay: {
        merchantCountryCode: 'US',
      },
      merchantDisplayName: 'Handle Delivery',
    });

    if (!error) {
      const {error} = await presentPaymentSheet();

      if (error) {
        setLoading(false);
      } else {
        let success = await confirmTicketPurchase({
          eventID: id,
          paymentIntent: res.data.paymentIntent.id,
        });

        if (success.data.success) {
          setLoading(false);
        } else {
          alert('Something went wrong!');
          setLoading(false);
        }
      }
    } else {
      Alert.alert('Sorry, something went wrong.' + error);
      setLoading(false);
    }
  }
  return event.isLoading ? (
    <View
      style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <ActivityIndicator size="large" color="white" />
    </View>
  ) : (
    <View
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: 'black',
      }}>
      <Pressable
        onPress={navigation.goBack}
        style={{
          position: 'absolute',
          zIndex: 2,
          left: 20,
          top: insets.top + 20,
          height: 50,
          width: 50,
          backgroundColor: 'white',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 100,
        }}>
        <CustomIcon name="arrow_backward" color="black" size={20} />
      </Pressable>
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: Dimensions.get('screen').width,
          zIndex: 1,
        }}
      />
      <FastImage
        style={{
          height: Dimensions.get('screen').width,
          width: Dimensions.get('screen').width,
          zIndex: 0,
        }}
        source={{uri: event.data?.data()?.image}}
      />
      <Gutter style={{flex: 1, paddingHorizontal: 20}}>
        <BoldText style={{color: 'white', marginTop: 16, fontSize: 24}}>
          {event.data?.data()?.name}
        </BoldText>
        <RegularText style={{color: 'white'}}>
          {event.data?.data()?.description}
        </RegularText>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 8,
          }}>
          <CustomIcon name="calendar_month" color="white" size={16} />
          <RegularText
            style={{
              color: 'white',
              marginLeft: 4,
              fontSize: 14,
            }}>
            {event.data?.data()?.datetime}
          </RegularText>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 8,
          }}>
          <CustomIcon name="poi" color="white" size={16} />
          <RegularText
            style={{
              color: 'white',
              marginLeft: 4,
              fontSize: 14,
            }}>
            {event.data?.data()?.location}
          </RegularText>
        </View>
        {!hasTicket ? (
          <Pressable
            onPress={purchaseTicket}
            style={{
              marginTop: 16,
              width: '100%',
              backgroundColor: 'white',
              borderRadius: 100,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 12,
            }}>
            {loading ? (
              <ActivityIndicator color="black" />
            ) : (
              <>
                <BoldText
                  style={{
                    fontSize: 18,
                    color: 'black',
                  }}>
                  Purchase Ticket
                </BoldText>
                <BoldText
                  style={{
                    fontSize: 18,
                    color: 'black',
                  }}>
                  ${event.data?.data()?.ticketPrice}
                </BoldText>
              </>
            )}
          </Pressable>
        ) : (
          <VerifiedTicket />
        )}
      </Gutter>
    </View>
  );
}
