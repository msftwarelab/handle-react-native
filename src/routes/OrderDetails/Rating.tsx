import {View, Pressable} from 'react-native';
import React, {useState} from 'react';
import {CustomIcon, RegularText} from '@/components';
import RateOrderModal from '@/routes/PastOrders/RateOrderModal';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import { Theme } from '@/constants';

export default function Rating({
  data,
}: {
  data: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>;
}): JSX.Element {
  const [showModal, setShowModal] = useState(false);
  const rating = data.data()?.rating ? data.data()?.rating : 0;

  return (
    <>
      <Pressable
        onPress={() => {
          if (!rating) {
            setShowModal(true);
          }
        }}
        style={{
          marginTop: 16,
          width: '100%',
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
            color={rating && rating >= 1 ? Theme.common.orange : Theme.text.placeholder}
            size={18}
          />
          <CustomIcon
            name="star"
            color={rating && rating >= 2 ? Theme.common.orange : Theme.text.placeholder}
            size={18}
          />
          <CustomIcon
            name="star"
            color={rating && rating >= 3 ? Theme.common.orange : Theme.text.placeholder}
            size={18}
          />
          <CustomIcon
            name="star"
            color={rating && rating >= 4 ? Theme.common.orange : Theme.text.placeholder}
            size={18}
          />
          <CustomIcon
            name="star"
            color={rating && rating >= 5 ? Theme.common.orange : Theme.text.placeholder}
            size={18}
          />
        </View>
      </Pressable>
      <RateOrderModal shown={showModal} setShown={setShowModal} data={data} />
    </>
  );
}
