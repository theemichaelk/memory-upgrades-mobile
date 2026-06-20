import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

type ActionsMenuProps = {
  visible: boolean;
  onClose: () => void;
  onShare: () => void;
  onOpenInBrowser: () => void;
  onReload: () => void;
};

export function ActionsMenu({ visible, onClose, onShare, onOpenInBrowser, onReload }: ActionsMenuProps) {
  const actions = [
    { id: 'share', label: 'Share Page', onPress: onShare },
    { id: 'browser', label: 'Open in Browser', onPress: onOpenInBrowser },
    { id: 'reload', label: 'Reload Page', onPress: onReload }
  ];

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.sheet}>
          <Text style={styles.title}>More Actions</Text>
          {actions.map((action) => (
            <Pressable
              key={action.id}
              style={styles.row}
              onPress={() => {
                action.onPress();
                onClose();
              }}
              accessibilityRole="button"
              accessibilityLabel={action.label}
            >
              <Text style={styles.rowText}>{action.label}</Text>
            </Pressable>
          ))}
          <Pressable style={styles.cancel} onPress={onClose} accessibilityRole="button" accessibilityLabel="Cancel">
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </View>
      </Pressable>
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
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 24
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb'
  },
  row: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#f1f5f9'
  },
  rowText: {
    fontSize: 16,
    color: '#0f172a'
  },
  cancel: {
    paddingHorizontal: 20,
    paddingTop: 16
  },
  cancelText: {
    fontSize: 16,
    color: '#0f4c81',
    fontWeight: '600',
    textAlign: 'center'
  }
});