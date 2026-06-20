import { createElement, forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import type { CachedPage } from '../types';
import { normalizeUrl } from '../utils/url';

export type AppWebViewHandle = {
  goBack: () => void;
  goForward: () => void;
  reload: () => void;
  goHome: () => void;
  navigateTo: (url: string) => void;
};

type AppWebViewProps = {
  isConnected: boolean;
  homeUrl: string;
  currentUrl: string;
  getCachedPage: (url: string) => CachedPage | null;
  onPageCached: (page: CachedPage) => void;
  onUrlChange: (url: string) => void;
  onNavigationStateChange: (state: { canGoBack: boolean; canGoForward: boolean }) => void;
};

export const AppWebView = forwardRef<AppWebViewHandle, AppWebViewProps>(function AppWebView(
  { homeUrl, currentUrl, onUrlChange, onNavigationStateChange },
  ref
) {
  const [isLoading, setIsLoading] = useState(true);
  const [frameUrl, setFrameUrl] = useState(currentUrl);
  const [reloadToken, setReloadToken] = useState(0);
  const historyRef = useRef<string[]>([currentUrl]);
  const historyIndexRef = useRef(0);

  useEffect(() => {
    const normalized = normalizeUrl(currentUrl);
    setFrameUrl(normalized);
    setIsLoading(true);

    const last = historyRef.current[historyIndexRef.current];
    if (normalizeUrl(last) !== normalized) {
      historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
      historyRef.current.push(normalized);
      historyIndexRef.current = historyRef.current.length - 1;
    }

    onNavigationStateChange({
      canGoBack: historyIndexRef.current > 0,
      canGoForward: historyIndexRef.current < historyRef.current.length - 1
    });
  }, [currentUrl, onNavigationStateChange]);

  const navigateTo = useCallback(
    (url: string) => {
      onUrlChange(normalizeUrl(url));
    },
    [onUrlChange]
  );

  const reload = useCallback(() => {
    setIsLoading(true);
    setReloadToken((token) => token + 1);
  }, []);

  const goBack = useCallback(() => {
    if (historyIndexRef.current <= 0) {
      return;
    }
    historyIndexRef.current -= 1;
    onUrlChange(historyRef.current[historyIndexRef.current]);
  }, [onUrlChange]);

  const goForward = useCallback(() => {
    if (historyIndexRef.current >= historyRef.current.length - 1) {
      return;
    }
    historyIndexRef.current += 1;
    onUrlChange(historyRef.current[historyIndexRef.current]);
  }, [onUrlChange]);

  const goHome = useCallback(() => {
    if (normalizeUrl(currentUrl) === normalizeUrl(homeUrl)) {
      reload();
      return;
    }
    onUrlChange(homeUrl);
  }, [currentUrl, homeUrl, onUrlChange, reload]);

  useImperativeHandle(
    ref,
    () => ({ goBack, goForward, reload, goHome, navigateTo }),
    [goBack, goForward, reload, goHome, navigateTo]
  );

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    onNavigationStateChange({
      canGoBack: historyIndexRef.current > 0,
      canGoForward: historyIndexRef.current < historyRef.current.length - 1
    });
  }, [onNavigationStateChange]);

  return (
    <View style={styles.container}>
      <View style={styles.frame}>
        {createElement('iframe', {
          key: `${frameUrl}-${reloadToken}`,
          src: frameUrl,
          title: 'Memory Upgrades',
          style: {
            width: '100%',
            height: '100%',
            border: 'none',
            display: 'block'
          },
          onLoad: handleLoad
        })}
      </View>
      {isLoading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#0f4c81" />
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 0
  },
  frame: {
    flex: 1,
    minHeight: 0,
    width: '100%'
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)'
  }
});