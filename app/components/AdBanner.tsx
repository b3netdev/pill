// components/AdBanner.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { Platform } from 'react-native';

const bannerAdUnitId =
  Platform.OS === 'ios'
    ? 'ca-app-pub-9981790406492178/6482337197'
    : 'ca-app-pub-9981790406492178/2130135008';

    //make for test
// const bannerAdUnitId =
//   Platform.OS === 'ios'
//     ? 'ca-app-pub-3940256099942544/2934735716' // Test ad unit ID for iOS
//     : 'ca-app-pub-3940256099942544/6300978111'; // Test ad unit ID for Android

const AdBanner: React.FC = () => {
  return (
    <View style={styles.bannerContainer}>
      <BannerAd
        unitId={bannerAdUnitId}
        size={BannerAdSize.BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingBottom: 0,
  },
});

export default AdBanner;
