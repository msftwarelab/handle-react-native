import React from 'react';
import {
  View,
  ScrollView,
  Platform,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Header from './Header';
import CheckID from './CheckID';
import SquadAd from './SquadAd';
import Referral from './Referral';
import Team from './Team';
import LogOut from './LogOut';
import {Theme} from '@/constants';
import {RegularText} from '@/components';
import VersionCheck from 'react-native-version-check';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export function Profile(): JSX.Element {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.root}>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <CheckID />
        <SquadAd />
        <Referral />
        <Team />
        <LogOut />
        <RegularText
          style={[
            styles.version,
            {
              paddingBottom: insets.bottom + 20,
            },
          ]}
          crack>
          Handle v{VersionCheck.getCurrentVersion()} (
          {VersionCheck.getCurrentBuildNumber()})
        </RegularText>
      </ScrollView>
      {Platform.OS === 'ios' && (
        <View style={styles.background}>
          <View style={styles.backgroundTop} />
          <View style={styles.backgroundBottom} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    backgroundColor: Theme.main.primary,
  },
  container: {
    backgroundColor: Theme.common.white,
  },
  version: {
    marginTop: 20,
    color: Theme.text.secondary,
    textAlign: 'center',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  backgroundTop: {flex: 1, backgroundColor: Theme.main.primary},
  backgroundBottom: {flex: 1, backgroundColor: Theme.common.white},
});
