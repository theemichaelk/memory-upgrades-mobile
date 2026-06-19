import { StatusBar } from 'expo-status-bar';
import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, View } from 'react-native';

import { AppWebView, AppWebViewHandle } from './src/components/AppWebView';
import { Toolbar } from './src/components/Toolbar';
import { useNetworkStatus } from './src/hooks/useNetworkStatus';
import { usePageCache } from './src/hooks/usePageCache';
import { getHomeUrl } from './src/utils/url';

export default function App() {
  const webviewRef = useRef<AppWebViewHandle>(null);
  const homeUrl = getHomeUrl();
  const [currentUrl, setCurrentUrl] = useState(homeUrl);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  const isConnected = useNetworkStatus();
  const { isHydrated, rememberPage, getPageForUrl } = usePageCache();

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
    <SafeAreaView style={styles.container}>
      <Toolbar
        canGoBack={canGoBack}
        canGoForward={canGoForward}
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