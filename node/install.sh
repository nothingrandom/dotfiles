if test ! $(which spoof)
then
  yarn global install spoof
fi

if test ! $(which pure-prompt)
then
  yarn global install pure-prompt
  autoload -U promptinit; promptinit
  prompt pure
fi
