import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {memo} from 'react';
import {BoldText} from '../BoldText';
import {RegularText} from '../RegularText';
import {CustomIcon} from '../CustomIcon';
import {Theme} from '@/constants';

const selections = [
  {value: 'TikTok', icon: 'comment_video'},
  {value: 'Instagram', icon: 'instagram'},
  {value: 'Friend', icon: 'contacts'},
  {value: 'Sign / QR Code', icon: 'qr_code'},
  {value: 'Ambassador', icon: 'accessibility_vs'},
  {value: 'Other', icon: 'comment_vs'},
];

// Function to shuffle the array
function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Referral source component
 * @param {string} referral - Referral state
 * @param {function} setReferral - Referral setter
 * @param {function} onBlur - onBlur function
 * @returns {JSX.Element}
 */
export function ReferralSource({
  referral,
  setReferral,
  onBlur,
}: {
  referral: string;
  setReferral: (value: string) => void;
  onBlur: (e: any) => void;
}): JSX.Element {
  const shuffledSelections = shuffleArray([...selections]);
  const WrappedSelection = memo(Selection);

  return (
    <View style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
      <BoldText
        style={{
          color: Theme.text.primary,
          marginBottom: 8,
          textAlign: 'center',
        }}>
        How did you discover {Theme.name}?
      </BoldText>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}>
        {shuffledSelections.map((selection, index) => (
          <>
            <WrappedSelection value={selection.value} icon={selection.icon} />
            {/* Add spacer view after each WrappedSelection except the last */}
            {index < shuffledSelections.length - 1 && (
              <View style={{width: '2%'}} />
            )}
          </>
        ))}
      </View>
    </View>
  );

  /**
   * Selection component
   * @param {string} value - Value of the selection
   * @param {string} icon - Icon of the selection
   * @returns {JSX.Element}
   */
  function Selection({
    value,
    icon,
  }: {
    value: string;
    icon: string;
  }): JSX.Element {
    return (
      <TouchableOpacity
        onPress={() => {
          setReferral(value);
        }}
        onBlur={onBlur}
        style={{
          width: '48%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          backgroundColor: Theme.common.offWhite,
          padding: 18,
          borderRadius: 100,
          alignItems: 'center',
          marginBottom: 8,
        }}>
        <CustomIcon
          name={icon}
          size={18}
          color={
            referral === value ? Theme.text.primary : Theme.text.placeholder
          }
        />
        <RegularText
          numberOfLines={1}
          style={[
            {marginLeft: 8, fontSize: 14},
            referral === value
              ? {color: Theme.text.primary}
              : {color: Theme.text.placeholder},
          ]}>
          {value}
        </RegularText>
      </TouchableOpacity>
    );
  }
}
