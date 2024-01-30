import { Theme } from '@/constants';
import {useNavigation} from '@/hooks';
import {memo} from 'react';
import {Pressable} from 'react-native';
import {CustomIcon} from './CustomIcon';

export const BackButton = memo(function BackButton({
  white,
}: {
  white?: boolean;
}): JSX.Element {
  const navigation = useNavigation();
  return (
    <Pressable onPress={() => navigation.goBack()}>
      <CustomIcon
        name="arrow_long_left"
        color={white ? Theme.common.white : Theme.text.primary}
        size={26}
      />
    </Pressable>
  );
});
