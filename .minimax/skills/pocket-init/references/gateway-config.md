# IM Gateway Configuration

## Read-Modify-Write Pattern

When updating gateway config, always read existing config first to avoid overwriting other platform settings:

```python
# config_path = "{workspace_dir}/gateway.config.json"

# 1. Read existing config
config = json.load(open(config_path)) if os.path.exists(config_path) else {}

# 2. Merge: only update the specific platform, preserve others
config["platforms"] = config.get("platforms", {})
config["platforms"]["enabled"] = list(set(config["platforms"].get("enabled", []) + ["slack"]))
config["slack"] = {"bot_token": "...", "app_token": "..."}

# 3. Write back
json.dump(config, open(config_path, "w"), indent=2)
```

## Config File Structure

Location: `{workspace_dir}/gateway.config.json`

```json
{
  "platforms": {
    "enabled": ["slack", "lark"],
    "primary": "slack"
  },
  "slack": {
    "bot_token": "xoxb-...",
    "app_token": "xapp-..."
  },
  "lark": {
    "app_id": "cli_...",
    "app_secret": "..."
  },
  "discord": {
    "bot_token": "..."
  },
  "wecom": {
    "bot_id": "...",
    "secret": "..."
  },
  "wechat": {
    "bot_token": "...",
    "ilink_bot_id": "...",
    "base_url": "..."
  }
}
```

## Platform Credentials

**China (CN):**

| Platform | Required Fields | How to Obtain |
|----------|-----------------|---------------|
| Feishu | `app_id`, `app_secret` | Create app at https://open.feishu.cn/app |
| WeCom | `bot_id`, `secret` | Create bot in WeCom admin console |
| WeChat | `bot_token`, `ilink_bot_id` | Configure via iLink bridge service |

**Global:**

| Platform | Required Fields | How to Obtain |
|----------|-----------------|---------------|
| Slack | `bot_token`, `app_token` | Create app at https://api.slack.com/apps |
| Discord | `bot_token` | Create bot at https://discord.com/developers/applications |

## Validation Rules

- Slack `bot_token` must start with `xoxb-`
- Slack `app_token` must start with `xapp-`
- Never expose credential values in responses
