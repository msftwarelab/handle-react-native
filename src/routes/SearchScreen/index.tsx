import {ActivityIndicator, StatusBar, View} from 'react-native';
import algoliasearch from 'algoliasearch';
import {FloatingCartButton, InfiniteHits} from '@/components';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Configure, InstantSearch} from 'react-instantsearch-hooks';
import {useUniversity} from '@/hooks/useUniversity';
import SearchBox from './SearchBox';
import { Theme } from '@/constants';
import { searchClient } from '@/service/algolia';

/**
 * Search products screen
 * @returns {JSX.Element}
 */
export function SearchScreen(): JSX.Element {
  const university = useUniversity();
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <>
      <StatusBar barStyle={'dark-content'} animated backgroundColor={Theme.common.white} />
      <View
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'white',
        }}>
        <View
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: 'white',
            paddingTop: safeAreaInsets.top,
          }}>
          {university.isLoading ? (
            <View
              style={{
                height: '100%',
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ActivityIndicator size="large" color={Theme.loading.primary} />
            </View>
          ) : (
            <InstantSearch
              searchClient={searchClient}
              indexName={university.data?.data()?.algolia_id}>
              <Configure hitsPerPage={20} filters="quantity>0" />
              <SearchBox />
              <InfiniteHits />
            </InstantSearch>
          )}
        </View>
        <FloatingCartButton />
      </View>
    </>
  );
}
