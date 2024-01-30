import {BoldText, RegularText} from '@/components';
import {Theme} from '@/constants';
import {memo} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

export default memo(function Upload({
  upload,
}: {
  upload: (blob: string) => void;
}) {
  const pickImage = async (type: string) => {
    if (type === 'Library') {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 1,
      });

      if (
        !result.didCancel &&
        result.assets &&
        result.assets.length > 0 &&
        result.assets[0].uri
      ) {
        upload(result.assets[0].uri);
      }
    } else {
      const result = await launchCamera({
        mediaType: 'photo',
        quality: 1,
      });

      if (
        !result.didCancel &&
        result.assets &&
        result.assets.length > 0 &&
        result.assets[0].uri
      ) {
        upload(result.assets[0].uri);
      }
    }
  };

  return (
    <View style={styles.root}>
      <Image
        source={require('@/assets/img/exampleID.png')}
        style={styles.image}
      />
      <BoldText style={styles.title}>
        Please snap a pic of your driver's license or passport before purchasing
        age restricted items
      </BoldText>
      <RegularText crack style={styles.subtitle}>
        Before uploading the picture, please make sure the photo of driving
        license is clearly visible and not pixelated
      </RegularText>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            pickImage('Camera');
          }}
          style={styles.cameraButton}>
          <BoldText style={styles.cameraButtonText}>Take Picture</BoldText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            pickImage('Library');
          }}
          style={styles.uploadButton}>
          <BoldText style={styles.uploadButtonText}>
            Upload from Library
          </BoldText>
        </TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    paddingHorizontal: 20,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    height: '100%',
  },
  image: {
    width: 188,
    height: 258,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    color: Theme.text.primary,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    textAlign: 'center',
    color: Theme.text.secondary,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  cameraButton: {
    width: '100%',
    height: 56,
    borderRadius: 100,
    backgroundColor: Theme.button.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  cameraButtonText: {
    fontSize: 16,
    color: Theme.common.white,
  },
  uploadButton: {
    marginTop: 16,
    padding: 12,
  },
  uploadButtonText: {
    textAlign: 'center',
    color: Theme.text.primary,
    textDecorationLine: 'underline',
  },
});
