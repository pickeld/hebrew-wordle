import {
  InterstitialAd,
  RewardedAd,
  AdEventType,
  RewardedAdEventType,
  TestIds,
  BannerAdSize,
} from 'react-native-google-mobile-ads';
import MobileAds from 'react-native-google-mobile-ads';

export { BannerAdSize };

export const AD_UNIT_IDS = {
  banner: __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-XXXXXXXX/XXXXXXXXXX',
  interstitial: __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-XXXXXXXX/XXXXXXXXXX',
  rewarded: __DEV__ ? TestIds.REWARDED : 'ca-app-pub-XXXXXXXX/XXXXXXXXXX',
};

export async function initializeAds(): Promise<void> {
  await MobileAds().initialize();
}

// ─── Interstitial ─────────────────────────────────────────────────────────────

let interstitial: ReturnType<typeof InterstitialAd.createForAdRequest> | null = null;

export function loadInterstitial(): void {
  interstitial = InterstitialAd.createForAdRequest(AD_UNIT_IDS.interstitial, {
    requestNonPersonalizedAdsOnly: true,
  });
  interstitial.load();
}

export function showInterstitial(onClosed?: () => void): void {
  if (!interstitial) {
    onClosed?.();
    return;
  }
  const ad = interstitial;
  const unsubClose = ad.addAdEventListener(AdEventType.CLOSED, () => {
    unsubClose();
    loadInterstitial();
    onClosed?.();
  });
  const unsubErr = ad.addAdEventListener(AdEventType.ERROR, () => {
    unsubErr();
    onClosed?.();
  });
  ad.show().catch(() => onClosed?.());
}

// ─── Rewarded ─────────────────────────────────────────────────────────────────

let rewarded: ReturnType<typeof RewardedAd.createForAdRequest> | null = null;

export function loadRewarded(): void {
  rewarded = RewardedAd.createForAdRequest(AD_UNIT_IDS.rewarded, {
    requestNonPersonalizedAdsOnly: true,
  });
  rewarded.load();
}

export function showRewarded(onRewarded: () => void, onDismissed?: () => void): void {
  if (!rewarded) {
    onDismissed?.();
    return;
  }
  const ad = rewarded;
  const unsubReward = ad.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
    unsubReward();
    onRewarded();
  });
  const unsubClose = ad.addAdEventListener(AdEventType.CLOSED, () => {
    unsubClose();
    loadRewarded();
    onDismissed?.();
  });
  ad.show().catch(() => onDismissed?.());
}
