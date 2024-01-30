import {QueryKey} from '@/constants';
import {useUserData} from './useUserData';
import {useDocumentSnapshot} from './useDocumentSnapshot';

export function useUniversity() {
  const userData = useUserData();
  return useDocumentSnapshot(
    [QueryKey.UNIVERSITY, userData.data?.data()?.school],
    `universities/${userData.data?.data()?.school}`,
    {
      enabled: !userData.isLoading && !!userData.data?.data()?.school,
    },
  );
}
