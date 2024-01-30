/* eslint-disable react-native/no-inline-styles */
import {AnimatePresence, MotiView} from 'moti';
import {ReactNode, memo} from 'react';
import {BoldText} from './BoldText';
import {RegularText} from './RegularText';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {View} from 'react-native';
import {Theme} from '@/constants';

export const Toast = memo(
  ({
    title,
    body,
    visible,
    type,
    offset,
  }: {
    title: string | undefined;
    body: string | ReactNode | undefined;
    visible: boolean;
      type?: 'error' | 'success' | 'info' | 'credit-info';
      offset?: number;
  }) => {
    const insets = useSafeAreaInsets();
    const foreground = type === 'error' || type === 'credit-info' ? 'white' : 'black';
    const background =
      type === 'error' ? Theme.main.error : type === 'success' ? Theme.main.success : type === 'credit-info' ? Theme.main.info : Theme.main.info;

    return (
      <View
        style={{
          position: 'absolute',
          bottom: type === 'credit-info' || !visible ? 0 : insets.bottom + 20 + (offset || 0),
          left: 0,
          right: 0,
          zIndex: 100
        }}>
        <AnimatePresence>
            {visible && (type === 'credit-info' ? 
            (
              <MotiView
                from = {{
                    opacity: 0
                }}
                animate = {{
                    opacity: 1
                }}
                exit = {{
                    opacity: 0
                }}

                transition = {{
                    type: 'timing',
                    duration: 1000
                }}
                exitTransition={{
                    type: 'timing',
                    duration: 1000
                }}

                style={{
                    position: 'absolute',
                    height: 40,
                    width: '80%',
                    borderRadius: 17,
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2,
                    bottom: insets.bottom + 20 + (offset || 0),
                    alignSelf: 'center',
                    paddingHorizontal: 10,
                    backgroundColor: Theme.other.storeCreditModal
                }}
              >
                <RegularText style={{color: 'white'}} crack> {body} </RegularText>
              </MotiView>
            )
            : 
            (
              <MotiView
                from={{translateY: 100 + (offset || 0)}}
                animate={{translateY: -100}}
                exit={{translateY: 100 + (offset || 0)}}
                transition={{type: 'timing', duration: 500}}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  padding: 20,
                  marginHorizontal: 10,
                  borderRadius: 20,
                  backgroundColor: background,
                  shadowColor: 'black',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}>
                <BoldText
                  style={{
                    color: foreground,
                  }}>
                  {title}
                </BoldText>
                <RegularText
                  style={{
                    color: foreground,
                  }}>
                  {body}
                </RegularText>
              </MotiView>
            ))}
        </AnimatePresence>
      </View>
    );
  },
);
