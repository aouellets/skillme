# Connect page screenshots

Drop the following PNG files here (1200px wide max) and set
`NEXT_PUBLIC_SHOW_SCREENSHOTS=true` in Vercel to display them on `/connect`.

| File | Step | What it shows |
| --- | --- | --- |
| `settings-avatar.png` | 1 | claude.ai with the avatar menu open in the bottom-left, "Settings" highlighted. Annotate with a red circle/arrow on the avatar. |
| `settings-integrations.png` | 2 | The Settings panel with "Integrations" in the left sidebar, highlighted or circled. |
| `add-integration.png` | 4 | The integrations panel with the MCP URL pasted in and the Connect button visible. |

The connect page references these paths via `/screenshots/<file>`. Images are
hidden until `NEXT_PUBLIC_SHOW_SCREENSHOTS=true`, so the page never renders a
broken image if the files are missing.
