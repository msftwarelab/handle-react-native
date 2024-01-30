import {View} from 'react-native';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {BoldText, RegularText} from '@/components';
import {Theme} from '@/constants';

export default function Prices({
  data,
}: {
  data: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>;
}): JSX.Element {
  const subtotal = data
    .data()
    ?.products.reduce(
      (acc: number, product: {price: number; quantity: number}) =>
        acc + product.price * product.quantity,
      0,
    );

  const tax =
    data.data()?.total -
    (subtotal +
      data.data()?.tip -
      (data.data()?.discountAmount ? data.data()?.discountAmount : 0) -
      data.data()?.storeCreditUsed);

  return (
    <View style={{marginTop: 32}}>
      <LineItem title="Subtotal" value={'$' + subtotal.toFixed(2)} />
      {data.data()?.discountAmount ? (
        <LineItem
          title="Discount"
          value={'-$' + data.data()?.discountAmount?.toFixed(2)}
        />
      ) : (
        <></>
      )}
      {data.data()?.storeCreditUsed ? (
        <LineItem
          title="Store Credit"
          value={'-$' + data.data()?.storeCreditUsed?.toFixed(2)}
        />
      ) : (
        <></>
      )}

      <LineItem title="Tip" value={'$' + data.data()?.tip?.toFixed(2)} />
      <LineItem title="Taxes & Fees" value={'$' + tax.toFixed(2)} />
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <BoldText
          style={{
            fontSize: 18,
            color: Theme.text.primary,
          }}>
          Total
        </BoldText>
        <BoldText
          style={{
            fontSize: 18,
            color: Theme.text.primary,
          }}>
          ${data.data()?.total.toFixed(2)}
        </BoldText>
      </View>
      <View
        style={{
          marginVertical: 10,
          width: '100%',
          height: 1,
          borderStyle: 'dashed',
          borderWidth: 0.5,
          borderColor: Theme.common.gray,
        }}
      />
    </View>
  );
}

function LineItem({title, value}: {title: string; value: string}) {
  return (
    <View style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <RegularText
          crack
          style={{
            fontSize: 16,
            color: Theme.text.primary,
          }}>
          {title}
        </RegularText>
        <BoldText
          style={{
            fontSize: 16,
            color: Theme.text.primary,
          }}>
          {value}
        </BoldText>
      </View>
      <View
        style={{
          marginVertical: 10,
          width: '100%',
          height: 1,
          borderStyle: 'dashed',
          borderWidth: 0.5,
          borderColor: Theme.common.gray,
        }}
      />
    </View>
  );
}
