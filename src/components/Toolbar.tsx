import { Pressable, StyleSheet, Text, View } from 'react-native';

type ToolbarProps = {
  canGoBack: boolean;
  canGoForward: boolean;
  onBack: () => void;
  onForward: () => void;
  onReload: () => void;
  onHome: () => void;
};

export function Toolbar({
  canGoBack,
  canGoForward,
  onBack,
  onForward,
  onReload,
  onHome
}: ToolbarProps) {
  return (
    <View style={styles.toolbar}>
      <Pressable
        style={[styles.button, !canGoBack && styles.buttonDisabled]}
        onPress={onBack}
        disabled={!canGoBack}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Text style={styles.buttonText}>Back</Text>
      </Pressable>
      <Pressable
        style={styles.button}
        onPress={onHome}
        accessibilityRole="button"
        accessibilityLabel="Go to home page"
      >
        <Text style={styles.buttonText}>Home</Text>
      </Pressable>
      <Pressable
        style={styles.button}
        onPress={onReload}
        accessibilityRole="button"
        accessibilityLabel="Reload page"
      >
        <Text style={styles.buttonText}>Reload</Text>
      </Pressable>
      <Pressable
        style={[styles.button, !canGoForward && styles.buttonDisabled]}
        onPress={onForward}
        disabled={!canGoForward}
        accessibilityRole="button"
        accessibilityLabel="Go forward"
      >
        <Text style={styles.buttonText}>Next</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f8fafc',
    paddingVertical: 8,
    paddingHorizontal: 4
  },
  button: {
    backgroundColor: '#0f4c81',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 72,
    alignItems: 'center'
  },
  buttonDisabled: {
    opacity: 0.4
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13
  }
});