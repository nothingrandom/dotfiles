echo "install.sh node"
# if test ! $(which spoof)
# then
#   npm install -g spoof
# fi

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
npm install -g npm

# Install bun via the official installer (to ~/.bun by default). BUN_INSTALL and
# the matching PATH/completions are set in zsh/zshrc.symlink. Skip if present.
BUN_INSTALL="${BUN_INSTALL:-$HOME/.bun}"
if [ ! -x "$BUN_INSTALL/bin/bun" ]; then
  curl -fsSL https://bun.sh/install | bash
fi