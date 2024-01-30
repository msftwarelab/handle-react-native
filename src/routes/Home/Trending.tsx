import {useQuery} from '@tanstack/react-query';
import {QueryKey, Theme} from '@/constants';
import firestore from '@react-native-firebase/firestore';
import {useUserData} from '@/hooks';
import {HorizontalProductLockup} from '../../components/HorizontalProductLockup';
import {SafeAreaView} from 'react-native';
import {Title} from './TItle';

/**
 * The trending component
 * @returns {JSX.Element}
 */
export function Trending(): JSX.Element {
  const {data: userData} = useUserData();
  const trending = useQuery(
    [QueryKey.TRENDING],
    () =>
      firestore()
        .collection(`universities/${userData?.data()?.school}/inventory`)
        .where('tags', 'array-contains', 'trending')
        .limit(50)
        .get(),
    {
      enabled: !!userData?.data()?.school,
    },
  );

  return (
    <>
      {((trending &&
        trending.data &&
        trending.data.docs &&
        trending.data.docs.length > 0) ||
        trending.isLoading) && (
        <SafeAreaView>
          <Title>Trending ✨</Title>
          <HorizontalProductLockup
            titleColor={'white'}
            productData={trending.data?.docs.filter(
              product => product.data().quantity > 0,
            )}
            backgroundColor={Theme.main.secondary}
            loading={trending.isLoading}
          />
        </SafeAreaView>
      )}
    </>
  );
}
