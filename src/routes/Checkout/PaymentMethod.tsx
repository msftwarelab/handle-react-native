import {Pressable, View} from 'react-native';
import Subheader from './Subheader';
import {RegularText} from '@/components';
import {useUniversity} from '@/hooks/useUniversity';
import { Theme } from '@/constants';

export default function PaymentMethod({
  paymentMethod,
  setPaymentMethod,
  poppayDiscount,
}: {
  paymentMethod: string;
  setPaymentMethod: (value: string) => void;
  poppayDiscount: number | null;
}) {
  const schoolData = useUniversity();

  return (
    <View style={{marginTop: 40}}>
      <Subheader>Payment method</Subheader>
      <View style={{marginTop: 12, width: '100%'}}>
        <PaymentOption name="Credit Card or Apple Pay" value="CC" />
        {schoolData.data?.data()?.popIDEnabled ? (
          <View style={{marginTop: 8}}>
            <PaymentOption name="PopPay" value="PP" />
          </View>
        ) : (
          <></>
        )}
      </View>
    </View>
  );

  function PaymentOption({name, value}: {name: string; value: string}) {
    return (
      <>
        <Pressable
          onPress={() => {
            setPaymentMethod(value);
          }}
          style={{
            padding: 16,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            borderRadius: 100,
            backgroundColor: Theme.common.offWhite,
          }}>
          <View
            style={{
              height: 20,
              width: 20,
              borderRadius: 24,
              borderWidth: 1,
              borderColor: Theme.main.primary,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {paymentMethod === value ? (
              <View
                style={{
                  backgroundColor: Theme.main.primary,
                  height: 15,
                  width: 15,
                  borderRadius: 15,
                }}
              />
            ) : (
              <></>
            )}
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              paddingRight: 16,
            }}>
            <RegularText
              crack
              style={{
                marginLeft: 12,
                color: Theme.text.primary,
                fontSize: 16,
              }}>
              {name}
            </RegularText>
            {name === 'PopPay' && poppayDiscount ? (
              <View
                style={{
                  backgroundColor: Theme.common.orange,
                  padding: 6,
                  borderRadius: 100,
                }}>
                <RegularText crack style={{color: Theme.text.primary, fontSize: 10}}>
                  Save ${poppayDiscount}
                </RegularText>
              </View>
            ) : (
              <></>
            )}
          </View>
        </Pressable>
        {name === 'PopPay' && poppayDiscount ? (
          <RegularText style={{color: 'grey', fontSize: 8}}>
            PopPay Discounts valid once per user per 24hrs.
          </RegularText>
        ) : (
          <></>
        )}
      </>
    );
  }
}
