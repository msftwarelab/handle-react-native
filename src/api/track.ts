import functions from '@react-native-firebase/functions';

export function track(event: any, params?: any) {
  const mixpanel = functions().httpsCallable('mixpanel');
  mixpanel({event, params: params || {}});
}
