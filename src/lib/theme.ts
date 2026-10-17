import { browser } from '$app/env'

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'promptferry-theme'

export function toggleTheme(): void {
	if (!browser) return

	const root = document.documentElement
	const next: Theme = root.dataset.theme === 'dark' ? 'light' : 'dark'

	const apply = (): void => {
		root.dataset.theme = next
		try {
			localStorage.setItem(STORAGE_KEY, next)
		} catch {
			// storage unavailable — theme still applies for this session
		}
	}

	const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

	if (!reducedMotion && typeof document.startViewTransition === 'function') {
		document.startViewTransition(apply)
	} else {
		apply()
	}
}
