import {View, Text, Pressable} from 'react-native';
import React, {useEffect, useState} from 'react';
import WebView from 'react-native-webview';
import firestore from '@react-native-firebase/firestore';
import {BoldText} from '@/components';
import {useNavigation} from '@react-navigation/native';

export const SupportWebview = () => {
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    firestore()
      .collection('global_data')
      .doc('global_data')
      .get()
      .then(doc => {
        if (doc.exists) {
          setUrl(doc.data()?.SUPPORT_URL);
          setLoading(false);
        }
      });
  }, []);

  return (
    <>
      {loading ? (
        <View>
          <Text>loading...</Text>
        </View>
      ) : (
        <>
          <Pressable
            onPress={() => {
              navigation.goBack();
            }}
            style={{
              position: 'absolute',
              top: 64,
              left: 16,
              backgroundColor: '#1b1558',
              borderRadius: 16,
              padding: 10,
              zIndex: 100,
            }}>
            <BoldText style={{color: 'white'}}>Close</BoldText>
          </Pressable>
          <WebView
            style={{width: '100%', height: '100%', paddingBottom: 32}}
            source={{
              uri: url,
            }}></WebView>
        </>
      )}
    </>
  );
};

export default SupportWebview;
