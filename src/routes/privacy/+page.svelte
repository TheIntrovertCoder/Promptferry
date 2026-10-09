<script lang="ts">
	import { IDEA_MAX_LENGTH } from '#lib/idea.ts'
</script>

<svelte:head>
	<title>Privacy — Promptferry</title>
	<meta
		name="description"
		content="What Promptferry processes, who processes it, how long it is kept, and your choices."
	/>
</svelte:head>

<section class="legal">
	<h1>Privacy</h1>
	<p class="legal-note">
		Plain-language draft of Promptferry's data practices — not legal advice, and not a
		compliance certification. Have counsel review before launch.
	</p>

	<div class="prose">
		<h2>What is processed</h2>
		<p>
			The project idea you type into the form (up to {IDEA_MAX_LENGTH} characters). Promptferry
			has no accounts, no analytics, no advertising, and no cookies.
		</p>

		<h2>Why it is processed</h2>
		<p>Solely to generate the prompt you requested and stream it back to you.</p>

		<h2>Who processes it</h2>
		<p>
			Your idea is sent to the OpenRouter API (<a
				href="https://openrouter.ai"
				target="_blank"
				rel="noopener noreferrer">openrouter.ai</a
			>), which runs the AI model that writes the prompt. The request is made only when you
			submit the form. Promptferry itself keeps no database and no record of your submission —
			the request is streamed through and discarded. How OpenRouter handles data in turn is
			described in
			<a href="https://openrouter.ai/privacy" target="_blank" rel="noopener noreferrer"
				>OpenRouter's privacy policy</a
			>.
		</p>

		<h2>Retention</h2>
		<p>
			Promptferry has no database, no history, and no profiles — your idea is never written to
			disk. A short-lived rate-limit counter keyed by IP address exists in server memory only
			and expires within about a minute. Anything retained upstream is governed by the
			provider's own policy (linked above).
		</p>

		<h2>Cookies and local storage</h2>
		<p>
			No cookies are set. One preference is saved in your browser's local storage — your
			light/dark theme choice (<code>promptferry-theme</code>). It never leaves your device
			and you can clear it at any time through your browser's site-data settings.
		</p>

		<h2>Your choices and rights</h2>
		<p>
			Because Promptferry keeps no record of your submissions, there is nothing held here to
			access, correct, or delete. Depending on where you live (for example under the GDPR in
			the EEA or UK, or CCPA/CPRA in California), you may have rights over data the AI
			provider retains — exercise those with the provider, as described in
			<a href="https://openrouter.ai/privacy" target="_blank" rel="noopener noreferrer"
				>OpenRouter's privacy policy</a
			>. Anything on your own device is under your control and clearable through your browser.
		</p>

		<h2>Changes</h2>
		<p>
			If these practices change materially, this page will be updated. Last revised: October
			2026.
		</p>
	</div>
</section>
