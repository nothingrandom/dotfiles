if test ! $(which scss_lint)
then
  # sudo gem install scss_lint
fi

if test ! $(which eslint)
then
  npm i -g eslint
  npm i -g eslint-plugin-import
  npm i -g eslint-config-airbnb-base
fi
