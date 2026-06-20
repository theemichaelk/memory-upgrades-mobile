import type { ConfigContext, ExpoConfig } from 'expo/config';

const EAS_PROJECT_ID = process.env.EXPO_PUBLIC_EAS_PROJECT_ID ?? 'REPLACE_WITH_EAS_PROJECT_ID';
const EXPO_OWNER = process.env.EXPO_PUBLIC_EXPO_OWNER ?? 'REPLACE_WITH_EXPO_ACCOUNT';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Memory Upgrades',
  slug: 'memory-upgrades-mobile',
  scheme: 'memoryupgrades',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  description:
    'Official Memory Upgrades app for cognitive training, memory coaching, and brain health resources.',
  primaryColor: '#0f4c81',
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff'
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'org.memoryupgrades.mobile',
    buildNumber: '1',
    associatedDomains: ['applinks:www.memoryupgrades.org', 'applinks:memoryupgrades.org'],
    infoPlist: {
      NSAppTransportSecurity: {
        NSAllowsArbitraryLoads: false
      }
    }
  },
  android: {
    package: 'org.memoryupgrades.mobile',
    versionCode: 1,
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/android-icon-foreground.png',
      backgroundImage: './assets/android-icon-background.png',
      monochromeImage: './assets/android-icon-monochrome.png'
    },
    permissions: ['INTERNET'],
    predictiveBackGestureEnabled: false,
    intentFilters: [
      {
        action: 'VIEW',
        autoVerify: true,
        data: [
          { scheme: 'https', host: 'www.memoryupgrades.org', pathPrefix: '/' },
          { scheme: 'https', host: 'memoryupgrades.org', pathPrefix: '/' }
        ],
        category: ['BROWSABLE', 'DEFAULT']
      }
    ]
  },
  web: {
    favicon: './assets/favicon.png'
  },
  plugins: [
    [
      'expo-build-properties',
      {
        android: {
          usesCleartextTraffic: false
        }
      }
    ]
  ],
  extra: {
    eas: {
      projectId: EAS_PROJECT_ID
    }
  },
  owner: EXPO_OWNER
});