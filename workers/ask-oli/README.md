# Ask Oli Worker (Groq)

Cloudflare Worker for the floating **Ask Oli** chat. Fast replies via Groq (free tier). Quark can be swapped back in later.

## Deploy

```bash
cd workers/ask-oli
npx wrangler login
npx wrangler secret put GROQ_API_KEY   # https://console.groq.com/keys
npx wrangler deploy
```

## Connect the site

In `index.html`:

```html
<div id="ask-oli" class="ask-oli" data-api="https://ask-oli.YOUR_SUBDOMAIN.workers.dev">
```

Optional CORS lock:

```toml
[vars]
ALLOWED_ORIGIN = "https://oli.mebberson.com,https://oli-mebberson.is-cool.dev"
GROQ_MODEL = "llama-3.1-8b-instant"
```

## Test

```bash
npx wrangler dev
curl -X POST http://127.0.0.1:8787 \
  -H 'Content-Type: application/json' \
  -d '{"message":"What projects has Oli shipped?"}'
```
