import {View, TouchableOpacity} from 'react-native';
import {BoldText, CustomIcon, LoadingRect, RegularText} from '@/components';
import {useCallback} from 'react';
import Clipboard from '@react-native-clipboard/clipboard';
import {useUniversity, useUserData} from '@/hooks';
import {Theme} from '@/constants';
import auth from '@react-native-firebase/auth';

/**
 * Referral component
 * @returns {JSX.Element}
 */
export default function Referral(): JSX.Element {
  const userData = useUserData();

  const onPress = useCallback(
    () => Clipboard.setString(userData.data?.data()?.referralCode || ''),
    [userData.data],
  );
  const university = useUniversity();

  return userData.isLoading ? (
    <LoadingRect
      style={{
        marginTop: 16,
        marginHorizontal: 20,
        borderRadius: 16,
        padding: 16,
      }}
    />
  ) : (
    <View
      style={{
        marginTop: 16,
        marginHorizontal: 20,
        backgroundColor: Theme.common.offWhiteWarm,
        borderRadius: 16,
        padding: 16,
      }}>
      <View
        style={{
          flexDirection: 'row',
          display: 'flex',
        }}>
        <View style={{flex: 1}}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <BoldText style={{color: Theme.text.primary, fontSize: 18}}>
              Your referral code
            </BoldText>
          </View>
          <RegularText style={{color: Theme.text.primary, fontSize: 14}}>
            Share your referral code with your friends! They get ${university.data?.data()?.referralBonus}, and you
            get ${university.data?.data()?.referralBonus} when they place their first order.
          </RegularText>
          <TouchableOpacity
            onPress={onPress}
            style={{
              width: '100%',
              marginTop: 16,
              marginBottom: 10,
              justifyContent: 'space-between',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: Theme.button.primary,
              borderRadius: 16,
              paddingVertical: 17,
              paddingHorizontal: 24,
              borderStyle: 'dashed',
              flexDirection: 'row',
            }}>
            <BoldText style={{color: Theme.text.primary}}>
              {userData.data?.data()?.referralCode}
            </BoldText>
            <CustomIcon name="copy" color={Theme.text.primary} size={24} />
          </TouchableOpacity>
          <RegularText
            style={{
              color: Theme.text.primary,
              fontSize: 14,
            }}>
            Referrals completed: {userData.data?.data()?.referrals || 0}
          </RegularText>
        </View>
      </View>
    </View>
  );
}
