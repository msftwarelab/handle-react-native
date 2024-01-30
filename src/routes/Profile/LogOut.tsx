import {Pressable, Alert, View, StyleSheet} from 'react-native';
import {BoldText, CustomIcon} from '@/components';
import {useCallback} from 'react';
import auth from '@react-native-firebase/auth';
import {track} from '@/api';
import {Theme} from '@/constants';

/**
 * Log out and delete account components
 * @returns {JSX.Element}
 */
export default function LogOut(): JSX.Element {
  const onLogOut = useCallback(() => {
    track('logout');
    auth().signOut();
  }, []);

  const onDelete = useCallback(
    () =>
      Alert.alert('Woah!', 'Are you certain you want to delete your account?', [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () =>
            Alert.alert(
              'Your account is scheduled for deletion and may take up to 24 hrs for changes to take effect.',
              'We hope to see you again soon!',
              [
                {
                  text: 'OK',
                  onPress: onLogOut,
                },
              ],
            ),
        },
      ]),
    [onLogOut],
  );

  return (
    <>
      <View style={styles.container}>
        <Pressable onPress={onLogOut} style={styles.pressable}>
          <CustomIcon
            name="arrow_left_circle_outlined"
            color={Theme.text.secondary}
            size={24}
          />
          <BoldText style={styles.text}>Log Out</BoldText>
        </Pressable>
      </View>
      <View style={styles.container}>
        <Pressable onPress={onDelete} style={styles.pressable}>
          <CustomIcon name="delete" color={Theme.text.secondary} size={24} />
          <BoldText style={styles.text}>Delete my Account</BoldText>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    alignItems: 'center',
  },
  pressable: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginLeft: 12,
    color: Theme.text.secondary,
    fontSize: 16,
  },
});
