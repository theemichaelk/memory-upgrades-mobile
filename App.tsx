import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { AppWebView, AppWebViewHandle } from './src/components/AppWebView';
import { PageMenu } from './src/components/PageMenu';
import { Toolbar } from './src/components/Toolbar';
import { useDeepLink } from './src/hooks/useDeepLink';
import { useNetworkStatus } from './src/hooks/useNetworkStatus';
import { usePageCache } from './src/hooks/usePageCache';
import { getHomeUrl, normalizeUrl } from './src/utils/url';

function AppShell() {
  const webviewRef = useRef<AppWebViewHandle>(null);
  const homeUrl = getHomeUrl();
  const [currentUrl, setCurrentUrl] = useState(homeUrl);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [hasRestoredSession, setHasRestoredSession] = useState(false);

  const isConnected = useNetworkStatus();
  const { isHydrated, lastUrl, rememberPage, getPageForUrl } = usePageCache();

  const handleNavigate = useCallback((url: string) => {
    setCurrentUrl(normalizeUrl(url));
  }, []);

  useDeepLink(handleNavigate);

  useEffect(() => {
    if (isHydrated && !hasRestoredSession) {
      setCurrentUrl(lastUrl);
      setHasRestoredSession(true);
    }
  }, [hasRestoredSession, isHydrated, lastUrl]);

  const handleNavigationStateChange = useCallback((state: { canGoBack: boolean; canGoForward: boolean }) => {
    setCanGoBack(state.canGoBack);
    setCanGoForward(state.canGoForward);
  }, []);

  if (!isHydrated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.bootLoader}>
          <ActivityIndicator size="large" color="#0f4c81" />
        </View>
        <StatusBar style="dark" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Toolbar
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        onMenu={() => setMenuVisible(true)}
        onBack={() => webviewRef.current?.goBack()}
        onForward={() => webviewRef.current?.goForward()}
        onReload={() => webviewRef.current?.reload()}
        onHome={() => webviewRef.current?.goHome()}
      />
      <AppWebView
        ref={webviewRef}
        isConnected={isConnected}
        homeUrl={homeUrl}
        currentUrl={currentUrl}
        getCachedPage={getPageForUrl}
        onPageCached={rememberPage}
        onUrlChange={setCurrentUrl}
        onNavigationStateChange={handleNavigationStateChange}
      />
      <PageMenu
        visible={menuVisible}
        currentUrl={currentUrl}
        onClose={() => setMenuVisible(false)}
        onSelectPage={handleNavigate}
      />
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  bootLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default function App() {
  return (
    <SafeAreaProvider>
      <AppShell />
    </SafeAreaProvider>
  );
}