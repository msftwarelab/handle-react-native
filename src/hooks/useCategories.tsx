import {QueryKey} from '@/constants';
import {useUserData} from './useUserData';
import {useQuerySnapshot} from './useQuerySnapshot';
import firestore from '@react-native-firebase/firestore';
import {useVersionCheck} from './useVersionCheck';
import VersionCheck from 'react-native-version-check';
import {useQuery} from '@tanstack/react-query';

export function useCategories() {
  const userData = useUserData();
  let categories = useQuerySnapshot(
    [QueryKey.CATEGORIES, userData.data?.data()?.school],
    firestore().collection(`subcategories`).where('shown', '==', true),
    {
      enabled: !userData.isLoading && !!userData.data?.data()?.school,
    },
  );

  const filteredCategories = categories.data?.docs.filter(doc => {
    const hiddenAtSchools = doc.data().hiddenAtSchools || [];
    const currentSchool = userData.data?.data()?.school;
    return !hiddenAtSchools.includes(currentSchool);
  });

  const APP_STORE_VERSION = useQuery(['APP_STORE_VERSION'], () =>
    firestore()
      .collection('global_data')
      .doc('global_data')
      .get()
      .then(res => res.data()?.APP_STORE_VERSION),
  );

  const data = {
    ...filteredCategories,
    data:
      APP_STORE_VERSION.data === VersionCheck.getCurrentVersion() &&
      (userData.data?.data()?.verified === 'Verified' ||
        !userData.data?.data()?.verified)
        ? filteredCategories
        : filteredCategories?.filter(doc => !doc.data().restricted),
  };

  return data;
}
