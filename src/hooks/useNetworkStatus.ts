import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

export function useNetworkStatus(): boolean {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const reachable = state.isInternetReachable;
      setIsConnected(Boolean(state.isConnected && reachable !== false));
    });

    return unsubscribe;
  }, []);

  return isConnected;
}