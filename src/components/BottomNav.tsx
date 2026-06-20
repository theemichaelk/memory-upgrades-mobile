import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { APP_COLORS } from '../constants/theme';

export type BottomNavTab = 'home' | 'blog' | 'browse' | 'more';

type BottomNavProps = {
  activeTab: BottomNavTab;
  onHome: () => void;
  onBlog: () => void;
  onBrowse: () => void;
  onMore: () => void;
};

const TABS: { id: BottomNavTab; label: string; icon: string }[] = [
  { id: 'home', label: 'Home', icon: '⌂' },
  { id: 'blog', label: 'Articles', icon: '✦' },
  { id: 'browse', label: 'Explore', icon: '▦' },
  { id: 'more', label: 'More', icon: '⋯' }
];

export function BottomNav({ activeTab, onHome, onBlog, onBrowse, onMore }: BottomNavProps) {
  const insets = useSafeAreaInsets();

  const handlers: Record<BottomNavTab, () => void> = {
    home: onHome,
    blog: onBlog,
    browse: onBrowse,
    more: onMore
  };

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <Pressable
            key={tab.id}
            style={[styles.tab, isActive && styles.tabActive]}
            onPress={handlers[tab.id]}
            accessibilityRole="button"
            accessibilityLabel={tab.label}
          >
            <Text style={[styles.icon, isActive && styles.iconActive]}>{tab.icon}</Text>
            <Text style={[styles.label, isActive && styles.labelActive]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: APP_COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: APP_COLORS.border,
    paddingTop: 6,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
    elevation: 8
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4
  },
  tabActive: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    marginHorizontal: 4
  },
  icon: {
    fontSize: 18,
    color: APP_COLORS.textMuted,
    marginBottom: 2
  },
  iconActive: {
    color: APP_COLORS.primary
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: APP_COLORS.textMuted
  },
  labelActive: {
    color: APP_COLORS.primary
  }
});