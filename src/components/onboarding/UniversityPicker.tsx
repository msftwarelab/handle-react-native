import {Pressable} from 'react-native';
import {useState} from 'react';
import {Picker} from '@react-native-picker/picker';
import {RegularText} from '../RegularText';
import {ActionSheet} from './ActionSheet';
import {useQuery} from '@tanstack/react-query';
import firestore from '@react-native-firebase/firestore';
import {QueryKey, Theme} from '@/constants';

/**
 * University picker component
 * @param {string} school - School state
 * @param {function} setSchool - School setter
 * @param {function} onBlur - onBlur function
 * @returns
 */
export function UniversityPicker({
  school,
  setSchool,
  onBlur,
}: {
  school: string;
  setSchool: (value: string) => void;
  onBlur: (e: any) => void;
}): JSX.Element {
  const schools = useQuery([QueryKey.UNIVERSITIES], () =>
    firestore()
      .collection('universities')
      .get()
      .then(res =>
        res.docs.map(doc => {
          return {
            id: doc.id,
            name: doc.data().name,
          };
        }),
      ),
  );
  const [openSheet, setOpenSheet] = useState(false);

  return (
    <>
      <Pressable
        onPress={() => {
          setOpenSheet(true);
        }}
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          backgroundColor: Theme.common.offWhite,
          padding: 18,
          borderRadius: 100,
          alignItems: 'center',
          marginBottom: 8,
        }}>
        <RegularText
          style={[
            !school
              ? {color: Theme.text.placeholder}
              : {color: Theme.text.primary},
          ]}>
          {!school ? 'University' : ''}
          {schools.data?.map((item, index) => {
            if (item.id === school) {
              return item.name;
            }
          })}
        </RegularText>
      </Pressable>
      <ActionSheet setOpen={setOpenSheet} open={openSheet}>
        <Picker
          selectedValue={school}
          onValueChange={itemValue => setSchool(itemValue)}
          onBlur={onBlur}>
          <Picker.Item label={'University'} value={''} />
          {schools.data?.map((item, index) => {
            return item.name ? (
              <Picker.Item key={index} label={item.name} value={item.id} />
            ) : null;
          })}
        </Picker>
      </ActionSheet>
    </>
  );
}
