# App Store Submission Guide — Somion

## Prerequisites

- macOS with Xcode 15+ installed
- Apple Developer account ($99/year) — https://developer.apple.com
- Node.js 18+
- CocoaPods (`sudo gem install cocoapods`)

## Step-by-step

### 1. Build the web app

```bash
npm install --include=dev
npm run build
```

### 2. Initialize Capacitor iOS project

```bash
npx cap init Somion app.somion.coach --web-dir dist
npx cap add ios
npx cap sync ios
```

### 3. Copy Apple Privacy Manifest

```bash
cp appstore/PrivacyInfo.xcprivacy ios/App/App/PrivacyInfo.xcprivacy
```

Then in Xcode, right-click the **App** group → "Add Files to App" → select `PrivacyInfo.xcprivacy`.

### 4. Open in Xcode

```bash
npx cap open ios
```

### 5. Configure in Xcode

#### Bundle Identifier
`app.somion.coach`

#### Signing
- Select your Team under Signing & Capabilities
- Enable "Automatically manage signing"

#### App Icon
- Open `ios/App/App/Assets.xcassets/AppIcon.appiconset`
- Replace with your 1024×1024 icon (no alpha, no rounded corners)
- Xcode will generate all required sizes

#### Display Name
Set to `Somion` in the target's General tab.

#### Deployment Target
Set to iOS 16.0 minimum (covers 95%+ of active iPhones).

#### Safe Areas
Already handled in CSS via `env(safe-area-inset-*)`. The `viewport-fit=cover` meta tag is set in `index.html`.

#### Orientation
Lock to Portrait in General → Deployment Info if desired.

### 6. Apple App Site Association (Universal Links)

Upload `public/apple-app-site-association` to `https://somion.app/.well-known/apple-app-site-association`.

Replace `TEAMID` in the file with your actual Apple Team ID.

### 7. App Store Connect Setup

1. Go to https://appstoreconnect.apple.com
2. Create a new app:
   - Platform: iOS
   - Bundle ID: `app.somion.coach`
   - Name: `Somion — Recovery Coach`
   - Primary language: English (U.S.)
   - SKU: `somion-coach-001`

3. Fill in metadata from `appstore/metadata.md`:
   - Description, keywords, subtitle
   - Support URL: `https://somion.app/support`
   - Privacy Policy URL: `https://somion.app/privacy`
   - Marketing URL: `https://somion.app`

4. **Age Rating Questionnaire**: Select 12+ for "Medical/Treatment Information — Infrequent/Mild"

5. **App Privacy (Nutrition Labels)**:
   - Email Address → App Functionality, linked to identity
   - Health & Fitness → App Functionality, linked to identity
   - No tracking, no third-party advertising

6. **Account Deletion**: Point to `https://somion.app/account-deletion`

### 8. Screenshots

Required sizes (see `appstore/metadata.md` for full list):
- iPhone 6.7" (1290×2796)
- iPhone 6.5" (1284×2778)  
- iPhone 5.5" (1242×2208)
- iPad Pro 12.9" (2048×2732) — if supporting iPad

Use Xcode Simulator to capture. Suggested flow:
1. Landing page
2. Today dashboard
3. Morning check-in
4. Train page with exercises
5. Recovery trends
6. Settings

### 9. Build & Upload

```bash
# Sync latest web build into iOS
npm run build:ios

# In Xcode:
# 1. Select "Any iOS Device (arm64)" as destination
# 2. Product → Archive
# 3. Distribute App → App Store Connect → Upload
```

### 10. Submit for Review

In App Store Connect:
1. Select the uploaded build
2. Add screenshots
3. Fill in "What's New" (for updates)
4. Add Review Notes from `appstore/metadata.md`
5. Submit for Review

## Required URLs (must be live before submission)

| URL | Purpose | Status |
|-----|---------|--------|
| `https://somion.app/privacy` | Privacy Policy | ✅ In-app, needs hosting |
| `https://somion.app/terms` | Terms of Service | ✅ In-app, needs hosting |
| `https://somion.app/support` | Support page | ✅ In-app, needs hosting |
| `https://somion.app/account-deletion` | Data deletion | ✅ In-app, needs hosting |
| `https://somion.app/health-disclaimer` | Health disclaimer | ✅ In-app, needs hosting |

All pages exist as in-app routes. When you deploy the web app (Vercel, Netlify, etc.), these URLs will be live automatically.

## Common Rejection Reasons & How We Handle Them

| Reason | Our Status |
|--------|-----------|
| Missing privacy policy | ✅ `/privacy` route + linked in footer + App Store Connect |
| No account deletion | ✅ `/account-deletion` route with in-app deletion flow |
| Health claims without disclaimer | ✅ `/health-disclaimer` + disclaimer in Terms |
| Missing privacy nutrition labels | ✅ `PrivacyInfo.xcprivacy` + App Store Connect questionnaire guide above |
| App doesn't work without hardware | ✅ Falls back to sample data without Oura Ring |
| Incomplete metadata | ✅ Full metadata in `appstore/metadata.md` |
