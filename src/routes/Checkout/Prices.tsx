import {View} from 'react-native';
import {BoldText, LoadingRect, RegularText} from '@/components';
import { Theme } from '@/constants';

export default function Prices({prices, tip}: {prices: any; tip: number}) {
  return prices ? (
    <View style={{marginTop: 32}}>
      <LineItem
        title="Subtotal"
        value={
          '$' +
          (prices.subtotal + prices.storeCredit + prices.discount).toFixed(2)
        }
      />
      {prices.discount ? (
        <LineItem
          neg
          title="Discount"
          value={'-$' + prices.discount.toFixed(2)}
        />
      ) : (
        <></>
      )}
      {prices.storeCredit ? (
        <LineItem
          neg
          title="Store Credit"
          value={'-$' + prices.storeCredit.toFixed(2)}
        />
      ) : (
        <></>
      )}

      <LineItem title="Tip" value={'$' + tip.toFixed(2)} />
      <LineItem
        title="Delivery Fee"
        value={'$' + prices.deliveryFee?.toFixed(2)}
      />
      <LineItem title="Taxes" value={'$' + prices.tax.toFixed(2)} />
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
          ${(prices.total + tip).toFixed(2)}
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
  ) : (
    <View style={{marginVertical: 16}}>
      <LoadingRect style={{width: '100%', height: 20}} />
      <LoadingRect style={{width: '100%', height: 20, marginTop: 8}} />
      <LoadingRect style={{width: '100%', height: 20, marginTop: 8}} />
      <LoadingRect style={{width: '100%', height: 20, marginTop: 8}} />
      <LoadingRect style={{width: '100%', height: 40, marginTop: 8}} />
    </View>
  );
}

function LineItem({
  title,
  value,
  neg,
}: {
  title: string;
  value: string;
  neg?: boolean;
}) {
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
          style={[
            {
              fontSize: 16,
            },
            neg ? {color: Theme.common.orange} : {color: Theme.text.primary},
          ]}>
          {title}
        </RegularText>
        <BoldText
          style={[
            {
              fontSize: 16,
            },
            neg ? {color: Theme.common.orange} : {color: Theme.text.primary},
          ]}>
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
