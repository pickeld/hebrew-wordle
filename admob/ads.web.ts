// Web stub for react-native-google-mobile-ads
// AdMob is native-only — these are no-ops on web

import React from 'react';
import { View } from 'react-native';

export const AD_UNIT_IDS = {
  banner: '',
  interstitial: '',
  rewarded: '',
};

export async function initializeAds(): Promise<void> {}
export function loadInterstitial(): void {}
export function showInterstitial(onClosed?: () => void): void { onClosed?.(); }
export function loadRewarded(): void {}
export function showRewarded(onRewarded: () => void, onDismissed?: () => void): void { onDismissed?.(); }

export { View as BannerAd };
