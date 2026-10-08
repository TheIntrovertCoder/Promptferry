import { OpenRouter } from "@openrouter/sdk";
import { OPENROUTER_API_KEY } from "$app/env/private"

export const openrouter_client = new OpenRouter({
    apiKey: OPENROUTER_API_KEY
})