import {Platform, Text, TextProps} from 'react-native';

export function RegularText({
  children,
  crack,
  ...props
}: {
  children: React.ReactNode;
  crack?: boolean;
} & TextProps) {
  return (
    <Text
      {...props}
      style={[
        {
          fontFamily:
            Platform.OS === 'ios'
              ? crack
                ? 'CrackGrotesk-Regular'
                : 'Manrope-Regular'
              : crack
              ? 'Crack-Grotesk'
              : 'Manrope-Regular',
        },
        props.style,
      ]}>
      {children}
    </Text>
  );
}
