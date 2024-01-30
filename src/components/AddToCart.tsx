import React, {memo, useCallback, useState} from 'react';
import {CustomIcon} from '@/components';
import auth from '@react-native-firebase/auth';
// import {addToCart} from '@/api/user';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {ActivityIndicator, TouchableOpacity} from 'react-native';
import {useNotifications} from '@/context';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {Theme} from '@/constants';
import functions from '@react-native-firebase/functions';

export const AddToCart = memo(function AddToCart({
  top,
  product,
  source,
  positionInList,
}: {
  top?: number;
  product: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>;
  source: string;
  positionInList: number;
}): JSX.Element {
  const [loading, setLoading] = useState(false);
  const {sendNotification} = useNotifications();
  const uid = auth().currentUser?.uid;

  const onPress = useCallback(async () => {
    setLoading(true);
    ReactNativeHapticFeedback.trigger('impactLight');
    const addToCartCloudFunction = functions().httpsCallable('addToCart');
    // await addToCart(uid, product, 1, source, positionInList).catch(() =>
    //   sendNotification({
    //     title: 'Sorry!',
    //     body: 'You already have too many of this item in your cart.',
    //     type: 'error',
    //     offset: 50,
    //   }),
    // );
    await addToCartCloudFunction({productID: product.id, quantity: 1}).catch(
      () =>
        sendNotification({
          title: 'Sorry!',
          body: 'We ran into an issue adding this to your cart. Contact us if this continues.',
          type: 'error',
          offset: 50,
        }),
    );
    setLoading(false);
  }, [uid, product, positionInList, source, sendNotification]);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        position: 'absolute',
        top: top,
        right: 10,
        display: 'flex',
        flexDirection: 'row-reverse',
        height: 32,
        width: 32,
        backgroundColor: Theme.text.primary,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      disabled={loading}>
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <CustomIcon name={'add'} color="white" size={20} />
      )}
    </TouchableOpacity>
  );
});
