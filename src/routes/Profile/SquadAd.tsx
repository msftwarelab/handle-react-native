import {View, TouchableOpacity} from 'react-native';
import {BoldText, CustomIcon, RegularText} from '@/components';
import {useCallback} from 'react';
import {useNavigation} from '@/hooks';
import { Theme } from '@/constants';

/**
 * Squad advertisement component
 * @returns {JSX.Element}
 */
export default function SquadAd(): JSX.Element {
  const navigation = useNavigation();
  const onPress = useCallback(() => navigation.navigate('SquadOnboarding'), []);

  return (
    <TouchableOpacity
      onPress={onPress}
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
              Join the {Theme.name} Squad!
            </BoldText>
            <CustomIcon name="arrow_long_right" color={Theme.text.primary} size={18} />
          </View>
          <RegularText style={{color: Theme.text.primary, fontSize: 14}}>
            Get free delivery and 5% off the entire store. Only $4.99/mo. Try
            free for 1 week.
          </RegularText>
        </View>
      </View>
    </TouchableOpacity>
  );
}
