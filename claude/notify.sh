#!/bin/sh
#
# Claude Code notification hook.
#
# Reads the hook payload (JSON) on stdin. If a terminal app is NOT the frontmost
# application, it posts a macOS notification so you notice that Claude is waiting
# on you. If you are already looking at the terminal, it stays quiet.
#
# Wired up as Notification and Stop hooks by claude/install.sh, which passes a
# kind argument ("approval" or "complete") to pick the sound. Fully portable: no
# absolute paths and no hardcoded user or home directory.

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

# If the terminal is frontmost the user can already see Claude, so stay silent.
if is_terminal_front; then
  exit 0
fi

payload=$(cat)

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

if command -v terminal-notifier >/dev/null 2>&1; then
  # -sender gives the Hyper icon + click-to-activate; -group collapses repeats.
  terminal-notifier -title "Claude Code" -message "$msg" \
    -sender "$sender" -group "claude-code" -sound "$sound" >/dev/null 2>&1
else
  # Plain notifications can't set an icon or click target; best effort only.
  # Strip double quotes so the message can't break out of the AppleScript string.
  safe=$(printf '%s' "$msg" | tr -d '"')
  osascript -e "display notification \"$safe\" with title \"Claude Code\" sound name \"$sound\"" >/dev/null 2>&1
fi

exit 0
