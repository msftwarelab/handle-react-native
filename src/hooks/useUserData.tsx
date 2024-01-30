import {QueryKey} from '@/constants';
import {useDocumentSnapshot} from './useDocumentSnapshot';
import auth from '@react-native-firebase/auth';

export function useUserData() {
  return useDocumentSnapshot(
    [QueryKey.USERDATA, auth().currentUser?.uid],
    `users/${auth().currentUser?.uid}`,
    {
      enabled: !!auth().currentUser?.uid,
    },
  );
}
