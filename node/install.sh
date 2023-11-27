echo "install.sh node"
# if test ! $(which spoof)
# then
#   npm install -g spoof
# fi

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
npm install -g npm