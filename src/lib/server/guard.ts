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

const PROJECT_NOUNS =
	/\b(?:app|application|website|site|web\s*app|platform|tool|service|saas|software|program|system|dashboard|game|bot|extension|api|marketplace|tracker|planner|manager|generator|maker|builder)\b/i

const NON_IDEA_PATTERNS: InjectionPattern[] = [
	{
		label: 'content-request',
		pattern:
			/^\s*(?:(?:please|pls|can\s+you|could\s+you)\s+)*(?:generate|draw|paint|imagine|write|compose|translate|summari[sz]e|explain|solve|calculate|tell|give|list|find|recommend|show)\b/i
	},
	{
		label: 'question',
		pattern: /^\s*(?:what|who|when|where|why|which|how|is|are|can|could|should|do|does|did)\b/i
	}
]

export function scanForNonIdea(input: string): string | null {
	if (PROJECT_NOUNS.test(input)) return null
	for (const { label, pattern } of NON_IDEA_PATTERNS) {
		if (pattern.test(input)) return label
	}
	return null
}
