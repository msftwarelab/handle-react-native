import {View, Pressable} from 'react-native';
import {BoldText, CustomIcon} from '@/components';
import {useNavigation} from '@react-navigation/native';
import { Theme } from '@/constants';

export function SimpleHeader({title}: {title: string}) {
  const navigation = useNavigation();
  return (
    <View
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <Pressable style={{width: '10%'}} onPress={navigation.goBack}>
        <CustomIcon name="arrow_backward" color={Theme.text.primary} size={24} />
      </Pressable>
      <BoldText
        style={{
          width: '80%',
          textAlign: 'center',
          color: Theme.text.primary,
          fontSize: 20,
        }}>
        {title}
      </BoldText>
    </View>
  );
}
