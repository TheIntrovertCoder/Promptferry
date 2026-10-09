# Promptferry

Turn a project idea into the ultimate, production-ready build prompt.

Describe what you want to build in a sentence or two; Promptferry streams back a
structured prompt covering stack and architecture, UI/UX, security, privacy, testing,
accessibility, performance, documentation, and deployment — ready to hand to a coding
agent or a teammate.

## Stack

- [SvelteKit](https://svelte.dev/docs/kit) 3 (runes) + TypeScript on Vite
- [`#lib`](https://svelte.dev/docs/kit) subpath imports (SvelteKit 3)
- Streaming responses from the [OpenRouter](https://openrouter.ai) API
- `marked` + `DOMPurify` for safe rendered output
- [Netlify Blobs](https://docs.netlify.com/build/data-and-storage/netlify-blobs/) for
  durable rate limiting in production

## Getting started

Requires [Bun](https://bun.sh) and Node 22+.

```sh
bun install
```

Copy the example environment file and add your key:

```sh
cp .env.example .env.local
```

```sh
# .env.local
OPENROUTER_API_KEY=your-key-from-https://openrouter.ai/keys
```

Start the dev server:

```sh
bun run dev
```

## Scripts

| Command           | Description                    |
| ----------------- | ------------------------------ |
| `bun run dev`     | Start the dev server           |
| `bun run build`   | Build for production           |
| `bun run preview` | Preview the production build   |
| `bun run check`   | Type-check with `svelte-check` |
| `bun run lint`    | Prettier check + ESLint        |
| `bun run format`  | Format with Prettier           |

## How it works

The form `POST`s your idea to a single server endpoint (`src/routes/+server.ts`), which:

1. Applies a sliding-window rate limit — durable via Netlify Blobs in production, falling
   back to in-memory when Blobs is not configured (local dev).
2. Rejects oversized bodies (64 KB cap) and malformed submissions.
3. Sanitizes the idea (control characters, length cap) and runs it through prompt-injection
   and non-project-idea guards.
4. Streams the model's response back to the browser, prefetching until it can confirm the
   output is a real prompt (not the `NOT_A_PROJECT_IDEA` sentinel) before committing to a
   `200`.

The page then renders the streamed markdown, sanitized with DOMPurify.

## Privacy

Promptferry has no accounts, no analytics, no cookies, and no database of submissions. Your
idea is sent to OpenRouter to generate the prompt and is streamed through, not stored here.
See [`/privacy`](./src/routes/privacy/+page.svelte) for the full plain-language description.

## Deploying to Netlify

The project uses [`@sveltejs/adapter-netlify`](https://svelte.dev/docs/kit/adapter-netlify)
and ships a `netlify.toml`:

```toml
[build]
  command = "bun run build"
  publish = "build"

[build.environment]
  NODE_VERSION = "22"
```

1. Create a Netlify site from this repository.
2. Add `OPENROUTER_API_KEY` under **Site configuration → Environment variables**.
3. Deploy. Netlify installs with the committed `bun.lock`, builds, and publishes `build/`.

> **Timeout caveat.** The chosen model runs a long reasoning phase (~20 s end to end). On
> Netlify's free tier synchronous functions have a 10-second limit, so generation can time
> out there. Use a plan that raises the function timeout (e.g. 26 s), or keep generation on a
> platform that allows longer requests. This is a deployment configuration concern, not
> something the app can override.

## License

[MIT](./LICENSE)
