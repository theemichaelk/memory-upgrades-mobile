import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Linking, StyleSheet, View } from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import type { ShouldStartLoadRequest } from 'react-native-webview/lib/WebViewTypes';

import { BASE_URL, CAPTURE_PAGE_SCRIPT } from '../constants';
import type { CachedPage } from '../types';
import { isExternalUrl, normalizeUrl } from '../utils/url';
import { OfflineBanner } from './OfflineBanner';
import { WebViewError } from './WebViewError';

export type AppWebViewHandle = {
  goBack: () => void;
  goForward: () => void;
  reload: () => void;
  goHome: () => void;
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

type WebViewSource = { uri: string } | { html: string; baseUrl: string };

export const AppWebView = forwardRef<AppWebViewHandle, AppWebViewProps>(function AppWebView(
  {
    isConnected,
    homeUrl,
    currentUrl,
    getCachedPage,
    onPageCached,
    onUrlChange,
    onNavigationStateChange
  },
  ref
) {
  const webviewRef = useRef<WebView>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Please check your connection and try again.');

  const source = useMemo<WebViewSource>(() => {
    if (isConnected) {
      return { uri: currentUrl };
    }

    const cached = getCachedPage(currentUrl) ?? getCachedPage(homeUrl);
    if (cached) {
      return { html: cached.html, baseUrl: BASE_URL };
    }

    return { uri: currentUrl };
  }, [currentUrl, getCachedPage, homeUrl, isConnected]);

  const usingCache = !isConnected && Boolean(getCachedPage(currentUrl) ?? getCachedPage(homeUrl));

  const reload = useCallback(() => {
    setHasError(false);
    setIsLoading(true);
    webviewRef.current?.reload();
  }, []);

  const goBack = useCallback(() => {
    webviewRef.current?.goBack();
  }, []);

  const goForward = useCallback(() => {
    webviewRef.current?.goForward();
  }, []);

  const goHome = useCallback(() => {
    setHasError(false);
    setIsLoading(true);
    if (normalizeUrl(currentUrl) === normalizeUrl(homeUrl)) {
      webviewRef.current?.reload();
      return;
    }
    onUrlChange(homeUrl);
  }, [currentUrl, homeUrl, onUrlChange]);

  useImperativeHandle(ref, () => ({ goBack, goForward, reload, goHome }), [goBack, goForward, reload, goHome]);

  const handleNavigation = useCallback(
    (state: WebViewNavigation) => {
      const nextUrl = normalizeUrl(state.url);
      onUrlChange(nextUrl);
      onNavigationStateChange({
        canGoBack: state.canGoBack,
        canGoForward: state.canGoForward
      });
      setHasError(false);
    },
    [onNavigationStateChange, onUrlChange]
  );

  const handleMessage = useCallback(
    (event: { nativeEvent: { data: string } }) => {
      try {
        const message = JSON.parse(event.nativeEvent.data) as {
          type?: string;
          payload?: { url?: string; html?: string };
        };

        if (message.type !== 'page-html' || !message.payload?.html || !message.payload.url) {
          return;
        }

        onPageCached({
          url: normalizeUrl(message.payload.url),
          html: message.payload.html,
          cachedAt: Date.now()
        });
      } catch {
        return;
      }
    },
    [onPageCached]
  );

  const handleShouldStartLoad = useCallback((request: ShouldStartLoadRequest) => {
    if (isExternalUrl(request.url)) {
      void Linking.openURL(request.url);
      return false;
    }
    return true;
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
    setErrorMessage('The page could not be loaded. Pull down to refresh or tap Reload.');
    setIsLoading(false);
  }, []);

  const handleHttpError = useCallback((event: { nativeEvent: { statusCode: number } }) => {
    setHasError(true);
    setErrorMessage(`Server responded with status ${event.nativeEvent.statusCode}.`);
    setIsLoading(false);
  }, []);

  const handleLoadEnd = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
    webviewRef.current?.injectJavaScript(CAPTURE_PAGE_SCRIPT);
  }, []);

  return (
    <View style={styles.container}>
      {!isConnected && <OfflineBanner usingCache={usingCache} />}
      {hasError && !usingCache ? (
        <WebViewError message={errorMessage} onRetry={reload} />
      ) : (
        <>
          <WebView
            ref={webviewRef}
            source={source}
            onMessage={handleMessage}
            onNavigationStateChange={handleNavigation}
            onShouldStartLoadWithRequest={handleShouldStartLoad}
            onError={handleError}
            onHttpError={handleHttpError}
            onLoadEnd={handleLoadEnd}
            onLoadStart={() => setIsLoading(true)}
            injectedJavaScript={CAPTURE_PAGE_SCRIPT}
            javaScriptEnabled
            cacheEnabled
            domStorageEnabled
            sharedCookiesEnabled
            thirdPartyCookiesEnabled
            pullToRefreshEnabled
            allowsBackForwardNavigationGestures
            setSupportMultipleWindows={false}
            originWhitelist={['https://*', 'http://*']}
            startInLoadingState
            style={styles.webview}
          />
          {isLoading && (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color="#0f4c81" />
            </View>
          )}
        </>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  webview: {
    flex: 1
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)'
  }
});