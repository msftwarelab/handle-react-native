import {BoldText} from '@/components';
import {Theme} from '@/constants';
import {StatusBar} from 'react-native';

/**
 * Header title component
 * @param {string} children - The title text
 * @returns {JSX.Element}
 */
export default function Title({
  children,
  invert,
  backgroundColor,
}: {
  children?: string;
  invert?: boolean;
  backgroundColor?: string;
}): JSX.Element {
  return (
    <>
      <StatusBar
        barStyle={invert ? 'dark-content' : 'light-content'}
        animated
        backgroundColor={
          backgroundColor
            ? backgroundColor
            : invert
            ? Theme.common.white
            : Theme.text.primary
        }
      />
      <BoldText
        style={{
          fontSize: 20,
          color: invert ? Theme.text.primary : Theme.common.white,
        }}>
        {children}
      </BoldText>
    </>
  );
}
