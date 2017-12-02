if test ! $(which scss_lint)
then
  gem install scss_lint
fi

if test ! $(which eslint)
then
  yarn global install eslint
fi
