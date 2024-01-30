import {BoldText, CustomIcon} from '@/components';
import {Theme} from '@/constants';
import {useNavigation, useUserData} from '@/hooks';
import {Home, PastOrders, Profile, SearchCategories} from '@/routes';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import Title from './Title';

const Tab = createBottomTabNavigator();

const styles = StyleSheet.create({
  tabBar: {
    elevation: Platform.OS === 'ios' ? 0 : 7,
    height: 70,
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 10 : 0,
    position: 'absolute',
    borderTopWidth: 1,
  },
});

/**
 * The main app tabs
 * @returns {JSX.Element}
 */
export function Tabs(): JSX.Element {
  const navigation = useNavigation();
  const userData = useUserData();

  return (
    <Tab.Navigator
      screenOptions={({route}: {route: {name: string}}) => ({
        lazy: true,
        lazyPlaceholder: () => <ActivityIndicator />,
        tabBarIcon: ({color}: {color: string}) => {
          let iconName;
          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Search':
              iconName = 'search';
              break;
            case 'Cart':
              iconName = 'shopping-cart';
              break;
            case 'Profile':
              iconName = 'user';
              break;
            case 'PastOrders':
              iconName = 'format_bullets';
              break;
            default:
              iconName = 'home';
              break;
          }

          return <CustomIcon name={iconName} size={24} color={color} />;
        },
        tabBarShowLabel: false,
        headerShown: true,
        headerStyle: {
          backgroundColor: Theme.main.primary,
          shadowColor: 'transparent',
        },
        headerTitleAlign: 'left',
        headerTitleStyle: {
          color: 'white',
          width: Dimensions.get('window').width - 75,
          minWidth: 100,
        },
        headerRightContainerStyle: {
          paddingRight: 10,
        },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: Theme.text.placeholder,
        tabBarStyle: styles.tabBar,
      })}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerTitle: () => (
            <Title>
              {`Hello ${userData.data?.data()?.displayName || 'there'}!`}
              {/* {userData.data?.data()?.storeCredit > 0 && (
                <StoreCreditHeader
                  storeCredit={userData.data?.data()?.storeCredit}
                />
              )} */}
            </Title>
          ),
          headerRight: () => (
            <Pressable
              onPress={() => {
                navigation.navigate('SearchScreen');
              }}>
              <CustomIcon name="search" size={26} color="white" />
            </Pressable>
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchCategories}
        options={{
          headerTitle: () => <Title>Discover</Title>,
          headerRight: () => (
            <Pressable
              onPress={() => {
                navigation.navigate('SearchScreen');
              }}>
              <CustomIcon name="search" size={26} color="white" />
            </Pressable>
          ),
          lazy: false,
        }}
      />

      <Tab.Screen
        name="PastOrders"
        component={PastOrders}
        options={{
          headerTitle: () => <Title>My Orders</Title>,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerTitle: () => (
            <Title>{`Hello ${
              userData.data?.data()?.displayName || 'there'
            }!`}</Title>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function StoreCreditHeader({storeCredit}: {storeCredit: number}) {
  return (
    <View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#27ae60',
          // paddingVertical: 4,
          // paddingHorizontal: 4,
          borderRadius: 12,
        }}>
        <BoldText style={{color: 'white', fontSize: 12}}>
          ${storeCredit.toFixed(2)}
        </BoldText>
      </View>
    </View>
  );
}
