import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Linking, StyleSheet, View } from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import type { ShouldStartLoadRequest } from 'react-native-webview/lib/WebViewTypes';

import { APP_USER_AGENT } from '../constants/appChrome';
import { WEBVIEW_BRIDGE_SCRIPT } from '../constants/webview';
import { APP_COLORS } from '../constants/theme';
import type { CachedPage } from '../types';
import { isBlockedNavigation, isExternalUrl, normalizeUrl } from '../utils/url';
import { OfflineBanner } from './OfflineBanner';
import { WebViewError } from './WebViewError';

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

type WebViewSource = { uri: string } | { html: string; baseUrl: string };

function openExternalUrl(url: string) {
  if (isBlockedNavigation(url)) {
    return;
  }
  void Linking.openURL(url);
}

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
  const [reloadToken, setReloadToken] = useState(0);

  const cachedPage = useMemo(() => {
    if (isConnected) {
      return null;
    }
    return getCachedPage(currentUrl);
  }, [currentUrl, getCachedPage, isConnected]);

  const usingCache = !isConnected && Boolean(cachedPage);
  const offlineUnavailable = !isConnected && !cachedPage;

  const source = useMemo<WebViewSource>(() => {
    if (isConnected) {
      return { uri: currentUrl };
    }

    if (cachedPage) {
      return { html: cachedPage.html, baseUrl: cachedPage.url };
    }

    return { uri: currentUrl };
  }, [cachedPage, currentUrl, isConnected]);

  const webviewKey = `${isConnected ? 'online' : 'offline'}-${normalizeUrl(currentUrl)}-${reloadToken}`;

  const navigateTo = useCallback(
    (url: string) => {
      setHasError(false);
      setIsLoading(true);
      onUrlChange(normalizeUrl(url));
    },
    [onUrlChange]
  );

  const reload = useCallback(() => {
    if (!isConnected) {
      if (cachedPage) {
        setHasError(false);
        setIsLoading(true);
        setReloadToken((token) => token + 1);
        return;
      }

      setHasError(true);
      setErrorMessage('You are offline and this page is not saved. Connect to the internet to reload.');
      setIsLoading(false);
      return;
    }

    setHasError(false);
    setIsLoading(true);
    webviewRef.current?.reload();
  }, [cachedPage, isConnected]);

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
      reload();
      webviewRef.current?.injectJavaScript('window.scrollTo(0, 0); true;');
      return;
    }
    onUrlChange(homeUrl);
  }, [currentUrl, homeUrl, onUrlChange, reload]);

  useImperativeHandle(
    ref,
    () => ({ goBack, goForward, reload, goHome, navigateTo }),
    [goBack, goForward, reload, goHome, navigateTo]
  );

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

        if (message.type === 'open-external' && message.payload?.url) {
          openExternalUrl(message.payload.url);
          return;
        }

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
    if (isBlockedNavigation(request.url)) {
      return false;
    }

    if (isExternalUrl(request.url)) {
      openExternalUrl(request.url);
      return false;
    }

    return true;
  }, []);

  const handleOpenWindow = useCallback((event: { nativeEvent: { targetUrl: string } }) => {
    const targetUrl = event.nativeEvent.targetUrl;
    if (targetUrl) {
      if (isExternalUrl(targetUrl)) {
        openExternalUrl(targetUrl);
        return false;
      }
    }
    return true;
  }, []);

  const handleError = useCallback(() => {
    if (offlineUnavailable) {
      setHasError(true);
      setErrorMessage('You are offline and this page has not been saved yet. Try again when you are back online.');
      setIsLoading(false);
      return;
    }

    setHasError(true);
    setErrorMessage('The page could not be loaded. Pull down to refresh or tap Reload.');
    setIsLoading(false);
  }, [offlineUnavailable]);

  const handleHttpError = useCallback((event: { nativeEvent: { statusCode: number } }) => {
    setHasError(true);
    setErrorMessage(`Server responded with status ${event.nativeEvent.statusCode}.`);
    setIsLoading(false);
  }, []);

  const finishLoading = useCallback(() => {
    setIsLoading(false);
    if (!offlineUnavailable) {
      setHasError(false);
    }
    if (isConnected) {
      webviewRef.current?.injectJavaScript(WEBVIEW_BRIDGE_SCRIPT);
    }
  }, [isConnected, offlineUnavailable]);

  const handleLoadEnd = finishLoading;
  const handleLoad = finishLoading;

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 20000);

    return () => clearTimeout(timeout);
  }, [currentUrl, isLoading, webviewKey]);

  if (offlineUnavailable) {
    return (
      <View style={styles.container}>
        <OfflineBanner usingCache={false} />
        <WebViewError
          message="You are offline and this page is not available. Visit it while online first, or go back to a saved page."
          onRetry={reload}
          onGoHome={goHome}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!isConnected && <OfflineBanner usingCache={usingCache} />}
      {hasError && !usingCache ? (
        <WebViewError message={errorMessage} onRetry={reload} onGoHome={goHome} />
      ) : (
        <>
          <WebView
            key={webviewKey}
            ref={webviewRef}
            source={source}
            onMessage={handleMessage}
            onNavigationStateChange={handleNavigation}
            onShouldStartLoadWithRequest={handleShouldStartLoad}
            onOpenWindow={handleOpenWindow}
            onError={handleError}
            onHttpError={handleHttpError}
            onLoad={handleLoad}
            onLoadEnd={handleLoadEnd}
            onLoadStart={() => setIsLoading(true)}
            injectedJavaScript={isConnected ? WEBVIEW_BRIDGE_SCRIPT : undefined}
            injectedJavaScriptBeforeContentLoaded={isConnected ? WEBVIEW_BRIDGE_SCRIPT : undefined}
            userAgent={APP_USER_AGENT}
            javaScriptEnabled
            cacheEnabled
            domStorageEnabled
            sharedCookiesEnabled
            thirdPartyCookiesEnabled
            pullToRefreshEnabled={isConnected}
            allowsBackForwardNavigationGestures
            setSupportMultipleWindows
            originWhitelist={['https://*', 'http://*']}
            startInLoadingState
            style={styles.webview}
          />
          {isLoading && (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color={APP_COLORS.primary} />
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