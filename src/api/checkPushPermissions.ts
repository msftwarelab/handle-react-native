import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid, Platform} from 'react-native';

/**
 * Request user permission to receive push notifications.
 */
export async function checkPushPermissions() {
  const hasPermission = await messaging().hasPermission();
  switch (hasPermission) {

    // If the user has already granted permission, we can proceed.
    case messaging.AuthorizationStatus.AUTHORIZED:
    case messaging.AuthorizationStatus.PROVISIONAL:
      return Promise.resolve();
    
    // If the user has not yet granted permission, we need to request it.
    case messaging.AuthorizationStatus.NOT_DETERMINED:
      if (Platform.OS === 'ios') {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        if (enabled) return Promise.resolve();
        else return Promise.reject();
      } else {
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: 'Push Notifications',
            message: 'This app would like to send you push notifications.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (result === PermissionsAndroid.RESULTS.GRANTED) {
          return Promise.resolve();
        } else {
          return Promise.reject();
        }
      }

    // If the user has denied permission, we can't proceed.
    case messaging.AuthorizationStatus.DENIED:
      return Promise.reject();
  }
}
