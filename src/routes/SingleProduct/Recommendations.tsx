import {memo} from 'react';
import functions from '@react-native-firebase/functions';
import {useQuery} from '@tanstack/react-query';
import {QueryKey, Theme} from '@/constants';
import {HorizontalProductLockup} from '@/components';
import {StyleSheet} from 'react-native';

export const Recommendations = memo(function Recommendations({
  itemID,
}: {
  itemID: string;
}) {
  const getAlgoliaRecommendation = functions().httpsCallable(
    'getAlgoliaRecommendation',
  );
  const recommendations = useQuery(
    [QueryKey.RECOMMENDATIONS, itemID],
    () =>
      getAlgoliaRecommendation({objectID: itemID}).then(res =>
        res.data.map((rec: any) => {
          return {
            id: rec.id,
            data: () => rec,
          };
        }),
      ),
    {
      enabled: !!itemID,
    },
  );

  return (
    <HorizontalProductLockup
      productData={recommendations.data}
      titleColor={'white'}
      title={'Similar products'}
      loading={recommendations.isLoading}
      backgroundColor={Theme.main.secondary}
      style={RecommendationsStyle.ProductLockUp}
    />
  );
});

const RecommendationsStyle = StyleSheet.create({
  ProductLockUp: {
    paddingTop: 16,
    marginTop: 16,
  },
});
