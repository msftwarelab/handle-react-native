import React, {useCallback, useEffect, useState} from 'react';
import {View, TextInput, Pressable} from 'react-native';
import {useSearchBox} from 'react-instantsearch-hooks';
import {track} from '@/api';
import {CustomIcon} from '@/components';
import {useNavigation} from '@/hooks';
import { Theme } from '@/constants';

export default function SearchBox() {
  const navigation = useNavigation();
  const {query, refine} = useSearchBox();
  const [value, setValue] = useState(query);
  useEffect(() => {
    track('opened search');
  }, []);

  const onChangeText = useCallback(
    (text: string) => {
      setValue(text);
      refine(text);
    },
    [refine],
  );

  return (
    <View
      style={{
        height: 56,
        flexDirection: 'row',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 10,
        marginBottom: 10,
        paddingHorizontal: 20,
      }}>
      <Pressable onPress={() => navigation.goBack()}>
        <CustomIcon name="arrow_long_left" color={Theme.text.primary} size={26} />
      </Pressable>
      <TextInput
        maxFontSizeMultiplier={1}
        style={{
          flex: 1,
          height: '100%',
          padding: 16,
          backgroundColor: Theme.common.white,
          borderRadius: 32,
          fontSize: 16,
          fontFamily: 'AvenirNext-Bold',
          marginLeft: 16,
          color: Theme.text.primary,
        }}
        onChangeText={onChangeText}
        value={value}
        placeholder={"I'm craving..."}
        clearButtonMode={'always'}
        underlineColorAndroid={Theme.common.white}
        spellCheck={false}
        autoCorrect={false}
        autoCapitalize={'none'}
        placeholderTextColor={Theme.text.placeholder}
      />
    </View>
  );
}
