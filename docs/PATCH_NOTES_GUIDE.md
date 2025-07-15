# Patch Notes Management Guide

This guide explains how to manage patch notes and releases for the BUAI application.

## 📋 Quick Start

### 1. Check Current Status
```bash
./scripts/version-manager.sh status
```

### 2. Add a New Change
```bash
# Add a new feature
./scripts/version-manager.sh add added "Real-time balance updates"

# Add a bug fix
./scripts/version-manager.sh add fixed "Wallet balance not updating after transactions"

# Add a breaking change
./scripts/version-manager.sh add breaking "Changed API endpoint structure"
```

### 3. Release a New Version
```bash
./scripts/version-manager.sh release 1.1.0
```

## 📝 Change Types

| Type | Description | Example |
|------|-------------|---------|
| `added` | New features | "Real-time notifications" |
| `changed` | Improvements to existing features | "Optimized balance update timing" |
| `fixed` | Bug fixes | "Fixed wallet connection issue" |
| `breaking` | Breaking changes | "Changed API response format" |
| `deprecated` | Deprecated features | "Deprecated old payment method" |
| `removed` | Removed features | "Removed legacy authentication" |

## 🔄 Workflow

### Daily Development
1. **Make changes** to the codebase
2. **Add entries** to the changelog as you work:
   ```bash
   ./scripts/version-manager.sh add fixed "Fixed balance display issue"
   ./scripts/version-manager.sh add added "New transaction history feature"
   ```

### Before Release
1. **Check status** to see all unreleased changes:
   ```bash
   ./scripts/version-manager.sh status
   ```

2. **Review changes** in `docs/CHANGELOG.md`

3. **Release version**:
   ```bash
   ./scripts/version-manager.sh release 1.1.0
   ```

4. **Edit release notes** in `docs/releases/v1.1.0-release-notes.md`

5. **Commit and tag**:
   ```bash
   git add .
   git commit -m "Release v1.1.0"
   git tag v1.1.0
   git push origin main --tags
   ```

## 📊 Version Numbering

### Semantic Versioning (MAJOR.MINOR.PATCH)

- **MAJOR** (1.0.0): Breaking changes
- **MINOR** (1.1.0): New features, backward compatible
- **PATCH** (1.1.1): Bug fixes, backward compatible

### Examples
- `1.0.0` → `1.0.1` (bug fix)
- `1.0.1` → `1.1.0` (new feature)
- `1.1.0` → `2.0.0` (breaking change)

## 📁 File Structure

```
docs/
├── CHANGELOG.md                    # Main changelog
├── RELEASE_NOTES_TEMPLATE.md       # Template for release notes
├── releases/                       # Individual release notes
│   ├── v1.0.0-release-notes.md
│   ├── v1.1.0-release-notes.md
│   └── ...
└── PATCH_NOTES_GUIDE.md           # This file

scripts/
└── version-manager.sh             # Version management script
```

## 🎯 Best Practices

### Writing Good Change Descriptions
- ✅ **Clear and concise**: "Fixed wallet balance not updating after transactions"
- ❌ **Vague**: "Fixed bugs"

- ✅ **User-focused**: "Added real-time balance updates for better UX"
- ❌ **Technical only**: "Implemented WebSocket balance updates"

- ✅ **Specific**: "Reduced balance update delay from 2s to 1s"
- ❌ **Generic**: "Improved performance"

### When to Add Entries
- **Immediately** when fixing a bug
- **After completing** a new feature
- **Before committing** breaking changes
- **During code review** for accuracy

### Release Frequency
- **Patch releases**: Weekly or as needed for critical fixes
- **Minor releases**: Monthly for new features
- **Major releases**: Quarterly or for significant changes

## 🔧 Manual Changelog Updates

If you need to edit the changelog manually:

### Adding a New Section
```markdown
## [Unreleased]

### Added
- New feature description

### Changed
- Improvement description

### Fixed
- Bug fix description
```

### Releasing a Version
```markdown
## [Unreleased]

## [1.1.0] - 2024-07-15

### Added
- New feature description
```

## 🚨 Emergency Releases

For critical security fixes or major issues:

1. **Create emergency branch**:
   ```bash
   git checkout -b hotfix/critical-fix
   ```

2. **Add fix entry**:
   ```bash
   ./scripts/version-manager.sh add fixed "Critical security vulnerability fix"
   ```

3. **Release patch version**:
   ```bash
   ./scripts/version-manager.sh release 1.0.1
   ```

4. **Deploy immediately** and merge back to main

## 📈 Tracking Metrics

Consider tracking these metrics in release notes:
- **Performance improvements**: Load times, transaction success rates
- **User engagement**: Active users, feature adoption
- **Technical debt**: Code quality improvements, refactoring
- **Security**: Vulnerability fixes, security enhancements

## 🤝 Team Collaboration

### Code Review Process
1. **Review code changes**
2. **Verify changelog entries** are accurate
3. **Check release notes** for completeness
4. **Approve and merge**

### Release Coordination
1. **Notify team** of upcoming releases
2. **Coordinate deployment** timing
3. **Test release notes** for accuracy
4. **Announce release** to users

---

## 📞 Support

- **Questions**: Check this guide first
- **Issues**: Create GitHub issue
- **Suggestions**: Submit pull request
- **Emergency**: Contact maintainers directly 