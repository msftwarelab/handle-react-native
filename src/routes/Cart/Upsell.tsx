import {useFilteredProducts, useUserData} from '@/hooks';
import {useQuery} from '@tanstack/react-query';
import {QueryKey, Theme} from '@/constants';
import {HorizontalProductLockup} from '@/components';
import firestore from '@react-native-firebase/firestore';

/**
 * Upsell component
 * @returns {JSX.Element}
 */
export default function Upsell(): JSX.Element {
  const userData = useUserData();
  const products = useQuery(
    [QueryKey.CHEAP_PRODUCTS],
    () =>
      firestore()
        .collection(`universities/${userData.data?.data()?.school}/inventory`)
        .where('price', '<', 2)
        .get(),
    {
      enabled: !userData.isLoading && !!userData.data,
    },
  );
  const filteredProducts = useFilteredProducts(products.data?.docs);

  return (
    <HorizontalProductLockup
      productData={filteredProducts.data}
      title={'Grab before you go!'}
      loading={products.isLoading}
      titleColor="white"
      backgroundColor={Theme.main.secondary}
    />
  );
}
