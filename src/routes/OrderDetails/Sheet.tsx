import {ActivityIndicator, View} from 'react-native';
import React, {useMemo, useRef} from 'react';
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import GridLockup from './GridLockup';
import Product from './Product';
import Prices from './Prices';
import Rating from './Rating';
import { Theme } from '@/constants';

/**
 * Displays order details
 * @param {FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>} data - The order data
 * @returns {JSX.Element}
 */
export default function Sheet({
  data,
}: {
  data?: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>;
}): JSX.Element {
  // Sheet data
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['60%', '80%'], []);

  return (
    <BottomSheet
      handleComponent={() => {
        return (
          <View
            style={{
              width: '100%',
              paddingTop: 12,
              paddingBottom: 12,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: 40,
                height: 3,
                borderRadius: 3,
                backgroundColor: Theme.main.primary,
              }}
            />
          </View>
        );
      }}
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}>
      <BottomSheetScrollView>
        {data ? (
          <View style={{paddingHorizontal: 20}}>
            <GridLockup data={data} />
            <Product data={data} />
            <Prices data={data} />
            <Rating data={data} />
          </View>
        ) : (
          <View
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ActivityIndicator size="large" color={Theme.common.orange} />
          </View>
        )}
        <View style={{width: '100%', height: 100}} />
      </BottomSheetScrollView>
    </BottomSheet>
  );
}
