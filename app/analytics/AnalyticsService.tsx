// src/analytics/AnalyticsService.tsx
// Works on both Android & iOS with @react-native-firebase/analytics

import { Platform } from 'react-native';
import {
  getAnalytics,
  FirebaseAnalyticsTypes,
} from '@react-native-firebase/analytics';

export type AnalyticsParams = Record<
  string,
  string | number | boolean | null | undefined
>;

function sanitizeEventName(name: string): string {
  let n = name.trim().replace(/[^A-Za-z0-9_]/g, '_');
  if (!/^[A-Za-z]/.test(n)) n = `e_${n}`;
  if (n.length > 40) n = n.slice(0, 40);
  return n || 'custom_event';
}

function sanitizeParamKey(key: string): string {
  let k = key.trim().replace(/[^A-Za-z0-9_]/g, '_');
  if (!/^[A-Za-z]/.test(k)) k = `p_${k}`;
  if (k.length > 24) k = k.slice(0, 24);
  return k || 'param';
}

function sanitizeParams(params: AnalyticsParams = {}) {
  const out: Record<string, string | number> = {};
  for (const [rawKey, rawVal] of Object.entries(params)) {
    if (rawVal === undefined || rawVal === null) continue;
    const key = sanitizeParamKey(rawKey);
    let value: string | number =
      typeof rawVal === 'boolean' ? (rawVal ? 1 : 0) : (rawVal as any);
    if (typeof value !== 'string' && typeof value !== 'number') value = String(value);
    out[key] = value;
  }
  return out;
}

/**
 * A tiny guard so builds won't crash if analytics isn't ready
 * (e.g., dev build missing plist/json). All methods become no-ops.
 */
function makeSafeAnalytics(): FirebaseAnalyticsTypes.Module {
  try {
    return getAnalytics(); // default app on both iOS & Android
  } catch {
    // Fallback shim with no-op methods
    const noop = async () => {};
    // @ts-expect-error - we only need the methods we call
    return {
      logEvent: noop,
      setUserId: noop,
      setUserProperty: noop,
      setAnalyticsCollectionEnabled: noop,
      setDefaultEventParameters: noop,
      resetAnalyticsData: noop,
    };
  }
}

class AnalyticsService {
  private _analytics?: FirebaseAnalyticsTypes.Module;

  private get analytics(): FirebaseAnalyticsTypes.Module {
    if (!this._analytics) this._analytics = makeSafeAnalytics();
    return this._analytics;
  }

  /**
   * GA4 screen logging — same for iOS & Android.
   * Using logEvent('screen_view', ...) keeps parity across platforms.
   */
  async screen(screenName: string): Promise<void> {
    // GA4 recommended params
    const params = {
      screen_name: screenName,
      screen_class: screenName,
      platform: Platform.OS, // helpful for segmentation
    } as const;

    await this.analytics.logEvent('screen_view' as any, params as any);
  }

  async event(name: string, params?: AnalyticsParams): Promise<void> {
    const eventName = sanitizeEventName(name);
    const safeParams = sanitizeParams(params);
    await this.analytics.logEvent(eventName as any, safeParams);
  }

  async setUser(id?: string | null): Promise<void> {
    await this.analytics.setUserId(id ?? null);
  }

  async setUserProps(props: AnalyticsParams): Promise<void> {
    const entries = Object.entries(sanitizeParams(props));
    for (const [key, value] of entries) {
      await this.analytics.setUserProperty(key, String(value));
    }
  }

  async setCollectionEnabled(enabled: boolean): Promise<void> {
    await this.analytics.setAnalyticsCollectionEnabled(enabled);
  }

  async setDefaults(params: AnalyticsParams): Promise<void> {
    await this.analytics.setDefaultEventParameters(sanitizeParams(params));
  }

  async reset(): Promise<void> {
    await this.analytics.resetAnalyticsData();
  }
}

export default new AnalyticsService();
