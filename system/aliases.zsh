# grc overides for ls
#   Made possible through contributions from generous benefactors like
#   `brew install coreutils`
# if $(gls &>/dev/null)
# then
alias ls='ls -F -G'
alias l='ls -lAh -G'
alias ll='ls -l -G'
alias la='ls -A -G'
# fi

# alias ls="ls -l "$@" | nice-ls"

alias top="bunx vtop" # alias / override top