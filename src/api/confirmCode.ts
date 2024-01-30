import {Alert} from 'react-native';
import {track} from './track';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';

/**
 *
 * @param {string} code - The code that the user entered
 * @param {FirebaseAuthTypes.ConfirmationResult} confirm - The confirmation object
 */
export async function confirmCode(
  code: string,
  confirm: FirebaseAuthTypes.ConfirmationResult | null,
): Promise<void> {
  const result = await confirm
    ?.confirm(code)
    .then(() => {
      track('Logged in');
      return Promise.resolve();
    })
    .catch(e => {
      Alert.alert('Invalid code. Please try again');
      return Promise.reject(e);
    });
  return result;
}
