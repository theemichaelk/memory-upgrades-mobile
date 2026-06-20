import { StyleSheet, Text, View } from 'react-native';

import { getReadablePath } from '../utils/url';

type LocationBarProps = {
  currentUrl: string;
  isConnected: boolean;
};

export function LocationBar({ currentUrl, isConnected }: LocationBarProps) {
  return (
    <View style={styles.bar}>
      <View style={[styles.dot, isConnected ? styles.dotOnline : styles.dotOffline]} />
      <Text style={styles.label} numberOfLines={1}>
        {getReadablePath(currentUrl)}
      </Text>
      <Text style={styles.status}>{isConnected ? 'Online' : 'Offline'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#e5e7eb'
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4
  },
  dotOnline: {
    backgroundColor: '#16a34a'
  },
  dotOffline: {
    backgroundColor: '#f59e0b'
  },
  label: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a'
  },
  status: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600'
  }
});