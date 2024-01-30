import {Pressable, View} from 'react-native';
import Sheet from './Sheet';
import {CustomIcon, FullScreenLoadingOverlay} from '@/components';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '@/types';
import {useDocumentSnapshot, useNavigation, useUserData} from '@/hooks';
import {QueryKey, Theme} from '@/constants';
import Map from './Map';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

/**
 * Order details screen
 * @returns {JSX.Element}
 */
export function OrderDetails({
  route,
}: NativeStackScreenProps<RootStackParamList, 'OrderDetails'>): JSX.Element {
  const navigation = useNavigation();
  const {orderID} = route.params;
  const userData = useUserData();
  const orderDetails = useDocumentSnapshot(
    [QueryKey.ORDER_DETAILS, userData.data?.data()?.school, orderID],
    `universities/${userData.data?.data()?.school}/orders/${orderID}`,
    {
      enabled:
        !userData.isLoading && !!userData.data?.data()?.school && !!orderID,
    },
  );
  const {top} = useSafeAreaInsets();

  return orderDetails.isLoading ? (
    <FullScreenLoadingOverlay />
  ) : (
    <View style={{width: '100%', height: '100%'}}>
      <View style={{width: '100%', height: '50%'}}>
        <Map
          destinationCoords={{
            lat: orderDetails.data?.data()?.latitude,
            long: orderDetails.data?.data()?.longitude,
          }}
        />
      </View>
      <Sheet data={orderDetails.data} />
      <Pressable
        onPress={() => {
          navigation.goBack();
        }}
        style={{
          position: 'absolute',
          top: top + 20,
          left: 20,
          height: 56,
          width: 56,
          backgroundColor: Theme.common.white,
          borderRadius: 56,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <CustomIcon color={Theme.text.primary} size={24} name="arrow_backward" />
      </Pressable>
    </View>
  );
}
