import { getStore, type Store } from '@netlify/blobs'

const WINDOW_MS = 60_000
const MAX_REQUESTS = 10
const SWEEP_THRESHOLD = 10_000
const STORE_NAME = 'promptferry-rate-limit'

const hits = new Map<string, number[]>()
let storeResolved = false
let blobsStore: Store | undefined

export interface RateLimitResult {
	ok: boolean
	retryAfterSeconds: number
}

function getBlobsStore(): Store | undefined {
	if (storeResolved) return blobsStore
	storeResolved = true
	try {
		blobsStore = getStore({ name: STORE_NAME, consistency: 'strong' })
	} catch {
		blobsStore = undefined
	}
	return blobsStore
}

export async function checkRateLimit(
	key: string,
	now: number = Date.now()
): Promise<RateLimitResult> {
	const store = getBlobsStore()
	if (store) {
		try {
			return await checkBlobs(store, key, now)
		} catch (err) {
			console.error('[rate-limit] Netlify Blobs unavailable, falling back to memory:', err)
			storeResolved = true
			blobsStore = undefined
		}
	}
	return checkMemory(key, now)
}

async function checkBlobs(store: Store, key: string, now: number): Promise<RateLimitResult> {
	const windowStart = now - WINDOW_MS
	const stored = await store.get(key, { type: 'json' })
	const timestamps = (Array.isArray(stored) ? stored : []).filter(
		(time): time is number => typeof time === 'number' && time > windowStart
	)

	if (timestamps.length >= MAX_REQUESTS) {
		return { ok: false, retryAfterSeconds: retryAfter(timestamps[0], now) }
	}

	timestamps.push(now)
	await store.setJSON(key, timestamps)
	return { ok: true, retryAfterSeconds: 0 }
}

function checkMemory(key: string, now: number): RateLimitResult {
	if (hits.size > SWEEP_THRESHOLD) sweep(now)

	const windowStart = now - WINDOW_MS
	const timestamps = (hits.get(key) ?? []).filter((time) => time > windowStart)

	if (timestamps.length >= MAX_REQUESTS) {
		hits.set(key, timestamps)
		return { ok: false, retryAfterSeconds: retryAfter(timestamps[0], now) }
	}

	timestamps.push(now)
	hits.set(key, timestamps)
	return { ok: true, retryAfterSeconds: 0 }
}

function retryAfter(oldest: number, now: number): number {
	return Math.max(Math.ceil((oldest + WINDOW_MS - now) / 1000), 1)
}

function sweep(now: number): void {
	const windowStart = now - WINDOW_MS
	for (const [key, timestamps] of hits) {
		const live = timestamps.filter((time) => time > windowStart)
		if (live.length === 0) hits.delete(key)
		else hits.set(key, live)
	}
}
