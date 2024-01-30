import {Dimensions, StyleSheet, View} from 'react-native';
import {useQuery} from '@tanstack/react-query';
import {Pressable} from 'react-native';
import {CustomIcon} from '@/components';
import {Theme} from '@/constants';
import {BoldText, RegularText} from '@/components';
import functions from '@react-native-firebase/functions';
import {QueryKey} from '@/constants';
import {ImageBackground} from 'react-native';
import {useNavigation, useUserData} from '@/hooks';
import {track} from '@/api';

export default function SquadUpsell({source}: {source: 'cart' | 'checkout'}) {
  const navigation = useNavigation();
  const userData = useUserData();
  const subtotal = userData.data
    ?.data()
    ?.cart.reduce((acc: number, product: any) => {
      return acc + product.obj?.price * product.quantity;
    }, 0);

  const getPrices = functions().httpsCallable('getPrices');
  const {data, isSuccess} = useQuery(
    [QueryKey.PRICES, null, userData.data?.data()?.cart],
    () => getPrices({discount: null}),
    {enabled: true},
  );

  const squadSaving = isSuccess
    ? Math.round((data?.data.deliveryFee + subtotal * 0.05) * 100) / 100
    : 0;

  return !userData?.data?.data()?.squad &&
    userData?.data?.data()?.cart.length > 0 &&
    squadSaving > 2 ? (
    <Pressable
      onPress={() => {
        track('Tapped Squad Upsell', {source: source});
        navigation.navigate('SquadOnboarding');
      }}>
      <View style={styles.root}>
        <ImageBackground
          imageStyle={styles.imageStyle}
          style={styles.image}
          source={require('@/assets/img/SquadUpsellingBoard.png')}
          resizeMode="contain">
          <View style={styles.container}>
            <View style={styles.justifyCenter}>
              <BoldText style={styles.title}>
                Save ${squadSaving.toFixed(2)} with Squad
              </BoldText>
              <View style={styles.iconContainer}>
                <CustomIcon
                  name="arrow_long_right"
                  color={Theme.text.primary}
                  size={30}
                />
              </View>
            </View>

            <RegularText style={styles.subtitle}>
              {
                'Get free delivery and 5% off the \nentire store. Only $4.99/mo \nfor a limited time'
              }
            </RegularText>
          </View>
        </ImageBackground>
      </View>
    </Pressable>
  ) : (
    <></>
  );
}

const styles = StyleSheet.create({
  root: {
    height: 200,
    flex: 1,
    alignItems: 'center',
    marginTop: '1%',
  },
  imageStyle: {
    borderRadius: 30,
  },
  image: {
    display: 'flex',
    height: '100%',
    width: Dimensions.get('screen').width - 30,
    padding: 0,
  },
  container: {
    height: '100%',
    paddingTop: '7%',
  },
  justifyCenter: {
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    paddingLeft: '3%',
    marginTop: '2%',
    color: Theme.text.primary,
  },
  subtitle: {
    textAlign: 'left',
    fontSize: 16.5,
    paddingLeft: '3%',
    marginTop: '1%',
    color: Theme.text.primary,
  },
  iconContainer: {
    width: '10%',
    position: 'absolute',
    right: 9,
  },
});
