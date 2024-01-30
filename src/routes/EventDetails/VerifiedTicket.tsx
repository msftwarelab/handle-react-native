import {View} from 'react-native';
import {RegularText} from '@/components';
import {useEffect, useState} from 'react';
import { Theme } from '@/constants';

/**
 * Verified ticket component
 * @returns {JSX.Element}
 */
export default function VerifiedTicket(): JSX.Element {
  const [str, setStr] = useState(new Date().toLocaleTimeString('en-US'));

  useEffect(() => {
    setInterval(() => {
      setStr(new Date().toLocaleTimeString('en-US'));
    }, 1000);
  }, []);

  return (
    <View
      style={{
        marginTop: 16,
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 100,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
      }}>
      <RegularText>{Theme.name} Verified Ticket</RegularText>
      <RegularText>{str}</RegularText>
    </View>
  );
}
