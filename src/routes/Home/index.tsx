import {View, Platform} from 'react-native';
import {useEffect, useMemo} from 'react';
import {track} from '@/api';
import {
  BoldText,
  FloatingCartButton,
  LoadingRect,
  RegularText,
} from '@/components';
import {Trending} from './Trending';
import {OrderAgain} from './OrderAgain';
import {Deals} from './Deals';
import {Events} from './Events';
import {Categories} from './Categories';
import {ClosedMessage} from './ClosedMessage';
import {Subheader} from './Subheader';
import {Breakdown} from './Breakdown';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {NewProducts} from './NewProducts';
import {Theme} from '@/constants';
import Announcement from './Announcement';
import {FlashList} from '@shopify/flash-list';
import {useBreakdown} from '@/hooks';
import {useNotifications} from '@/context';
import {useUserData} from '@/hooks';
import {useContacts} from '@/hooks/useContacts';
import BannerAds from './BannerAds';

/**
 * The home screen
 * @returns {JSX.Element}
 */
export function Home(): JSX.Element {
  const {sendNotification} = useNotifications();
  const userData = useUserData();
  const storeCredit = userData.data?.data()?.storeCredit.toFixed(2);

  useContacts();

  useEffect(() => {
    track('loaded home');
    storeCredit > 0 &&
      sendNotification({
        title: '',
        body: (
          <RegularText crack>
            You have <BoldText>${storeCredit}</BoldText> in store credit.
          </RegularText>
        ),
        type: 'credit-info',
        offset: 75,
      });
  }, [sendNotification, storeCredit]);

  const insets = useSafeAreaInsets();
  const renderItem = useMemo(
    () =>
      ({item}: {item: JSX.Element}) =>
        item,
    [],
  );
  const breakdown = useBreakdown();
  const data = useMemo(
    () => [
      <Subheader />,
      <Categories />,
      <Announcement />,
      <BannerAds />,
      <ClosedMessage />,
      <Trending />,
      <OrderAgain />,
      <Deals />,
      <NewProducts />,
      <Events />,
      ...(breakdown.data?.map(item => <Breakdown item={item} />) ?? [
        <View
          style={{
            width: '100%',
            height: 300,
            paddingHorizontal: 20,
            backgroundColor: Theme.common.white,
            paddingTop: 20,
          }}>
          <LoadingRect
            style={{
              height: 20,
              width: 300,
              marginBottom: 16,
            }}
          />
          <View style={{display: 'flex', flexDirection: 'row'}}>
            <LoadingRect
              style={{
                height: 200,
                width: 120,
                marginRight: 8,
              }}
            />
            <LoadingRect
              style={{
                height: 200,
                width: 120,
                marginRight: 8,
              }}
            />
            <LoadingRect
              style={{
                height: 200,
                width: 120,
                marginRight: 8,
              }}
            />
          </View>
        </View>,
      ]),
    ],
    [breakdown.data],
  );

  return (
    <SafeAreaView
      edges={['bottom', 'left', 'right']}
      style={{
        flex: 1,
        height: '100%',
        width: '100%',
        minHeight: '100%',
        minWidth: '100%',
      }}>
      <FlashList
        data={data}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          backgroundColor: 'white',
          paddingBottom: insets.bottom + 100,
        }}
        estimatedItemSize={356}
      />
      <FloatingCartButton tabs />
      {Platform.OS === 'ios' && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -1,
          }}>
          <View style={{flex: 1, backgroundColor: Theme.main.primary}} />
          <View style={{flex: 1, backgroundColor: Theme.common.white}} />
        </View>
      )}
    </SafeAreaView>
  );
}
