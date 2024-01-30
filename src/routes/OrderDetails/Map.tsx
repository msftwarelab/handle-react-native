import {RegularText} from '@/components';
import { Theme } from '@/constants';
import {memo, useEffect, useMemo} from 'react';
import {View} from 'react-native';
import MapView, {Marker} from 'react-native-maps';

/**
 * The map component for order details
 * @param {{lat: number; long: number}} destinationCoords - The coordinates of the destination
 * @param {{lat: number; long: number}} courierCoords - The coordinates of the courier
 * @returns {JSX.Element}
 */
export default function Map({
  destinationCoords,
  courierCoords,
}: {
  destinationCoords: {lat: number; long: number};
  courierCoords?: {lat: number; long: number};
}): JSX.Element {

  return (
    <View>
      <MapView
        style={{height: '100%', width: '100%', borderRadius: 16}}
        initialRegion={{
          latitude: destinationCoords.lat,
          longitude: destinationCoords.long,
          latitudeDelta: 0.006,
          longitudeDelta: 0.006,
        }}>
        <DestinationMarker destinationCoords={destinationCoords} />
      </MapView>
    </View>
  );
}

const DestinationMarker = memo(
  ({destinationCoords}: {destinationCoords: {lat: number; long: number}}) => {
    return (
      <Marker
        coordinate={{
          latitude: destinationCoords.lat,
          longitude: destinationCoords.long,
        }}
        tracksViewChanges={false}
      >
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
              borderBottomColor: Theme.text.primary,
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
                backgroundColor: Theme.main.primary,
                borderRadius: 10,
              }}
            />
          </View>
        </View>
      </Marker>
    );
  },
);
