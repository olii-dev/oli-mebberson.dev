# Oli's assistant Worker (Groq)

Cloudflare Worker for the floating **Oli's assistant** chat. Uses Groq model `openai/gpt-oss-20b` by default (replacement for retired `llama-3.1-8b-instant`).

## Deploy

```bash
cd workers/ask-oli
npx wrangler secret put GROQ_API_KEY
npx wrangler deploy
```

Optional model override in `wrangler.toml`:

```toml
[vars]
GROQ_MODEL = "openai/gpt-oss-20b"
```
