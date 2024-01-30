import {useQuery} from '@tanstack/react-query';
import {useCategories} from './useCategories';
import {useUserData} from './useUserData';
import {QueryKey} from '@/constants';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

export function useBreakdown() {
  const userData = useUserData();
  const categories = useCategories();
  return useQuery(
    [QueryKey.CATEGORY_BREAKDOWN],
    () =>
      Promise.all(
        categories.data!.map(doc =>
          firestore()
            .collection(
              `universities/${userData?.data?.data()?.school}/inventory`,
            )
            .where('tags', 'array-contains', doc.data().slug)
            .where('quantity', '>', 0)
            .limit(20)
            .get()
            .then(snapshot => {
              return {
                category: doc.data(),
                items: snapshot.docs,
              };
            }),
        ),
      ).then(
        (
          result: {
            category: FirebaseFirestoreTypes.DocumentData;
            items: FirebaseFirestoreTypes.QueryDocumentSnapshot<FirebaseFirestoreTypes.DocumentData>[];
          }[],
        ) =>
          result
            .filter(item => item.items.length > 0)
            .filter(item =>
              userData.data?.data()?.verified === 'Verified'
                ? true
                : !item.category.restricted,
            )
            .sort((a, b) => a.category.index - b.category.index)
            .flat(),
      ),

    {
      enabled:
        !categories?.isLoading &&
        !userData.isLoading &&
        !!categories.data &&
        categories.data.length > 0,
    },
  );
}
