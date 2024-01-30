import { Theme } from '@/constants';
import {ActivityIndicator, Image, View} from 'react-native';

/**
 * Loading screen
 * @returns {JSX.Element}
 */
export function Loading(): JSX.Element {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Theme.loading.screen,
      }}>
      <View style={{height: 100}} />
      <Image
        source={require('@/assets/img/logo.png')}
        resizeMode="contain"
        style={{
          height: 100,
          marginBottom: 16,
        }}
      />
      <ActivityIndicator color={Theme.loading.primary} size="small" style={{height: 100}} />
    </View>
  );
}
