# mas is a command line interface to the Mac App Store. It's a great way to
# script the installation of apps from the Mac App Store
# eg. items not in homebrew casks or that have been purchased
mas install 1091189122 # Bear, Markdown Notes
mas install 639968404 # Parcel, Delivery Tracking
mas install 1287239339 # ColorSlurp, Color Picker

# The Brewfile handles Homebrew-based app and library installs, but there may
# still be updates and installables in the Mac App Store. There's a nifty
# command line interface to it that we can use to just install everything, so
# yeah, let's do that.

echo "› sudo softwareupdate -i -a"
sudo softwareupdate -i -a
