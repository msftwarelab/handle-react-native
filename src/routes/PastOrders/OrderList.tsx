import {ActivityIndicator, Platform, View} from 'react-native';
import {BoldText, RegularText} from '@/components';
import CompletedOrder from './CompletedOrder';
import ActiveOrder from './ActiveOrder';
import {useUserData} from '@/hooks';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {QueryKey, Theme} from '@/constants';
import {useInfiniteQuery} from '@tanstack/react-query';
import {useCallback} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {FlashList} from '@shopify/flash-list';

/**
 * The order list component
 * @returns {JSX.Element}
 */
export default function OrderList(): JSX.Element {
  const userData = useUserData();
  const ref = firestore()
    .collection(`universities/${userData.data?.data()?.school}/orders`)
    .where('customerID', '==', userData.data?.id)
    .orderBy('timestamp', 'desc')
    .limit(10);

  const orders = useInfiniteQuery(
    [QueryKey.ORDERS, userData.data?.id],
    ({pageParam}) => (pageParam ? ref.startAfter(pageParam).get() : ref.get()),
    {
      getNextPageParam: lastPage => lastPage.docs[lastPage.docs.length - 1],
      enabled: !!userData.data?.data()?.school,
    },
  );

  const onRefresh = useCallback(() => orders.refetch(), [orders]);
  const onEndReached = useCallback(() => orders.fetchNextPage(), []);
  const renderItem = useCallback(
    ({
      item,
      index,
    }: {
      item: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>;
      index: number;
    }) => {
      if (
        item.data()?.status === 'Delivered' ||
        item.data()?.status === 'Cancelled'
      ) {
        return <CompletedOrder fetch={orders.refetch} data={item} />;
      } else {
        return <ActiveOrder data={item} />;
      }
    },

    [],
  );

  const ListFooterComponent = useCallback(
    () =>
      orders.hasNextPage && orders.isFetchingNextPage ? (
        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 16,
          }}>
          <ActivityIndicator size="large" color={Theme.loading.primary} />
        </View>
      ) : (
        <></>
      ),
    [orders],
  );

  const insets = useSafeAreaInsets();

  return (
    <View style={{width: '100%', height: '100%'}}>
      <FlashList
        onEndReached={onEndReached}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: insets.bottom + (Platform.OS === 'ios' ? 46 : 0),
        }}
        data={orders.data?.pages.map(page => page.docs).flat()}
        onRefresh={onRefresh}
        refreshing={orders.isFetching || orders.isLoading}
        renderItem={renderItem}
        ListEmptyComponent={ListEmpty}
        ListFooterComponent={ListFooterComponent}
        estimatedItemSize={100}
      />
    </View>
  );

  function ListEmpty() {
    if (!orders.isLoading) {
      return (
        <View
          style={{
            width: '100%',
            marginTop: 156,
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
          }}>
          <RegularText style={{fontSize: 72}}>😔</RegularText>
          <BoldText style={{color: Theme.text.primary, fontSize: 26}}>
            No orders yet
          </BoldText>
          <RegularText
            style={{
              fontSize: 16,
              color: Theme.text.primary,
              opacity: 0.5,
              width: '70%',
              textAlign: 'center',
            }}>
            Search an item by name or browse by category
          </RegularText>
        </View>
      );
    } else {
      return <></>;
    }
  }
}
