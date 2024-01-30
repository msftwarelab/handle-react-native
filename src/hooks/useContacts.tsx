import {useEffect, useState} from 'react';
import Contacts from 'react-native-contacts';
import functions from '@react-native-firebase/functions';
import {Alert} from 'react-native';

export function useContacts() {
  const processContacts = functions().httpsCallable('processContacts');

  useEffect(() => {
    presentQuestion();
  }, []);

  async function presentQuestion() {
    let authorization = await Contacts.checkPermission();
    if (authorization === 'undefined') {
      Alert.alert(
        'Can we make your experience better?',
        'Handle uses your contacts to build a taste profile from you and your friends, and to find friends you can invite to Handle!',
        [
          {
            text: 'No :(',
            onPress: () => console.log('Cancel Pressed'),
          },
          {
            text: 'Yes 🫶',
            onPress: () => requestPermissions(),
            style: 'cancel',
          },
        ],
      );
    } else if (authorization === 'authorized') {
      syncContacts();
    }
  }

  async function requestPermissions() {
    let result = await Contacts.requestPermission();
    if (result === 'authorized') {
      syncContacts();
    } else {
      console.log('DENIED');
    }
  }

  async function syncContacts() {
    Contacts.getAllWithoutPhotos().then(contacts => {
      let numbers: string[] = [];
      contacts.forEach(contact => {
        contact.phoneNumbers.forEach(phoneNumber => {
          numbers.push(phoneNumber.number);
        });
      });
      processContacts({numbers: numbers});
    });
  }
}
