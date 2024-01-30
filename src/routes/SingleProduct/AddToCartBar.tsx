import {addToCart} from '@/api/user';
import {useNotifications} from '@/context';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {MotiView} from 'moti';
import {memo, useCallback, useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {StyleSheet} from 'react-native';
import auth from '@react-native-firebase/auth';
import {
  ActivityIndicator,
  Pressable,
  TouchableOpacity,
  View,
} from 'react-native';
import {BoldText, CustomIcon, RegularText} from '@/components';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {Theme} from '@/constants';

export const AddToCartBar = memo(
  ({
    product,
    max,
  }: {
    product: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>;
    max: number;
  }) => {
    const [quantity, setQuantity] = useState(1);
    const {bottom} = useSafeAreaInsets();
    const [loading, setLoading] = useState(false);
    const {sendNotification} = useNotifications();

    const onPress = useCallback(async () => {
      if (quantity > max) {
        return;
      }
      setLoading(true);
      await addToCart(
        auth().currentUser?.uid,
        product,
        quantity,
        'SingleProductPage',
        undefined,
      ).catch(() =>
        sendNotification({
          title: 'Sorry!',
          body: 'You already have too many of this item in your cart.',
          type: 'error',
          offset: 50,
        }),
      );
      setLoading(false);
      setQuantity(1);
    }, [quantity, max]); //eslint-disable-line react-hooks/exhaustive-deps

    const add = useCallback(() => {
      if (quantity >= max) {
        sendNotification({
          title: 'Sorry!',
          body: 'You already selected the maximum amount of this item.',
          type: 'error',
          offset: 50,
        });
        return;
      }
      ReactNativeHapticFeedback.trigger('impactLight');
      setQuantity(prev => prev + 1);
    }, [quantity, max]); //eslint-disable-line react-hooks/exhaustive-deps

    const remove = useCallback(() => {
      ReactNativeHapticFeedback.trigger('impactLight');
      setQuantity(prev => prev - 1);
    }, [quantity]); //eslint-disable-line react-hooks/exhaustive-deps

    return (
      <MotiView
        from={{translateY: 100}}
        animate={{translateY: 0}}
        transition={{
          type: 'timing',
          duration: 300,
        }}>
        <View
          style={[
            AddToCartBarStylesheet.ViewContainer,
            {
              height: 65 + bottom,
              paddingBottom: bottom + 16,
            },
          ]}>
          <View style={AddToCartBarStylesheet.QuantityContainer}>
            <Pressable
              onPress={remove}
              style={AddToCartBarStylesheet.RemoveButton}
              disabled={loading || quantity <= 1}>
              <CustomIcon name="remove" color={Theme.text.primary} size={18} />
            </Pressable>
            {!loading ? (
              <RegularText style={AddToCartBarStylesheet.QuantityText}>
                {quantity}
              </RegularText>
            ) : (
              <ActivityIndicator
                style={AddToCartBarStylesheet.ActivityIndicatorStyle}
                color={Theme.text.primary}
                size="small"
              />
            )}
            <Pressable
              onPress={add}
              style={AddToCartBarStylesheet.AddButton}
              disabled={loading || quantity > max}>
              <CustomIcon name="add" color={Theme.text.primary} size={18} />
            </Pressable>
          </View>
          <TouchableOpacity
            onPress={onPress}
            style={[
              AddToCartBarStylesheet.AddToCartButton,
              {
                backgroundColor:
                  quantity > max ? Theme.separator.gray : Theme.button.primary,
              },
            ]}
            disabled={loading || quantity > max}>
            <BoldText
              style={[
                AddToCartBarStylesheet.AddToCartText,
                {
                  color:
                    quantity > max ? Theme.common.gray : Theme.common.white,
                },
              ]}>
              Add to Cart
            </BoldText>
          </TouchableOpacity>
        </View>
      </MotiView>
    );
  },
);

const AddToCartBarStylesheet = StyleSheet.create({
  ViewContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingTop: 16,
    backgroundColor: 'white',
    borderTopColor: Theme.separator.gray,
    borderTopWidth: 1,
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  QuantityContainer: {
    flex: 1,
    backgroundColor: Theme.separator.gray,
    borderRadius: 100,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  RemoveButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  QuantityText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    color: 'black',
  },
  AddButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  AddToCartButton: {
    paddingHorizontal: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },
  AddToCartText: {
    fontSize: 16,
  },
  ActivityIndicatorStyle: {
    flex: 1,
  },
});
