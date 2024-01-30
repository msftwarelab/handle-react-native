import {View, Pressable, ActivityIndicator, Platform} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {useNavigation, useUserData} from '@/hooks';
import {BoldText, CustomIcon, RegularText} from '@/components';
import Subheader from './Subheader';
import { Theme } from '@/constants';

/**
 * Checkout map component
 * @returns {JSX.Element}
 */
export default function Map(): JSX.Element {
  const navigation = useNavigation();
  const userData = useUserData();
  const coords: {
    lat: number | undefined;
    long: number | undefined;
  } = {
    lat: userData.data?.data()?.coords?.lat,
    long: userData.data?.data()?.coords?.long,
  };

  return userData.isLoading || !coords.lat || !coords.long ? (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      }}>
      <ActivityIndicator size="large" color={Theme.loading.primary} />
    </View>
  ) : (
    <View style={{marginTop: 24}}>
      <Subheader>Delivery address</Subheader>
      <View
        style={{
          marginTop: 12,
          backgroundColor: Theme.common.offWhite,
          borderRadius: 16,
          padding: 16,
        }}>
        <MapView
          zoomTapEnabled={false}
          zoomControlEnabled={false}
          scrollEnabled={false}
          zoomEnabled={false}
          style={{height: 150, width: '100%', borderRadius: 16}}
          region={{
            latitude: coords.lat + (Platform.OS === 'ios' ? 0.0005 : 0.002),
            longitude: coords.long,
            latitudeDelta: 0.003,
            longitudeDelta: 0.003,
          }}>
          <Marker
            coordinate={{
              latitude: coords.lat,
              longitude: coords.long,
            }}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                paddingBottom: 59,
              }}>
              <View
                style={{
                  width: 35,
                  height: 35,
                  backgroundColor: Theme.common.white,
                  borderWidth: 3,
                  borderRadius: 8,
                  borderColor: Theme.text.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <RegularText>🏠</RegularText>
              </View>
              <View
                style={{
                  width: 0,
                  height: 0,
                  backgroundColor: 'transparent',
                  borderStyle: 'solid',
                  borderLeftWidth: 6,
                  borderRightWidth: 6,
                  borderBottomWidth: 8,
                  borderLeftColor: 'transparent',
                  borderRightColor: 'transparent',
                  borderBottomColor: Theme.main.primary,
                  transform: [{rotate: '180deg'}],
                }}
              />
              <View
                style={{
                  height: 24,
                  width: 24,
                  borderRadius: 24,
                  backgroundColor: Theme.main.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                  transform: [{translateY: -8}],
                }}>
                <View
                  style={{
                    height: 12,
                    width: 12,
                    backgroundColor: Theme.text.primary,
                    borderRadius: 10,
                  }}
                />
              </View>
            </View>
          </Marker>
        </MapView>
        <Pressable
          onPress={() => {
            navigation.navigate('Address', {next: undefined});
          }}
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 8,
          }}>
          <RegularText style={{color: Theme.text.primary, fontSize: 12, width: '50%'}}>
            {userData.data?.data()?.address}
          </RegularText>
          <CustomIcon name="caret_right" color={Theme.text.primary} size={24} />
        </Pressable>
      </View>
    </View>
  );
}
