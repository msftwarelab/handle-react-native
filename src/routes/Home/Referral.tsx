import {
  Pressable,
  TouchableOpacity,
  View,
  Share,
  Modal,
  Alert,
} from 'react-native';
import React, {memo, useEffect} from 'react';
import {BoldText, CustomIcon, RegularText} from '@/components';
import {useUniversity, useUserData} from '@/hooks';
import {track} from '@/api';
import {Theme} from '@/constants';
import Clipboard from '@react-native-clipboard/clipboard';

/**
 * The referral modal
 * @param {boolean} shown - Whether the modal is shown
 * @param {(shown: boolean) => void} setShown - Sets whether the modal is shown
 * @returns {JSX.Element}
 */
export const Referral = memo(function Referral({
  shown,
  setShown,
}: {
  shown: boolean;
  setShown: (shown: boolean) => void;
}): JSX.Element {
  const userData = useUserData();
  const university = useUniversity();

  useEffect(() => {
    if (shown) {
      track('opened referral modal');
    }
  }, [shown]);
  return (
    <Modal
      transparent
      visible={shown}
      onRequestClose={() => {
        setShown(false);
      }}
      animationType={'slide'}>
      <View
        style={{
          height: '100%',
          width: '100%',
          padding: 20,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}>
        <View
          style={{
            height: '70%',
            width: '100%',
            backgroundColor: Theme.main.secondary,
            borderRadius: 16,
          }}>
          <View style={{padding: 20}}>
            <Pressable
              style={{marginBottom: 16}}
              onPress={() => {
                setShown(false);
              }}>
              <CustomIcon color={Theme.common.white} name="clear" size={24} />
            </Pressable>
            <BoldText
              style={{
                color: Theme.common.white,
                fontSize: 60,
                lineHeight: 70,
              }}>
              Give ${university.data?.data()?.referralBonus}, get $
              {university.data?.data()?.referralBonus}.
            </BoldText>
            <BoldText
              style={{
                color: Theme.common.white,
                fontSize: 20,
              }}>
              Gift your friends ${university.data?.data()?.referralBonus} to use
              on {Theme.name} and get ${university.data?.data()?.referralBonus}{' '}
              when they place their first order!
            </BoldText>
            <View
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}>
              <TouchableOpacity
                onPress={() => {
                  track('copied referral code to clipboard');
                  Clipboard.setString(userData.data?.data()?.referralCode);
                  Alert.alert('Copied to Clipboard!');
                }}
                style={{
                  padding: 8,
                  width: '100%',
                  borderRadius: 24,
                  backgroundColor: Theme.common.offWhiteWarm,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginVertical: 16,
                }}>
                <RegularText
                  style={{
                    color: Theme.text.secondary,
                    fontSize: 12,
                  }}>
                  YOUR CODE
                </RegularText>
                <BoldText
                  style={{
                    color: Theme.text.primary,
                    fontSize: 24,
                  }}>
                  {userData.data?.data()?.referralCode}
                </BoldText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  track('tapped share referral code');
                  Share.share({
                    message:
                      'hey! use my code ' +
                      userData.data?.data()?.referralCode +
                      ' on ' +
                      Theme.name +
                      ' and we both get $' +
                      university.data?.data()?.referralBonus +
                      `! download here: https://apps.apple.com/us/app/${Theme.name.toLowerCase()}-10-min-snack-delivery/${
                        Theme.appStoreId
                      }`,
                  });
                }}
                style={{
                  padding: 8,
                  width: '100%',
                  borderRadius: 24,
                  backgroundColor: Theme.common.offWhiteWarm,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginBottom: 16,
                }}>
                <BoldText
                  style={{
                    color: Theme.text.primary,
                    fontSize: 24,
                  }}>
                  Share with Friends
                </BoldText>
              </TouchableOpacity>
              <BoldText
                style={{
                  color: Theme.common.white,
                  fontSize: 18,
                }}>
                Referrals completed: {userData.data?.data()?.referrals || 0}
              </BoldText>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
});
