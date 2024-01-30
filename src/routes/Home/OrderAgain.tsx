import {View} from 'react-native';
import React, {memo} from 'react';
import {useQuery} from '@tanstack/react-query';
import {QueryKey, Theme} from '@/constants';
import {getOrderAgainItems} from '@/api/user';
import {useUserData} from '@/hooks';
import auth from '@react-native-firebase/auth';
import {BoldText, HorizontalProductLockup} from '@/components';

/**
 * The order again section
 * @returns {JSX.Element}
 */
export const OrderAgain = memo(function OrderAgain(): JSX.Element {
  const {data: userData} = useUserData();
  const orderAgain = useQuery(
    [QueryKey.ORDER_AGAIN],
    () => getOrderAgainItems(userData?.data()?.school, auth().currentUser?.uid),
    {
      enabled: !!userData?.data()?.school && !!auth().currentUser?.uid,
    },
  );

  return (
    <View style={{backgroundColor: Theme.main.secondary}}>
      {!orderAgain.isLoading && orderAgain.data?.length === 0 ? (
        <></>
      ) : (
        <HorizontalProductLockup
          title="Order Again 🔁"
          titleColor="white"
          productData={orderAgain.data}
          backgroundColor={Theme.main.secondary}
          loading={orderAgain.isLoading}
        />
      )}
    </View>
  );
});
