<script lang="ts">
	import { IDEA_MAX_LENGTH } from '#lib/idea.ts'
</script>

<svelte:head>
	<title>Privacy — Promptium</title>
	<meta
		name="description"
		content="What Promptium processes, who processes it, how long it is kept, and your choices."
	/>
</svelte:head>

<section class="legal">
	<h1>Privacy</h1>
	<p class="legal-note">
		Plain-language draft of Promptium's data practices — not legal advice, and not a compliance
		certification. Have counsel review before launch.
	</p>

	<div class="prose">
		<h2>What is processed</h2>
		<p>
			The project idea you type into the form (up to {IDEA_MAX_LENGTH} characters). Promptium has
			no accounts, no analytics, no advertising, and no cookies.
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
			submit the form. Promptium itself keeps no database and no record of your submission —
			the request is streamed through and discarded. How OpenRouter handles data in turn is
			described in
			<a href="https://openrouter.ai/privacy" target="_blank" rel="noopener noreferrer"
				>OpenRouter's privacy policy</a
			>.
		</p>

		<h2>Retention</h2>
		<p>
			Promptium stores nothing: no server-side logs of your idea, no history, no profiles.
			Anything retained upstream is governed by the provider's own policy (linked above).
		</p>

		<h2>Cookies and local storage</h2>
		<p>
			No cookies are set. One preference is saved in your browser's local storage — your
			light/dark theme choice (<code>promptium-theme</code>). It never leaves your device and
			you can clear it at any time through your browser's site-data settings.
		</p>

		<h2>Your choices and rights</h2>
		<p>
			Depending on where you live (for example under the GDPR in the EEA or UK, or CCPA/CPRA
			in California), you may have rights to access, correct, delete, or obtain a copy of your
			data, and to object to or restrict certain processing. Because Promptium does not store
			submissions, most such requests would concern data held in your own browser or, where
			applicable, upstream providers. To make a request, contact us at
			<span class="todo">[TODO — add a data-request contact address before launch]</span>.
		</p>

		<h2>Changes</h2>
		<p>
			If these practices change materially, this page will be updated. Last revised: October
			2026.
		</p>
	</div>
</section>
