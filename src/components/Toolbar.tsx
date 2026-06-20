import { Pressable, StyleSheet, Text, View } from 'react-native';

type ToolbarProps = {
  canGoBack: boolean;
  canGoForward: boolean;
  onMenu: () => void;
  onBack: () => void;
  onForward: () => void;
  onMore: () => void;
  onHome: () => void;
};

export function Toolbar({
  canGoBack,
  canGoForward,
  onMenu,
  onBack,
  onForward,
  onMore,
  onHome
}: ToolbarProps) {
  return (
    <View style={styles.toolbar}>
      <Pressable
        style={styles.button}
        onPress={onMenu}
        accessibilityRole="button"
        accessibilityLabel="Open page menu"
      >
        <Text style={styles.buttonText}>Menu</Text>
      </Pressable>
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
        style={[styles.button, !canGoForward && styles.buttonDisabled]}
        onPress={onForward}
        disabled={!canGoForward}
        accessibilityRole="button"
        accessibilityLabel="Go forward"
      >
        <Text style={styles.buttonText}>Next</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={onMore} accessibilityRole="button" accessibilityLabel="More actions">
        <Text style={styles.buttonText}>More</Text>
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
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 58,
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