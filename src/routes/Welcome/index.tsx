import React, {useRef, useState} from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Image,
  SafeAreaView,
  InputAccessoryView,
  Linking,
  Platform,
} from 'react-native';
import {Gutter, RegularText} from '@/components';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '@/types';
import auth from '@react-native-firebase/auth';
import {Theme} from '@/constants';
import functions from '@react-native-firebase/functions';

export function Welcome({
  navigation,
}: NativeStackScreenProps<RootStackParamList>) {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const inputAccessoryViewID = 'uniqueID';

  function formatPhoneNumber(value: string) {
    if (!value) {
      return value;
    }
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) {
      return phoneNumber;
    }
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
      3,
      6,
    )}-${phoneNumber.slice(6, 10)}`;
  }

  async function handleSubmit() {
    const check_cf = functions().httpsCallable('checkPhoneNumber');
    const ph = phone
      .replace('(', '') // Remove '('
      .replace(') ', '') // Remove ') '
      .replace(/-/g, '') // Remove all '-'
      .replace(/ /g, '') // Remove any spaces
      .replace(/^/, '+1'); // Add '+1' at the beginning
    console.log(ph);
    const check = await check_cf({phone: ph});
    console.log(check);
    if (check.data === 'REJECT') {
      alert("Sorry, you can't use this phone number.");
      return;
    }
    auth()
      .signInWithPhoneNumber(`+1${phone}`)
      .then(confirmation => {
        navigation.navigate('Confirm', {confirmation});
      });
  }

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
      }}>
      <Gutter>
        <SafeAreaView>
          <View
            style={{
              marginTop: 32,
              width: '100%',
              alignItems: 'center',
              marginBottom: 128,
            }}>
            <Image
              source={require('@/assets/img/wordmark.png')}
              style={{
                width: '50%',
                height: 32,
                resizeMode: 'contain',
              }}
            />
          </View>
          <View
            style={{
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  backgroundColor: Theme.common.offWhite,
                  padding: 18,
                  borderRadius: 100,
                  alignItems: 'center',
                  marginBottom: 16,
                }}>
                <Text
                  maxFontSizeMultiplier={1}
                  style={{
                    color: Theme.text.primary,
                    fontSize: 15,
                  }}>
                  +1{' '}
                </Text>
                <TextInput
                  maxFontSizeMultiplier={1}
                  // autoCompleteType="tel"
                  placeholderTextColor={'grey'}
                  keyboardAppearance="dark"
                  placeholder={'Phone number'}
                  value={formatPhoneNumber(phone)}
                  onChangeText={setPhone}
                  style={{
                    color: Theme.text.primary,
                    fontSize: 15,
                  }}
                  inputAccessoryViewID={inputAccessoryViewID}
                  keyboardType="decimal-pad"
                  autoFocus
                />
              </View>
              <RegularText style={{color: Theme.text.primary}}>
                Enter your phone number to get your login code
              </RegularText>
            </View>
          </View>
          {Platform.OS === 'ios' ? (
            <InputAccessoryView nativeID={inputAccessoryViewID}>
              <Gutter>
                <TouchableOpacity
                  style={{
                    width: Dimensions.get('window').width - 40,
                    backgroundColor: Theme.button.primary,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 12,
                    borderRadius: 100,
                    marginBottom: 16,
                  }}
                  onPress={() => handleSubmit()}>
                  <RegularText
                    style={{
                      color: Theme.common.white,
                      fontSize: 18,
                    }}>
                    Continue
                  </RegularText>
                </TouchableOpacity>
              </Gutter>
            </InputAccessoryView>
          ) : (
            <Gutter
              style={{
                paddingTop: 20,
              }}>
              <TouchableOpacity
                style={{
                  width: Dimensions.get('window').width - 40,
                  backgroundColor: Theme.button.primary,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 12,
                  borderRadius: 100,
                  marginBottom: 16,
                }}
                onPress={() => handleSubmit()}>
                <RegularText
                  style={{
                    color: Theme.common.white,
                    fontSize: 18,
                  }}>
                  Continue
                </RegularText>
              </TouchableOpacity>
            </Gutter>
          )}
          <TouchableOpacity
            style={{
              width: '100%',
              alignItems: 'center',
              position: 'absolute',
              top: Dimensions.get('screen').height - 150,
              left: 0,
            }}
            onPress={() => {
              Linking.openURL('https://www.handledelivery.com/privacy');
            }}>
            <RegularText style={{color: Theme.text.secondary}}>
              Privacy
            </RegularText>
          </TouchableOpacity>
        </SafeAreaView>
      </Gutter>
    </View>
  );
}
