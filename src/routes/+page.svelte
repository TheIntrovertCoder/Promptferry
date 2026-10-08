<script>
	import { marked } from 'marked'
	import DOMPurify from 'dompurify'

	let input = $state('')
	let output = $state('')
	let loading = $state(false)

	async function handleSubmit() {
		loading = true
		output = ''

		const formData = new FormData()
		formData.append('great-idea', input)

		const res = await fetch('/', { method: 'POST', body: formData })

		if (!res.body) throw new Error('No response body')
		const reader = res.body.getReader()
		const decoder = new TextDecoder()

		while (true) {
			const { done, value } = await reader.read()
			if (done) break
			output += decoder.decode(value)
		}

		output = DOMPurify.sanitize(await marked.parse(output))

		loading = false
	}
</script>

<form onsubmit={handleSubmit}>
	<textarea
		bind:value={input}
		placeholder="Your great idea..."
		required
		autocomplete="off"
		autocapitalize="sentences"></textarea>
	<button disabled={loading}>{loading ? 'Streaming...' : 'Submit'}</button>
</form>

<pre>{@html output}</pre>
