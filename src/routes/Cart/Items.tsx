import {View, StyleSheet} from 'react-native';
import {SwipeListView} from 'react-native-swipe-list-view';
import {useCallback, useMemo} from 'react';
import {useUserData} from '@/hooks';
import {BoldText, RegularText} from '@/components';
import Upsell from './Upsell';
import SquadUpsell from '@/components/SquadUpsell';
import {Theme} from '@/constants';
import Item from './Item';
import SwipeMenu from './SwipeMenu';
import {CartItem} from '@/types';

/**
 * Cart items component
 * @returns {JSX.Element}
 */
export default function Items(): JSX.Element {
  const userData = useUserData();

  const renderItem = useCallback(
    ({item, index}: {item: CartItem; index: number}) => (
      <Item
        item={item}
        key={item.product}
        index={index}
        isLast={index !== userData.data?.data()?.cart?.length - 1}
      />
    ),
    [userData.data],
  );

  const renderHiddenItem = useCallback(
    ({item}: {item: CartItem}) => <SwipeMenu item={item} />,
    [],
  );

  const keyExtractor = useCallback((item: any) => item.product, []);
  const ListEmptyComponent = useMemo(
    () => (
      <View style={styles.emptyContainer}>
        <RegularText style={{fontSize: 72}}>😔</RegularText>
        <BoldText style={styles.emptyText}>Your bag is empty</BoldText>
        <RegularText style={styles.emptyTextSecondary}>
          Search an item by name or browse by category
        </RegularText>
      </View>
    ),
    [],
  );

  const data = useMemo(
    () =>
      !userData.isLoading && userData.data?.data()?.cart
        ? userData.data?.data()?.cart
        : [],
    [userData.data, userData.isLoading],
  );

  return (
    <SwipeListView
      ListHeaderComponent={<SquadUpsell source="cart" />}
      ListFooterComponent={Upsell}
      ListEmptyComponent={ListEmptyComponent}
      contentContainerStyle={styles.contentContainer}
      rightOpenValue={-124}
      style={styles.swipeListView}
      data={data}
      renderItem={renderItem}
      renderHiddenItem={renderHiddenItem}
      showsVerticalScrollIndicator={false}
      keyExtractor={keyExtractor}
    />
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    width: '100%',
    marginVertical: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: Theme.text.primary,
    fontSize: 26,
  },
  emptyTextSecondary: {
    fontSize: 16,
    color: Theme.text.primary,
    opacity: 0.5,
    width: '70%',
    textAlign: 'center',
  },
  contentContainer: {
    marginTop: 12,
    marginBottom: 12,
  },
  swipeListView: {
    width: '100%',
  },
});
