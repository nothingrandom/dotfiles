echo "install.sh zsh"

if [ ! -d "$HOME/.zsh-syntax-highlighting/" ];
then
  git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ~/.zsh-syntax-highlighting
fi

if [ ! -d "$HOME/.zsh-autosuggestions/" ];
then
  git clone https://github.com/zsh-users/zsh-autosuggestions ~/.zsh-autosuggestions
fi
