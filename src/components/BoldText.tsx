import {ReactNode} from 'react';
import {Platform, Text, TextProps} from 'react-native';

export function BoldText({
  children,
  manrope,
  ...props
}: {
  children: ReactNode;
  manrope?: boolean;
} & TextProps) {
  return (
    <Text
      {...props}
      maxFontSizeMultiplier={1}
      style={[
        props.style,
        {
          fontFamily:
            Platform.OS === 'ios'
              ? manrope
                ? 'Manrope-Bold'
                : 'CrackGrotesk-Medium'
              : manrope
              ? 'Manrope-Bold'
              : 'Crack-Grotesk-Medium',
        },
      ]}>
      {children}
    </Text>
  );
}
