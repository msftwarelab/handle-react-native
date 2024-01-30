import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
  Platform,
} from 'react-native';
import {
  BoldText,
  FullScreenLoadingOverlay,
  Gutter,
  RegularText,
} from '@/components';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '@/types';
import {confirmCode} from '@/api';
import { Theme } from '@/constants';

/**
 * Phone number confirmation screen
 * @param navigation - navigation object
 * @param route - route object
 * @returns {JSX.Element}
 */
export function Confirm({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, 'Confirm'>): JSX.Element {
  const [loading, setLoading] = useState<boolean>(false);
  const [code, setCode] = useState<string>('');

  // Dismiss keyboard when loading
  useEffect(() => {
    if (loading) {
      Keyboard.dismiss();
    }
  }, [loading]);

  // If the code is 6 digits long, submit the code
  useEffect(() => {
    if (code && code.length === 6 && !loading) {
      handleSubmit();
    }
  }, [code]);

  /**
   * Handles the confirmation code submission
   */
  async function handleSubmit() {
    setLoading(true);
    await confirmCode(code, route.params.confirmation)
      .then(async () => {
        navigation.navigate('Loading');
        setLoading(false);
        setCode('');
      })
      .catch(() => {
        setLoading(false);
        setCode('');
      });
  }

  // Render component
  return (
    <SafeAreaView
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
      }}>
      {loading ? <FullScreenLoadingOverlay /> : <></>}
      <Gutter>
        <View
          style={{
            marginTop: 32,
            width: '100%',
            alignItems: 'center',
            marginBottom: 128,
          }}>
          <BoldText style={{fontSize: 26, color: Theme.text.primary}}>
            Enter code
          </BoldText>
          <RegularText
            style={{
              fontSize: 14,
              color: Theme.text.primary,
              textAlign: 'center',
            }}>
            Please enter the verification code{'\n'}sent to your texts
          </RegularText>
          <View style={{width: '100%'}}>
            <Gutter>
              <TextInput
                keyboardType="numeric"
                onChangeText={setCode}
                value={code}
                style={{
                  marginTop: 20,
                  borderRadius: 8,
                  color: Theme.text.primary,
                  marginHorizontal: 3,
                  width: '100%',
                  height: 40,
                  fontSize: Platform.OS === 'ios' ? 24 : 18,
                  backgroundColor: Theme.common.offWhite,
                  overflow: 'hidden',
                  textAlign: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              />
            </Gutter>
          </View>
          <View
            style={{
              width: '100%',
              justifyContent: 'center',
              marginTop: 32,
              display: 'flex',
              flexDirection: 'row',
            }}>
            <BoldText style={{fontSize: 18, color: Theme.text.primary}}>
              Didn't get the code?
            </BoldText>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Welcome');
              }}>
              <BoldText
                style={{
                  marginLeft: 8,
                  fontSize: 18,
                  color: Theme.text.primary,
                  textDecorationLine: 'underline',
                }}>
                Resend
              </BoldText>
            </TouchableOpacity>
          </View>
        </View>
      </Gutter>
    </SafeAreaView>
  );
}
