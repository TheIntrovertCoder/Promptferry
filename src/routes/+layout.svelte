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
</footer>
