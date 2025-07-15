#!/bin/bash

# BUAI Version Manager Script
# This script helps manage versions and generate release notes

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
CHANGELOG_FILE="docs/CHANGELOG.md"
RELEASE_NOTES_DIR="docs/releases"
TEMPLATE_FILE="docs/RELEASE_NOTES_TEMPLATE.md"

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}=== $1 ===${NC}"
}

# Function to get current version from package.json
get_current_version() {
    node -p "require('./package.json').version"
}

# Function to update version in package.json
update_version() {
    local new_version=$1
    npm version $new_version --no-git-tag-version
    print_status "Updated package.json version to $new_version"
}

# Function to create release notes
create_release_notes() {
    local version=$1
    local release_date=$(date +%Y-%m-%d)
    local release_file="$RELEASE_NOTES_DIR/v${version}-release-notes.md"
    
    # Create releases directory if it doesn't exist
    mkdir -p "$RELEASE_NOTES_DIR"
    
    # Copy template and replace placeholders
    sed "s/\[VERSION\]/$version/g; s/\[DATE\]/$release_date/g" "$TEMPLATE_FILE" > "$release_file"
    
    print_status "Created release notes: $release_file"
    echo "Please edit the release notes with specific details for version $version"
}

# Function to update changelog
update_changelog() {
    local version=$1
    local release_date=$(date +%Y-%m-%d)
    
    # Replace [Unreleased] with the new version
    sed -i.bak "s/## \[Unreleased\]/## \[Unreleased\]\n\n## [$version] - $release_date/" "$CHANGELOG_FILE"
    
    print_status "Updated changelog with version $version"
}

# Function to show current status
show_status() {
    print_header "Current Status"
    echo "Current version: $(get_current_version)"
    echo "Changelog file: $CHANGELOG_FILE"
    echo "Release notes dir: $RELEASE_NOTES_DIR"
    
    # Check for unreleased changes
    if grep -A 20 "## \[Unreleased\]" "$CHANGELOG_FILE" | grep -q "### Added\|### Changed\|### Fixed"; then
        print_warning "There are unreleased changes in the changelog"
        echo "Unreleased changes:"
        grep -A 20 "## \[Unreleased\]" "$CHANGELOG_FILE" | grep -E "### (Added|Changed|Fixed|Breaking Changes)" -A 1
    else
        print_status "No unreleased changes found"
    fi
}

# Function to add a new change entry
add_change() {
    local change_type=$1
    local description=$2
    
    # Validate change type
    case $change_type in
        "added"|"changed"|"fixed"|"breaking"|"deprecated"|"removed")
            ;;
        *)
            print_error "Invalid change type. Use: added, changed, fixed, breaking, deprecated, removed"
            exit 1
            ;;
    esac
    
    # Convert to proper case for markdown
    case $change_type in
        "added") change_type="Added" ;;
        "changed") change_type="Changed" ;;
        "fixed") change_type="Fixed" ;;
        "breaking") change_type="Breaking Changes" ;;
        "deprecated") change_type="Deprecated" ;;
        "removed") change_type="Removed" ;;
    esac
    
    # Add the change to the unreleased section
    if grep -q "### $change_type" "$CHANGELOG_FILE"; then
        # Add to existing section
        sed -i.bak "/### $change_type/a\\
- $description" "$CHANGELOG_FILE"
    else
        # Create new section
        sed -i.bak "/## \[Unreleased\]/a\\
\\
### $change_type\\
- $description" "$CHANGELOG_FILE"
    fi
    
    print_status "Added $change_type entry: $description"
}

# Function to release a new version
release_version() {
    local version=$1
    local release_type=${2:-"patch"}
    
    print_header "Releasing Version $version"
    
    # Validate version format
    if [[ ! $version =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
        print_error "Invalid version format. Use semantic versioning (e.g., 1.2.3)"
        exit 1
    fi
    
    # Update package.json
    update_version $version
    
    # Update changelog
    update_changelog $version
    
    # Create release notes
    create_release_notes $version
    
    print_status "Version $version released successfully!"
    echo "Next steps:"
    echo "1. Review and edit the release notes"
    echo "2. Commit your changes"
    echo "3. Create a git tag: git tag v$version"
    echo "4. Push the tag: git push origin v$version"
}

# Function to show help
show_help() {
    echo "BUAI Version Manager"
    echo ""
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  status                    Show current version and unreleased changes"
    echo "  add [TYPE] [DESCRIPTION]  Add a new change entry"
    echo "  release [VERSION]         Release a new version"
    echo "  help                      Show this help message"
    echo ""
    echo "Change Types:"
    echo "  added                     New features"
    echo "  changed                   Changes to existing features"
    echo "  fixed                     Bug fixes"
    echo "  breaking                  Breaking changes"
    echo "  deprecated                Deprecated features"
    echo "  removed                   Removed features"
    echo ""
    echo "Examples:"
    echo "  $0 status"
    echo "  $0 add added \"Real-time balance updates\""
    echo "  $0 add fixed \"Wallet balance not updating after transactions\""
    echo "  $0 release 1.1.0"
    echo ""
}

# Main script logic
case "${1:-help}" in
    "status")
        show_status
        ;;
    "add")
        if [ -z "$2" ] || [ -z "$3" ]; then
            print_error "Usage: $0 add [TYPE] [DESCRIPTION]"
            exit 1
        fi
        add_change "$2" "$3"
        ;;
    "release")
        if [ -z "$2" ]; then
            print_error "Usage: $0 release [VERSION]"
            exit 1
        fi
        release_version "$2"
        ;;
    "help"|*)
        show_help
        ;;
esac 