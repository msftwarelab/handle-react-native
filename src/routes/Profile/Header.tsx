import {View, Pressable, Linking} from 'react-native';
import {BoldText, CustomIcon, Gutter, RegularText} from '../../components';
import {useNavigation, useUserData} from '@/hooks';
import {useUniversity} from '@/hooks/useUniversity';
import {Theme} from '@/constants';

export default function Header(): JSX.Element {
  const navigation = useNavigation();
  const userData = useUserData();
  const schoolData = useUniversity();

  return (
    <View
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        paddingBottom: 8,
        width: '100%',
        paddingHorizontal: 20,
        backgroundColor: Theme.main.primary,
      }}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <RegularText style={{color: Theme.common.white, fontSize: 16}}>
          Your {Theme.name} Balance
        </RegularText>
        <BoldText style={{color: 'white', fontSize: 20, marginLeft: 8}}>
          ${userData.data?.data()?.storeCredit?.toFixed(2)}
        </BoldText>
      </View>
      <Gutter style={{backgroundColor: Theme.main.primary}}>
        <LineItem
          emoji="❤️"
          title="Favorite goods"
          callback={() => {
            navigation.navigate('Favorites');
          }}
        />
        <LineItem
          emoji="✉️"
          title="Get support"
          callback={() => {
            navigation.navigate('SupportWebview');
          }}
        />
      </Gutter>
    </View>
  );
}

/**
 * A line item in the profile screen
 * @param {string} emoji - The emoji to display
 * @param {string} title - The title of the line item
 * @param {function} callback - The callback to run when the line item is pressed
 * @returns
 */
function LineItem({
  emoji,
  title,
  callback,
}: {
  emoji: string;
  title: string;
  callback: () => void;
}): JSX.Element {
  return (
    <Pressable
      onPress={() => {
        callback();
      }}
      style={{
        display: 'flex',
        flexDirection: 'row',
        paddingVertical: 10,
        alignItems: 'center',
        borderTopColor: Theme.separator.primary,
        borderTopWidth: 1,
        justifyContent: 'space-between',
      }}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <BoldText style={{fontSize: 32}}>{emoji}</BoldText>
        <RegularText
          crack={true}
          style={{color: 'white', fontSize: 16, marginLeft: 8}}>
          {title}
        </RegularText>
      </View>
      <CustomIcon name="caret_right" color="white" size={32} />
    </Pressable>
  );
}
