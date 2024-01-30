import {View} from 'react-native';
import {BoldText, RegularText} from '@/components';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {useCallback} from 'react';
import FastImage from 'react-native-fast-image';
import {Theme} from '@/constants';
import { FlashList } from '@shopify/flash-list';

export default function Product({
  data,
}: {
  data: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>;
}): JSX.Element {
  const renderItem = useCallback(
    ({item, index}: {item: any; index: number}) => (
      <View
        key={index}
        style={{
          display: 'flex',
          flexDirection: 'row',
          paddingVertical: 16,
        }}>
        <FastImage source={{uri: item.image}} style={{height: 56, width: 56}} />
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            paddingLeft: 8,
          }}>
          <RegularText
            style={{
              fontSize: 12,
              color: Theme.text.primary,
            }}>
            {item.name}
          </RegularText>
          <View style={{flex: 1}} />
          <BoldText
            manrope
            style={{
              fontSize: 14,
              color: Theme.text.primary,
            }}>
            {item.quantity}x
          </BoldText>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}>
          <RegularText
            style={{
              opacity: 0.5,
              fontSize: 12,
              color: Theme.text.primary,
            }}>
            {item.size}
          </RegularText>
          <RegularText
            style={{
              fontSize: 14,
              color: Theme.text.primary,
            }}>
            ${item.price}
          </RegularText>
        </View>
      </View>
    ),
    [],
  );

  return (
    <View style={{marginTop: 16}}>
      <BoldText
        style={{color: Theme.text.primary, fontSize: 18, marginBottom: 12}}>
        Order #{data.id.substring(0, 6).toUpperCase()}
      </BoldText>
      <Divider />
      <FlashList
        data={data.data()?.products}
        renderItem={renderItem}
        ItemSeparatorComponent={Divider}
        scrollEnabled={false}
      />
    </View>
  );
}

function Divider() {
  return (
    <View
      style={{width: '100%', height: 1, backgroundColor: Theme.separator.gray}}
    />
  );
}
