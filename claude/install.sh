#!/bin/sh
#
# Claude Code
#
# Sets up the shared, portable pieces of the Claude Code config:
#   - symlinks global instructions (CLAUDE.md) and the notify hook script into
#     ~/.claude, plus any custom commands/agents/skills
#   - registers Notification, Elicitation and Stop hooks in
#     ~/.claude/settings.json so macOS lets you know (with distinct sounds) when
#     Claude needs approval/input or has finished (append-only, backed up,
#     idempotent)
#
# It does NOT manage the rest of ~/.claude/settings.json or ~/.claude.json:
# those hold machine- and work-specific config plus auth/state and stay local.
# General settings keys worth copying to a new machine are in settings.reference.md.

echo "install.sh claude"

CLAUDE_SRC="$(cd "$(dirname "$0")" && pwd -P)"
CLAUDE_DST="$HOME/.claude"

mkdir -p "$CLAUDE_DST"

link () {
  src="$1"
  dst="$2"

  # Already the correct symlink? Leave it.
  if [ "$(readlink "$dst" 2>/dev/null)" = "$src" ]; then
    echo "  ok      $dst"
    return
  fi

  # Something real is in the way: back it up rather than clobber it.
  if [ -e "$dst" ] || [ -L "$dst" ]; then
    mv "$dst" "$dst.backup"
    echo "  backup  $dst -> $dst.backup"
  fi

  ln -s "$src" "$dst"
  echo "  link    $dst"
}

# Global instructions and the notification hook script.
link "$CLAUDE_SRC/CLAUDE.md" "$CLAUDE_DST/CLAUDE.md"
link "$CLAUDE_SRC/notify.sh" "$CLAUDE_DST/notify.sh"

# Custom command/agent/skill directories, only if present in the repo.
for dir in commands agents skills; do
  if [ -d "$CLAUDE_SRC/$dir" ]; then
    link "$CLAUDE_SRC/$dir" "$CLAUDE_DST/$dir"
  fi
done

# Append one command to a given hook event, idempotently. Leaves everything else
# (e.g. status bar hooks) untouched.
add_hook () {
  settings="$1"
  event="$2"
  cmd="$3"

  if jq -e --arg e "$event" --arg c "$cmd" \
      '[.hooks[$e][]?.hooks[]?.command] | index($c) != null' \
      "$settings" >/dev/null 2>&1; then
    echo "  ok      $event hook already registered"
    return
  fi

  tmp="$settings.tmp.$$"
  if jq --arg e "$event" --arg c "$cmd" '
        .hooks //= {}
      | .hooks[$e] //= []
      | .hooks[$e] += [{ hooks: [{ type: "command", command: $c }] }]
      ' "$settings" > "$tmp" 2>/dev/null && jq -e . "$tmp" >/dev/null 2>&1; then
    mv "$tmp" "$settings"
    echo "  hook    registered $event -> notify.sh"
  else
    rm -f "$tmp"
    echo "  WARN    could not update $settings for $event (see settings.reference.md)"
  fi
}

# Register the macOS notification hooks. Append-only, backed up once before any
# change. Commands store a literal $HOME so they resolve for any machine/user.
setup_hooks () {
  settings="$CLAUDE_DST/settings.json"

  if ! command -v jq >/dev/null 2>&1; then
    echo "  skip    notify hooks: jq not found (see settings.reference.md to add them by hand)"
    return
  fi

  [ -f "$settings" ] || echo '{}' > "$settings"
  cp "$settings" "$settings.backup"

  add_hook "$settings" "Notification" '$HOME/.claude/notify.sh approval'
  add_hook "$settings" "Elicitation"  '$HOME/.claude/notify.sh approval'
  add_hook "$settings" "Stop"         '$HOME/.claude/notify.sh complete'
}

setup_hooks

exit 0
