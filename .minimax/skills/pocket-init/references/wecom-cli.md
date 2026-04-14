# WeCom CLI (wecom-cli)

GitHub: https://github.com/WecomTeam/wecom-cli

## Capabilities

| Skill                    | Capabilities                 |
| ------------------------ | ---------------------------- |
| wecomcli-lookup-contact  | Search contacts              |
| wecomcli-get-todo-list   | Query todos                  |
| wecomcli-edit-todo       | Create, update, delete todos |
| wecomcli-get-msg         | Chat history, send messages  |
| wecomcli-manage-schedule | Calendar CRUD                |

## Installation & Configuration

```bash
# 1. Install CLI
npm install -g @wecom/cli
npx skills add WeComTeam/wecom-cli -y -g

# 2. Initialize config
wecom-cli init
```

**Credential reuse from IM gateway:** If `{workspace_dir}/gateway.config.json` contains `wecom.bot_id` and `wecom.secret`, read them and pass to `wecom-cli init` instead of asking the user to enter credentials again. This skips the interactive setup since the user already provided these credentials during IM integration.
