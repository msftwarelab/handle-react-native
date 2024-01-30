import {
  View,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  Image,
  Dimensions,
  Alert,
  Pressable,
} from 'react-native';
import React, {useState} from 'react';
import {BoldText, CustomIcon, Gutter, RegularText} from '@/components';
import {useStripe} from '@stripe/stripe-react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation, useUserData} from '@/hooks';
import functions from '@react-native-firebase/functions';
import {track} from '@/api';
import {Theme} from '@/constants';

/**
 * Squad onboarding screen
 * @returns {JSX.Element}
 */
export function SquadOnboarding(): JSX.Element {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const {initPaymentSheet, presentPaymentSheet} = useStripe();
  const userData = useUserData();
  const insets = useSafeAreaInsets();
  const cancelSquad = functions().httpsCallable('cancelSquad');
  const setUpPaymentMethod = functions().httpsCallable('setUpPaymentMethod');
  const createSquadSubscription = functions().httpsCallable(
    'createSquadSubscription',
  );

  async function Signup() {
    setLoading(true);
    if (userData.data?.data()?.squad) {
      cancelSquad()
        .then(res => {
          if (res.data.status === 'failed') {
            alert(res.data.description);
            setLoading(false);
          } else {
            alert('You have successfully cancelled your Squad subscription.');
            setLoading(false);
          }
        })
        .catch(error => {
          Alert.alert('Sorry, something went wrong.', error);
          setLoading(false);
        });
    } else {
      let res = await setUpPaymentMethod();

      const {error} = await initPaymentSheet({
        customerId: res.data.customer,
        customerEphemeralKeySecret: res.data.ephemeralKey,
        setupIntentClientSecret: res.data.client_secret,
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
          let success = await createSquadSubscription();

          if (success.data.success) {
            track('Squad signup success');
            setDone(true);
            setLoading(false);
          } else {
            alert('Something went wrong!');
            setLoading(false);
          }
        }
      } else {
        alert('Sorry, something went wrong.' + error);
        setLoading(false);
      }
    }
  }

  return (
    <View
      style={{
        height: '100%',
        width: '100%',
        flexDirection: 'column',
        backgroundColor: Theme.other.imageBackground,
        paddingTop: insets.top,
      }}>
      <Gutter>
        <View
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: -1
          }}>
          <View style={{width: '33%', justifyContent: 'center'}}>
            <Pressable
              onPress={() => {
                navigation.goBack();
              }}>
              <CustomIcon
                color={Theme.text.primary}
                name="arrow_backward"
                size={24}
              />
            </Pressable>
          </View>

          <View style={{width: '33%', alignItems: 'center'}}>
            <Image
              source={require('@/assets/img/wordmark.png')}
              style={{height: 20, width: 98}}
            />
          </View>
          <View
            style={{
              width: '33%',
              display: 'flex',
              flexDirection: 'row-reverse',
            }}
          />  
        </View>

        <BoldText
          style={{
            fontSize: 28,
            textAlign: 'center',
            color: Theme.text.primary,
            marginTop: Dimensions.get('screen').height < 700 ? 10 : 32,
          }}>
          Get more for less with {Theme.name} Squad
        </BoldText>

        <RegularText
          style={{
            fontSize: 14,
            textAlign: 'center',
            color: Theme.text.primary,
            marginTop: Dimensions.get('screen').height < 700 ? 10 : 18,
          }}>
          No delivery minimum. Cancel anytime. Free delivery is compatible with
          other discount codes. 1wk free only valid once per user.
        </RegularText>

        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: Dimensions.get('screen').height < 700 ? '5%' : '20%',
            zIndex: -1
          }}>
          <FeatureList
            title={'Free Trial'}
            description="1 week free then $4.99/mo"
            iconName="credit_cards"
            color={Theme.common.gold}
          />
          <FeatureList
            title={'5% Discount'}
            description="5% off every product we carry"
            iconName="label_outlined"
            color={Theme.text.secondary}
          />
          <FeatureList
            title={'Free Delivery'}
            description="free delivery on all orders"
            iconName="time"
            color={Theme.common.orange}
          />
        </View>
      </Gutter>
      <ImageBackground
        style={{
          width: Dimensions.get('screen').width,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          paddingBottom: insets.bottom,
          transform: [{translateY: Dimensions.get('screen').height < 700 ? 0 : 10}],
          paddingHorizontal: 20,
        }}
        resizeMode={'cover'}
        source={require('@/assets/img/squadFooter.png')}>
        {!loading ? (
          <TouchableOpacity
            onPress={() => {
              track('Attempt squad signup');
              if (!done) {
                Signup();
              }
            }}
            style={{
              width: '100%',
              backgroundColor: Theme.button.primary,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              height: 56,
              borderRadius: 64,
              marginBottom: '5%'
            }}>
            <BoldText style={{fontSize: 16, color: Theme.common.white}}>
              {!userData.data?.data()?.squad
                ? 'Join the squad'
                : 'Leave the squad'}
            </BoldText>
          </TouchableOpacity>
        ) : (
          <ActivityIndicator
            style={{marginTop: 16}}
            color={Theme.common.white}
          />
        )}
      </ImageBackground>
    </View>
  );
}

function FeatureList({
  title,
  description,
  color,
  iconName,
}: {
  title: string;
  description: string;
  color: string;
  iconName: string;
}) {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: Dimensions.get('screen').height < 700 ? 15 : 32,
        paddingHorizontal: 36,
      }}>
      <View
        style={{
          width: 48,
          height: 48,
          backgroundColor: color,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 48,
        }}>
        <CustomIcon color={Theme.text.primary} name={iconName} size={28} />
      </View>
      <View style={{width: '80%'}}>
        <BoldText
          style={{
            fontSize: 18,
            color: Theme.text.primary,
          }}>
          {title}
        </BoldText>
        <RegularText style={{color: Theme.text.primary, fontSize: 14}}>
          {description}
        </RegularText>
      </View>
    </View>
  );
}
