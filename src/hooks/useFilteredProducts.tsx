import {QueryKey} from '@/constants';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {useQuerySnapshot} from './useQuerySnapshot';
import {useUserData} from './useUserData';
import firestore from '@react-native-firebase/firestore';
import VersionCheck from 'react-native-version-check';
import {useVersionCheck} from './useVersionCheck';
import {useQuery} from '@tanstack/react-query';

type FilteredProducts = {
  data:
    | FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>[]
    | FirebaseFirestoreTypes.QueryDocumentSnapshot<FirebaseFirestoreTypes.DocumentData>[]
    | undefined;
  isLoading: boolean;
};

/**
 * Filter products based on user data, quantity, and price
 * @param {FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>[] | FirebaseFirestoreTypes.QueryDocumentSnapshot<FirebaseFirestoreTypes.DocumentData>[] | undefined} data Product data
 * @returns {FilteredProducts}
 */
export function useFilteredProducts(
  data:
    | FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>[]
    | FirebaseFirestoreTypes.QueryDocumentSnapshot<FirebaseFirestoreTypes.DocumentData>[]
    | undefined,
): FilteredProducts {
  const userData = useUserData();
  const versionCheck = useVersionCheck();

  const CLIENT_VERSION = VersionCheck.getCurrentVersion();

  const APP_STORE_VERSION = useQuery(['APP_STORE_VERSION'], () =>
    firestore()
      .collection('global_data')
      .doc('global_data')
      .get()
      .then(res => res.data()?.APP_STORE_VERSION),
  );

  const categories = useQuerySnapshot(
    [QueryKey.CATEGORIES, userData.data?.data()?.school],
    firestore().collection('subcategories').where('shown', '==', true),
    {
      enabled: !userData.isLoading && !!userData.data?.data()?.school,
    },
  );

  const restricted = categories.data?.docs
    .filter(doc => doc.data().restricted)
    .map(doc => doc.id);

  return {
    data: data?.filter(
      doc =>
        (doc.data()?.tags?.some((tag: string) => restricted?.includes(tag))
          ? userData.data?.data()?.verified === 'Verified' &&
            APP_STORE_VERSION.data === CLIENT_VERSION
          : true) &&
        doc.data()?.quantity > 0 &&
        typeof doc.data()?.price === 'number' &&
        doc.data()?.price >= 0,
    ),
    isLoading:
      categories.isLoading ||
      userData.isLoading ||
      versionCheck.isLoading ||
      APP_STORE_VERSION.isLoading,
  };
}
