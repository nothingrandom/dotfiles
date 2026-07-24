#!/bin/sh
#
# Claude Code notification hook.
#
# Reads the hook payload (JSON) on stdin and posts a macOS notification so you
# notice that Claude is waiting on you or has finished. By default it notifies
# regardless of which app is frontmost; set CLAUDE_NOTIFY_QUIET_WHEN_FRONT=1 to
# suppress notifications while a terminal app is frontmost.
#
# Wired up as Notification and Stop hooks by claude/install.sh, which passes a
# kind argument ("approval" or "complete") to pick the sound. Fully portable: no
# absolute paths and no hardcoded user or home directory.

# Hooks may invoke this script with a minimal PATH that lacks Homebrew, where
# terminal-notifier lives. Prepend the usual Homebrew bin dirs (Apple Silicon and
# Intel) so we find it instead of silently falling back to osascript.
PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

# Treat these frontmost apps as "I'm already looking at the terminal".
is_terminal_front () {
  front_asn=$(lsappinfo front 2>/dev/null) || return 1
  [ -n "$front_asn" ] || return 1
  name=$(lsappinfo info -only name "$front_asn" 2>/dev/null \
    | sed -E 's/^"[^"]*"="?([^"]*)"?$/\1/')
  case "$name" in
    Hyper|Terminal|iTerm2|iTerm|WezTerm|Alacritty|kitty|Ghostty|Warp|Tabby)
      return 0 ;;
    *)
      return 1 ;;
  esac
}

# Bundle id of the frontmost application, or empty if it can't be determined.
frontmost_bundleid () {
  front_asn=$(lsappinfo front 2>/dev/null) || return 1
  [ -n "$front_asn" ] || return 1
  lsappinfo info -only bundleid "$front_asn" 2>/dev/null \
    | sed -E 's/^"[^"]*"="?([^"]*)"?$/\1/'
}

# By default we always notify: you might leave a terminal open but be away from
# it. Set CLAUDE_NOTIFY_QUIET_WHEN_FRONT=1 to stay silent when a terminal app is
# frontmost (the old behavior).
if [ -n "$CLAUDE_NOTIFY_QUIET_WHEN_FRONT" ] && is_terminal_front; then
  exit 0
fi

# Read the hook payload from stdin. Guard against a tty so running the script by
# hand (no piped input) doesn't hang forever on cat.
payload=""
if [ ! -t 0 ]; then
  payload=$(cat)
fi

# Pull the message out of the hook payload; fall back to a generic prompt.
msg=""
if command -v jq >/dev/null 2>&1; then
  msg=$(printf '%s' "$payload" | jq -r '.message // empty' 2>/dev/null)
fi

# Notification kind (passed by the hook registration): "approval" or "complete".
# This picks the sound and the fallback message.
kind="${1:-approval}"
case "$kind" in
  complete) sound="Ping";  default_msg="Claude Code finished" ;;
  *)        sound="Glass"; default_msg="Claude Code needs your approval" ;;
esac

[ -n "$msg" ] || msg="$default_msg"

# Bundle id used as the notification "sender": the banner shows that app's icon
# and clicking it brings the app to the front. Defaults to Hyper; override with
# CLAUDE_NOTIFY_SENDER to point at a different terminal (e.g. com.googlecode.iterm2).
sender="${CLAUDE_NOTIFY_SENDER:-co.zeit.hyper}"

# macOS silences the banner AND sound for a notification attributed to whatever
# app is currently frontmost. So if the sender app (Hyper) is what you're looking
# at, drop -sender and deliver as terminal-notifier itself — that still alerts you
# while the terminal is active. When the sender app is NOT frontmost (you're in
# another app, or Hyper is closed), keep -sender for the nice icon + click-to-focus.
if [ "$(frontmost_bundleid)" = "$sender" ]; then
  sender=""
fi

if command -v terminal-notifier >/dev/null 2>&1; then
  # We deliberately omit -group: terminal-notifier only ever shows ONE
  # notification per group, replacing the prior one, and macOS often skips
  # re-banners on a replacement — the flaky "sometimes it notifies" behavior.
  if [ -n "$sender" ]; then
    terminal-notifier -title "Claude Code" -message "$msg" \
      -sender "$sender" -sound "$sound" >/dev/null 2>&1
  else
    terminal-notifier -title "Claude Code" -message "$msg" \
      -sound "$sound" >/dev/null 2>&1
  fi
else
  # Plain notifications can't set an icon or click target; best effort only.
  # Strip double quotes so the message can't break out of the AppleScript string.
  safe=$(printf '%s' "$msg" | tr -d '"')
  osascript -e "display notification \"$safe\" with title \"Claude Code\" sound name \"$sound\"" >/dev/null 2>&1
fi

exit 0
