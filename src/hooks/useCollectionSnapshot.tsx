import {useCallback, useEffect} from 'react';
import {
  UseQueryOptions,
  UseQueryResult,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

// Global observers map
const observers: Record<string, boolean> = {};

/**
 * A React Query based hook for listening to a Firebase collection
 * @param {any} key - The key for the query
 * @param {string} path - The path to the Collection
 * @param {UseQueryOptions<FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>, Error>} useQueryOptions - The options for the query
 * @returns {UseQueryResult<FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>, Error>} - The result of the query
 */
export function useCollectionSnapshot(
  key: any,
  path: string,
  useQueryOptions?: UseQueryOptions<
    FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>,
    Error
  >,
): UseQueryResult<
  FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>,
  Error
> {
  // Fetch the query client
  const queryClient = useQueryClient();

  /**
   * The query function
   * @returns {Promise<FFirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>>}
   */
  async function queryFn() {
    const snapshot = await firestore().collection(path).get();
    return snapshot;
  }

  // Define the subscription function
  const subscribe = useCallback(async () => {
    observers[key] = true;
    const unsubscribe = firestore()
      .collection(path)
      .onSnapshot(snapshot => queryClient.setQueryData(key, snapshot));
    return () => {
      unsubscribe();
      observers[key] = false;
    };
  }, [key, queryClient]);

  // Subscribe to the Collection when the component mounts
  useEffect(() => {
    (!useQueryOptions || useQueryOptions.enabled !== false) &&
      !observers[key] &&
      subscribe();
  }, [useQueryOptions, subscribe]);

  // Return the query
  return useQuery<
    FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>,
    Error
  >(key, queryFn, {
    ...useQueryOptions,
    refetchOnMount: !observers[key],
    refetchOnWindowFocus: !observers[key],
    refetchOnReconnect: !observers[key],
  });
}
