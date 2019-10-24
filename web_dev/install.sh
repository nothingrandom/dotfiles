echo "install.sh web_dev"
if test ! $(which scss_lint)
then
  sudo gem install scss_lint
fi

yarn install --cwd ~/.config/yarn/global