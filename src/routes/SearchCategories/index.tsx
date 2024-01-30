import {
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {memo, useCallback, useEffect} from 'react';
import {CustomIcon, LoadingRect, RegularText} from '@/components';
import {track} from '@/api';
import {Theme} from '@/constants';
import {useCategories, useNavigation, useUserData} from '@/hooks';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {FlashList} from '@shopify/flash-list';

/**
 * The search categories screen
 * @returns {JSX.Element}
 */
export function SearchCategories(): JSX.Element {
  const userData = useUserData();
  const categories = useCategories();
  const navigation = useNavigation();
  useEffect(() => {
    track('opened fullscreen categories page');
  }, []);

  const onPress = useCallback(
    (
      item: FirebaseFirestoreTypes.QueryDocumentSnapshot<FirebaseFirestoreTypes.DocumentData>,
    ) => {
      if (
        item.data()?.restricted &&
        userData?.data?.data()?.verified !== 'Verified'
      ) {
        navigation.navigate('CheckID');
      } else {
        navigation.navigate('ProductList', {
          slug: item.data()?.slug,
          name: item.data()?.name,
        });
      }
    },
    [userData, navigation],
  );

  const renderItem = useCallback(
    ({
      item,
    }: {
      item: FirebaseFirestoreTypes.QueryDocumentSnapshot<FirebaseFirestoreTypes.DocumentData>;
    }) => <Item item={item} onPress={onPress} />,
    [onPress],
  );

  return (
    <SafeAreaView style={styles.root}>
      <FlashList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        estimatedItemSize={80}
        data={
          categories.data?.sort((a, b) =>
            a.data().name.localeCompare(b.data().name),
          ) ?? []
        }
        ListHeaderComponent={<View style={styles.ListHeaderComponent} />}
        ListFooterComponent={<View style={styles.ListFooterComponent} />}
        ListEmptyComponent={
          <>
            {Array.from({length: 15}).map((_, key) => (
              <LoadingRect key={key} style={styles.loading} />
            ))}
          </>
        }
        refreshing={categories.isLoading}
        renderItem={renderItem}
      />
      {Platform.OS === 'ios' && (
        <View style={styles.backgroundContainer}>
          <View style={styles.backgroundTop} />
          <View style={styles.backgroundBottom} />
        </View>
      )}
    </SafeAreaView>
  );
}

const Item = memo(function Item({
  item,
  onPress,
}: {
  item: FirebaseFirestoreTypes.QueryDocumentSnapshot<FirebaseFirestoreTypes.DocumentData>;
  onPress: (
    item: FirebaseFirestoreTypes.QueryDocumentSnapshot<FirebaseFirestoreTypes.DocumentData>,
  ) => void;
}): JSX.Element {
  return (
    <Pressable onPress={() => onPress(item)} style={styles.item}>
      <View style={styles.itemContainer}>
        <View style={styles.emojiContainer}>
          <RegularText style={styles.emojiText}>
            {item.data()?.emoji}
          </RegularText>
        </View>
        <RegularText crack={true} style={styles.categoryText}>
          {item.data()?.name}
        </RegularText>
      </View>
      <CustomIcon
        name="arrow_long_right"
        color={Theme.text.secondary}
        size={24}
      />
    </Pressable>
  );
});

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    backgroundColor: Theme.main.primary,
  },
  list: {
    backgroundColor: Theme.common.white,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  loading: {
    height: 64,
    marginBottom: 8,
    padding: 12,
  },
  ListHeaderComponent: {width: '100%', height: 16},
  ListFooterComponent: {width: '100%', height: 48},
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  backgroundTop: {flex: 1, backgroundColor: Theme.main.primary},
  backgroundBottom: {flex: 1, backgroundColor: Theme.common.white},
  item: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: Theme.common.offWhite,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  emojiContainer: {
    height: 48,
    borderRadius: 24,
    width: 48,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  emojiText: {
    fontSize: 24,
  },
  categoryText: {
    marginLeft: 16,
    fontSize: 16,
    color: Theme.text.primary,
  },
});
