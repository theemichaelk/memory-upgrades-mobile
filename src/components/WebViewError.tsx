import { Pressable, StyleSheet, Text, View } from 'react-native';

type WebViewErrorProps = {
  message: string;
  onRetry: () => void;
};

export function WebViewError({ message, onRetry }: WebViewErrorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Unable to load page</Text>
      <Text style={styles.message}>{message}</Text>
      <Pressable style={styles.button} onPress={onRetry} accessibilityRole="button" accessibilityLabel="Retry loading page">
        <Text style={styles.buttonText}>Try Again</Text>
      </Pressable>
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
  button: {
    backgroundColor: '#0f4c81',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600'
  }
});