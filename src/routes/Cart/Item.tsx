import {addToCart, removeFromCart} from '@/api/user';
import {QueryKey, Theme} from '@/constants';
import {useNotifications} from '@/context';
import {useDocumentSnapshot, useUserData} from '@/hooks';
import {memo, useCallback, useState} from 'react';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import auth from '@react-native-firebase/auth';
import {ActivityIndicator, Pressable, StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {CustomIcon, RegularText} from '@/components';
import {CartItem} from '@/types';

export default memo(
  ({
    item,
    index,
    isLast,
  }: {
    item: CartItem;
    index: number;
    isLast?: boolean;
  }) => {
    const [loading, setLoading] = useState(false);
    const {sendNotification} = useNotifications();

    const userData = useUserData();
    const product = useDocumentSnapshot(
      [QueryKey.PRODUCT, item.product],
      `universities/${userData.data?.data()?.school}/inventory/${item.product}`,
      {
        enabled: !!userData.data?.data()?.school,
      },
    );

    const add = useCallback(async () => {
      ReactNativeHapticFeedback.trigger('impactLight');
      setLoading(true);
      await addToCart(
        auth().currentUser?.uid,
        product.data,
        1,
        'CartList',
        undefined,
      ).catch(() => {
        sendNotification({
          title: 'Sorry!',
          body: 'You already have too many of this item in your cart.',
          type: 'error',
          offset: 125,
        });
      });
      setLoading(false);
    }, [product.data, sendNotification]);

    const remove = useCallback(() => {
      if (item.quantity <= 0) {
        return;
      }
      ReactNativeHapticFeedback.trigger('impactLight');
      if (item.quantity === 1) {
        setLoading(true);
        removeFromCart(auth().currentUser?.uid, item.product).then(() =>
          setLoading(false),
        );
      } else {
        setLoading(true);
        addToCart(
          auth().currentUser?.uid,
          product.data,
          -1,
          'CartList',
          undefined,
        ).then(() => setLoading(false));
      }
    }, [item, product.data]);

    return (
      <View
        key={index}
        style={[styles.container, !isLast ? styles.borderBottom : {}]}>
        <FastImage source={{uri: item.obj.image}} style={styles.image} />
        <View style={styles.detailsContainer}>
          <RegularText numberOfLines={1} style={styles.name}>
            {item.obj.name}
          </RegularText>
          <View style={styles.quantityContainer}>
            <Pressable
              onPress={remove}
              disabled={loading}
              style={styles.button}>
              <CustomIcon name="remove" color={Theme.text.primary} size={12} />
            </Pressable>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={Theme.loading.primary} />
              </View>
            ) : (
              <RegularText style={styles.quantity}>{item.quantity}</RegularText>
            )}
            <Pressable onPress={add} disabled={loading} style={styles.button}>
              <CustomIcon name="add" color={Theme.text.primary} size={12} />
            </Pressable>
          </View>
        </View>

        <View style={styles.priceContainer}>
          <RegularText style={styles.size}>{item.obj.size}</RegularText>
          <RegularText crack style={styles.price}>
            ${item.obj.price}
          </RegularText>
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    height: 88,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Theme.common.white,
    paddingHorizontal: 20,
  },
  borderBottom: {
    borderBottomColor: Theme.separator.gray,
    borderBottomWidth: 1,
  },
  image: {
    height: 56,
    width: 56,
  },
  detailsContainer: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    paddingLeft: 8,
    height: '100%',
    paddingVertical: 16,
  },
  name: {
    fontSize: 12,
    color: Theme.text.primary,
    maxWidth: '65%',
  },
  quantityContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  button: {
    width: 32,
    height: 32,
    backgroundColor: Theme.common.offWhite,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    marginHorizontal: 4,
  },
  quantity: {
    marginHorizontal: 8,
    color: Theme.text.primary,
    fontSize: 14,
  },
  priceContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginLeft: 20,
    paddingVertical: 16,
    height: '100%',
    width: 64,
  },
  size: {
    fontSize: 12,
    opacity: 0.5,
    color: Theme.text.primary,
    flexWrap: 'wrap',
    maxWidth: '100%',
    textAlign: 'right',
  },
  price: {
    fontSize: 14,
    color: Theme.text.primary,
  },
});
