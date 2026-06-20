import { Pressable, StyleSheet, Text, View } from 'react-native';

type WebViewErrorProps = {
  message: string;
  onRetry: () => void;
  onGoHome?: () => void;
};

export function WebViewError({ message, onRetry, onGoHome }: WebViewErrorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Unable to load page</Text>
      <Text style={styles.message}>{message}</Text>
      <View style={styles.actions}>
        <Pressable style={styles.button} onPress={onRetry} accessibilityRole="button" accessibilityLabel="Retry loading page">
          <Text style={styles.buttonText}>Try Again</Text>
        </Pressable>
        {onGoHome && (
          <Pressable
            style={[styles.button, styles.buttonSecondary]}
            onPress={onGoHome}
            accessibilityRole="button"
            accessibilityLabel="Go to home page"
          >
            <Text style={[styles.buttonText, styles.buttonSecondaryText]}>Go Home</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f8fafc'
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8
  },
  message: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    marginBottom: 20
  },
  actions: {
    gap: 10,
    width: '100%',
    maxWidth: 220
  },
  button: {
    backgroundColor: '#0f4c81',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center'
  },
  buttonSecondary: {
    backgroundColor: '#e2e8f0'
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600'
  },
  buttonSecondaryText: {
    color: '#0f172a'
  }
});