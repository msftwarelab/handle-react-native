import React from 'react';
import {Text, View, Dimensions, ViewProps} from 'react-native';

export function Gutter({
  children,
  ...props
}: {
  children: React.ReactNode;
} & ViewProps) {
  return (
    <View
      style={[
        {
          paddingHorizontal: 20,
          // width: Dimensions.get('window').width - 40,
        },
        props.style,
      ]}
      {...props}>
      {children}
    </View>
  );
}
