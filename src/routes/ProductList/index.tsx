import {ActivityIndicator, SafeAreaView, View} from 'react-native';
import {FloatingCartButton, InfiniteHits} from '@/components';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '@/types';
import {Configure, InstantSearch} from 'react-instantsearch-hooks';
import {
  useDocumentSnapshot,
  useNavigation,
  useUniversity,
  useUserData,
} from '@/hooks';
import {QueryKey, Theme} from '@/constants';
import {useEffect} from 'react';
import {searchClient} from '@/service/algolia';

/**
 * The product list screen
 * @returns {JSX.Element}
 */
export function ProductList({
  route,
}: NativeStackScreenProps<RootStackParamList, 'ProductList'>): JSX.Element {
  const {slug} = route.params;
  const university = useUniversity();
  const userData = useUserData();
  const navigation = useNavigation();
  const subcategory = useDocumentSnapshot(
    [QueryKey.CATEGORY, university.data?.data()?.id, slug],
    `subcategories/${slug}`,
    {
      enabled: !!university.data?.data()?.id,
    },
  );

  useEffect(() => {
    if (
      userData.data?.data()?.verified !== 'Verified' &&
      subcategory.data?.data()?.restricted
    ) {
      navigation.replace('CheckID');
    }
  }, [
    userData.data?.data()?.verified,
    navigation,
    subcategory.data?.data()?.restricted,
  ]);

  return (
    <SafeAreaView
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: Theme.common.white,
      }}>
      {university.data?.data()?.algolia_id && !subcategory.isLoading ? (
        <InstantSearch
          searchClient={searchClient}
          indexName={university.data?.data()?.algolia_id}>
          {/* @ts-ignore */}
          <Configure filters={`quantity>0 AND tags:'${slug}'`} />
          <InfiniteHits />
        </InstantSearch>
      ) : (
        <View
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size="large" color={Theme.loading.primary} />
        </View>
      )}
      <FloatingCartButton />
    </SafeAreaView>
  );
}
