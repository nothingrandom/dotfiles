# macOS defaults reference

Companion notes for [`set-defaults.sh`](./set-defaults.sh). Reference only; this file is never executed, since the `.md` extension keeps it out of any `*.sh` run path.

> **Last reviewed:** 2026-07-24, against macOS 26.5.2 (Tahoe).

## Authoritative catalogs

The complete set of `defaults` keys lives upstream, so don't vendor it here.

- **macos-defaults.com** (<https://macos-defaults.com>): searchable, per-key, notes version support.
- **mathiasbynens/dotfiles `.macos`** (<https://github.com/mathiasbynens/dotfiles/blob/master/.macos>): what `set-defaults.sh` was derived from.

## How to discover / verify a key

```sh
# Snapshot a domain, toggle the setting in System Settings, snapshot again, diff.
defaults read com.apple.finder > /tmp/before.txt
# ...change setting in the UI...
defaults read com.apple.finder > /tmp/after.txt
diff /tmp/before.txt /tmp/after.txt

# Some settings are per-host (ByHost), so check both scopes:
defaults read <domain> <key>
defaults -currentHost read <domain> <key>
```

If a scripted `defaults write` seems to do nothing, it's usually one of four things: the value is per-host (needs `-currentHost`), the owning daemon only re-reads it at login, the domain needs Full Disk Access, or the key was renamed or removed in this macOS version.

## Verification

```sh
bash -n macos/set-defaults.sh   # syntax check
bin/set-defaults                # run as your user (NOT sudo) → $ZSH/macos/set-defaults.sh
```

Then log out and back in (or restart) to pick up login-time settings.
