import { useEffect } from 'react';
import {
  InterstitialAd,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';
import { Platform } from 'react-native';

// Use your real Ad Unit IDs
const adUnitId = Platform.select({
  android: 'ca-app-pub-9981790406492178/9379979189',
  ios: 'ca-app-pub-9981790406492178/5169255528',
})!;

//test ad unit id
// const adUnitId = Platform.select({
//   android: TestIds.INTERSTITIAL,
//   ios: TestIds.INTERSTITIAL,
// })!;

const interstitial = InterstitialAd.createForAdRequest(adUnitId);

export const useInterstitialAd = () => {
  const showAd = () => {
    if (interstitial.loaded) {
      interstitial.show();
      console.log('[Ad] Interstitial shown');
    } else {
      console.log('[Ad] Not loaded yet — loading now...');
      interstitial.load();
    }
  };

  useEffect(() => {
    const unsubscribeLoaded = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        console.log('[Ad] Interstitial ad loaded');
      }
    );

    const unsubscribeClosed = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        console.log('[Ad] Interstitial ad closed — preloading next');
        interstitial.load();
      }
    );

    // Initial preload
    interstitial.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
    };
  }, []);

  return { showAd };
};
