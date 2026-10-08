interface InjectionPattern {
	label: string
	pattern: RegExp
}

const PATTERNS: InjectionPattern[] = [
	{
		label: 'instruction-override',
		pattern:
			/\bignore\s+(?:all\s+|any\s+|previous|prior|above|earlier|preceding)\s+(?:instructions?|rules?|prompts?|guidelines?|directions?)\b/i
	},
	{
		label: 'instruction-override',
		pattern:
			/\b(?:forget|disregard)\s+(?:everything|all\s+(?:previous|prior|above)|previous|prior|above|your\s+(?:instructions?|rules?))\b/i
	},
	{
		label: 'system-prompt-exfil',
		pattern:
			/\b(?:reveal|show|tell|print|repeat|output|display|leak)(?:\s+me)?\s+(?:your|the|this|all)\s+(?:(?:system|initial|original|hidden|secret)\s+){1,2}(?:message|prompt|instructions?)\b/i
	},
	{
		label: 'jailbreak-persona',
		pattern: /\bdeveloper\s+mode\b|\bjailbreak(?:ed|ing)?\b|\bdo\s+anything\s+now\b/i
	},
	{
		label: 'jailbreak-persona',
		pattern: /\bDAN\b/
	},
	{
		label: 'jailbreak-persona',
		pattern:
			/\byou\s+are\s+now\s+(?:an?\s+)?(?:unrestricted|unfiltered|uncensored|jailbroken)\b/i
	},
	{
		label: 'template-smuggling',
		pattern: /<<SYS>>|\[INST\]|\[\/INST\]|<\|im_start\|>|<\|im_end\|>|<\/?system>/i
	},
	{
		label: 'markup-payload',
		pattern:
			/<\s*script\b|javascript:|<iframe\b|data:text\/html|\bon(?:error|load|click|mouseover|focus)\s*=/i
	}
]

export function scanForInjection(input: string): string | null {
	for (const { label, pattern } of PATTERNS) {
		if (pattern.test(input)) return label
	}
	return null
}
