import {useState, useEffect, useCallback, memo} from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Keyboard,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {PolyUtil} from 'node-geometry-library';
import {CustomIcon, FullScreenLoadingOverlay, RegularText} from '@/components';
import {useNavigation} from '@/hooks';
import {useUniversity} from '@/hooks/useUniversity';
import {track} from '@/api';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {MAPS_API_KEY} from '@/keys';
import {useQuery} from '@tanstack/react-query';
import {QueryKey, Theme} from '@/constants';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '@/types';
import {FlashList} from '@shopify/flash-list';

type AddressResult = {
  description: string;
  place_id: string;
};

/**
 * The address screen
 * @returns {JSX.Element}
 */
export function Address({
  route,
}: NativeStackScreenProps<RootStackParamList, 'Address'>): JSX.Element {
  const navigation = useNavigation();
  const uniData = useUniversity();
  const [addressSearchTerm, setAddressSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const addresses = useQuery(
    [QueryKey.ADDRESSES, addressSearchTerm],
    () =>
      fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${MAPS_API_KEY}&input=${addressSearchTerm}&components=country:us`,
        {
          method: 'POST',
        },
      )
        .then(res => res.json())
        .then(data => data.predictions),
    {
      enabled: addressSearchTerm.length > 0,
      onError: () => {
        Alert.alert(
          "Sorry, we weren't able to search for your address. Please try again later.",
        );
      },
    },
  );

  const getAddressCoords = useCallback(async (str: string) => {
    setLoading(true);
    Keyboard.dismiss();
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${str}&key=${MAPS_API_KEY}`,
      {
        method: 'POST',
      },
    )
      .then(res => res.json())
      .then(data => {
        //check if within ordering polygon
        let polygon;

        polygon = JSON.parse(uniData.data?.data()?.geofence);
        polygon.forEach((point: any, index: any) => {
          let tempObj = {
            lat: Number(point.lat),
            lng: Number(point.lng),
          };
          polygon[index] = tempObj;
        });
        const response = PolyUtil.containsLocation(
          {
            lat: data.results[0].geometry.location.lat,
            lng: data.results[0].geometry.location.lng,
          },
          polygon,
        );
        if (response) {
          track('updated address');
          firestore()
            .collection('users')
            .doc(auth().currentUser?.uid)
            .set(
              {
                address: str,
                coords: {
                  lat: data.results[0].geometry.location.lat,
                  long: data.results[0].geometry.location.lng,
                },
              },
              {merge: true},
            )
            .then(() => {
              route.params.next
                ? navigation.navigate(route.params.next)
                : navigation.goBack();
            })
            .catch(e => {
              Alert.alert(
                "Sorry, we weren't able to save your address. Please try again later.",
              );
              setLoading(false);
            });
        } else {
          Alert.alert(
            "Sorry, we're unable to service this address. We can only serve areas near campus. Did you select the correct address?",
          );
          setLoading(false);
        }
      })
      .catch(() =>
        Alert.alert(
          "Sorry, we weren't able to save your address. Please try again later.",
        ),
      );
  }, []);

  const renderItem = useCallback(
    ({item}: {item: AddressResult}) => (
      <Item item={item} onPress={() => getAddressCoords(item.description)} />
    ),
    [getAddressCoords],
  );

  useEffect(() => {
    track('opened addresses screen');
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Theme.common.white,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
      }}>
      {loading ? <FullScreenLoadingOverlay /> : <></>}
      <FlashList
        keyboardShouldPersistTaps={'always'}
        estimatedItemSize={100}
        data={addresses.data}
        renderItem={renderItem}
        ListHeaderComponent={
          <View
            style={{
              width: Dimensions.get('window').width - 40,
              minHeight: 56,
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'row',
              borderRadius: 32,
              marginTop: 16,
              paddingHorizontal: 16,
              marginBottom: 16,
              backgroundColor: Theme.common.offWhite,
            }}>
            <CustomIcon name="search" size={16} color={Theme.text.primary} />
            <TextInput
              maxFontSizeMultiplier={1}
              style={{marginLeft: 12, color: Theme.text.primary}}
              autoFocus
              placeholder={'123 W Main St'}
              value={addressSearchTerm}
              onChangeText={text => setAddressSearchTerm(text)}
            />
          </View>
        }
        ListEmptyComponent={
          addresses.isLoading ? (
            <View
              style={{
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <ActivityIndicator size="large" color={Theme.loading.primary} />
            </View>
          ) : (
            <></>
          )
        }
      />
    </SafeAreaView>
  );
}

const Item = memo(
  ({item, onPress}: {item: AddressResult; onPress: () => void}) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: '100%',
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingVertical: 16,
        borderBottomColor: Theme.separator.gray,
        borderBottomWidth: 1,
      }}>
      <CustomIcon name="poi_outlined" color={Theme.text.primary} size={24} />
      <RegularText
        crack
        style={{
          marginLeft: 12,
          fontSize: 16,
          color: Theme.text.primary,
          width: '80%',
          flexWrap: 'nowrap',
        }}>
        {item.description}
      </RegularText>
    </TouchableOpacity>
  ),
);
