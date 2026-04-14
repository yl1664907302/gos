# Feishu CLI (lark-cli)

GitHub: https://github.com/larksuite/cli

## Capabilities

| Skill         | Capabilities                                |
| ------------- | ------------------------------------------- |
| lark-calendar | View agenda, create events, check free/busy |
| lark-im       | Send/reply messages, group chat management  |
| lark-doc      | Create, read, update documents              |
| lark-drive    | Upload/download files, manage permissions   |
| lark-sheets   | Create, read, write spreadsheets            |
| lark-base     | Tables, records, views                      |
| lark-task     | Tasks, subtasks, reminders                  |
| lark-mail     | Browse, search, read, send emails           |

## Installation & Configuration

```bash
# 1. Install CLI
npm install -g @larksuite/cli
npx skills add larksuite/cli -y -g

# 2. Initialize config
lark-cli config init --new

# 3. Login via OAuth (opens browser for user authorization)
lark-cli auth login --recommend
```

**Credential reuse from IM gateway:** If `{workspace_dir}/gateway.config.json` contains `lark.app_id` and `lark.app_secret`, read them and write directly to `~/.lark-cli/config.json` instead of running `config init --new`. This skips the interactive setup since the user already provided these credentials during IM integration.
