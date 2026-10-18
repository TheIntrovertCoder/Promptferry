interface InjectionPattern {
	label: string
	pattern: RegExp
}

const PATTERNS: InjectionPattern[] = [
	{
		label: 'instruction-override',
		pattern:
			/\bignore\s+(?:all|any|previous|prior|above|earlier|preceding)(?:\s+(?:previous|prior|above|earlier|preceding))?\s+(?:instructions?|rules?|prompts?|guidelines?|directions?)\b/i
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
			/^\s*(?:(?:please|pls|can\s+you|could\s+you)\s+)*(?:generate|draw|paint|imagine|write|compose|translate|summari[sz]e|explain|solve|calculate|tell|give|list|find|recommend|show|create|make|build|design|develop)\b/i
	},
	{
		label: 'question',
		pattern:
			/^\s*(?:what|who|when|where|why|which|how|is|are|can|could|should|do|does|did|will|would|may|might)\b/i
	},
	{
		label: 'creative-writing',
		pattern:
			/^\s*(?:write|compose|draft|pen|craft|author)\b.*\b(?:a\s+)?(?:story|poem|essay|article|blog|letter|email|speech|script|lyrics|novel|review|caption|bio|headline|slogan|tagline)\b/i
	},
	{
		label: 'code-explanation',
		pattern:
			/^\s*(?:what\s+does|how\s+does|can\s+you\s+explain|explain\s+this|what\s+is\s+this)\b.*\b(code|function|script|program|snippet)\b/i
	},
	{
		label: 'homework-assignment',
		pattern:
			/^\s*(?:can\s+you\s+)?(?:help\s+me\s+)?(?:with\s+)?(?:my\s+)?(?:homework|assignment|project|essay|paper|thesis|dissertation)\b/i
	},
	{
		label: 'image-generation',
		pattern:
			/^\s*(?:generate|create|make|draw|paint|design)\b.*\b(?:image|picture|photo|logo|icon|illustration|graphic|banner|wallpaper)\b/i
	},
	{
		label: 'translation',
		pattern:
			/^\s*(?:translate|translation)\b.*\b(?:to\s+|from\s+|english|spanish|french|german|chinese|japanese|korean|italian|portuguese|russian|arabic|hindi)\b/i
	},
	{
		label: 'summarization',
		pattern:
			/^\s*(?:summarize|summary|summari[sz]e|tl;?dr|give\s+me\s+the\s+gist|in\s+brief)\b/i
	}
]

export function scanForNonIdea(input: string): string | null {
	// Check content-request/question patterns first. content-request verbs
	// (build, make, create, ...) also describe project ideas, so an input
	// that names a concrete project noun is treated as a project idea and
	// allowed through; the model's NOT_A_PROJECT_IDEA sentinel is the
	// backstop for anything that still slips through.
	for (const { label, pattern } of NON_IDEA_PATTERNS) {
		if (!pattern.test(input)) continue
		if (label === 'content-request' && PROJECT_NOUNS.test(input)) {
			return null
		}
		return label
	}
	return null
}
