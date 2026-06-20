import * as Linking from 'expo-linking';
import { useEffect } from 'react';

import { resolveDeepLink } from '../utils/deepLink';

export function useDeepLink(onNavigate: (url: string) => void) {
  useEffect(() => {
    const handleUrl = (url: string) => {
      const resolved = resolveDeepLink(url);
      if (resolved) {
        onNavigate(resolved);
      }
    };

    void Linking.getInitialURL().then((url) => {
      if (url) {
        handleUrl(url);
      }
    });

    const subscription = Linking.addEventListener('url', (event) => {
      handleUrl(event.url);
    });

    return () => subscription.remove();
  }, [onNavigate]);
}