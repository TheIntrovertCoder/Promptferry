const WINDOW_MS = 60_000
const MAX_REQUESTS = 10
const SWEEP_THRESHOLD = 10_000

const hits = new Map<string, number[]>()

export interface RateLimitResult {
	ok: boolean
	retryAfterSeconds: number
}

export function checkRateLimit(key: string, now: number = Date.now()): RateLimitResult {
	if (hits.size > SWEEP_THRESHOLD) sweep(now)

	const windowStart = now - WINDOW_MS
	const timestamps = (hits.get(key) ?? []).filter((time) => time > windowStart)

	if (timestamps.length >= MAX_REQUESTS) {
		hits.set(key, timestamps)
		const retryAfterSeconds = Math.ceil((timestamps[0] + WINDOW_MS - now) / 1000)
		return { ok: false, retryAfterSeconds: Math.max(retryAfterSeconds, 1) }
	}

	timestamps.push(now)
	hits.set(key, timestamps)
	return { ok: true, retryAfterSeconds: 0 }
}

function sweep(now: number): void {
	const windowStart = now - WINDOW_MS
	for (const [key, timestamps] of hits) {
		const live = timestamps.filter((time) => time > windowStart)
		if (live.length === 0) hits.delete(key)
		else hits.set(key, live)
	}
}
