import {SafeAreaView, View, ViewProps} from 'react-native';
import {memo, useCallback, useState} from 'react';
import {BoldText, LoadingRect, ProductTile} from '@/components';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {useFilteredProducts} from '@/hooks';
import {FlashList} from '@shopify/flash-list';

/**
 * The horizontal product lockup component
 * @param {FirebaseFirestoreTypes.QueryDocumentSnapshot<FirebaseFirestoreTypes.DocumentData>[] | undefined} productData - The data for the products
 * @param {string} title - The title of the lockup
 * @param {function} arrowCallback - The callback for the arrow
 * @param {string} backgroundColor - The background color of the lockup
 * @param {boolean} loading - Whether or not the lockup is loading
 * @param {string} titleColor - The color of the title
 * @param {string} borderColor - The color of the border
 * @returns {JSX.Element}
 */
export const HorizontalProductLockup = memo(function HorizontalProductLockup({
  productData,
  title,
  backgroundColor,
  loading,
  titleColor,
  borderColor,
  ...props
}: {
  productData:
    | FirebaseFirestoreTypes.QueryDocumentSnapshot<FirebaseFirestoreTypes.DocumentData>[]
    | FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>[]
    | undefined;
  title?: string;
  backgroundColor?: string;
  loading?: boolean;
  titleColor?: string;
  borderColor?: string;
} & ViewProps): JSX.Element {
  const renderItem = useCallback(
    ({
      item,
      index,
    }: {
      item:
        | FirebaseFirestoreTypes.QueryDocumentSnapshot<FirebaseFirestoreTypes.DocumentData>
        | FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>;
      index: number;
    }) => (
      <ProductTile
        id={item.id}
        borderColor={borderColor}
        item={item.data()!}
        style={{marginRight: 8}}
        ATCSource="Homescreen Horizontal List"
        positionInList={index + 1}
      />
    ),
    [borderColor],
  );

  const data = useFilteredProducts(productData);
  const [endReached, setEndReached] = useState(false);
  const onEndReached = useCallback(() => setEndReached(true), []);
  const ListFooterComponent = useCallback(
    () =>
      endReached ? (
        <></>
      ) : (
        <LoadingRect
          style={{
            flex: 1,
            width: 130,
            marginRight: 16,
          }}
        />
      ),
    [endReached],
  );
  const ListEmptyComponent = useCallback(
    () => (
      <>
        <LoadingRect
          style={{
            height: 225,
            width: 130,
            marginRight: 16,
          }}
        />
        <LoadingRect
          style={{
            height: 225,
            width: 130,
            marginRight: 16,
          }}
        />
        <LoadingRect
          style={{
            height: 225,
            width: 130,
            marginRight: 16,
          }}
        />
        <LoadingRect
          style={{
            height: 225,
            width: 130,
            marginRight: 16,
          }}
        />
      </>
    ),
    [],
  );

  return (
    <SafeAreaView
      {...props}
      style={[
        {
          backgroundColor: backgroundColor,
          width: '100%',
        },
        props.style,
      ]}>
      {title && (
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            marginLeft: 20,
            marginRight: 20,
            alignItems: 'center',
            marginBottom: 16,
            justifyContent: 'space-between',
            paddingTop: 20,
          }}>
          <BoldText style={{color: titleColor, fontSize: 20}}>{title}</BoldText>
        </View>
      )}
      <FlashList
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingLeft: 20,
          paddingBottom: 20,
        }}
        data={data.data}
        refreshing={data.isLoading}
        renderItem={renderItem}
        ListEmptyComponent={ListEmptyComponent}
        onEndReached={onEndReached}
        onEndReachedThreshold={1}
        estimatedItemSize={130}
      />
    </SafeAreaView>
  );
});
