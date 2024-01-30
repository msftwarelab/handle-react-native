import {FirebaseMessagingTypes} from '@react-native-firebase/messaging';
import {MotiView} from 'moti';
import {memo} from 'react';
import {BoldText} from './BoldText';
import {RegularText} from './RegularText';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from '@/constants';
import { StyleSheet } from 'react-native';

export const NotificationToast = memo((props: FirebaseMessagingTypes.Notification) => {
  const { title, body } = props;
  const insets = useSafeAreaInsets();

  return (
    <MotiView
      from={{translateY: -100}}
      animate={{translateY: insets.top}}
      exit={{ translateY: -100 }}
      transition={{type: 'timing', duration: 500}}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: Theme.common.white,
        padding: 20,
        marginHorizontal: 10,
        borderRadius: 20,
        shadowColor: 'black',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}>
      <BoldText style={NotificationToastStyle.notificationTitle}>{title}</BoldText>
      <RegularText style={NotificationToastStyle.notificationMessage}>{body}</RegularText>
    </MotiView>
  );
});

const NotificationToastStyle = StyleSheet.create({
  notificationTitle: {
    color: "black"
  },
  notificationMessage: {
    color: "black"
  }
})
