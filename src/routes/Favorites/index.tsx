import {View, Pressable, ActivityIndicator} from 'react-native';
import {memo, useCallback, useMemo, useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {BoldText, CustomIcon, RegularText} from '@/components';
import {useNavigation, useUserData} from '@/hooks';
import auth from '@react-native-firebase/auth';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import FastImage from 'react-native-fast-image';
import {QueryKey, Theme} from '@/constants';
import {useQuery} from '@tanstack/react-query';
import {FlashList} from '@shopify/flash-list';

/**
 * The favorites screen
 * @returns {JSX.Element}
 */
export function Favorites(): JSX.Element {
  const {top} = useSafeAreaInsets();
  const userData = useUserData();
  const favorites = useQuery(
    [QueryKey.FAVORITES],
    () =>
      Promise.all(
        userData
          .data!.data()!
          .favorites?.map((id: string) =>
            firestore()
              .collection(
                `universities/${userData.data?.data()?.school}/inventory`,
              )
              .doc(id)
              .get(),
          ) || [],
      ),
    {
      enabled: !userData.isLoading && !!userData.data?.data()?.favorites,
    },
  );

  const refetch = useCallback(() => favorites.refetch(), [favorites]);
  const renderItem = useCallback(
    ({
      item,
    }: {
      item: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>;
      index: number;
    }) => <ListItem item={item} key={item.id} callback={refetch} />,
    [],
  );
  const onRefresh = useCallback(() => favorites.refetch(), []);

  const ListEmptyComponent = useMemo(
    () =>
      !favorites.isLoading ? (
        <View
          style={{
            width: '100%',
            marginTop: 156,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <RegularText style={{fontSize: 72}}>😔</RegularText>
          <BoldText style={{color: 'white', fontSize: 26}}>
            No favorites yet
          </BoldText>
          <RegularText
            style={{
              fontSize: 16,
              color: 'white',
              opacity: 0.5,
              width: '70%',
              textAlign: 'center',
            }}>
            Search an item by name or browse by category
          </RegularText>
        </View>
      ) : null,
    [favorites.isLoading],
  );

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: Theme.main.secondary,
        paddingTop: top,
      }}>
      <View style={{width: '100%', height: '100%'}}>
        <FlashList
          estimatedItemSize={100}
          ListEmptyComponent={ListEmptyComponent}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 250,
          }}
          data={favorites.data}
          refreshing={favorites.isLoading || favorites.isFetching}
          onRefresh={onRefresh}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
}

const ListItem = memo(
  ({
    item,
    callback,
  }: {
    item: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>;
    callback: () => void;
  }) => {
    const navigation = useNavigation();
    const [favoriting, setFavoriting] = useState(false);
    const go = useCallback(
      () => navigation.navigate('SingleProduct', {id: item.id}),
      [item, navigation],
    );
    const unfavorite = useCallback(() => {
      setFavoriting(true);
      firestore()
        .doc(`users/${auth().currentUser?.uid}`)
        .update({
          favorites: firestore.FieldValue.arrayRemove(item.id),
        })
        .then(() => setFavoriting(false))
        .then(callback);
    }, [item, callback]);

    return (
      <View
        style={{
          width: '100%',
          backgroundColor: 'white',
          borderRadius: 16,
          padding: 16,
          display: 'flex',
          flexDirection: 'row',
          marginBottom: 8,
        }}>
        <Pressable onPress={go}>
          <FastImage
            source={{uri: item.data()?.image}}
            style={{height: 66, width: 66, marginRight: 20}}
          />
        </Pressable>
        <View style={{flex: 1, display: 'flex', flexDirection: 'row'}}>
          <Pressable onPress={go} style={{flex: 1}}>
            <RegularText
              numberOfLines={1}
              style={{fontSize: 12, color: Theme.text.primary}}>
              {item.data()?.name}
            </RegularText>
            <RegularText
              numberOfLines={1}
              style={{fontSize: 10, color: Theme.text.secondary}}>
              {item.data()?.size}
            </RegularText>
            <View style={{flex: 1}} />
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <BoldText manrope style={{color: Theme.text.primary}}>
                ${item.data()?.price}
              </BoldText>
              {item.data()?.comparePrice ? (
                <RegularText
                  style={{
                    fontSize: 10,
                    color: Theme.text.secondary,
                    textDecorationLine: 'line-through',
                    marginLeft: 6,
                  }}>
                  ${item.data()?.comparePrice?.toFixed(0)}
                </RegularText>
              ) : (
                <></>
              )}
            </View>
          </Pressable>
          <Pressable onPress={unfavorite}>
            {favoriting ? (
              <ActivityIndicator color={Theme.loading.primary} />
            ) : (
              <CustomIcon name="heart" color={Theme.text.primary} size={20} />
            )}
          </Pressable>
        </View>
      </View>
    );
  },
);
