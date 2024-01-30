import {StyleSheet} from 'react-native';
import Items from './Items';
import StickyFooter from './StickyFooter';
import {SafeAreaView} from 'react-native-safe-area-context';

/**
 * The cart screen
 * @returns {JSX.Element}
 */
export function Cart(): JSX.Element {
  return (
    <SafeAreaView style={styles.root} edges={['bottom']}>
      <Items />
      <StickyFooter />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
  },
});
