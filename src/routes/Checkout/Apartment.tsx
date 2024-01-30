import {View, TextInput, ActivityIndicator, Alert} from 'react-native';
import {CustomIcon} from '@/components';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Subheader from './Subheader';
import {useUserData} from '@/hooks';
import {useEffect, useState} from 'react';
import { Theme } from '@/constants';

/**
 * Apartment component
 * @returns {JSX.Element}
 */
export default function Apartment(): JSX.Element {
  const userData = useUserData();
  const [apartment, setApartment] = useState(userData.data?.data()?.apartment);
  const [instructions, setInstructions] = useState(
    userData.data?.data()?.instructions,
  );
  const [loadingApartment, setLoadingApartment] = useState(false);
  const [loadingInstructions, setLoadingInstructions] = useState(false);

  // Update apartment state when userData changes
  useEffect(() => {
    setApartment(userData.data?.data()?.apartment);
  }, [userData.data?.data()?.apartment]);

  // Update instructions state when userData changes
  useEffect(() => {
    setInstructions(userData.data?.data()?.instructions);
  }, [userData.data?.data()?.instructions]);

  /**
   * Saves apartment to Firestore
   */
  async function saveApartment(): Promise<void> {
    setLoadingApartment(true);
    await firestore()
      .collection('users')
      .doc(auth().currentUser?.uid)
      .update({
        apartment: apartment,
      })
      .catch(() => {
        Alert.alert('Error', 'There was an error saving your apartment.');
      });
    setLoadingApartment(false);
  }

  /**
   * Saves delivery instructions to Firestore
   */
  async function saveInstructions(): Promise<void> {
    setLoadingInstructions(true);
    firestore()
      .collection('users')
      .doc(auth().currentUser?.uid)
      .update({
        instructions: instructions,
      })
      .catch(() => {
        Alert.alert('Error', 'There was an error saving your instructions.');
      });
    setLoadingInstructions(false);
  }

  return (
    <View>
      <View style={{marginTop: 40}}>
        <Subheader>Apt # or Building</Subheader>
        <View
          style={{
            marginTop: 12,
            padding: 16,
            borderRadius: 32,
            width: '100%',
            backgroundColor: Theme.common.offWhite,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TextInput
            placeholder="Apartment 123"
            style={{flex: 1, color: Theme.text.primary}}
            value={apartment}
            onChangeText={setApartment}
            onEndEditing={saveApartment}
            keyboardType="web-search"
          />
          {loadingApartment ? (
            <ActivityIndicator color={Theme.loading.primary} size="small" />
          ) : (
            <CustomIcon name="edit" color={Theme.text.primary} size={18} />
          )}
        </View>
      </View>
      <View style={{marginTop: 40}}>
        <Subheader>Delivery Instructions</Subheader>
        <View
          style={{
            marginTop: 12,
            padding: 16,
            borderRadius: 32,
            width: '100%',
            backgroundColor: Theme.common.offWhite,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TextInput
            placeholder="Please ring the doorbell"
            style={{flex: 1, color: Theme.text.primary}}
            value={instructions}
            onChangeText={setInstructions}
            onEndEditing={saveInstructions}
            keyboardType="web-search"
          />
          {loadingInstructions ? (
            <ActivityIndicator color={Theme.loading.primary} size="small" />
          ) : (
            <CustomIcon name="edit" color={Theme.text.primary} size={18} />
          )}
        </View>
      </View>
    </View>
  );
}
