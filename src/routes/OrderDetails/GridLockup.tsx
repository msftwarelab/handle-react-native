import {View, TouchableOpacity, Linking} from 'react-native';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {BoldText, CustomIcon, RegularText} from '@/components';
import {useQuery} from '@tanstack/react-query';
import {QueryKey, Theme} from '@/constants';
import firestore from '@react-native-firebase/firestore';

/**
 * Displays order details
 * @param {FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>} data - The order data
 * @returns {JSX.Element}
 */
export default function GridLockup({
  data,
}: {
  data: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>;
}): JSX.Element {
  const d = data.data()?.timestamp.toDate();
  const courier = useQuery(
    [QueryKey.USERDATA, data.data()?.courier],
    () => firestore().collection('users').doc(data.data()?.courier).get(),
    {
      enabled: !!data.data()?.courier,
    },
  );

  return (
    <View style={{width: '100%', display: 'flex', flexDirection: 'column'}}>
      {data.data()?.courierName ? (
        <>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
            }}>
            <View>
              <BoldText
                manrope
                style={{color: Theme.text.primary, fontSize: 14}}>
                {data.data()?.courierName}
              </BoldText>
              <RegularText
                style={{
                  fontSize: 12,
                  color: Theme.text.primary,
                  opacity: 0.5,
                }}>
                Courier
              </RegularText>
            </View>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(`sms:${courier.data?.data()?.phone}`);
              }}
              style={{
                backgroundColor: Theme.common.orange,
                height: 40,
                width: 40,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 40,
              }}>
              <CustomIcon name="message" size={12} color="white" />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <></>
      )}
      <Rect header={`Order is ${data.data()?.status}`} icon="poi_outlined">
        <RegularText style={{color: Theme.common.gray, fontSize: 12}}>
          {data.data()?.address}
        </RegularText>
      </Rect>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          maxWidth: '100%',
          marginTop: 8,
        }}>
        <Rect header="Time" icon="time" style={{flex: 1, marginRight: 8}}>
          <RegularText style={{color: Theme.common.gray, fontSize: 12}}>
            {d.toLocaleDateString()}{' '}
            {d.toLocaleTimeString('en-US', {timeStyle: 'short'})}
          </RegularText>
        </Rect>
        <Rect header="Total" style={{flex: 1}} icon="credit_cards">
          <RegularText style={{color: Theme.text.secondary, fontSize: 12}}>
            {data.data()?.products?.length} item
            {data.data()?.products?.length > 1 ? 's' : ''}: $
            {data.data()?.total.toFixed(2)}
          </RegularText>
        </Rect>
      </View>
    </View>
  );
}

function Rect({
  children,
  style,
  header,
  icon,
}: {
  children: any;
  style?: any;
  header: string;
  icon: string;
}) {
  return (
    <View
      style={[
        {
          display: 'flex',
          flexDirection: 'column',
          padding: 16,
          backgroundColor: Theme.common.offWhite,
          borderRadius: 16,
        },
        style,
      ]}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}>
        <RegularText crack style={{color: Theme.text.primary, fontSize: 16}}>
          {header}
        </RegularText>
        <CustomIcon name={icon} color={Theme.text.primary} size={16} />
      </View>

      {children}
    </View>
  );
}
