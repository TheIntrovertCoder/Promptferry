<script lang="ts">
	import favicon from '#lib/assets/favicon.svg'
	import { toggleTheme } from '#lib/theme.ts'
	import type { LayoutProps } from './$types'
	import '../app.css'

	let { children }: LayoutProps = $props()
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<header class="site-header">
	<a class="brand" href="/">
		<img class="brand-mark" src={favicon} alt="" width="28" height="28" />
		<span>Promptferry</span>
	</a>

	<button
		class="theme-toggle"
		type="button"
		onclick={toggleTheme}
		aria-label="Toggle color theme"
	>
		<svg
			class="icon-moon"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="1.8"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<path d="M20.95 12.95 A9 9 0 1 1 11.05 3.05 A7 7 0 0 0 20.95 12.95 Z" />
		</svg>
		<svg
			class="icon-sun"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="1.8"
			stroke-linecap="round"
			aria-hidden="true"
		>
			<circle cx="12" cy="12" r="4" />
			<path
				d="M12 2.5v2.2M12 19.3v2.2M4.57 4.57l1.56 1.56M17.87 17.87l1.56 1.56M2.5 12h2.2M19.3 12h2.2M4.57 19.43l1.56-1.56M17.87 6.13l1.56-1.56"
			/>
		</svg>
	</button>
</header>

<main>
	{@render children()}
</main>

<footer class="site-footer">
	<p>
		Ideas are processed by <a
			href="https://openrouter.ai"
			target="_blank"
			rel="noopener noreferrer">OpenRouter</a
		>
		to generate your prompt. No accounts, no tracking. Generated prompts are provided as-is — review
		and adapt before use.
	</p>
	<a class="footer-link" href="/privacy">Privacy</a>
	<a
		class="footer-github"
		href="https://github.com/TheIntrovertCoder/Promptferry"
		target="_blank"
		rel="noopener noreferrer"
		aria-label="View source on GitHub"
	>
		<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="18" height="18">
			<path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
		</svg>
	</a>
</footer>
