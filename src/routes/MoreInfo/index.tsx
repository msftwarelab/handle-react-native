import {BoldText, FullScreenLoadingOverlay, RegularText} from '@/components';
import {GradYearPicker, UniversityPicker} from '@/components/onboarding';
import {ReferralSource} from '@/components/onboarding/ReferralSource';
import {RootStackParamList} from '@/types';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Formik} from 'formik';
import {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Image,
  Keyboard,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {useMutation} from '@tanstack/react-query';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {Theme} from '@/constants';

/**
 * User data onboarding screen
 * @param navigation - navigation object
 * @returns {JSX.Element}
 */
export function MoreInfo({
  navigation,
}: NativeStackScreenProps<RootStackParamList>): JSX.Element {
  const [loading, setLoading] = useState<boolean>(false);
  const inputAccessoryViewID = 'uniqueID';
  type FormValues = {
    displayName: string;
    school: string;
    gradYear: string;
    signupSource: string;
  };
  const mutation = useMutation(
    (values: FormValues) => {
      return firestore()
        .doc(`users/${auth().currentUser?.uid}`)
        .set(values, {merge: true});
    },
    {
      onSuccess: () => {
        setLoading(false);
        navigation.navigate('Tabs');
      },
      onError: error => {
        setLoading(false);
      },
    },
  );

  return (
    <Formik
      initialValues={{} as FormValues}
      onSubmit={async values => {
        setLoading(true);
        Keyboard.dismiss();
        mutation.mutate(values);
      }}
      validate={values => {
        const errors: any = {};
        if (!values.displayName) {
          errors.displayName = 'Required';
        }
        if (!values.school) {
          errors.school = 'Required';
        }
        if (!values.gradYear) {
          errors.gradYear = 'Required';
        }
        if (!values.signupSource) {
          errors.referral = 'Required';
        }
        return errors;
      }}>
      {({handleChange, handleBlur, handleSubmit, values, setFieldValue}) => (
        <View
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'white',
            paddingHorizontal: 20,
          }}>
          {loading ? <FullScreenLoadingOverlay /> : <></>}
          <SafeAreaView>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  marginTop: 32,
                  width: '100%',
                  alignItems: 'center',
                  marginBottom: 32,
                }}>
                <Image
                  source={require('@/assets/img/wordmark.png')}
                  style={{
                    width: '50%',
                    height: 32,
                    resizeMode: 'contain',
                  }}
                />
                <BoldText
                  style={{
                    color: Theme.text.primary,
                    textAlign: 'center',
                    marginTop: 32,
                    fontSize: 20,
                  }}>
                  Hey there!{'\n'}Welcome to {Theme.name}!
                </BoldText>
              </View>
              <View
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  backgroundColor: Theme.common.offWhite,
                  padding: 18,
                  borderRadius: 100,
                  alignItems: 'center',
                  marginBottom: 8,
                }}>
                <TextInput
                  // autoCompleteType="name"
                  // placeholderTextColor={'grey'}
                  keyboardAppearance="dark"
                  placeholderTextColor={Theme.text.placeholder}
                  placeholder={'Full name'}
                  value={values.displayName}
                  onChangeText={handleChange('displayName')}
                  onBlur={handleBlur('displayName')}
                  style={{
                    color: Theme.text.primary,
                    fontSize: 15,
                    width: '100%',
                  }}
                  inputAccessoryViewID={inputAccessoryViewID}
                  autoFocus
                />
              </View>
              <UniversityPicker
                school={values.school}
                setSchool={handleChange('school')}
                onBlur={handleBlur('school')}
              />
              <GradYearPicker
                gradYear={values.gradYear}
                setGradYear={val => setFieldValue('gradYear', val)}
                onBlur={handleBlur('gradYear')}
              />
              <ReferralSource
                referral={values.signupSource}
                setReferral={handleChange('signupSource')}
                onBlur={handleBlur('signupSource')}
              />
              <TouchableOpacity
                style={{
                  width: Dimensions.get('window').width - 40,
                  backgroundColor: Theme.text.primary,
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
                    color: 'white',
                    fontSize: 18,
                  }}>
                  Continue
                </RegularText>
              </TouchableOpacity>
              <View style={{height: 500}} />
            </ScrollView>
          </SafeAreaView>
        </View>
      )}
    </Formik>
  );
}
