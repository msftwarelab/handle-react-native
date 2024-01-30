import {Pressable, View} from 'react-native';
import {BoldText, CustomIcon, RegularText} from '@/components';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {useNavigation} from '@/hooks';
import {Theme} from '@/constants';

/**
 * Displays an active order card
 * @param {FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>} data - The order data
 * @returns {JSX.Element}
 */
export default function ActiveOrder({
  data,
}: {
  data: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>;
}): JSX.Element {
  const navigation = useNavigation();
  const d = new Date(0);
  d.setTime(data.data()?.timestamp?.seconds * 1000);

  return (
    <View
      style={{
        backgroundColor: Theme.common.white,
        borderRadius: 16,
        marginBottom: 8,
      }}>
      <View style={{paddingTop: 24, paddingHorizontal: 24}}>
        <Pressable
          onPress={() => {
            navigation.navigate('OrderDetails', {
              orderID: data.id,
            });
          }}
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
          }}>
          <BoldText
            style={{
              color: Theme.text.primary,
              fontSize: 18,
            }}>
            Order #{data.id.substring(0, 6).toUpperCase()}
          </BoldText>
          <CustomIcon
            name="arrow_long_right"
            size={24}
            color={Theme.text.primary}
          />
        </Pressable>
        <RegularText
          style={{color: Theme.text.secondary, fontSize: 14, marginBottom: 32}}>
          {d.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </RegularText>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            alignItems: 'center',
          }}>
          <RegularText crack style={{fontSize: 14, color: Theme.text.primary}}>
            {data.data()?.products?.length} items, $
            {data.data()?.total.toFixed(2)}
          </RegularText>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View
              style={{
                height: 8,
                width: 8,
                borderRadius: 8,
                backgroundColor: Theme.main.primary,
              }}
            />
            <BoldText
              manrope
              style={{
                fontSize: 14,
                color: Theme.text.primary,
                marginLeft: 8,
              }}>
              {data.data()?.status}
            </BoldText>
          </View>
        </View>
        <ProgressBar data={data} />
      </View>
    </View>
  );
}

function ProgressBar({
  data,
}: {
  data: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>;
}) {
  function getColor(status: string) {
    switch (status) {
      case 'Packing':
        return Theme.common.orange;
      case 'Packed':
        if (
          data.data()?.status === 'Packed' ||
          data.data()?.status === 'En Route'
        ) {
          return Theme.common.orange;
        }
      case 'En Route':
        if (data.data()?.status === 'En Route') {
          return Theme.common.orange;
        }
      default:
        return Theme.text.placeholder;
    }
  }

  return (
    <View
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginVertical: 24,
      }}>
      <CustomIcon
        name="shopping_basket_outlined"
        color={getColor('Packing')}
        size={24}
      />
      <DashedLine color={getColor('Packed')} />
      <CustomIcon
        name="receipt_outlined"
        color={getColor('Packed')}
        size={24}
      />
      <DashedLine color={getColor('En Route')} />
      <CustomIcon name="bike" color={getColor('En Route')} size={24} />
      <DashedLine color={Theme.text.placeholder} />
      <CustomIcon
        name="checkmark_circle"
        color={Theme.text.secondary}
        size={24}
      />
    </View>
  );

  function DashedLine({color}: {color: string}) {
    return (
      <View
        style={{
          flex: 1,
          borderWidth: 1,
          borderStyle: 'dashed',
          borderRadius: 1,
          borderColor: color,
          marginHorizontal: 4,
        }}
      />
    );
  }
}
