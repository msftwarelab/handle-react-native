import React, {useState, useEffect, useCallback} from 'react';
import {View, SafeAreaView, StyleSheet} from 'react-native';
import {BoldText, FullScreenLoadingOverlay, RegularText} from '@/components';
import auth from '@react-native-firebase/auth';
import functions from '@react-native-firebase/functions';
import storage from '@react-native-firebase/storage';
import {Theme} from '@/constants';
import {useNavigation, useUserData} from '@/hooks';
import Upload from './Upload';

export function CheckID(): JSX.Element {
  const [uploading, setUploading] = useState<boolean>(false);
  const processID = functions().httpsCallable('processID');
  const userData = useUserData();
  const navigation = useNavigation();

  /**
   * Uploads the image to firebase storage and then calls the processID function
   * to process the image and update the user's verified status
   * @returns {void}
   */
  const upload = useCallback(
    async (blob: string) => {
      setUploading(true);
      const image = await fetch(blob).then(res => res.blob());
      await storage()
        .ref()
        .child(`ids/${auth().currentUser?.uid}.jpg`)
        .put(image);
      processID({});
      setUploading(false);
    },
    [processID],
  );

  useEffect(() => {
    if (userData.data?.data()?.verified === 'Verified') {
      navigation.goBack();
    }
  }, [userData.data, navigation]);

  return (
    <SafeAreaView style={styles.root}>
      {uploading && <FullScreenLoadingOverlay />}
      {userData.data?.data()?.verified === 'Pending' ? (
        <View style={styles.container}>
          <BoldText style={styles.title}>Thank you!</BoldText>
          <RegularText style={styles.subtitle}>
            We're uploading your ID to be processed.{'\n'}Thanks for helping us
            keep our community safe.
          </RegularText>
        </View>
      ) : (
        <Upload upload={upload} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    height: '100%',
    backgroundColor: Theme.common.offWhite,
  },
  container: {
    paddingHorizontal: 20,
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    color: Theme.text.primary,
  },
  subtitle: {
    color: Theme.text.primary,
    marginTop: 16,
    textAlign: 'center',
  },
});
