import React, {useState, memo} from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import {BoldText} from '@/components';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {track} from '@/api';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faPaperPlane} from '@fortawesome/free-solid-svg-icons/faPaperPlane';
import { Theme } from '@/constants';
import { useHeaderHeight } from '@react-navigation/elements';

/**
 * Displays a box of product suggestions
 * @returns {JSX.Element}
 */
export const SuggestionBox = memo(function SuggestionBox(): JSX.Element {
  const [val, setVal] = useState('');
  const [loading, setLoading] = useState(false);

  function sendRequest() {
    setLoading(true);
    let _val = val;
    let time = new Date();
    setVal('');
    firestore()
      .collection('data')
      .doc('product_requests')
      .collection('data')
      .add({
        user: auth().currentUser?.uid,
        request: _val,
        timestamp: time,
      })
      .then(() => {
        alert('Request sent!');
        setLoading(false);
      })
      .catch(() => {
        alert(
          "Sorry! We weren't able to process that request. Please try again later or contact support.",
        );
        setLoading(false);
      });
  }

  const height = useHeaderHeight();

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={height + 47}
      behavior="position"
    >
      <View
        style={{
          width: '100%',
          padding: 16,
          marginTop: 16,
          marginBottom: 100,
          borderRadius: 16,
          borderColor: 'black',
          borderWidth: 4,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View
          style={{
            flex: 1,
          }}>
          <BoldText
            style={{
              fontSize: 12,
            }}>
            MISSING SOMETHING YOU WANT?
          </BoldText>
          <TextInput
            style={{
              fontSize: 18,
            }}
            placeholderTextColor={Theme.text.placeholder}
            placeholder="I wish you guys carried..."
            value={val}
            onChangeText={(text) => setVal(text)}
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            track('Submit product request');
            sendRequest();
          }}>
          {loading ? (
            <ActivityIndicator size="small" color="black" />
          ) : (
            <FontAwesomeIcon
              icon={faPaperPlane}
              size={24}
              color={val !== '' ? Theme.text.primary : Theme.text.placeholder}
            />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
});
