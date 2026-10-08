<script lang="ts">
	import { marked } from 'marked'
	import DOMPurify from 'dompurify'
	import { browser } from '$app/env'

	let input = $state('')
	let raw = $state('')
	let loading = $state(false)
	let error = $state('')
	let copied = $state(false)

	let copyTimer: ReturnType<typeof setTimeout> | undefined

	let html = $derived.by(() => {
		if (!browser || !raw) return ''
		const parsed = marked.parse(raw, { async: false })
		return DOMPurify.sanitize(typeof parsed === 'string' ? parsed : '')
	})

	async function handleSubmit(event: SubmitEvent): Promise<void> {
		event.preventDefault()
		if (loading) return

		loading = true
		error = ''
		copied = false
		raw = ''

		try {
			const formData = new FormData()
			formData.append('great-idea', input)

			const res = await fetch('/', { method: 'POST', body: formData })
			if (!res.ok || !res.body) throw new Error(`request failed (${res.status})`)

			const reader = res.body.getReader()
			const decoder = new TextDecoder()
			while (true) {
				const { done, value } = await reader.read()
				if (done) break
				raw += decoder.decode(value, { stream: true })
			}
			raw += decoder.decode()
		} catch {
			error = 'Something went wrong while crafting your prompt. Please try again.'
		} finally {
			loading = false
		}
	}

	async function copyPrompt(): Promise<void> {
		try {
			await navigator.clipboard.writeText(raw)
			copied = true
			clearTimeout(copyTimer)
			copyTimer = setTimeout(() => {
				copied = false
			}, 2000)
		} catch {
			copied = false
		}
	}
</script>

<svelte:head>
	<title>Promptium — Your idea, the ultimate prompt</title>
	<meta
		name="description"
		content="Describe your project idea and Promptium turns it into the ultimate, ready-to-use prompt."
	/>
</svelte:head>

<section class="hero">
	<h1>Describe your project.<br />Get the <span class="grad">ultimate prompt</span>.</h1>
	<p class="sub">
		Share your idea. Promptium turns it into a precise, production-ready prompt you can use
		anywhere.
	</p>
</section>

<form class="idea-card" onsubmit={handleSubmit}>
	<label class="sr-only" for="idea">Your project idea</label>
	<textarea
		id="idea"
		class="idea-input"
		bind:value={input}
		placeholder="e.g. A habit-tracking app with streaks, reminders, and a weekly progress report…"
		rows="5"
		required
		autocomplete="off"
		autocapitalize="sentences"></textarea>
	<div class="form-actions">
		<button class="btn-primary" type="submit" disabled={loading}>
			{#if loading}
				<span class="spinner" aria-hidden="true"></span>
				Generating…
			{:else}
				Generate prompt
			{/if}
		</button>
	</div>
</form>

{#if error}
	<p class="error" role="alert">{error}</p>
{/if}

{#if loading || raw}
	<section class="output-card" aria-busy={loading}>
		<div class="output-head">
			<h2 class="output-title">Your ultimate prompt</h2>
			{#if raw}
				<button class="btn-ghost" type="button" onclick={copyPrompt}>
					{copied ? 'Copied' : 'Copy'}
				</button>
			{/if}
		</div>
		<div class="output-body">
			{#if raw}
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				<div class="prose">{@html html}</div>
			{:else}
				<p class="output-wait">
					<span class="spinner" aria-hidden="true"></span>
					Researching your idea…
				</p>
			{/if}
		</div>
	</section>
{/if}
