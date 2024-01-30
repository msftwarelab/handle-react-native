import {View, Pressable} from 'react-native';
import {useCallback} from 'react';
import {BoldText, LoadingRect, RegularText} from '@/components';
import {useNavigation, useUserData} from '@/hooks';
import {Theme} from '@/constants';

export default function CheckID(): JSX.Element {
  const userData = useUserData();
  const navigation = useNavigation();
  const onPress = useCallback(() => navigation.navigate('CheckID'), []);

  return userData.isLoading ? (
    <LoadingRect
      style={{
        marginTop: 24,
        marginHorizontal: 20,
        borderRadius: 16,
        padding: 16,
      }}
    />
  ) : (
    <View
      style={{
        marginTop: 24,
        marginHorizontal: 20,
        backgroundColor: Theme.common.offWhiteWarm,
        borderRadius: 16,
        padding: 16,
      }}>
      <View
        style={{
          flexDirection: 'row',
          display: 'flex',
        }}>
        <View style={{marginRight: 20, flex: 1}}>
          <BoldText style={{color: Theme.text.primary, fontSize: 18}}>
            Check ID
          </BoldText>
          <RegularText style={{color: Theme.text.primary, fontSize: 14}}>
            Let us check your ID before you buy 21+ products
          </RegularText>
        </View>
        <Pressable
          onPress={onPress}
          disabled={userData.data?.data()?.verified === 'Verified'}
          style={{
            width: 130,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: Theme.button.primary,
            borderRadius: 16,
            paddingVertical: 24,
            paddingHorizontal: 16,
            borderStyle: 'dashed',
          }}>
          <RegularText style={{color: Theme.text.primary}}>Status:</RegularText>
          <BoldText style={{color: Theme.text.primary}}>
            {userData.data?.data()?.verified
              ? userData.data?.data()?.verified
              : 'Unverified'}
          </BoldText>
        </Pressable>
      </View>
    </View>
  );
}
