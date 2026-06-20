import { Pressable, StyleSheet, Text, View } from 'react-native';

import { APP_COLORS } from '../constants/theme';

type AppHeaderProps = {
  title: string;
  subtitle: string;
  canGoBack: boolean;
  isConnected: boolean;
  onBack: () => void;
  onMenu: () => void;
};

export function AppHeader({ title, subtitle, canGoBack, isConnected, onBack, onMenu }: AppHeaderProps) {
  return (
    <View style={styles.header}>
      <Pressable
        style={[styles.sideButton, !canGoBack && styles.sideButtonHidden]}
        onPress={onBack}
        disabled={!canGoBack}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Text style={styles.sideButtonText}>‹</Text>
      </Pressable>

      <View style={styles.center}>
        <Text style={styles.brand}>Memory Upgrades</Text>
        <View style={styles.subtitleRow}>
          <View style={[styles.statusDot, isConnected ? styles.online : styles.offline]} />
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        </View>
      </View>

      <Pressable style={styles.sideButton} onPress={onMenu} accessibilityRole="button" accessibilityLabel="Open menu">
        <Text style={styles.menuIcon}>☰</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: APP_COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: APP_COLORS.primaryDark
  },
  sideButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sideButtonHidden: {
    opacity: 0
  },
  sideButtonText: {
    color: '#fff',
    fontSize: 28,
    lineHeight: 30,
    fontWeight: '300',
    marginTop: -2
  },
  menuIcon: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700'
  },
  center: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 4
  },
  brand: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700'
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
    maxWidth: '100%'
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4
  },
  online: {
    backgroundColor: APP_COLORS.online
  },
  offline: {
    backgroundColor: APP_COLORS.offline
  },
  subtitle: {
    color: '#dbeafe',
    fontSize: 12,
    fontWeight: '500',
    flexShrink: 1
  }
});