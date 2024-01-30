import {View, TextInput, ActivityIndicator} from 'react-native';
import {useState} from 'react';
import Subheader from './Subheader';
import functions from '@react-native-firebase/functions';
import {CustomIcon} from '@/components';
import {Theme} from '@/constants';

/**
 * Discount component
 * @returns {JSX.Element}
 */
export default function Discount({
  setDiscountData,
}: {
  setDiscountData: (discount: string) => void;
}): JSX.Element {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const checkDiscountCode = functions().httpsCallable('checkDiscountCode');
  const redeemReferralCode = functions().httpsCallable('redeemReferralCode');

  async function checkCode() {
    setLoading(true);
    let res1 = await checkDiscountCode({code: text.toUpperCase()});
    if (res1.data.success) {
      setDiscountData(text);
      setLoading(false);
    } else {
      if (
        res1.data.message ===
        'That discount code is for first time customers only.'
      ) {
        alert('That discount code is for first time customers only.');
        setLoading(false);
        return;
      }
      let res2 = await redeemReferralCode({code: text});
      if (
        res2.data.status !== 'Code not found.' &&
        res2.data.status !== 'SUCCESS'
      ) {
        alert(res2.data.status);
      }
      if (res2.data.status === 'SUCCESS') {
        alert(
          'Referral code claimed. Store credit has been applied to your account.',
        );
      }
      if (res2.data.status === 'Code not found.') {
        alert(
          "Sorry, we couldn't find any referral or discount codes matching " +
            text +
            '.',
        );
        setLoading(false);
      }
    }
  }

  return (
    <View style={{marginTop: 40}}>
      <Subheader>Discount & referral code</Subheader>
      <View
        style={{
          height: 56,
          borderRadius: 56,
          width: '100%',
          backgroundColor: Theme.common.offWhite,
          borderStyle: 'dashed',
          borderColor: Theme.text.secondary,
          borderWidth: 1,
          marginTop: 16,
          alignItems: 'center',
          paddingLeft: 16,
          display: 'flex',
          flexDirection: 'row',
        }}>
        {!loading ? (
          <CustomIcon
            name="label_outlined"
            color={Theme.text.primary}
            size={24}
          />
        ) : (
          <ActivityIndicator size="small" color={Theme.loading.primary} />
        )}
        <TextInput
          style={{
            marginLeft: 12,
            color: Theme.text.primary,
            flex: 1,
            height: 24,
          }}
          onChangeText={setText}
          value={text}
          placeholder="Enter Code"
          placeholderTextColor={Theme.text.primary}
          keyboardType="web-search"
          onSubmitEditing={checkCode}
          autoCapitalize={'none'}
        />
      </View>
    </View>
  );
}
