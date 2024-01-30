import {CustomIcon, RegularText} from '@/components';
import {Theme} from '@/constants';
import {
  Linking,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {getAds} from '@/api/getAds';
import {useCallback, useEffect, useState} from 'react';
import {useNavigation, useUniversity} from '@/hooks';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {useQuery} from '@tanstack/react-query';
import {track} from '@/api';

/**
 * The banner ads component
 * @returns {JSX.Element}
 */
export default function BannerAds(): JSX.Element {
  const university = useUniversity();

  const {
    data: ads,
    isLoading,
    isError,
  } = useQuery(
    ['ads', university.data?.id],
    () => getAds(university.data?.id ? university.data?.id : ''),
    {
      enabled: !!university.data?.id, // Only run query if university ID is available
      select: data => (data.length > 0 ? data : []),
      staleTime: 5 * 60 * 1000, // 5 minutes in milliseconds
    },
  );
  const navigation = useNavigation();

  const onPress = useCallback((slug: string, title: string, url: string) => {
    track('banner-ad-clicked', {title});
    if (url) {
      Linking.openURL(url);
      return;
    }
    navigation.navigate('ProductList', {
      slug,
      name: title,
    });
  }, []);

  if (ads && ads.length) {
    return (
      <View>
        {ads &&
          ads.length &&
          ads.map((ad: any) => (
            <Pressable
              key={ad.id}
              onPress={() =>
                onPress(
                  ad.action === 'CATEGORY' ? ad.action_content : '',
                  ad.title,
                  ad.url,
                )
              }
              style={styles.container}>
              <FastImage
                source={{uri: ad.image}}
                style={{flex: 1, borderRadius: 16}}
                resizeMode={FastImage.resizeMode.cover}>
                <LinearGradient
                  colors={['#00000000', '#00000080']}
                  style={{flex: 1}}>
                  <View style={{padding: 16}}>
                    <RegularText
                      style={{color: 'white', fontSize: 10, marginBottom: 16}}>
                      {ad.disclaimer}
                    </RegularText>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <View style={{maxWidth: '90%'}}>
                        <RegularText
                          style={{
                            fontSize: 16,
                            color: 'white',
                            fontWeight: 'bold',
                          }}>
                          {ad.title}
                        </RegularText>
                        <RegularText style={{fontSize: 16, color: 'white'}}>
                          {ad.subtitle}
                        </RegularText>
                      </View>
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'flex-end',
                        }}>
                        {ad.action && (
                          <CustomIcon
                            name="arrow_long_right"
                            color={'white'}
                            size={24}
                          />
                        )}
                      </View>
                    </View>
                  </View>
                </LinearGradient>
              </FastImage>
            </Pressable>
          ))}
      </View>
    );
  }
  return <></>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: 'black',
    marginBottom: 16,
    marginHorizontal: 16,
  },
});
