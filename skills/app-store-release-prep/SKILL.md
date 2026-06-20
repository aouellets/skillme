---
name: App Store Release Prep
description: Produce a reproducible signing, versioning, and store-declaration pipeline so an iOS or Android build passes App Store Connect / Play Console submission. Use when building or uploading a distribution .ipa/.aab, fixing signing/provisioning-profile or entitlement errors, bumping CFBundleVersion/versionCode, filling App Privacy / Data safety forms or PrivacyInfo.xcprivacy, wiring Fastlane lanes, or diagnosing a store rejection. Do NOT use for general (non-mobile) release steps like changelogs, tagging, or backend deploys — use prepare-release instead; do NOT use for store listing titles, descriptions, or keywords — use app-store-copy instead.
---
# App Store Release Prep

Turn a mobile release into a reproducible pipeline — correct signing, monotonic build numbers, complete privacy declarations — so submission to App Store Connect or Play Console succeeds on the first upload.

## Workflow

1. **Establish identity and signing first; it is the most common blocker.**
   - iOS: a distribution build needs a distribution certificate plus a provisioning profile whose app id, capabilities, and entitlements all match the build. Store and sync these with Fastlane `match` in a shared encrypted repo so every machine and CI sign identically. Verify the profile matches the bundle id and enabled capabilities before building.
   - Android: sign with an upload key and enroll in Play App Signing so Google holds the app signing key. A lost upload key is recoverable via the Play Console; protect the app signing key regardless.

2. **Set both version numbers correctly.**
   - Marketing version (`CFBundleShortVersionString` / `versionName`) is human-facing and may repeat across uploads.
   - Build number (`CFBundleVersion` / `versionCode`) must strictly increase on every upload — including re-uploads of a rejected build. Automate it with `increment_build_number` or derive it from the CI build count so you never collide with an existing upload.

3. **Build the signed artifact through a defined lane.**
   - Define Fastlane lanes: `build`, `beta`, `release`. Use `gym`/`build_app` to produce the signed `.ipa`/`.aab`, `pilot`/`upload_to_testflight` and `supply`/`upload_to_play_store` to push it, `deliver` for metadata/screenshots.
   - Run the lane on a tagged commit in CI so releases are reproducible, not laptop-dependent.

4. **Complete gating declarations — they cause rejection, not warnings.**
   - iOS: fill the App Privacy "nutrition labels" and ship `PrivacyInfo.xcprivacy` declaring data use and required-reason API usage.
   - Android: complete the Data safety form and target an API level meeting the Play requirement for the submission window (check the Play Console for the enforced minimum).
   - Provide screenshots in every required device size.
   - Confirm each declaration matches actual runtime behavior; a mismatch between the form and the code is a rejection.

5. **Pre-empt the frequent rejection reasons before submitting.**
   - Provide working demo credentials and reviewer notes; ensure the app does not crash on review and has no placeholder content (Apple 2.1).
   - Remove duplicate/spam-like clones (Apple 4.3).
   - Collect no data before consent or without a stated reason (Apple 5.1.1).
   - Ship in-app account deletion if the app supports account creation.
   - Android: justify background-location use and ensure no Data safety mismatch.

6. **Tier the rigor by track.**
   - For internal/TestFlight/Play-internal builds you may skip store-metadata polish — but never skip signing correctness or the build-number bump, since both break the pipeline for every downstream upload.

## Quality bar

- Signing assets are version-controlled and reproducible (e.g. `match`), not emailed `.p12` files.
- Build number is monotonic and incremented automatically, verified greater than the last uploaded build.
- Privacy/Data-safety declarations and `PrivacyInfo.xcprivacy` exactly match what the code does at runtime.
- A clean checkout on CI can produce and upload the build from a tag with no manual signing steps.

## Do NOT

- Do not hand-manage signing certificates or share `.p12`/keystores by email or chat.
- Do not reuse or hand-pick a build number; never upload with a number equal to or below an existing one.
- Do not declare privacy/data usage that contradicts the shipped code, or omit required-reason API entries.
- Do not submit without working demo credentials, reviewer notes, and account deletion (when accounts exist).
- Do not run the release from a developer laptop when a CI lane on a tagged commit is the auditable path.
