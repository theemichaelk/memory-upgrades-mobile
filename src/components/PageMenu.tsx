import { useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { getPageUrl, SITE_PAGES, type SitePage, type SitePageGroup } from '../constants/pages';

type PageMenuProps = {
  visible: boolean;
  currentUrl: string;
  onClose: () => void;
  onSelectPage: (url: string) => void;
};

const GROUP_LABELS: Record<SitePageGroup, string> = {
  main: 'Main & Blog Pages',
  category: 'Categories'
};

export function PageMenu({ visible, currentUrl, onClose, onSelectPage }: PageMenuProps) {
  const [query, setQuery] = useState('');

  const menuSections = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filteredPages = SITE_PAGES.filter((page) => {
      if (!normalizedQuery) {
        return true;
      }
      return page.label.toLowerCase().includes(normalizedQuery) || page.path.toLowerCase().includes(normalizedQuery);
    });

    return [
      { group: 'main' as SitePageGroup, pages: filteredPages.filter((page) => page.group === 'main') },
      { group: 'category' as SitePageGroup, pages: filteredPages.filter((page) => page.group === 'category') }
    ].filter((section) => section.pages.length > 0);
  }, [query]);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Browse Pages</Text>
            <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Close page menu">
              <Text style={styles.closeText}>Close</Text>
            </Pressable>
          </View>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search pages..."
            placeholderTextColor="#94a3b8"
            style={styles.search}
            accessibilityLabel="Search pages"
          />
          <FlatList
            data={menuSections}
            keyExtractor={(section) => section.group}
            ListEmptyComponent={<Text style={styles.empty}>No pages match your search.</Text>}
            renderItem={({ item: section }) => (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>{GROUP_LABELS[section.group]}</Text>
                {section.pages.map((page) => {
                  const pageUrl = getPageUrl(page);
                  const isActive = currentUrl.replace(/\/$/, '') === pageUrl.replace(/\/$/, '');

                  return (
                    <Pressable
                      key={page.id}
                      style={[styles.row, isActive && styles.rowActive]}
                      onPress={() => {
                        onSelectPage(pageUrl);
                        onClose();
                        setQuery('');
                      }}
                      accessibilityRole="button"
                      accessibilityLabel={`Open ${page.label}`}
                    >
                      <Text style={[styles.rowText, isActive && styles.rowTextActive]}>{page.label}</Text>
                    </Pressable>
                  );
                })}
              </View>
            )}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(15, 23, 42, 0.45)'
  },
  sheet: {
    maxHeight: '82%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 24
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb'
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a'
  },
  closeText: {
    color: '#0f4c81',
    fontWeight: '600',
    fontSize: 15
  },
  search: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#0f172a',
    backgroundColor: '#f8fafc'
  },
  section: {
    paddingHorizontal: 12,
    paddingTop: 12
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 4,
    paddingHorizontal: 8
  },
  row: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8
  },
  rowActive: {
    backgroundColor: '#e0f2fe'
  },
  rowText: {
    fontSize: 15,
    color: '#0f172a'
  },
  rowTextActive: {
    color: '#0f4c81',
    fontWeight: '600'
  },
  empty: {
    textAlign: 'center',
    color: '#64748b',
    padding: 24,
    fontSize: 14
  }
});