import {
  View,
  Modal,
  Dimensions,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {BoldText, CustomIcon} from '@/components';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {useUserData} from '@/hooks';
import {Theme} from '@/constants';

/**
 * Displays a modal to rate an order
 * @param {boolean} shown - Whether the modal is shown
 * @param {function} setShown - The function to set the shown state
 * @returns {JSX.Element}
 */
export default function RateOrderModal({
  shown,
  setShown,
  callback,
  data,
}: {
  shown: boolean;
  setShown: (shown: boolean) => void;
  callback?: () => void;
  data: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>;
}): JSX.Element {
  let {height, width} = Dimensions.get('screen');
  const userData = useUserData();
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  async function rateOrder() {
    if (userData.isLoading || !userData.data?.data()?.school) {
      return Promise.resolve(false);
    }
    return firestore()
      .doc(`universities/${userData.data?.data()?.school}/orders/${data.id}`)
      .update({
        rating: rating,
      });
  }

  function closeModal() {
    if (!loading) {
      setRating(0);
      setShown(false);
    }
  }

  function submitRating() {
    if (!loading && rating > 0) {
      setLoading(true);
      rateOrder().then(res => {
        if (res) {
          setLoading(false);
          callback && callback();
          closeModal();
        } else {
          Alert.alert('Sorry, something went wrong.');
          setLoading(false);
        }
      });
    }
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={shown}
      onRequestClose={() => {
        setShown(false);
      }}>
      <View
        style={{
          backgroundColor: Theme.main.primary,
          height: height,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            backgroundColor: Theme.common.white,
            borderRadius: 16,
            width: width - 40,
            padding: 16,
          }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              width: '100%',
            }}>
            <Pressable onPress={closeModal}>
              <CustomIcon name="clear" color={Theme.text.primary} size={24} />
            </Pressable>
          </View>
          <View
            style={{
              marginTop: 8,
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <BoldText
              style={{
                color: Theme.text.primary,
                fontSize: 26,
              }}>
              Rate your order
            </BoldText>
          </View>
          <View
            style={{
              backgroundColor: Theme.separator.gray,
              height: 1,
              marginVertical: 16,
              width: '100%',
            }}
          />
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
            }}>
            <Star index={1} rating={rating} setRating={setRating} />
            <Star index={2} rating={rating} setRating={setRating} />
            <Star index={3} rating={rating} setRating={setRating} />
            <Star index={4} rating={rating} setRating={setRating} />
            <Star index={5} rating={rating} setRating={setRating} />
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 32,
            }}>
            <Pressable
              onPress={closeModal}
              style={{
                width: '48%',
                borderColor: Theme.text.primary,
                height: 48,
                borderRadius: 100,
                borderWidth: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <BoldText style={{fontSize: 16, color: Theme.text.primary}}>
                Later
              </BoldText>
            </Pressable>
            <Pressable
              onPress={submitRating}
              style={[
                {
                  width: '48%',
                  backgroundColor: Theme.text.primary,
                  height: 48,
                  borderRadius: 100,
                  borderWidth: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                },
                rating > 0 ? {opacity: 1} : {opacity: 0.2},
              ]}>
              {loading ? (
                <ActivityIndicator color={Theme.common.white} size={16} />
              ) : (
                <BoldText style={{fontSize: 16, color: Theme.common.white}}>
                  Rate
                </BoldText>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function Star({
  index,
  rating,
  setRating,
}: {
  index: number;
  rating: number;
  setRating: (rating: number) => void;
}): JSX.Element {
  return (
    <Pressable
      onPress={() => {
        setRating(index);
      }}>
      <CustomIcon
        name="star"
        color={rating >= index ? Theme.common.orange : Theme.text.placeholder}
        size={45}
      />
    </Pressable>
  );
}
