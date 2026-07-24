# Claude Code settings: general keys (reference)

Not applied automatically. `~/.claude/settings.json` is kept local on purpose: it also holds machine-specific hooks and work config, and both Claude Code and the status bar tool rewrite it, so symlinking it into a shared repo would fight those tools and leak internal names.

On a new machine, set these general preferences by hand in `~/.claude/settings.json`, then let the rest accrue locally.

```json
{
  "model": "opus",
  "theme": "dark",
  "permissions": {
    "deny": [
      "Read(~/.ssh/**)",
      "Read(~/.aws/**)",
      "Read(~/.gnupg/**)",
      "Read(~/.config/**)",
      "Read(**/.env)",
      "Read(**/.env.*)",
      "Read(**/secrets/**)",
      "Bash(gh:*)"
    ]
  }
}
```

## macOS notifications

`claude/install.sh` symlinks `notify.sh` into `~/.claude/` and registers three hooks in `~/.claude/settings.json` (append-only and idempotent, with a `.backup` written first): Notification and Elicitation hooks for when Claude needs your approval or input (Glass sound) and a Stop hook for when Claude finishes (Ping sound). All stay quiet while a terminal is the frontmost app.

With `terminal-notifier` installed, the banner uses your terminal's icon and clicking it brings the terminal to the front. It defaults to Hyper (`co.zeit.hyper`); set `CLAUDE_NOTIFY_SENDER` to another bundle id (for example `com.googlecode.iterm2`) to change it. Without `terminal-notifier` it falls back to `osascript`, which cannot set an icon or click target.

If jq is unavailable and you need to add the hooks by hand, add these entries under `hooks` in `~/.claude/settings.json`:

```json
"Notification": [
  { "hooks": [ { "type": "command", "command": "$HOME/.claude/notify.sh approval" } ] }
],
"Elicitation": [
  { "hooks": [ { "type": "command", "command": "$HOME/.claude/notify.sh approval" } ] }
],
"Stop": [
  { "hooks": [ { "type": "command", "command": "$HOME/.claude/notify.sh complete" } ] }
]
```

## Machine- and work-specific config

Everything else stays out of this repo:

- Work-machine plugins, marketplaces, and project repo allow-paths belong in the relevant work repo's `.claude/settings.json` (project scope).
- Status bar hooks are written and maintained by the status bar tool itself.
- `~/.claude.json` (auth tokens, MCP servers, project trust, history) is never committed anywhere.
