import {View, Pressable, StyleSheet} from 'react-native';
import {BoldText, RegularText} from '@/components';
import {useNavigation, useUserData} from '@/hooks';
import {Theme} from '@/constants';

/**
 * Cart footer component
 * @returns {JSX.Element}
 */
export default function StickyFooter(): JSX.Element {
  const navigation = useNavigation();
  const userData = useUserData();
  const subtotal = userData.data
    ?.data()
    ?.cart.reduce((acc: number, product: any) => {
      return acc + product.obj?.price * product.quantity;
    }, 0);

  return userData.data?.data()?.cart?.length === 0 ? (
    <></>
  ) : (
    <View style={styles.root}>
      <View style={styles.subtotal}>
        <RegularText style={styles.textSubtotal}>Subtotal</RegularText>
        <BoldText style={styles.textSubtotal}>${subtotal.toFixed(2)}</BoldText>
      </View>
      <Pressable
        onPress={() => {
          userData.data?.data()?.address === '123 Main St, Town, State'
            ? navigation.navigate('Address', {next: 'Checkout'})
            : navigation.navigate('Checkout');
        }}
        style={styles.continue}>
        <BoldText style={styles.textContinue}>Continue</BoldText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'relative',
    bottom: 0,
    width: '100%',
    left: 0,
    paddingBottom: 50,
    backgroundColor: Theme.common.white,
    paddingTop: 16,
    paddingHorizontal: 20,
  },
  subtotal: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  textSubtotal: {
    color: Theme.text.primary,
    fontSize: 16,
  },
  textContinue: {
    color: Theme.common.white,
    fontSize: 16,
  },
  continue: {
    width: '100%',
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.text.primary,
    borderRadius: 100,
  },
});
