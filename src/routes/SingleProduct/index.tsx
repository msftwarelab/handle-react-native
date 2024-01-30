import {useState, useRef, useMemo, useCallback} from 'react';
import {
  View,
  SafeAreaView,
  Pressable,
  ActivityIndicator,
  Platform,
  StyleSheet,
} from 'react-native';
import {BoldText, CustomIcon, Gutter, RegularText} from '@/components';
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '@/types';
import {useDocumentSnapshot, useUserData} from '@/hooks';
import {QueryKey, Theme} from '@/constants';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import FastImage from 'react-native-fast-image';
import {Recommendations} from './Recommendations';
import {AddToCartBar} from './AddToCartBar';

/**
 * The single product screen
 * @returns {JSX.Element}
 */
export function SingleProduct({
  route,
}: NativeStackScreenProps<RootStackParamList, 'SingleProduct'>): JSX.Element {
  const {id} = route.params;
  const {bottom} = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(
    () => ['25%', '45%', Platform.OS === 'ios' ? '80%' : '85%'],
    [Platform.OS], //eslint-disable-line react-hooks/exhaustive-deps
  );

  const userData = useUserData();

  const product = useDocumentSnapshot(
    [QueryKey.PRODUCT, id],
    `universities/${userData.data?.data()?.school}/inventory/${id}`,
    {
      enabled: !userData.isLoading && !!userData.data?.data()?.school && !!id,
    },
  );

  const [favoriting, setFavoriting] = useState(false);

  const favoriteProduct = useCallback(async () => {
    const ref = firestore().doc(`users/${auth().currentUser?.uid}`);
    setFavoriting(true);
    if (userData.data?.data()?.favorites?.includes(id)) {
      await ref
        .update({
          favorites: firestore.FieldValue.arrayRemove(id),
        })
        .catch(() => {});
    } else {
      await ref.update({
        favorites: firestore.FieldValue.arrayUnion(id),
      });
    }
    setFavoriting(false);
  }, [id, userData]);

  return product.isLoading ? (
    <View style={SingleProductStyle.LoadingView}>
      <ActivityIndicator size="large" color={Theme.loading.primary} />
    </View>
  ) : (
    <View style={SingleProductStyle.ProductContainerView}>
      <SafeAreaView style={SingleProductStyle.SafeAreaStyle}>
        <View style={SingleProductStyle.SafeAreaProductContainerView}>
          <FastImage
            source={{uri: product.data?.data()?.image}}
            style={SingleProductStyle.ProductImage}
          />
        </View>
        {!product.isLoading && (
          <BottomSheet
            ref={bottomSheetRef}
            index={1}
            snapPoints={snapPoints}
            animateOnMount>
            <BottomSheetScrollView
              style={SingleProductStyle.BottomScrollViewStyle}>
              <Gutter>
                <View style={SingleProductStyle.ProductTitle}>
                  <BoldText style={SingleProductStyle.ProductTitleText}>
                    {product.data?.data()?.name}
                  </BoldText>
                  <Pressable
                    onPress={favoriteProduct}
                    style={[
                      SingleProductStyle.FavoritesButton,
                      userData.data?.data()?.favorites?.includes(id)
                        ? {backgroundColor: Theme.button.secondary}
                        : {backgroundColor: Theme.common.offWhite},
                    ]}>
                    {favoriting ? (
                      <ActivityIndicator
                        size="small"
                        color={
                          userData.data?.data()?.favorites?.includes(id)
                            ? Theme.common.white
                            : Theme.loading.primary
                        }
                      />
                    ) : (
                      <CustomIcon
                        name={
                          userData.data?.data()?.favorites?.includes(id)
                            ? 'heart'
                            : 'heart_outlined'
                        }
                        size={28}
                        color={
                          userData.data?.data()?.favorites?.includes(id)
                            ? Theme.common.white
                            : Theme.text.primary
                        }
                      />
                    )}
                  </Pressable>
                </View>

                <View style={SingleProductStyle.SeperatingView} />

                <View style={SingleProductStyle.PriceAndQuantityView}>
                  <View style={SingleProductStyle.PriceView}>
                    {product.data?.data()?.comparePrice ? (
                      <BoldText style={SingleProductStyle.PriceCompareText}>
                        ${product.data?.data()?.comparePrice.toFixed(2)}
                      </BoldText>
                    ) : (
                      <></>
                    )}
                    <BoldText style={SingleProductStyle.PriceText}>
                      ${product.data?.data()?.price}
                    </BoldText>
                  </View>
                  <RegularText style={SingleProductStyle.QuantityText}>
                    {product.data?.data()?.size}
                  </RegularText>
                </View>
              </Gutter>
              <Recommendations itemID={product.data!.id} />
            </BottomSheetScrollView>
          </BottomSheet>
        )}
      </SafeAreaView>
      {product.data?.id &&
        (product.data?.data()?.quantity > 0 ? (
          <AddToCartBar
            product={product.data}
            max={
              product.data?.data()?.quantity -
              (userData.data
                ?.data()
                ?.cart?.find((item: any) => item.product === product.data?.id)
                ?.quantity || 0)
            }
          />
        ) : (
          <View
            style={[
              SingleProductStyle.OutOfStockContainer,
              {
                height: 65 + bottom,
                paddingBottom: bottom + 16,
              },
            ]}>
            <View style={SingleProductStyle.OutOfStockView}>
              <BoldText style={SingleProductStyle.OutOfStockText}>
                Out of Stock
              </BoldText>
            </View>
          </View>
        ))}
    </View>
  );
}

const SingleProductStyle = StyleSheet.create({
  LoadingView: {
    backgroundColor: Theme.common.offWhite,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ProductContainerView: {
    backgroundColor: Theme.common.offWhite,
    height: '100%',
    width: '100%',
  },
  SafeAreaStyle: {
    height: '100%',
  },
  SafeAreaProductContainerView: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  },
  ProductImage: {
    height: 300,
    width: 300,
    marginVertical: 50,
  },
  BottomScrollViewStyle: {
    width: '100%',
    backgroundColor: 'white',
    display: 'flex',
    height: '100%',
    borderTopRightRadius: 32,
    borderTopLeftRadius: 32,
  },
  ProductTitle: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ProductTitleText: {
    fontSize: 20,
    width: '75%',
    lineHeight: 30,
    color: Theme.text.primary,
  },
  FavoritesButton: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  SeperatingView: {
    width: '100%',
    backgroundColor: Theme.separator.gray,
    height: 1,
    marginBottom: 16,
  },
  PriceAndQuantityView: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  PriceView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  PriceCompareText: {
    color: Theme.text.secondary,
    fontSize: 20,
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  PriceText: {
    fontSize: 20,
    color: Theme.text.primary,
  },
  QuantityText: {
    color: Theme.text.secondary,
    fontSize: 16,
  },
  OutOfStockContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    // height: 65 + bottom,
    // paddingBottom: bottom + 16,
    paddingTop: 16,
    backgroundColor: 'white',
    borderTopColor: Theme.separator.gray,
    borderTopWidth: 1,
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  OutOfStockView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  OutOfStockText: {
    color: 'red',
    fontSize: 16,
  },
});

export default SingleProduct;
