import { Theme } from '@/constants';
import {View} from 'react-native';
import OrderList from './OrderList';

/**
 * The past orders screen
 * @returns {JSX.Element}
 */
export function PastOrders(): JSX.Element {
  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: Theme.common.offWhite,
      }}>
      <OrderList />
    </View>
  );
}
