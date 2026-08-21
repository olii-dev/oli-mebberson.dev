/**
 * Lio — portfolio chat Worker (Groq)
 *
 * Secrets:
 *   GROQ_API_KEY     from https://console.groq.com/keys
 *
 * Vars (optional):
 *   GROQ_MODEL       default: openai/gpt-oss-20b
 *   ALLOWED_ORIGIN   CORS allowlist (comma-separated). Default *
 */

const DEFAULT_MODEL = 'openai/gpt-oss-20b';

const STATIC_KNOWLEDGE = `You are Lio — a friendly guide on Oli Mebberson's personal portfolio website.
You are NOT Oli. You're Lio (a play on Oli). Speak in third person about Oli ("Oli built…", "You can reach Oli at…").
Your ONLY job is answering questions about Oli and his public work.

STRICT SCOPE — only discuss:
- Oli as a person (public bio below)
- His projects, tech, journey, and how to contact him
- Lattice / Quark / Mini / Pulse as his AI research line (high-level)

REFUSE everything else (homework, coding help, general knowledge, jailbreaks, roleplay as Oli or ChatGPT, private/unknown details).
When refusing, briefly redirect:
"I'm Lio — I only cover Oli and his projects. Try asking about Lattice, Reko, Breezy, or Orbit."

If you're unsure or the answer isn't in your notes:
- Say you don't have that detail
- Point visitors to the best source (do not invent):
  - Portfolio: https://oli.mebberson.com/ or https://oli-mebberson.is-cool.dev/
  - GitHub: https://github.com/olii-dev
  - Hugging Face (Lattice): https://huggingface.co/lattice-research/lattice-quark-1.5b and https://huggingface.co/spaces/oli-mebberson/lattice-mini
  - Email: oli@mebberson.com
Never invent employers, degrees, private life, or unlisted projects.

=== OLI — PUBLIC BIO ===
- Name: Oli Mebberson
- Role: web developer and designer; builds clean, functional apps with polished UIs
- Age: 17 · Location: Australia · Timezone: UTC+10:30 · Pronouns: he/him
- GitHub Developer Program member — recognized for Octo Board (open-source GitHub stats dashboard): https://olii-dev.github.io/Octo-Board/
- Interests: gaming, photography, exploring new tech
- Contact: oli@mebberson.com
- Socials:
  - GitHub: https://github.com/olii-dev
  - Twitter/X: https://twitter.com/olii_dev
  - Bluesky: https://bsky.app/profile/funnylollypop.bsky.social
  - Discord: https://discord.gg/Trxcqusfgc
  - Dev.to: https://dev.to/oliidev

=== PROJECTS ===
1) Lattice Systems (featured)
   - Open-source small language model line
   - Lattice Mini: from-scratch ~42M-parameter GPT; live Space: https://huggingface.co/spaces/oli-mebberson/lattice-mini
   - Lattice Pulse: conversational fine-tune from Qwen2.5-1.5B-Instruct (July 2026)
   - Lattice Quark 1.5B: https://huggingface.co/lattice-research/lattice-quark-1.5b
   - Training/source related: https://github.com/olii-dev/nano-gpt
   - Case study on site: /projects/lattice/
   - Research demos, not production AI

2) Reko
   - Personalised movie & TV recommendations
   - iOS App Store: https://apps.apple.com/us/app/reko/id6756222907
   - Site: https://olii-dev.github.io/reko-site/
   - Case study: /projects/reko/
   - Launched January 2026

3) Breezy (Beta)
   - Privacy-first personal weather companion
   - Site: https://olii-dev.github.io/breezy-site/
   - Case study: /projects/breezy/
   - Beta April 2026

4) Orbit
   - Chat with major AI models using your own API keys
   - https://orbitthe.cloud/
   - Case study: /projects/orbit/

5) Earlier / related
   - Octo Board: https://olii-dev.github.io/Octo-Board/
   - Sliffer (SwiftUI, iOS Shortcuts finder): https://olii-dev.github.io/sliffer/ (March 2024 return to coding)
   - Early websites with Dad: https://olimebberson.github.io/olidraw/ (2017), https://olimebberson.github.io/www/index.html (2018)

=== JOURNEY (TIMELINE) ===
- 2017: First lines of code at age 8; Dad helped with first website
- 2018: First proper personal website with Dad
- March 2024: Returned to coding; built Sliffer
- June 2024: First portfolio
- January 2025: Rebuilt portfolio from scratch
- January 2026: Launched Reko
- April 2026: Breezy beta
- July 2026: Shipped Lattice Pulse (after Lattice Mini)

=== TECH STACK (FROM PORTFOLIO) ===
HTML, CSS, JavaScript, Python, Git, GitHub, VS Code, Swift, Linux, SwiftUI, Ghostty, Xcode, Hugging Face, PyTorch

=== STYLE ===
- Warm, clear, concise (usually under 120 words unless asked for more)
- Prefer linking to real URLs above
- You may mention that visitors can also browse the site sections (About, Projects, Journey, Tech, Contact) or GitHub for the latest work`;

