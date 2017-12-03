# Sets reasonable macOS defaults.
#
# Or, in other words, set shit how I like in macOS.
#
# The original idea (and a couple settings) were grabbed from:
#   https://github.com/mathiasbynens/dotfiles/blob/master/.macos
#
# Run ./set-defaults.sh and you'll be good to go.

###############################################################################
# System                                                                      #
###############################################################################

# System: Disable the sound effects on boot
sudo nvram SystemAudioVolume=" "

# System: Dark mode
defaults write NSGlobalDomain AppleInterfaceStyle Dark

# System: Reduce transparency
defaults write com.apple.universalaccess reduceTransparency -boolean true

# System: Disable elastic scrolling
defaults write -g NSScrollViewRubberbanding -int 0

# System: Disable guest access
sudo defaults write /Library/Preferences/com.apple.AppleFileServer guestAccess -bool NO
sudo defaults write /Library/Preferences/SystemConfiguration/com.apple.smb.server AllowGuestAccess -bool NO

###############################################################################
# Dock                                                                       #
###############################################################################

# Dock: Hide
defaults write com.apple.Dock autohide -bool TRUE

# Dock: Disable hide / show animation
defaults write com.apple.Dock autohide-delay -float 0

# Dock: Set icon size sanely
defaults write com.apple.dock tilesize -int 42

# Dock: Make icons of hidden applications translucent
defaults write com.apple.dock showhidden -bool true

###############################################################################
# Finder                                                                      #
###############################################################################

# Finder: Disable the “Are you sure you want to open this application?” dialog
defaults write com.apple.LaunchServices LSQuarantine -bool false

# Finder: allow quitting via ⌘ + Q; doing so will also hide desktop icons
defaults write com.apple.finder QuitMenuItem -bool true

# Finder: Expand save panel by default
defaults write NSGlobalDomain NSNavPanelExpandedStateForSaveMode -bool true
defaults write NSGlobalDomain NSNavPanelExpandedStateForSaveMode2 -bool true

# Finder: Use AirDrop over every interface. srsly this should be a default.
defaults write com.apple.NetworkBrowser BrowseAllInterfaces 1

# Finder: Always open everything in Finder's list view. This is important.
defaults write com.apple.finder FXPreferredViewStyle -string "clmv"

# Finder: Show the ~/Library folder.
chflags nohidden ~/Library/

# Disable the warning when changing a file extension
defaults write com.apple.finder FXEnableExtensionChangeWarning -bool false

# Enable snap-to-grid for icons on the desktop and in other icon views
/usr/libexec/PlistBuddy -c "Set :DesktopViewSettings:IconViewSettings:arrangeBy grid" ~/Library/Preferences/com.apple.finder.plist
/usr/libexec/PlistBuddy -c "Set :FK_StandardViewSettings:IconViewSettings:arrangeBy grid" ~/Library/Preferences/com.apple.finder.plist
/usr/libexec/PlistBuddy -c "Set :StandardViewSettings:IconViewSettings:arrangeBy grid" ~/Library/Preferences/com.apple.finder.plist

# Desktop: Show icons for hard drives, servers, and removable media on the desktop
defaults write com.apple.finder ShowExternalHardDrivesOnDesktop -bool true
defaults write com.apple.finder ShowHardDrivesOnDesktop -bool true
defaults write com.apple.finder ShowMountedServersOnDesktop -bool true
defaults write com.apple.finder ShowRemovableMediaOnDesktop -bool true

###############################################################################
# Input                                                                       #
###############################################################################

# Input: Disable press-and-hold for keys in favor of key repeat.
defaults write -g ApplePressAndHoldEnabled -bool false

# Input: Set a blazingly fast keyboard repeat rate
defaults write NSGlobalDomain KeyRepeat -int 1
defaults write NSGlobalDomain InitialKeyRepeat -int 10

###############################################################################
# Lock                                                                        #
###############################################################################

# Lock: Require password immediately after sleep or screen saver begins
defaults write com.apple.screensaver askForPassword -int 1
defaults write com.apple.screensaver askForPasswordDelay -int 0

# Lock: Disable sleep
sudo systemsetup -setcomputersleep Never

###############################################################################
# Trackpad                                                                    #
###############################################################################

# Trackpad: enable tap to click for this user and for the login screen
defaults write com.apple.driver.AppleBluetoothMultitouch.trackpad Clicking -bool true
defaults -currentHost write NSGlobalDomain com.apple.mouse.tapBehavior -int 1
defaults write NSGlobalDomain com.apple.mouse.tapBehavior -int 1

# Trackpad: map bottom right corner to right-click
defaults write com.apple.driver.AppleBluetoothMultitouch.trackpad TrackpadCornerSecondaryClick -int 2
defaults write com.apple.driver.AppleBluetoothMultitouch.trackpad TrackpadRightClick -bool true
defaults -currentHost write NSGlobalDomain com.apple.trackpad.trackpadCornerClickBehavior -int 1
defaults -currentHost write NSGlobalDomain com.apple.trackpad.enableSecondaryClick -bool true

# Trackpad: Enable 3-finger drag.
defaults write com.apple.driver.AppleBluetoothMultitouch.trackpad TrackpadThreeFingerDrag -bool true
defaults write com.apple.AppleMultitouchTrackpad TrackpadThreeFingerDrag -bool true

# Run the screensaver if we're in the bottom-left hot corner.
# defaults write com.apple.dock wvous-bl-corner -int 5
# defaults write com.apple.dock wvous-bl-modifier -int 0

###############################################################################
# Safari                                                                      #
###############################################################################

# Safari: Hide Safari's bookmark bar.
defaults write com.apple.Safari ShowFavoritesBar -bool false

# Safari: Set up Safari for development.
defaults write com.apple.Safari IncludeInternalDebugMenu -bool true
defaults write com.apple.Safari IncludeDevelopMenu -bool true
defaults write com.apple.Safari WebKitDeveloperExtrasEnabledPreferenceKey -bool true
defaults write com.apple.Safari "com.apple.Safari.ContentPageGroupIdentifier.WebKit2DeveloperExtrasEnabled" -bool true
defaults write NSGlobalDomain WebKitDeveloperExtras -bool true
