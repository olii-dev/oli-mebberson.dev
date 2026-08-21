# Lio Worker (Groq)

Cloudflare Worker for the floating **Lio** chat on the portfolio. Uses Groq model `openai/gpt-oss-20b` by default.

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
