import {useCallback, useEffect, useState} from 'react';
import {useInfiniteHits} from 'react-instantsearch-hooks';
import {ProductTile} from './ProductTile';
import {ActivityIndicator, View} from 'react-native';
import {SuggestionBox} from './SuggestionBox';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFilteredProducts} from '@/hooks';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {FlashList} from '@shopify/flash-list';

/**
 * Infinite hits component for products list
 * @returns {JSX.Element}
 */
export function InfiniteHits(): JSX.Element {
  const {hits, isLastPage, showMore} = useInfiniteHits();
  const [likelyLoaded, setLikelyLoaded] = useState(false);

  const renderItem = useCallback(
    ({
      item,
      index,
    }: {
      index: number;
      item: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>;
    }) => {
      return (
        <ProductTile
          ATCSource="CategoryList"
          positionInList={index + 1}
          item={item.data()}
          id={item.id}
          large
        />
      );
    },
    [],
  );

  useEffect(() => {
    setTimeout(() => {
      setLikelyLoaded(true);
    }, 3000);
  }, []);

  const onEndReached = useCallback(() => {
    if (!isLastPage) {
      showMore();
    }
  }, [isLastPage, showMore]);

  const data = useFilteredProducts(
    hits.map(hit => ({
      id: hit.objectID,
      data: () => hit as any,
    })) as FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>[],
  );

  const ListFooterComponent = useCallback(
    () =>
      !isLastPage && hits.length > 0 ? (
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            width: '100%',
            paddingBottom: 16,
            marginTop: 20,
          }}>
          <ActivityIndicator size="large" color="black" />
        </View>
      ) : isLastPage && hits.length > 0 ? (
        <SuggestionBox />
      ) : null,
    [isLastPage, hits],
  );

  const ListEmptyComponent = useCallback(
    () =>
      !likelyLoaded ? (
        <SafeAreaView
          edges={['bottom', 'left', 'right', 'top']}
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            marginTop: 20,
          }}>
          <ActivityIndicator size="large" color="black" />
        </SafeAreaView>
      ) : (
        <SuggestionBox />
      ),

    [likelyLoaded],
  );
  return (
    <View
      style={{
        height: '100%',
      }}>
      <FlashList
        data={data.data?.sort((a, b) => {
          const aRate = a.data()?.sales || 0;
          const bRate = b.data()?.sales || 0;
          return bRate - aRate;
        })}
        renderItem={renderItem}
        onEndReached={onEndReached}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={ListFooterComponent}
        ListEmptyComponent={ListEmptyComponent}
        estimatedItemSize={220}
        removeClippedSubviews={false}
        contentContainerStyle={{
          padding: 16,
        }}
      />
    </View>
  );
}
