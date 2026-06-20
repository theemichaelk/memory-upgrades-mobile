import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Linking, Share, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { ActionsMenu } from './src/components/ActionsMenu';
import { AppHeader } from './src/components/AppHeader';
import { AppWebView, AppWebViewHandle } from './src/components/AppWebView';
import { BottomNav, BottomNavTab } from './src/components/BottomNav';
import { PageMenu } from './src/components/PageMenu';
import { APP_ARTICLES_URL } from './src/constants';
import { APP_COLORS } from './src/constants/theme';
import { useDeepLink } from './src/hooks/useDeepLink';
import { useNetworkStatus } from './src/hooks/useNetworkStatus';
import { usePageCache } from './src/hooks/usePageCache';
import { getHomeUrl, getReadablePath, normalizeUrl } from './src/utils/url';

function resolveActiveTab(url: string, homeUrl: string): BottomNavTab {
  const normalized = normalizeUrl(url);
  if (normalized === normalizeUrl(homeUrl)) {
    return 'home';
  }
  if (normalized.includes('/blog/')) {
    return 'blog';
  }
  return 'home';
}

function AppShell() {
  const webviewRef = useRef<AppWebViewHandle>(null);
  const homeUrl = getHomeUrl();
  const [currentUrl, setCurrentUrl] = useState(homeUrl);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [actionsVisible, setActionsVisible] = useState(false);
  const [hasRestoredSession, setHasRestoredSession] = useState(false);

  const isConnected = useNetworkStatus();
  const { isHydrated, lastUrl, rememberPage, getPageForUrl } = usePageCache();

  const activeTab = useMemo(() => resolveActiveTab(currentUrl, homeUrl), [currentUrl, homeUrl]);

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

  const handleShare = useCallback(async () => {
    await Share.share({
      message: `Check out ${getReadablePath(currentUrl)} on Memory Upgrades: ${currentUrl}`,
      url: currentUrl,
      title: 'Memory Upgrades'
    });
  }, [currentUrl]);

  const handleOpenInBrowser = useCallback(() => {
    void Linking.openURL(currentUrl);
  }, [currentUrl]);

  if (!isHydrated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.bootLoader}>
          <ActivityIndicator size="large" color={APP_COLORS.primary} />
          <View style={styles.bootBadge}>
            <ActivityIndicator size="small" color="#fff" />
          </View>
        </View>
        <StatusBar style="light" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <AppHeader
        title="Memory Upgrades"
        subtitle={getReadablePath(currentUrl)}
        canGoBack={canGoBack}
        isConnected={isConnected}
        onBack={() => webviewRef.current?.goBack()}
        onMenu={() => setMenuVisible(true)}
      />
      <View style={styles.content}>
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
      </View>
      <BottomNav
        activeTab={menuVisible ? 'browse' : actionsVisible ? 'more' : activeTab}
        onHome={() => handleNavigate(homeUrl)}
        onBlog={() => handleNavigate(APP_ARTICLES_URL)}
        onBrowse={() => setMenuVisible(true)}
        onMore={() => setActionsVisible(true)}
      />
      <PageMenu
        visible={menuVisible}
        currentUrl={currentUrl}
        onClose={() => setMenuVisible(false)}
        onSelectPage={handleNavigate}
      />
      <ActionsMenu
        visible={actionsVisible}
        onClose={() => setActionsVisible(false)}
        onShare={() => void handleShare()}
        onOpenInBrowser={handleOpenInBrowser}
        onReload={() => webviewRef.current?.reload()}
      />
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_COLORS.background
  },
  content: {
    flex: 1,
    backgroundColor: APP_COLORS.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
    marginTop: -8
  },
  bootLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: APP_COLORS.primary
  },
  bootBadge: {
    marginTop: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: APP_COLORS.primaryDark,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default function App() {
  return (
    <SafeAreaProvider>
      <AppShell />
    </SafeAreaProvider>
  );
}