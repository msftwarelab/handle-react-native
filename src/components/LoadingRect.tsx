import {memo} from 'react';
import {MotiView} from 'moti';
import {ViewProps} from 'react-native';
import { Theme } from '@/constants';

export function LoadingRect(props: ViewProps) {
  function Component() {
    return (
      <MotiView
        from={{opacity: 0.25}}
        animate={{opacity: 1}}
        transition={{
          type: 'timing',
          duration: 1000,
          loop: true,
        }}
        style={[props.style, {backgroundColor: Theme.main.placeholder, borderRadius: 16}]}
      />
    );
  }

  const WrappedRect = memo(Component);
  return <WrappedRect />;
}