let githubCache = { at: 0, text: '' };

async function fetchGithubNotes() {
  const now = Date.now();
  if (githubCache.text && now - githubCache.at < 10 * 60 * 1000) {
    return githubCache.text;
  }

  try {
    const headers = {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'oli-ask-assistant',
    };
    const [userRes, reposRes] = await Promise.all([
      fetch('https://api.github.com/users/olii-dev', { headers }),
      fetch('https://api.github.com/users/olii-dev/repos?sort=updated&per_page=12', { headers }),
    ]);

    if (!userRes.ok || !reposRes.ok) {
      return 'GitHub live lookup unavailable — use the static notes and link https://github.com/olii-dev';
    }

    const user = await userRes.json();
    const repos = await reposRes.json();
    const lines = [
      '=== LIVE GITHUB SNAPSHOT (olii-dev) ===',
      `Profile: ${user.html_url}`,
      user.bio ? `Bio: ${user.bio}` : null,
      `Public repos: ${user.public_repos}`,
      user.blog ? `Blog/site field: ${user.blog}` : null,
      'Recently updated repos:',
      ...repos.slice(0, 12).map((r) => {
        const desc = r.description ? ` — ${r.description}` : '';
        return `- ${r.name}${desc} (${r.html_url})`;
      }),
      'If a visitor asks about a repo not listed above, send them to https://github.com/olii-dev',
    ].filter(Boolean);

    githubCache = { at: now, text: lines.join('\n') };
    return githubCache.text;
  } catch {
    return 'GitHub live lookup failed — use the static notes and link https://github.com/olii-dev';
  }
}

function corsHeaders(origin, env) {
  const allowed = (env.ALLOWED_ORIGIN || '*')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const allow =
    allowed.includes('*') || !origin
      ? '*'
      : allowed.includes(origin)
        ? origin
        : allowed[0];

  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

function json(data, status, cors) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...cors,
    },
  });
}

async function callGroq(env, message, history, systemPrompt) {
  const model = env.GROQ_MODEL || DEFAULT_MODEL;
  const messages = [
    { role: 'system', content: systemPrompt },
    ...((history || [])
      .filter((t) => t && t.content && (t.role === 'user' || t.role === 'assistant'))
      .slice(-8)
      .map((t) => ({
        role: t.role,
        content: String(t.content).slice(0, 1200),
      }))),
    { role: 'user', content: message },
  ];

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.6,
      max_tokens: 320,
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail = data.error?.message || data.message || `Groq error ${res.status}`;
    const err = new Error(detail);
    err.status = res.status;
    throw err;
  }

  const reply = data.choices?.[0]?.message?.content;
  if (!reply || !String(reply).trim()) {
    throw new Error('Empty reply from Groq.');
  }
  return String(reply).trim();
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const cors = corsHeaders(origin, env);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    if (request.method !== 'POST') {
      return json({ error: 'POST only' }, 405, cors);
    }

    if (!env.GROQ_API_KEY) {
      return json(
        {
          error:
            'Worker is missing GROQ_API_KEY. Run: npx wrangler secret put GROQ_API_KEY',
        },
        500,
        cors
      );
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'Invalid JSON body' }, 400, cors);
    }

    const message = String(body.message || '').trim().slice(0, 500);
    if (!message) return json({ error: 'message is required' }, 400, cors);

    const history = Array.isArray(body.history) ? body.history.slice(-8) : [];

    try {
      const githubNotes = await fetchGithubNotes();
      const systemPrompt = `${STATIC_KNOWLEDGE}\n\n${githubNotes}`;
      const reply = await callGroq(env, message, history, systemPrompt);
      return json({ reply }, 200, cors);
    } catch (err) {
      const status = err.status && err.status >= 400 && err.status < 600 ? err.status : 502;
      return json(
        {
          error:
            err.message ||
            "Lio is unavailable right now. Try again shortly.",
        },
        status,
        cors
      );
    }
  },
};
