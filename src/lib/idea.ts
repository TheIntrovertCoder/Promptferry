export const IDEA_MAX_LENGTH = 8000

function isStrayControl(code: number): boolean {
	if (code === 9 || code === 10) return false
	if (code < 32) return true
	return code === 127 || (code >= 128 && code <= 159)
}

export function sanitizeIdea(value: string): string {
	const normalized = value.replace(/\r\n?/g, '\n')
	let result = ''
	for (const char of normalized) {
		if (!isStrayControl(char.charCodeAt(0))) result += char
	}
	return result.trim()
}
