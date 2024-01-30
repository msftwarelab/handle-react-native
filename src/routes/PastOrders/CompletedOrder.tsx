import {Pressable, Text, View} from 'react-native';
import React, {useState} from 'react';
import {BoldText, CustomIcon, RegularText} from '@/components';
import RateOrderModal from './RateOrderModal';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {useNavigation} from '@/hooks';
import {Theme} from '@/constants';

/**
 * Displays a completed order card
 * @param {FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>} data - The order data
 * @param {function} fetch - The function to fetch the data
 * @returns {JSX.Element}
 */
export default function CompletedOrder({
  data,
  fetch,
}: {
  data: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>;
  fetch: () => void;
}): JSX.Element {
  const [showModal, setShowModal] = useState(false);
  const navigation = useNavigation();
  const d = new Date(0);
  d.setTime(data.data()?.timestamp?.seconds * 1000);

  return (
    <View
      style={{
        backgroundColor: 'white',
        borderRadius: 16,
        marginBottom: 8,
      }}>
      <RateOrderModal
        shown={showModal}
        setShown={setShowModal}
        data={data}
        callback={fetch}
      />
      <View style={{paddingTop: 24, paddingHorizontal: 24}}>
        <Pressable
          onPress={() => {
            navigation.navigate('OrderDetails', {
              orderID: data.id,
            });
          }}
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
          }}>
          <BoldText
            style={{
              color: Theme.text.primary,
              fontSize: 18,
            }}>
            Order #{data.id.substring(0, 6).toUpperCase()}
          </BoldText>
          <CustomIcon
            name="arrow_long_right"
            size={24}
            color={Theme.text.primary}
          />
        </Pressable>
        <RegularText
          style={{color: Theme.text.secondary, fontSize: 14, marginBottom: 32}}>
          {d.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </RegularText>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            alignItems: 'center',
          }}>
          <RegularText crack style={{fontSize: 14, color: Theme.text.primary}}>
            {data.data()?.products?.length} items, $
            {data.data()?.total && data.data()?.total}
          </RegularText>
        </View>
      </View>
      <View
        style={{
          width: '100%',
          height: 1,
          marginVertical: 16,
          backgroundColor: Theme.separator.gray,
        }}
      />
      <Pressable
        onPress={() => {
          if (!data.data()?.rating) {
            setShowModal(true);
          }
        }}
        style={{
          width: '100%',
          paddingHorizontal: 24,
          paddingBottom: 24,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <RegularText crack style={{fontSize: 14, color: Theme.text.primary}}>
          Rate your order
        </RegularText>
        <View style={{display: 'flex', flexDirection: 'row'}}>
          <CustomIcon
            name="star"
            color={
              data.data()?.rating && data.data()?.rating >= 1
                ? Theme.common.orange
                : Theme.text.placeholder
            }
            size={18}
          />
          <CustomIcon
            name="star"
            color={
              data.data()?.rating && data.data()?.rating >= 2
                ? Theme.common.orange
                : Theme.text.placeholder
            }
            size={18}
          />
          <CustomIcon
            name="star"
            color={
              data.data()?.rating && data.data()?.rating >= 3
                ? Theme.common.orange
                : Theme.text.placeholder
            }
            size={18}
          />
          <CustomIcon
            name="star"
            color={
              data.data()?.rating && data.data()?.rating >= 4
                ? Theme.common.orange
                : Theme.text.placeholder
            }
            size={18}
          />
          <CustomIcon
            name="star"
            color={
              data.data()?.rating && data.data()?.rating >= 5
                ? Theme.common.orange
                : Theme.text.placeholder
            }
            size={18}
          />
        </View>
      </Pressable>
    </View>
  );
}
