import {Pressable, StyleSheet} from 'react-native';
import React, {useCallback, useState} from 'react';
import {Picker} from '@react-native-picker/picker';
import {RegularText} from '../RegularText';
import {ActionSheet} from './ActionSheet';
import {Theme} from '@/constants';

/**
 * Graduation year picker
 * @param {string} gradYear - Graduation year state
 * @param {function} setGradYear - Graduation year setter
 * @param {function} onBlur - onBlur function
 * @returns {JSX.Element}
 */
export function GradYearPicker({
  gradYear,
  setGradYear,
  onBlur,
}: {
  gradYear: string;
  setGradYear: (value: string) => void;
  onBlur: (e: any) => void;
}): JSX.Element {
  const [openSheet, setOpenSheet] = useState(false);
  const YEARS = [
    ...Array.from({length: 5}, (_, i) =>
      (new Date().getFullYear() + i).toString(),
    ),
    'Other',
    'Not a current student',
  ];
  const onOpen = useCallback(() => setOpenSheet(true), []);

  return (
    <>
      <Pressable onPress={onOpen} style={styles.pressable}>
        <RegularText
          style={[
            !gradYear
              ? {color: Theme.text.placeholder}
              : {color: Theme.text.primary},
          ]}>
          {!gradYear ? 'Grad Year' : gradYear}
        </RegularText>
      </Pressable>
      <ActionSheet setOpen={setOpenSheet} open={openSheet}>
        <Picker
          selectedValue={gradYear}
          onValueChange={itemValue => setGradYear(itemValue)}
          onBlur={onBlur}>
          <Picker.Item label={'Grad Year'} value={''} />

          {YEARS.map(item => {
            return <Picker.Item key={item} label={item} value={item} />;
          })}
        </Picker>
      </ActionSheet>
    </>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: Theme.common.offWhite,
    padding: 18,
    borderRadius: 100,
    alignItems: 'center',
    marginBottom: 16,
  },
});
