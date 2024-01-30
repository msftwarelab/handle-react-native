import {Pressable, View, Dimensions, SafeAreaView} from 'react-native';
import React, {memo, useCallback} from 'react';
import {BoldText, CustomIcon, Gutter, RegularText} from '@/components';
import {useQuery} from '@tanstack/react-query';
import {QueryKey, Theme} from '@/constants';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {useNavigation, useUserData} from '@/hooks';
import FastImage from 'react-native-fast-image';
import {FlashList} from '@shopify/flash-list';

/**
 * The events component
 * @returns {JSX.Element}
 */
export const Events = memo(function Events(): JSX.Element {
  const navigation = useNavigation();
  const {data: userData} = useUserData();
  const {data: events} = useQuery(
    [QueryKey.EVENTS],
    () =>
      firestore()
        .collection(`universities/${userData?.data()?.school}/events`)
        .where('shown', '==', true)
        .get(),
    {
      enabled: !!userData?.data()?.school,
    },
  );
  const renderItem = useCallback(
    ({
      item,
    }: {
      item:
        | FirebaseFirestoreTypes.QueryDocumentSnapshot<FirebaseFirestoreTypes.DocumentData>
        | FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>;
    }) => {
      return <Event data={item} />;
    },
    [events],
  );

  if (events?.docs.length === 0) {
    return <></>;
  }

  return (
    <SafeAreaView
      style={{
        height: '100%',
        paddingHorizontal: 20,
        marginBottom: 16,
        backgroundColor: Theme.common.white,
      }}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 16,
          justifyContent: 'space-between',
        }}>
        <BoldText style={{color: Theme.text.primary, fontSize: 20}}>
          Local Events on {Theme.name}
        </BoldText>
      </View>
      <View style={{height: '100%'}}>
        <FlashList
          data={events?.docs}
          renderItem={renderItem}
          scrollEnabled={false}
          estimatedItemSize={10}
        />
      </View>
    </SafeAreaView>
  );

  /**
   * The event component
   * @param {FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>} data - The event data
   * @returns {JSX.Element}
   */
  function Event({
    data,
  }: {
    data: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>;
  }): JSX.Element {
    return (
      <Pressable
        onPress={() => {
          navigation.navigate('EventDetails', {id: data.id});
        }}
        style={{
          width: '100%',
          backgroundColor: Theme.text.primary,
          display: 'flex',
          flexDirection: 'row',
          borderRadius: 8,
        }}>
        <FastImage
          resizeMode="contain"
          style={{height: 100, width: 100, borderRadius: 8}}
          source={{uri: data.data()?.image}}
        />
        <View
          style={{
            padding: 16,
            maxWidth: Dimensions.get('screen').width - 40 - 100,
          }}>
          <BoldText style={{color: Theme.common.white}}>
            {data.data()?.name}
          </BoldText>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <CustomIcon name="dollar" color={Theme.common.white} size={12} />
            <RegularText
              style={{
                color: Theme.common.white,
                marginHorizontal: 4,
                fontSize: 10,
              }}>
              ${data.data()?.ticketPrice}
            </RegularText>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <CustomIcon
              name="calendar_month"
              color={Theme.common.white}
              size={12}
            />
            <RegularText
              style={{
                color: Theme.common.white,
                marginLeft: 4,
                fontSize: 10,
              }}>
              {data.data()?.datetime}
            </RegularText>
          </View>
        </View>
      </Pressable>
    );
  }
});
