import {QueryKey} from '@/constants';
import {useQuery} from '@tanstack/react-query';
import {Platform} from 'react-native';
import VersionCheck from 'react-native-version-check';

export function useVersionCheck() {
  return useQuery([QueryKey.VERSION], async () => {
    if (Platform.OS === 'ios') {
      const packageName = VersionCheck.getPackageName();
      const countryName = 'us';
      const latestVersion = await fetch(
        `https://itunes.apple.com/${countryName.toLowerCase()}/lookup?bundleId=${packageName}`,
      )
        .then(r => r.json())
        .then(res => res?.results[0]?.version);
      return latestVersion;
    } else {
      const latestVersion = await VersionCheck.getLatestVersion();
      return latestVersion;
    }
  });
}
