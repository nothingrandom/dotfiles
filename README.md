# benjamin (nothingrandom) does dotfiles

> This is forked from holman, go check out [his repo](https://github.com/holman/dotfiles).

Your dotfiles are how you personalize your system. These are now mine, no longer holman's.

I've kept the same structure and, for the most part, the same installation. There's been a lot of tweaks to specifics and additions to what works better for me.

## Topics
Everything's built around topic areas. If you're adding a new area to your forked dotfiles, say 'python', simply create a `python` directory and put files there.
Anything with an extension of `.zsh` will get automatically included into your shell.
Anything with an extension of `.symlink` will get symlinked without extension into `$HOME` when you run `script/bootstrap`.

## What's here
Loads. A lot of stuff. Seriously, everything I need. Check out the files above, choose what works for you.
[Fork it](https://github.com/nothingrandom/dotfiles/fork), remove what you don't use, and build on what you do use.

## Components
There's a few special files in the hierarchy.

- **bin/**: Anything in `bin/` will get added to your `$PATH` and be made available everywhere.
- **Brewfile**: This is a list of applications for [Homebrew Cask](https://caskroom.github.io) to install: things like Chrome and 1Password and Adium and stuff. Might want to edit this file before running any initial setup.
- **topic/*.zsh**: Any files ending in `.zsh` get loaded into your environment.
- **topic/path.zsh**: Any file named `path.zsh` is loaded first and is expected to setup `$PATH` or similar.
- **topic/completion.zsh**: Any file named `completion.zsh` is loaded last and is expected to setup autocomplete.
- **topic/install.sh**: Any file named `install.sh` is executed when you run `script/install`. To avoid being loaded automatically, its extension is `.sh`, not `.zsh`.
- **topic/*.symlink**: Any file ending in `*.symlink` gets symlinked into your `$HOME`. This is so you can keep all of those versioned in your dotfiles but still keep those autoloaded files in your home directory. These get symlinked in when you run `script/bootstrap`.

## To Install
Run this:

```sh
git clone https://github.com/nothingrandom/dotfiles.git ~/.dotfiles
cd ~/.dotfiles
script/bootstrap
```

This will symlink the appropriate files in `.dotfiles` to your home directory. Everything is configured and tweaked within `~/.dotfiles`.

The main file you'll want to change right off the bat is `zsh/zshrc.symlink`, which sets up a few paths that'll be different on your particular machine.

`dot` is a simple script that installs some dependencies, sets sane macOS defaults, and so on. Tweak this script, and occasionally run `dot` from time to time to keep your environment fresh and up-to-date. You can find this script in `bin/`.

## Bugs
This should work for everyone; clone it down and it should work for you even though you may not have `rbenv` installed, for example. That said, I do use this as _my_ dotfiles, so there's a good chance I may break something if I forget to make a check for a dependency.

If you're brand-new to the project and run into any blockers, please [open an issue](https://github.com/nothingrandom/dotfiles/issues) on this repository and I'll do my best to help.
