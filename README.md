# Memory Upgrades Mobile

Official Expo/React Native app for [memoryupgrades.org](https://www.memoryupgrades.org). The app wraps the website in a native shell with offline caching, navigation controls, and store-ready build configuration.

## Features

- Native WebView shell for the Memory Upgrades website
- Back, Home, Reload, and Forward controls
- Offline support with per-page HTML caching (up to 25 pages, 7-day TTL)
- Pull-to-refresh on supported platforms
- External links open in the device browser
- Error screen with retry
- EAS Build profiles for development, preview, and production

## Requirements

- Node.js 20+
- npm 10+
- Expo Go for local testing, or EAS CLI for device builds

## Local Development

```bash
npm install
npm start
```

Then scan the QR code with Expo Go, or press `a` for Android emulator / `i` for iOS simulator.

Useful checks:

```bash
npm run typecheck
npm run doctor
```

## Project Structure

```
App.tsx                 # App shell and layout
src/
  components/           # Toolbar, WebView, banners, error UI
  hooks/                # Network status and page cache
  utils/                # URL helpers and cache persistence
  constants.ts
  types.ts
```

## EAS Build Setup

1. Install and log in to EAS:

```bash
npm install -g eas-cli
eas login
```

2. Link the project:

```bash
eas init
```

This updates `app.json` with your Expo account owner and `extra.eas.projectId`.

3. Replace placeholder submit values in `eas.json` before store submission:
   - iOS: `appleId`, `ascAppId`, `appleTeamId`
   - Android: `google-play-service-account.json`

## Build Commands

Preview APK / internal build:

```bash
npm run build:preview:android
npm run build:preview:ios
```

Production store build:

```bash
npm run build:android
npm run build:ios
```

Submit to stores after a production build:

```bash
npm run submit:android
npm run submit:ios
```

## App Identifiers

| Platform | Identifier |
|----------|------------|
| iOS bundle ID | `org.memoryupgrades.mobile` |
| Android package | `org.memoryupgrades.mobile` |
| Deep link scheme | `memoryupgrades://` |

## Offline Behavior

When the device loses connectivity:

1. The app checks AsyncStorage for a cached copy of the current page.
2. If found, it renders the saved HTML with a base URL of `https://www.memoryupgrades.org`.
3. If not found, it shows an offline message.

Cached pages are refreshed automatically whenever the user visits them online.

## Notes

- Do not commit `.expo/`, `node_modules/`, or store credentials.
- Add `google-play-service-account.json` locally only; it is gitignored.
- Run `eas build` from this directory after `eas login` and `eas init`.