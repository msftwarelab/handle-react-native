import {ActivityIndicator, Dimensions, Text, View} from 'react-native';
import {MotiView} from 'moti';
import { Theme } from '@/constants';

export function FullScreenLoadingOverlay() {
  const {width, height} = Dimensions.get('screen');
  return (
    <MotiView
      from={{opacity: 0.25}}
      animate={{opacity: 1}}
      transition={{
        type: 'timing',
        duration: 250,
      }}
      style={{
        position: 'absolute',
        width: width,
        height: height,
        top: 0,
        left: 0,
        backgroundColor: Theme.main.primary + '66',
        zIndex: 10,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <ActivityIndicator size="large" color={Theme.loading.primary} />
    </MotiView>
  );
}
