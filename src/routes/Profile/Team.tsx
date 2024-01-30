import {View, TouchableOpacity, Linking} from 'react-native';
import {BoldText, CustomIcon, LoadingRect, RegularText} from '@/components';
import {useUserData} from '@/hooks';
import {Theme} from '@/constants';

/**
 * Team component
 * @returns {JSX.Element}
 */
export default function Team(): JSX.Element {
  const userData = useUserData();
  return userData.isLoading ? (
    <LoadingRect
      style={{
        marginTop: 16,
        marginHorizontal: 20,
        borderRadius: 16,
        padding: 16,
      }}
    />
  ) : (
    <TouchableOpacity
      onPress={() => Linking.openURL('https://jobs.handledelivery.com')}
      style={{
        marginTop: 16,
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
        <View style={{flex: 1}}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <BoldText style={{color: Theme.text.primary, fontSize: 18}}>
              Ride fast, make cash.
            </BoldText>
            <CustomIcon
              name="arrow_long_right"
              color={Theme.text.primary}
              size={18}
            />
          </View>
          <RegularText style={{color: Theme.text.primary, fontSize: 14}}>
            {userData.data?.data()?.type !== 'handler'
              ? 'Check out our open positions on our delivery and warehouse teams.'
              : 'Welcome back Handler - Start your shift here.'}
          </RegularText>
        </View>
      </View>
    </TouchableOpacity>
  );
}
