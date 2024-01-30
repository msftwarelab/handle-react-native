import {BoldText} from '@/components';
import {Theme} from '@/constants';
import {View} from 'moti';
import {memo} from 'react';

export const Title = memo(
  ({
    action,
    color,
    children,
  }: {
    action?: JSX.Element;
    color?: string;
    children: string | string[];
  }) => {
    return (
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 16,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: color === 'white' ? 'white' : Theme.main.secondary,
        }}>
        <BoldText
          style={{
            color: color === 'white' ? Theme.text.primary : Theme.common.white,
            fontSize: 20,
            paddingBottom: 16,
          }}>
          {children}
        </BoldText>
        {action}
      </View>
    );
  },
);
