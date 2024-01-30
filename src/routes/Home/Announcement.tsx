import {RegularText} from '@/components';
import {Theme} from '@/constants';
import {useUniversity} from '@/hooks';
import {StyleSheet, View} from 'react-native';

/**
 * The announcement component
 * @returns {JSX.Element}
 */
export default function Announcement(): JSX.Element {
  const university = useUniversity();
  return university.data?.data()?.announcement?.enabled ? (
    <View style={styles.container}>
      <RegularText style={styles.text} crack>
        {university.data?.data()?.announcement?.content}
      </RegularText>
    </View>
  ) : (
    <></>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.main.primary,
    borderRadius: 16,
    marginBottom: 20,
    marginHorizontal: 16,
    padding: 10,
    flexDirection: 'row',
  },
  text: {
    color: Theme.common.white,
    fontSize: 16,
    margin: 6,
  },
});
