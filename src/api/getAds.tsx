import firestore from '@react-native-firebase/firestore';

export async function getAds(school: string) {
  let ads = await firestore()
    .collection('advertisements')
    .where('end', '>', new Date())
    .get();
  const adsData: Array<any> = [];
  ads.forEach(ad => {
    if (ad.data().schools.includes(school) && ad.data().start < new Date()) {
      adsData.push({...ad.data(), id: ad.id});
    }
  });
  return adsData;
}
