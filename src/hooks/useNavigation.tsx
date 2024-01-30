import {RootStackParamList} from '@/types';
import {useNavigation as useNativeNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

/**
 * Hook to get the navigation object with custom types
 * @returns {NativeStackNavigationProp<RootStackParamList>} - Navigation hook
 */
export function useNavigation(): NativeStackNavigationProp<RootStackParamList> {
  return useNativeNavigation<NativeStackNavigationProp<RootStackParamList>>();
}
