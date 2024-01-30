import {useQuery} from '@tanstack/react-query';
import {QueryKey, Theme} from '@/constants';
import firestore from '@react-native-firebase/firestore';
import {useUserData} from '@/hooks';
import {HorizontalProductLockup} from '@/components';
import {memo} from 'react';
import {View} from 'react-native';

/**
 * The new products component
 * @returns {JSX.Element}
 */
export const NewProducts = memo(function NewProducts(): JSX.Element {
  const {data: userData} = useUserData();
  const newProducts = useQuery(
    [QueryKey.NEW_PRODUCTS],
    () =>
      firestore()
        .collection(`universities/${userData?.data()?.school}/inventory`)
        .where('tags', 'array-contains', 'new')
        .limit(50)
        .get(),
    {
      enabled: !!userData?.data()?.school,
    },
  );

  return (
    <>
      {((newProducts &&
        newProducts.data &&
        newProducts.data.docs &&
        newProducts.data.docs.length > 0) ||
        newProducts.isLoading) && (
        <View
          style={{
            marginBottom: 16,
          }}>
          <HorizontalProductLockup
            title={`New to ${Theme.name} 🔥`}
            titleColor={'white'}
            productData={newProducts.data?.docs.filter(
              product => product.data().quantity > 0,
            )}
            backgroundColor={Theme.main.secondary}
            loading={newProducts.isLoading}
          />
        </View>
      )}
    </>
  );
});
