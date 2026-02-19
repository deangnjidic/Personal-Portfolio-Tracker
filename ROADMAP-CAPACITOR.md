# 📱 Capacitor Native App Roadmap

Converting Free Portfolio Tracker to a native Android & iOS app using [Capacitor](https://capacitorjs.com/).

---

## Overview

Capacitor wraps the existing HTML/CSS/JS codebase into a native WebView shell, producing a real `.apk`/`.aab` for Google Play and `.ipa` for the App Store. No framework rewrite needed.

---

## Prerequisites

### Tools (install once)
- [ ] [Node.js](https://nodejs.org/) v18+ and npm
- [ ] [Android Studio](https://developer.android.com/studio) (for Android builds)
- [ ] Xcode 15+ on a Mac (for iOS builds — **Mac required**)
- [ ] Java JDK 17+ (bundled with Android Studio)

### Accounts
- [ ] [Google Play Console](https://play.google.com/console) — $25 one-time fee
- [ ] [Apple Developer Program](https://developer.apple.com/programs/) — $99/year (required for iOS)

---

## Phase 1 — Project Setup

- [ ] Initialise `package.json` in the project root
  ```bash
  npm init -y
  ```
- [ ] Install Capacitor core and CLI
  ```bash
  npm install @capacitor/core
  npm install -D @capacitor/cli
  ```
- [ ] Initialise Capacitor (app name, bundle ID, web dir)
  ```bash
  npx cap init "Free Portfolio Tracker" "com.freeportfoliotracker.app" --web-dir .
  ```
- [ ] Install Android and iOS platforms
  ```bash
  npm install @capacitor/android @capacitor/ios
  npx cap add android
  npx cap add ios
  ```
- [ ] Verify `capacitor.config.json` looks correct:
  ```json
  {
    "appId": "com.freeportfoliotracker.app",
    "appName": "Free Portfolio Tracker",
    "webDir": ".",
    "server": {
      "androidScheme": "https"
    }
  }
  ```

---

## Phase 2 — Web App Adjustments

These changes make the web app behave properly inside a native shell.

- [ ] **Add `manifest.json`** — required for splash screen / app identity
- [ ] **Viewport & safe areas** — add CSS env variables for notch/home bar on modern phones:
  ```css
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  ```
- [ ] **Disable text selection** on non-input elements (feels more native)
- [ ] **Disable long-press context menu** on images/links where not needed
- [ ] **Fix `alert()` / `confirm()` dialogs** — replace with custom modal UI (native WebView may style these poorly)
- [ ] **Touch targets** — audit all buttons to be minimum 44×44px (Apple HIG requirement)
- [ ] **Remove hover-only interactions** — ensure all hover states also work on tap
- [ ] **Test `localStorage`** — works fine in Capacitor's WebView, no changes needed
- [ ] **Audit external links** — links to `finnhub.io`, `metals.dev` etc. should open in the system browser, not inside the app:
  ```bash
  npm install @capacitor/browser
  ```

---

## Phase 3 — Native Configuration

### Android
- [ ] Open Android project: `npx cap open android`
- [ ] Set app icon (1024×1024 adaptive icon) in `android/app/src/main/res/`
- [ ] Set splash screen colours in `android/app/src/main/res/values/styles.xml`
- [ ] Install Capacitor splash screen plugin:
  ```bash
  npm install @capacitor/splash-screen
  npx cap sync
  ```
- [ ] Configure `AndroidManifest.xml`:
  - [ ] Internet permission (already added by Capacitor)
  - [ ] Set `minSdkVersion` to 24 (Android 7.0+)
  - [ ] Set `targetSdkVersion` to 34
- [ ] Set app version in `android/app/build.gradle`

### iOS
- [ ] Open iOS project: `npx cap open ios`
- [ ] Set app icon set in `App/App/Assets.xcassets/AppIcon.appiconset/`
- [ ] Set splash screen in `App/App/Assets.xcassets/Splash.imageset/`
- [ ] Configure `Info.plist`:
  - [ ] `NSAppTransportSecurity` — allow HTTPS API calls to Finnhub and metals.dev
  - [ ] Set display name, version, bundle ID
- [ ] Set deployment target to iOS 15.0+
- [ ] Configure signing — add your Apple Developer Team ID in Xcode

---

## Phase 4 — Build & Test

### Development testing
```bash
# Sync web files to native projects
npx cap sync

# Run on Android emulator or connected device
npx cap run android

# Run on iOS simulator (Mac only)
npx cap run ios
```

- [ ] Test on Android emulator (Pixel 6 Pro, API 34)
- [ ] Test on Android physical device
- [ ] Test on iOS Simulator (iPhone 15, iOS 17)
- [ ] Test on iOS physical device (requires paid Apple Developer account)

### What to test
- [ ] All pages load correctly
- [ ] Navigation works
- [ ] Charts render (Chart.js works fine in WebView)
- [ ] `localStorage` reads/writes correctly
- [ ] API calls to Finnhub and metals.dev succeed
- [ ] External links open in system browser
- [ ] Back button behaviour on Android
- [ ] Safe area insets (notch, home bar) look correct
- [ ] Orientation lock or handling (portrait recommended)

---

## Phase 5 — Production Builds

### Android — Google Play
- [ ] Generate signed release APK/AAB:
  - Create a keystore: `keytool -genkey -v -keystore release.keystore ...`
  - Configure signing in `android/app/build.gradle`
  - Build: `./gradlew bundleRelease` (from `android/` folder)
- [ ] Create Google Play Console listing:
  - [ ] App title, description, screenshots (phone + tablet)
  - [ ] Feature graphic (1024×500)
  - [ ] Privacy policy URL (already have `privacy.html`)
  - [ ] Content rating questionnaire
- [ ] Upload `.aab` to Play Console → Internal Testing → Production

### iOS — App Store
- [ ] Archive build in Xcode: Product → Archive
- [ ] Upload to App Store Connect via Xcode Organizer
- [ ] Create App Store listing:
  - [ ] App title, subtitle, description, keywords
  - [ ] Screenshots (6.7" iPhone, 12.9" iPad)
  - [ ] Privacy policy URL
  - [ ] Age rating
- [ ] Submit for Apple Review (typically 1–3 days)

---

## Phase 6 — Optional Native Enhancements

These are not required but improve the native feel significantly.

| Feature | Plugin | Priority |
|---|---|---|
| Push notifications (price alerts) | `@capacitor/push-notifications` | Medium |
| Biometric lock (Face ID / fingerprint) | `@capacitor/biometrics` | Medium |
| Share portfolio snapshot as image | `@capacitor/share` | Low |
| Haptic feedback on button taps | `@capacitor/haptics` | Low |
| Status bar colour matching app theme | `@capacitor/status-bar` | High |
| Prevent screen sleep during refresh | `@capacitor/keep-awake` | Low |
| Deep linking (open app from URL) | Capacitor built-in | Low |

---

## Sync Workflow (ongoing)

After any web code change:
```bash
npx cap sync        # copies web files + updates plugins
npx cap run android # test on Android
npx cap run ios     # test on iOS
```

---

## Estimated Effort

| Phase | Estimated Time |
|---|---|
| Phase 1 — Setup | 1–2 hours |
| Phase 2 — Web adjustments | 3–6 hours |
| Phase 3 — Native config | 2–4 hours |
| Phase 4 — Build & test | 4–8 hours |
| Phase 5 — Store submission | 2–4 hours |
| **Total** | **~12–24 hours** |

> iOS store review adds 1–3 days of waiting. Android review is typically under 24 hours.

---

## Monetisation Strategy

| Platform | Model |
|---|---|
| Web (freeportfoliotracker.com) | Free, open source, always |
| Google Play | $4.99 one-time purchase, no ads |
| App Store | $4.99 one-time purchase, no ads |

### Rationale
- **No ads** — finance apps with ads appear untrustworthy. Showing someone their net worth alongside loan/crypto ads would undermine the product's credibility. Ad SDKs also introduce tracking, which directly contradicts the app's privacy-first, local-data positioning.
- **No subscription** — a portfolio tracker has no server costs or ongoing data delivery that would justify recurring billing. Users would rightly question it.
- **No "pay to remove ads"** — anchors the experience as bad by default and feels punishing.
- **One-time $4.99** — charges for the native experience (which requires real build and maintenance effort) without compromising the trust that makes the product valuable. Users who won't pay can always use the free web version.
- **Open source web version** — the open source codebase is the credibility signal. It lets users verify that their financial data never leaves their device. Keeping it open source is a feature, not a cost.

---

## Resources

- [Capacitor Docs](https://capacitorjs.com/docs)
- [Capacitor Android Guide](https://capacitorjs.com/docs/android)
- [Capacitor iOS Guide](https://capacitorjs.com/docs/ios)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [App Store Connect Help](https://developer.apple.com/help/app-store-connect/)
