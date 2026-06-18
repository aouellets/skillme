---
name: Changelog Generator
description: Generate CHANGELOG.md following Keep a Changelog format from git history.
---
# Changelog Generator
Follow keepachangelog.com format exactly.
## Format
```markdown
# Changelog
## [Unreleased]
## [1.2.0] - 2026-06-15
### Added
- New feature description (PR #123)
### Changed
- What changed and why
### Fixed
- Bug that was fixed
### Removed
- What was removed
### Deprecated
- What will be removed next version
### Security
- Security fixes always get their own section
```
## Rules
- Newest version at top
- Human-readable — not git log output
- Each entry: one line, what changed from a user perspective
- Link PR numbers when available
- "Unreleased" section always present for upcoming changes
- Semantic version from commit type: feat→minor, fix/perf→patch, BREAKING→major
## Process
1. Group commits since last tag by type
2. Translate commit messages to user-facing language
3. Remove internal/chore commits
4. Sort: Added > Changed > Deprecated > Removed > Fixed > Security
