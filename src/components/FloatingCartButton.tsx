import {View, Pressable, Platform} from 'react-native';
import {MotiView} from 'moti';
import {BoldText, CustomIcon} from '@/components';
import {useNavigation, useUserData} from '@/hooks';
import {track} from '@/api';
import {Theme} from '@/constants';

/**
 * Floating cart button component
 * @returns {JSX.Element}
 */
export function FloatingCartButton({tabs}: {tabs?: boolean}): JSX.Element {
  const navigation = useNavigation();
  const userData = useUserData();
  const quantity = userData?.data
    ?.data()
    ?.cart?.reduce((acc: number, product: any) => {
      return acc + product.quantity;
    }, 0);

  return (
    <MotiView
      from={{
        bottom: 0,
      }}
      animate={{
        bottom: tabs ? (Platform.OS === 'android' ? 150 : 175) : 25,
      }}
      transition={{
        type: 'timing',
        duration: 500,
      }}
      style={{
        height: 56,
        width: 56,
        borderRadius: 30,
        backgroundColor: Theme.text.primary,
        zIndex: 10,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        right: 20,
      }}>
      <View
        style={{
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Pressable
          onPress={() => {
            track('clicked floating cart button');
            navigation.navigate('Cart');
          }}
          style={{
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 32,
              height: 24,
              width: 24,
              borderRadius: 12,
              borderWidth: 2,
              borderColor: Theme.text.primary,
              backgroundColor: Theme.common.white,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <BoldText style={{color: Theme.text.primary, fontSize: 14}}>
              {quantity}
            </BoldText>
          </View>
          <CustomIcon
            name="shopping_basket"
            color={Theme.common.white}
            size={24}
          />
        </Pressable>
      </View>
    </MotiView>
  );
}
