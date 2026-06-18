---
name: App Store Release Prep
description: Prepares signing, build config, and store metadata for App Store and Play submission including provisioning, versioning, Fastlane, and common rejection reasons. Use when preparing a mobile release or submission.
---
# App Store Release Prep
Shipping fails on the boring parts: a mismatched provisioning profile, a forgotten version bump, a privacy declaration. Treat release as a reproducible pipeline, not a manual ritual you rediscover under deadline pressure.

## Signing Is the Most Common Blocker
On iOS, a distribution build needs a distribution certificate plus a provisioning profile whose app id, capabilities, and entitlements all match the build. Mismatch is the #1 build failure. Use Fastlane match to store and sync signing assets in a shared encrypted repo so the whole team and CI sign identically — stop emailing .p12 files. On Android, sign with an upload key and enroll in Play App Signing so Google manages the app signing key; losing the upload key is recoverable, losing the app signing key historically was not.

## Versioning Has Two Numbers, Use Both Right
The marketing version (CFBundleShortVersionString / versionName) is human-facing and can repeat across builds. The build number (CFBundleVersion / versionCode) must strictly increase for every upload to App Store Connect or Play, even for a rejected build. Automate the bump (Fastlane increment_build_number, or derive from CI build count) so you never collide with an already-uploaded build.

## Automate the Pipeline with Fastlane
Define lanes: build, beta (TestFlight / Play internal track), and release. gym/build_app produces the signed artifact, pilot/upload_to_testflight and supply/upload_to_play_store push it, deliver handles metadata and screenshots. CI runs the lane on a tagged commit so releases are reproducible and auditable, not laptop-dependent.

## Metadata and Privacy Are Gating
Apple requires accurate App Privacy "nutrition labels" and a privacy manifest (PrivacyInfo.xcprivacy) declaring data use and required-reason APIs. Google requires the Data safety form and a target API level that meets the current Play deadline. Screenshots must match required device sizes. Wrong or missing declarations are a rejection, not a warning.

## Pre-Empt Common Rejections
Apple guideline 4.3 (spam/duplicate), 2.1 (crashes on review, broken demo account, placeholder content), 5.1.1 (data collected before consent or for no reason), and missing account-deletion for apps with accounts are frequent rejections. Provide working demo credentials and reviewer notes. On Play, watch background-location justification and the data-safety mismatch.

## When to Cut Corners (and Not)
For an internal or TestFlight-only build you can skip store metadata polish — but never skip signing correctness or the build-number bump. Those break the pipeline for everyone downstream.
