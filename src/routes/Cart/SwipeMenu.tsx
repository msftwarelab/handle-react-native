import {removeFromCart} from '@/api/user';
import {CartItem} from '@/types';
import {memo, useCallback, useState} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useUserData} from '@/hooks';
import {ActivityIndicator, Pressable, View, StyleSheet} from 'react-native';
import {Theme} from '@/constants';
import {CustomIcon} from '@/components';

export default memo(({item}: {item: CartItem}) => {
  const [deleting, setDeleting] = useState(false);
  const [favoriting, setFavoriting] = useState(false);
  const onDelete = useCallback(() => {
    setDeleting(true);
    removeFromCart(auth().currentUser?.uid, item.product).then(() =>
      setDeleting(false),
    );
  }, [item.product]);
  const userData = useUserData();
  const changeFavorite = useCallback(async () => {
    setFavoriting(true);
    if (userData.data?.data()?.favorites?.includes(item.product)) {
      await firestore()
        .doc(`users/${auth().currentUser?.uid}`)
        .update({
          favorites: firestore.FieldValue.arrayRemove(item.product),
        });
    } else {
      await firestore()
        .doc(`users/${auth().currentUser?.uid}`)
        .update({
          favorites: firestore.FieldValue.arrayUnion(item.product),
        });
    }
    setFavoriting(false);
  }, [item.product, userData.data]);

  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.button, styles.favoriteButton]}
        onPress={changeFavorite}>
        {favoriting ? (
          <ActivityIndicator size="small" color={Theme.loading.primary} />
        ) : (
          <CustomIcon
            name={
              userData.data?.data()?.favorites?.includes(item.product)
                ? 'heart'
                : 'heart_outlined'
            }
            color={Theme.text.primary}
            size={14}
          />
        )}
      </Pressable>
      <Pressable
        onPress={onDelete}
        style={[styles.button, styles.deleteButton]}>
        {deleting ? (
          <ActivityIndicator size="small" color="#DF3961" />
        ) : (
          <CustomIcon name="delete_outlined" color="#DF3961" size={14} />
        )}
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginRight: 5,
  },
  button: {
    height: '95%',
    width: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButton: {
    backgroundColor: Theme.common.offWhite,
    marginRight: 4,
  },
  deleteButton: {
    backgroundColor: Theme.common.lightRed,
  },
});
