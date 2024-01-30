import {
  Text,
  TouchableOpacity,
  SafeAreaView,
  Pressable,
  View,
} from 'react-native';
import {BoldText, CustomIcon, LoadingRect} from '@/components';
import {useCategories, useNavigation, useUserData} from '@/hooks';
import {Theme} from '@/constants';
import {track} from '@/api';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {memo, useCallback} from 'react';
import {Title} from './TItle';
import {FlashList} from '@shopify/flash-list';

/**
 * The categories component
 * @returns {JSX.Element}
 */
export const Categories = memo(function Categories(): JSX.Element {
  const navigation = useNavigation();
  const categories = useCategories();
  const userData = useUserData();

  const renderItem = useCallback(
    ({
      item,
      index,
    }: {
      item: FirebaseFirestoreTypes.QueryDocumentSnapshot<FirebaseFirestoreTypes.DocumentData>;
      index: number;
    }) => (
      <Item
        item={item}
        last={
          (categories.data || false) && index === categories.data?.length - 1
        }
        verified={userData.data?.data()?.verified === 'Verified'}
      />
    ),
    [categories, userData],
  );

  return (
    <SafeAreaView
      style={{
        backgroundColor: Theme.common.white,
        paddingBottom: 16,
        width: '100%',
        marginBottom: 20,
      }}>
      <Title
        action={
          <Pressable
            onPress={() => {
              navigation.navigate('Search');
            }}>
            <CustomIcon
              name="arrow_long_right"
              color={Theme.text.primary}
              size={24}
            />
          </Pressable>
        }
        color="white">
        Categories
      </Title>
      <View
        style={{
          flexGrow: 1,
          flexDirection: 'row',
          height: 85,
        }}>
        <FlashList
          horizontal
          estimatedItemSize={114}
          contentContainerStyle={{
            paddingLeft: 20,
          }}
          showsHorizontalScrollIndicator={false}
          data={[...(categories.data || [])].sort(
            (a, b) => a.data().index - b.data().index,
          )}
          renderItem={renderItem}
          refreshing={categories.isLoading}
          ListEmptyComponent={
            <>
              <LoadingRect
                style={{
                  width: 85,
                  height: 85,
                  borderRadius: 16,
                  marginRight: 8,
                }}
              />
              <LoadingRect
                style={{
                  width: 85,
                  height: 85,
                  borderRadius: 16,
                  marginRight: 8,
                }}
              />
              <LoadingRect
                style={{
                  width: 85,
                  height: 85,
                  borderRadius: 16,
                  marginRight: 8,
                }}
              />
              <LoadingRect
                style={{
                  width: 85,
                  height: 85,
                  borderRadius: 16,
                  marginRight: 8,
                }}
              />
            </>
          }
        />
      </View>
    </SafeAreaView>
  );
});

const Item = memo(
  ({
    item,
    last,
    verified,
  }: {
    item: FirebaseFirestoreTypes.QueryDocumentSnapshot<FirebaseFirestoreTypes.DocumentData>;
    last: boolean;
    verified: boolean;
  }) => {
    const navigation = useNavigation();
    const onPress = useCallback(() => {
      track('opened category', {
        slug: item.data().slug,
      });
      if (item.data().restricted && !verified) {
        navigation.navigate('CheckID');
      } else {
        navigation.navigate('ProductList', {
          slug: item.data().slug,
          name: item.data().name,
        });
      }
    }, [item]);

    return (
      <TouchableOpacity
        onPress={onPress}
        key={item.id}
        style={[
          {
            height: 85,
            minWidth: 85,
            borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: Theme.separator.gray,
            marginRight: 8,
            borderRadius: 16,
            paddingHorizontal: 8,
          },
          last ? {marginRight: 40} : {},
        ]}>
        <Text
          maxFontSizeMultiplier={1}
          style={{
            fontSize: 40,
            paddingTop: 4.5,
          }}>
          {item.data().emoji}
        </Text>
        <BoldText
          manrope={true}
          numberOfLines={1}
          style={{
            color: Theme.text.primary,
            fontWeight: 'bold',
            paddingTop: 3,
            paddingHorizontal: 5,
            fontSize: 14,
          }}>
          {item.data().name}
        </BoldText>
      </TouchableOpacity>
    );
  },
);
