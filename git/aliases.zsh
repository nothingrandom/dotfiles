# Use `hub` as our git wrapper:
#   http://defunkt.github.com/hub/
hub_path=$(which hub)
if (( $+commands[hub] ))
then
  alias git=$hub_path
fi

alias g='git'

alias gl='git pull --prune'
alias gp='git push origin HEAD'

alias gs='git status -sb' # upgrade your git if -sb breaks for you. it's fun.

alias gtree='git tree' # config alias
alias glog='git log --graph --pretty=format:"%Cred%h%Creset %an: %s - %Creset %C(yellow)%d%Creset %Cgreen(%cr)%Creset" --abbrev-commit --date=relative'

# Remove `+` and `-` from start of diff lines; just rely upon color.
alias gd='git diff --color | sed "s/^\([^-+ ]*\)[-+ ]/\\1/" | less -r'

# Add diff lines one chunck at a time
alias gap='git add -p'
# this will touch new files, unlike gca below
alias gac='git add -A && git commit -m'
alias ge='git-edit-new'

alias gc='git commit -m'
# this doesn't touch new files, unlike gac above
alias gca='git commit -a -m'

alias gsta='git stash save'
alias gstp='git stash pop'

alias gnew='git new' # config alias
alias gco='git checkout'
alias gcb='git-copy-branch-name'
alias gb='git branch'

alias gai='cp "$HOME/.gitignore" ".gitignore"'

# Deletes a branch if it's been merged in to HEAD
alias gbda='git branch --no-color --merged | command grep -vE "^(\*|\s*(master|develop|dev)\s*$)" | command xargs -n 1 git branch -d; git fetch --all --prune; git branch -a'

# Adds a new branch to the upstream under the same name and pushes it
alias gpsup='git push --set-upstream origin -u head'
alias gtrack='git-track'
