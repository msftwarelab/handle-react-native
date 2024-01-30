import {Pressable, View} from 'react-native';
import {BoldText, CustomIcon, HorizontalProductLockup} from '@/components';
import {Theme} from '@/constants';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {memo, useCallback} from 'react';
import {useNavigation} from '@/hooks';

/**
 * Category breakdown component
 * @returns {JSX.Element}
 */
export const Breakdown = memo(
  ({
    item,
  }: {
    item: {
      category: FirebaseFirestoreTypes.DocumentData;
      items: FirebaseFirestoreTypes.QueryDocumentSnapshot<FirebaseFirestoreTypes.DocumentData>[];
    };
  }) => {
    const navigation = useNavigation();
    const onPress = useCallback(
      (slug: string, title: string) =>
        navigation.navigate('ProductList', {
          slug,
          name: title,
        }),
      [],
    );

    return (
      <View style={{backgroundColor: Theme.common.white}}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            paddingHorizontal: 20,
            alignItems: 'center',
            paddingBottom: 10,
            justifyContent: 'space-between',
            backgroundColor: Theme.common.white,
          }}>
          <BoldText style={{color: Theme.text.primary, fontSize: 20}}>
            {item.category.name}
          </BoldText>
          <Pressable
            style={{paddingVertical: 8, paddingLeft: 8}}
            onPress={() => onPress(item.category.slug, item.category.name)}>
            <CustomIcon
              name="arrow_long_right"
              color={Theme.text.primary}
              size={24}
            />
          </Pressable>
        </View>

        <HorizontalProductLockup
          productData={item.items}
          backgroundColor={Theme.common.white}
          borderColor={Theme.separator.gray}
          style={{
            paddingBottom: 0,
          }}
        />
      </View>
    );
  },
);
