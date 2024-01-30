import {Alert, Pressable, Text, View} from 'react-native';
import React, {memo, useEffect, useState} from 'react';
import {BoldText, CustomIcon, Gutter, RegularText} from '@/components';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '@/types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useUserData} from '@/hooks';
import {Referral} from './Referral';
import {QueryKey, Theme} from '@/constants';
import functions from '@react-native-firebase/functions';
import {useQuery} from '@tanstack/react-query';

export const Subheader = memo(function Subheader() {
  const userData = useUserData();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [showReferralModal, setShowReferralModal] = useState(false);
  const getAverageDeliveryTime = functions().httpsCallable(
    'getAverageDeliveryTime',
  );
  const averageDeliveryTime = useQuery(
    [QueryKey.AVERAGE_DELIVERY_TIME, userData.data?.data()?.school],
    () =>
      getAverageDeliveryTime({school: userData.data?.data()?.school}).then(
        res => res.data,
      ),
    {
      enabled: !!userData.data?.data()?.school,
    },
  );

  const orders = userData.data?.data()?.orders.length;

  const address =
    userData.data
      ?.data()
      ?.address?.substring(0, userData.data?.data()?.address?.indexOf(',')) ||
    'Where to, boss?';
  const addressEndIndex = address.length < 18 ? address.length : 18;

  return (
    <>
      <Referral shown={showReferralModal} setShown={setShowReferralModal} />
      <Gutter
        style={{backgroundColor: Theme.main.primary, paddingHorizontal: 20}}>
        <LineItem
          emoji="📍"
          title={
            address.substring(0, addressEndIndex).trim() +
            (address.length > 18 ? '...' : '')
          }
          details={
            averageDeliveryTime.data !== undefined
              ? `${
                  averageDeliveryTime.data - 4 < 1
                    ? 1
                    : averageDeliveryTime.data - 4
                } - ${averageDeliveryTime.data + 2} min`
              : undefined
          }
          callback={() => {
            navigation.navigate('Address', {
              next: undefined,
            });
          }}
        />
        <LineItem
          emoji="💰"
          title="Give $10, get $10!"
          callback={() => {
            setShowReferralModal(true);
          }}
        />
        {orders < 3 && (
          <LineItem
            emoji="💸"
            title={`$5 off your next ${
              orders < 2 ? 3 - orders + ' ' : ''
            }order${orders < 2 ? 's' : ''}!`}
            callback={() => {
              Alert.alert(
                'Welcome to Handle!',
                'You have $5 in store credit for each of your first 3 orders. Your credit will be shown at checkout.',
              );
            }}
          />
        )}
      </Gutter>
    </>
  );
});

/**
 * A line item for the subheader
 * @param {string} emoji - The emoji to display
 * @param {string} title - The title to display
 * @param {function} callback - The callback to run when the line item is pressed
 * @returns {JSX.Element}
 */
function LineItem({
  emoji,
  title,
  details,
  callback,
}: {
  emoji: string;
  title: string;
  details?: string;
  callback: () => void;
}): JSX.Element {
  return (
    <Pressable
      onPress={() => {
        callback();
      }}
      style={{
        display: 'flex',
        flexDirection: 'row',
        paddingVertical: 10,
        alignItems: 'center',
        borderTopColor: Theme.separator.primary,
        borderTopWidth: 1,
        justifyContent: 'space-between',
      }}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}>
        <BoldText style={{fontSize: 32}}>{emoji}</BoldText>
        <RegularText
          crack={true}
          style={{color: 'white', fontSize: 16, marginLeft: 8}}>
          {title}
        </RegularText>
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        {details && (
          <View
            style={{
              backgroundColor: 'white',
              paddingVertical: 4,
              paddingHorizontal: 6,
              borderRadius: 12,
            }}>
            <RegularText
              style={{
                color: Theme.common.lightGreen,
                fontSize: 16,
              }}>
              {details}
            </RegularText>
          </View>
        )}
        <CustomIcon name="caret_right" color="white" size={32} />
      </View>
    </Pressable>
  );
}
