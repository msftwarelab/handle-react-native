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
 * A React Query based hook for listening to a Firebase document
 * @param {any} key - The key for the query
 * @param {string} path - The path to the document
 * @param {UseQueryOptions<FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>, Error>} useQueryOptions - The options for the query
 * @returns {UseQueryResult<FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>, Error>} - The result of the query
 */
export function useDocumentSnapshot(
  key: any,
  path: string,
  useQueryOptions?: UseQueryOptions<
    FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>,
    Error
  >,
): UseQueryResult<
  FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>,
  Error
> {
  // Fetch the query client
  const queryClient = useQueryClient();

  /**
   * The query function
   * @returns {Promise<FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>>}
   */
  async function queryFn() {
    const snapshot = await firestore().doc(path).get();
    return snapshot;
  }

  // Define the subscription function
  const subscribe = useCallback(async () => {
    observers[key] = true;
    const unsubscribe = firestore()
      .doc(path)
      .onSnapshot(snapshot => {
        queryClient.setQueryData(key, snapshot);
      });
    return () => {
      unsubscribe();
      observers[key] = false;
    };
  }, [key, queryClient]);

  // Subscribe to the document when the component mounts
  useEffect(() => {
    (!useQueryOptions || useQueryOptions.enabled !== false) &&
      !observers[key] &&
      subscribe();
  }, [useQueryOptions, subscribe]);

  // Return the query
  return useQuery<
    FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>,
    Error
  >(key, queryFn, {
    ...useQueryOptions,
    enabled: useQueryOptions?.enabled ?? true,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
