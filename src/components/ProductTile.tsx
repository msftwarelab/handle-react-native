import {Pressable, View} from 'react-native';
import {memo, useCallback, useMemo} from 'react';
import {AddToCart, BoldText, RegularText} from '@/components';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {useNavigation} from '@/hooks';
import FastImage from 'react-native-fast-image';
import {Theme} from '@/constants';

/**
 * Displays a product tile
 * @param {FirebaseFirestoreTypes.DocumentData} item - The item to render
 * @param {string} borderColor - The border color
 * @param {boolean} large - Whether or not the tile is large
 * @param {object} style - The style of the tile
 * @returns {JSX.Element}
 */
export const ProductTile = memo(function ProductTile({
  item,
  borderColor,
  large,
  style,
  id,
  ATCSource,
  positionInList,
}: {
  item: FirebaseFirestoreTypes.DocumentData | undefined;
  borderColor?: string;
  large?: boolean;
  style?: Record<string, any>;
  id: string;
  ATCSource: string;
  positionInList: number;
}): JSX.Element {
  const navigation = useNavigation();
  const size = useMemo(() => (large ? 150 : 110), [large]);
  const goToSingle = useCallback(() => {
    navigation.navigate('SingleProduct', {id});
  }, [id, navigation]);

  return (
    <View
      style={[
        {
          width: large ? '100%' : size + 20,
          backgroundColor: Theme.common.white,
          borderRadius: 16,
          paddingVertical: 12,
          paddingHorizontal: 10,
          marginRight: 16,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: size + 115,
        },
        borderColor ? {borderColor: borderColor, borderWidth: 1} : {},
        style,
      ]}>
      <Pressable
        onPress={goToSingle}
        style={{
          marginHorizontal: 10,
        }}>
        {item?.image ? (
          <FastImage
            style={{
              width: size,
              height: size,
              marginBottom: 10,
              paddingHorizontal: 10,
            }}
            resizeMode="cover"
            source={{uri: item.image}}
          />
        ) : (
          <View
            style={{
              backgroundColor: 'lightgrey',
              width: size,
              height: size,
              marginBottom: 10,
              borderRadius: 8,
            }}
          />
        )}
      </Pressable>
      {item?.quantity > 0 && (
        <AddToCart
          source={ATCSource}
          positionInList={positionInList}
          product={
            {
              id: id,
              data: () => item,
            } as FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>
          }
          top={size - 16}
        />
      )}
      <Pressable
        onPress={goToSingle}
        style={{
          width: '100%',
        }}>
        <RegularText
          style={{
            color: Theme.text.primary,
            fontSize: 14,
            fontWeight: '500',
          }}
          numberOfLines={2}>
          {item?.name}
        </RegularText>
        <BoldText
          manrope={true}
          style={{
            color: Theme.text.primary,
            fontSize: 14,
            marginTop: 10,
          }}>
          ${item?.price}
        </BoldText>
        <RegularText
          style={{
            color: Theme.text.secondary,
            fontSize: 10,
            marginTop: 4,
          }}
          numberOfLines={2}>
          {item?.size}
        </RegularText>
      </Pressable>
    </View>
  );
});
