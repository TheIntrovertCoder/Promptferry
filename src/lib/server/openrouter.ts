import { OpenRouter } from '@openrouter/sdk'
import { OPENROUTER_API_KEY } from '$app/env/private'

function validateApiKey(): void {
	if (typeof OPENROUTER_API_KEY !== 'string' || !OPENROUTER_API_KEY.startsWith('sk-or-v1-')) {
		throw new Error('Invalid OPENROUTER_API_KEY: expected a string starting with "sk-or-v1-"')
	}
}

export const openrouter_client = new OpenRouter({
	apiKey: OPENROUTER_API_KEY
})

export { validateApiKey }
