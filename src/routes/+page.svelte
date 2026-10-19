<script lang="ts">
	import { marked } from 'marked'
	import DOMPurify from 'dompurify'
	import { browser } from '$app/env'
	import { IDEA_MAX_LENGTH, sanitizeIdea } from '#lib/idea.ts'

	let input = $state('')
	let raw = $state('')
	let loading = $state(false)
	let error = $state('')
	let hint = $state('')
	let copied = $state(false)
	let stage = $state('')
	let streamComplete = $state(false)
	let truncated = $state(false)

	// Sent by the server when generation hits its deadline — strip it from
	// copied output and surface a warning to the user.
	const TRUNCATION_MARKER = '\n\n_[Response was truncated due to a generation timeout.]_'

	const NON_IDEA_FALLBACK =
		'That looks like a request for content rather than a project to build. Describe the app, site, or tool you want to make.'

	// Cap the accumulated streamed response so a very long model output
	// cannot grow client memory without bound.
	const MAX_RESPONSE_CHARS = 100_000

	function errorFallback(status: number): string {
		if (status === 429)
			return 'You are sending requests too quickly. Wait a moment and try again.'
		if (status === 413)
			return 'Your idea was too large to process. Please shorten it and try again.'
		if (status >= 500)
			return 'The prompt service had a problem on its side. Please try again in a moment.'
		return 'The server rejected this request. Please check your idea and try again.'
	}

	let copyTimer: ReturnType<typeof setTimeout> | undefined

	let html = $derived.by(() => {
		if (!browser || !raw || loading) return ''
		let parsed: string
		try {
			parsed = marked.parse(raw, { async: false })
		} catch {
			parsed = ''
		}
		return DOMPurify.sanitize(typeof parsed === 'string' ? parsed : '', {
			FORBID_ATTR: [
				'onerror',
				'onload',
				'onclick',
				'onmouseover',
				'onmouseout',
				'onfocus',
				'onkeydown',
				'onkeyup',
				'style',
				'href',
				'src'
			],
			FORBID_TAGS: [
				'script',
				'iframe',
				'object',
				'embed',
				'form',
				'input',
				'textarea',
				'select',
				'button'
			]
		})
	})

	async function handleSubmit(event: SubmitEvent): Promise<void> {
		event.preventDefault()
		if (loading) return

		error = ''
		hint = ''
		const idea = sanitizeIdea(input)
		if (!idea) {
			error = 'Please enter a project idea.'
			return
		}

		loading = true
		copied = false
		raw = ''
		stage = 'sending'
		streamComplete = false
		truncated = false

		try {
			const formData = new FormData()
			formData.append('great-idea', idea)

			let res: Response
			try {
				res = await fetch('/', { method: 'POST', body: formData })
			} catch {
				error = 'Could not reach the server. Check your internet connection and try again.'
				return
			}

			if (!res.ok) {
				const detail = (await res.text().catch(() => '')).trim().slice(0, 300)
				if (res.status === 422) {
					hint = detail || NON_IDEA_FALLBACK
				} else {
					error = detail || errorFallback(res.status)
				}
				return
			}

			if (!res.body) {
				error = 'The server returned an empty response. Please try again.'
				return
			}

			const reader = res.body.getReader()
			const decoder = new TextDecoder()
			try {
				while (true) {
					const { done, value } = await reader.read()
					if (done) {
						streamComplete = true
						break
					}
					if (raw.length >= MAX_RESPONSE_CHARS) continue // cap reached: drain without storing
					raw += decoder.decode(value, { stream: true })
					if (stage === 'sending') stage = 'generating'
					if (raw.length > MAX_RESPONSE_CHARS) {
						raw = raw.slice(0, MAX_RESPONSE_CHARS)
					}
				}
				raw += decoder.decode()
				if (raw.length > MAX_RESPONSE_CHARS) {
					raw = raw.slice(0, MAX_RESPONSE_CHARS)
				}
				truncated = raw.endsWith(TRUNCATION_MARKER)
			} catch {
				error = 'The connection dropped while generating your prompt. Please try again.'
			}
		} finally {
			loading = false
			stage = ''
			if (streamComplete && !raw.trim() && !error) {
				error = 'The prompt came back empty. Please try again.'
			}
		}
	}

	async function copyPrompt(): Promise<void> {
		try {
			if (!navigator.clipboard) {
				copied = false
				return
			}
			await navigator.clipboard.writeText(raw.replace(TRUNCATION_MARKER, ''))
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
	<title>Promptferry — Your idea, the ultimate prompt</title>
	<meta
		name="description"
		content="Describe your project idea and Promptferry turns it into the ultimate, ready-to-use prompt."
	/>
</svelte:head>

<section class="hero">
	<h1>Describe your project.<br />Get the <span class="grad">ultimate prompt</span>.</h1>
	<p class="sub">
		Share your idea. Promptferry turns it into a precise, production-ready prompt you can use
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
		maxlength={IDEA_MAX_LENGTH}
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

{#if hint}
	<p class="hint" role="status">{hint}</p>
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
			{#if loading}
				<p class="output-wait" role="status">
					<span class="spinner" aria-hidden="true"></span>
					{#if stage === 'sending'}
						Sending your idea…
					{:else if stage === 'generating'}
						Generating your prompt…
					{:else}
						Putting it together…
					{/if}
				</p>
			{:else if raw}
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				<div class="prose">{@html html}</div>
				{#if truncated}
					<p class="output-wait" role="status">
						The response was cut off before finishing. Copy what's generated and try
						again with a shorter idea.
					</p>
				{/if}
			{/if}
		</div>
	</section>
{/if}
