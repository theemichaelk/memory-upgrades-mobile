import { StyleSheet, Text, View } from 'react-native';

type OfflineBannerProps = {
  usingCache: boolean;
};

export function OfflineBanner({ usingCache }: OfflineBannerProps) {
  return (
    <View style={styles.banner}>
      <Text style={styles.bannerText}>
        {usingCache
          ? 'Offline mode: showing your last saved page.'
          : 'You are offline. Connect to the internet to load new pages.'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#fffbeb',
    borderBottomWidth: 1,
    borderColor: '#fde68a',
    padding: 8
  },
  bannerText: {
    color: '#92400e',
    textAlign: 'center',
    fontSize: 12
  }
});