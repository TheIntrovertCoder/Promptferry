import { openrouter_client } from '#lib/server/openrouter.ts';

export const POST = async ({ request }) => {
	const user_prompt = (await request.formData()).get('great-idea');

	if (typeof user_prompt !== 'string' || !user_prompt.trim()) {
		return new Response('invalid input...', { status: 400 });
	}

	const prompt_response = await openrouter_client.chat.send({
		chatRequest: {
			model: 'apodex/apodex-1.1-mini:free',
			messages: [{ role: 'user', content: user_prompt }],
			stream: true
		}
	});

	if (!(prompt_response instanceof ReadableStream)) {
		return new Response('Expected a streamed response', { status: 400 });
	}

	return new Response(
		new ReadableStream({
			async start(controller) {
				for await (const chunk of prompt_response) {
					controller.enqueue(chunk.choices[0]?.delta?.content ?? '');
				}
				controller.close();
			}
		}),
		{ headers: { 'Content-Type': 'text/event-stream' } }
	);
};
