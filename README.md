# Memory Upgrades Mobile

Official Expo/React Native app for [memoryupgrades.org](https://www.memoryupgrades.org). The app wraps the website in a native shell with offline caching, navigation controls, and store-ready build configuration.

## Features

- Native WebView shell for the Memory Upgrades website
- Browse menu for all main site pages and blog categories
- Back, Home, Reload, Forward, and Menu controls
- Session restore to your last visited page
- Deep links and universal links for `memoryupgrades://` and `https://www.memoryupgrades.org`
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
npm run setup
npm start
```

Then scan the QR code with Expo Go, or press `a` for Android emulator / `i` for iOS simulator.

Useful checks:

```bash
npm run typecheck
npm run verify:pages
npm run doctor
```

## Project Structure

```
App.tsx                 # App shell and layout
app.config.ts           # Expo config (env-driven EAS settings)
src/
  components/           # Toolbar, WebView, page menu, banners, error UI
  constants/pages.ts    # All site pages for the browse menu
  hooks/                # Network status, page cache, deep links
  utils/                # URL helpers, cache persistence, deep links
  constants.ts
  types.ts
scripts/
  verify-site-pages.mjs # Checks every browse-menu page returns HTTP 200
```

## EAS Build Setup

1. Install and log in to EAS:

```bash
npm install -g eas-cli
eas login
```

2. Copy environment template and link the project:

```bash
cp .env.example .env
eas init
```

Set `EXPO_PUBLIC_EAS_PROJECT_ID` and `EXPO_PUBLIC_EXPO_OWNER` in `.env` after `eas init`.

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