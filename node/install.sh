echo "install.sh node"
if test ! $(which spoof)
then
  yarn global add spoof
fi

curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash
