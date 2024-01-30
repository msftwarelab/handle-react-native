import {Pressable, SafeAreaView, View} from 'react-native';
import {BoldText, Gutter, LoadingRect, RegularText} from '@/components';
import {useFilteredProducts, useNavigation, useUserData} from '@/hooks';
import {useQuery} from '@tanstack/react-query';
import {QueryKey, Theme} from '@/constants';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {memo, useCallback} from 'react';
import {Title} from './TItle';
import FastImage from 'react-native-fast-image';
import {FlashList} from '@shopify/flash-list';

/**
 * The deals component
 * @returns {JSX.Element}
 */
export const Deals = memo(function Deals(): JSX.Element {
  const userData = useUserData();
  const deals = useQuery(
    [QueryKey.DEALS],
    () =>
      firestore()
        .collection(`universities/${userData?.data?.data()?.school}/inventory`)
        .where('comparePrice', '>', 0)
        .limit(25)
        .get(),
    {
      enabled: !userData.isLoading && !!userData?.data?.data()?.school,
    },
  );

  const renderItem = useCallback(
    ({
      item,
      index,
    }: {
      item:
        | FirebaseFirestoreTypes.QueryDocumentSnapshot<FirebaseFirestoreTypes.DocumentData>
        | FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>;

      index: number;
    }) => {
      if (index === (data.data?.length || 0) - 1) {
        if ((index + 1) % 2 == 1) {
          return <FullTile product={item} />;
        }
      }
      return <HalfTile product={item} index={index} />;
    },
    [deals],
  );

  const data = useFilteredProducts(
    deals.data?.docs.filter(doc => doc.data()?.quantity > 0) || [],
  );

  return deals.isLoading || (deals.data?.docs.length || 0) > 0 ? (
    <SafeAreaView>
      <Title color="white">Happy Deals 🤠</Title>
      {deals.isLoading ? (
        <View
          style={{
            backgroundColor: Theme.common.white,
            paddingBottom: 32,
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            width: '100%',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
          }}>
          {Array.from({length: 6}).map((_, index) => (
            <LoadingRect
              style={{
                height: 144,
                padding: 16,
                borderRadius: 8,
                backgroundColor: Theme.common.offWhite,
                width: '49%',
                overflow: 'hidden',
                marginBottom: 8,
              }}
              key={index}
            />
          ))}
        </View>
      ) : (
        deals &&
        deals.data?.docs.length !== 0 && (
          <View
            style={{backgroundColor: Theme.common.white, paddingBottom: 32}}>
            <Gutter>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  width: '100%',
                  minHeight: 144,

                  justifyContent: 'space-between',
                }}>
                <FlashList
                  data={data.data}
                  refreshing={deals.isFetching}
                  renderItem={renderItem}
                  estimatedItemSize={139}
                  numColumns={2}
                />
              </View>
            </Gutter>
          </View>
        )
      )}
    </SafeAreaView>
  ) : (
    <></>
  );
});

/**
 * Displays a half tile
 * @param {FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>} product - Product to display
 * @returns {JSX.Element}
 */
const HalfTile = memo(
  ({
    product,
    index,
  }: {
    product: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>;
    index: number;
  }) => {
    const navigation = useNavigation();
    return (
      <View
        style={{
          width: '100%',
          marginBottom: 8,
          paddingRight: index % 2 == 0 ? 4 : 0,
          paddingLeft: index % 2 == 1 ? 4 : 0,
        }}>
        <Pressable
          onPress={() => {
            navigation.navigate('SingleProduct', {id: product.id});
          }}
          style={{
            height: 144,
            padding: 16,
            borderRadius: 8,
            backgroundColor: Theme.common.offWhite,
            width: '100%',
            overflow: 'hidden',
          }}>
          <FastImage
            source={{uri: product.data()?.image}}
            style={{
              height: 100,
              width: 100,
              position: 'absolute',
              top: 50,
              left: '50%',
            }}
          />
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%',
            }}>
            <View>
              <BoldText style={{color: Theme.text.primary, fontSize: 12}}>
                {product.data()?.name}
              </BoldText>
              <RegularText style={{color: Theme.text.primary}}>
                {product.data()?.size}
              </RegularText>
            </View>

            <View>
              <BoldText
                manrope
                style={{fontSize: 14, color: Theme.text.primary}}>
                ${product.data()?.price}
              </BoldText>
              <RegularText
                style={{
                  fontSize: 10,
                  color: Theme.text.primary,
                  opacity: 0.5,
                  textDecorationLine: 'line-through',
                }}>
                ${product.data()?.comparePrice?.toFixed(2)}
              </RegularText>
            </View>
          </View>
        </Pressable>
      </View>
    );
  },
);

/**
 * Displays a full tile
 * @param {FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>} product - Product to display
 * @returns
 */
const FullTile = memo(
  ({
    product,
  }: {
    product: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>;
  }) => {
    const navigation = useNavigation();
    return (
      <Pressable
        onPress={() => {
          navigation.navigate('SingleProduct', {id: product.id});
        }}
        style={{
          height: 144,
          padding: 16,
          borderRadius: 8,
          backgroundColor: Theme.common.offWhite,
          width: '200%',
          overflow: 'hidden',
        }}>
        <FastImage
          source={{uri: product.data()?.image}}
          style={{
            height: 140,
            width: 140,
            position: 'absolute',
            top: 20,
            left: '70%',
          }}
        />
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
            paddingRight: 140,
          }}>
          <View>
            <BoldText style={{color: Theme.text.primary, fontSize: 18}}>
              {product.data()?.name}
            </BoldText>
            <RegularText style={{color: Theme.text.primary}}>
              {product.data()?.size}
            </RegularText>
          </View>

          <View>
            <BoldText manrope style={{fontSize: 14, color: Theme.text.primary}}>
              ${product.data()?.price}
            </BoldText>
            <RegularText
              style={{
                fontSize: 10,
                color: Theme.text.primary,
                opacity: 0.5,
                textDecorationLine: 'line-through',
              }}>
              ${product.data()?.comparePrice?.toFixed(2)}
            </RegularText>
          </View>
        </View>
      </Pressable>
    );
  },
);
