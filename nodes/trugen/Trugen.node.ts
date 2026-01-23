import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	IDataObject,
	JsonObject,
} from 'n8n-workflow';

const trugenHelpers = {
	formatResponse(responseData: unknown): JsonObject {
		let formatted: unknown = responseData;

		if (typeof formatted === 'string') {
			try {
				formatted = JSON.parse(formatted);
			} catch {
				return { data: formatted as string };
			}
		}

		if (Array.isArray(formatted)) {
			return { data: formatted };
		}

		if (!formatted || typeof formatted !== 'object') {
			return { data: String(formatted) };
		}

		if ('id' in formatted) {
			const typed = formatted as { id: string };
			return {
				...(formatted as JsonObject),
				call_link: `https://app.trugen.ai/agent/${typed.id}`,
				embed_code: `<iframe src="https://app.trugen.ai/embed?agentId=${typed.id}" width="100%" height="600" frameborder="0" allow="camera; microphone; autoplay"></iframe>`,
			};
		}

		return formatted as JsonObject;
	},
};

export class Trugen implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Trugen',
		name: 'trugen',
		icon: { light: 'file:trugen.svg', dark: 'file:trugen.dark.svg' },
		group: ['transform'],
		version: 1,
		usableAsTool: true,
		description: 'Create agents, list avatars, and fetch conversations from Trugen',
		defaults: { name: 'Trugen' },
		inputs: <NodeConnectionType[]>['main'],
		outputs: <NodeConnectionType[]>['main'],
		credentials: [{ name: 'trugenApi', required: true }],

		properties: [
			{
				displayName: 'Action',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Create Agent', value: 'createAgent' },
					{ name: 'Get Stock Avatars', value: 'getAvatars' },
					{ name: 'Get Conversation', value: 'getConversation' },
				],
				default: 'createAgent',
			},
			{
				displayName: 'Agent Name',
				name: 'name',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { operation: ['createAgent'] } },
			},
			{
				displayName: 'System Prompt',
				name: 'system_prompt',
				type: 'string',
				required: true,
				default: 'You are a helpful assistant.',
				displayOptions: { show: { operation: ['createAgent'] } },
			},
			{
				displayName: 'Greeting',
				name: 'greeting',
				type: 'string',
				default: 'Hello! How can I help you today?',
				displayOptions: { show: { operation: ['createAgent'] } },
			},
			{
				displayName: 'Avatar Source',
				name: 'avatarSource',
				type: 'options',
				options: [
					{ name: 'Stock Avatar', value: 'stock' },
					{ name: 'Manual Avatar ID', value: 'manual' },
				],
				default: 'stock',
				displayOptions: { show: { operation: ['createAgent'] } },
			},
			{
				displayName: 'Stock Avatar ID',
				name: 'avatarStockId',
				type: 'string',
				default: '665a1170',
				displayOptions: {
					show: { operation: ['createAgent'], avatarSource: ['stock'] },
				},
			},
			{
				displayName: 'Avatar ID',
				name: 'avatarId',
				type: 'string',
				default: '665a1170',
				displayOptions: {
					show: { operation: ['createAgent'], avatarSource: ['manual'] },
				},
			},
			{
				displayName: 'LLM Provider',
				name: 'llmProvider',
				type: 'options',
				options: [
					{ name: 'OpenAI', value: 'openai' },
					{ name: 'Groq', value: 'groq' },
					{ name: 'Google', value: 'google' },
				],
				default: 'openai',
				displayOptions: { show: { operation: ['createAgent'] } },
			},
			{
				displayName: 'LLM Model (OpenAI)',
				name: 'llmModel_openai',
				type: 'options',
				options: [
					{ name: 'GPT-4.1 Mini', value: 'gpt-4.1-mini' },
					{ name: 'GPT-4.1 Nano', value: 'gpt-4.1-nano' },
					{ name: 'GPT-4.1', value: 'gpt-4.1' },
				],
				default: 'gpt-4.1-mini',
				displayOptions: {
					show: { operation: ['createAgent'], llmProvider: ['openai'] },
				},
			},
			{
				displayName: 'LLM Model (Groq)',
				name: 'llmModel_groq',
				type: 'string',
				default: 'meta-llama/llama-4-maverick-17b-128e-instruct',
				displayOptions: {
					show: { operation: ['createAgent'], llmProvider: ['groq'] },
				},
			},
			{
				displayName: 'LLM Model (Google)',
				name: 'llmModel_google',
				type: 'string',
				default: 'gemini-2.5-flash',
				displayOptions: {
					show: { operation: ['createAgent'], llmProvider: ['google'] },
				},
			},
			{
				displayName: 'TTS Provider',
				name: 'ttsProvider',
				type: 'options',
				options: [{ name: 'ElevenLabs', value: 'elevenlabs' }],
				default: 'elevenlabs',
				displayOptions: { show: { operation: ['createAgent'] } },
			},
			{
				displayName: 'TTS Model',
				name: 'ttsModel_elevenlabs',
				type: 'string',
				default: 'eleven_turbo_v2_5',
				displayOptions: {
					show: { operation: ['createAgent'], ttsProvider: ['elevenlabs'] },
				},
			},
			{
				displayName: 'TTS Voice ID',
				name: 'ttsVoiceId',
				type: 'string',
				default: 'FGY2WhTYpPnrIDTdsKH5',
				displayOptions: {
					show: { operation: ['createAgent'], ttsProvider: ['elevenlabs'] },
				},
			},
			{
				displayName: 'STT Provider',
				name: 'sttProvider',
				type: 'options',
				options: [
					{ name: 'Deepgram', value: 'deepgram' },
					{ name: 'Deepgram V2', value: 'deepgram-v2' },
				],
				default: 'deepgram',
				displayOptions: { show: { operation: ['createAgent'] } },
			},
			{
				displayName: 'STT Model',
				name: 'sttModel',
				type: 'string',
				default: 'nova-3',
				displayOptions: { show: { operation: ['createAgent'] } },
			},
			{
				displayName: 'STT Language',
				name: 'sttLanguage',
				type: 'string',
				default: 'en',
				displayOptions: { show: { operation: ['createAgent'] } },
			},
			{
				displayName: 'Max Session Length (Minutes)',
				name: 'maxSessionLengthMinutes',
				type: 'number',
				default: 5,
				displayOptions: { show: { operation: ['createAgent'] } },
			},
			{
				displayName: 'Record Calls',
				name: 'record',
				type: 'boolean',
				default: true,
				displayOptions: { show: { operation: ['createAgent'] } },
			},
			{
				displayName: 'Callback Events',
				name: 'callback_events',
				type: 'multiOptions',
				default: [],
				options: [
					{ name: 'Call Ended', value: 'call_ended' },
					{ name: 'Agent Interrupted', value: 'agent.interrupted' },
				],
				displayOptions: { show: { operation: ['createAgent'] } },
			},
			{
				displayName: 'Callback URL',
				name: 'callback_url',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['createAgent'] } },
			},
			{
				displayName: 'Conversation ID',
				name: 'conversation_id',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { operation: ['getConversation'] } },
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const operation = this.getNodeParameter('operation', 0) as string;
		const credentials = await this.getCredentials('trugenApi');

		const results: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			let response: unknown;

			if (operation === 'createAgent') {
				const avatarSource = this.getNodeParameter('avatarSource', i);
				const avatarId =
					avatarSource === 'stock'
						? this.getNodeParameter('avatarStockId', i)
						: this.getNodeParameter('avatarId', i);

				const llmProvider = this.getNodeParameter('llmProvider', i);
				const llmModel =
					llmProvider === 'openai'
						? this.getNodeParameter('llmModel_openai', i)
						: llmProvider === 'groq'
							? this.getNodeParameter('llmModel_groq', i)
							: this.getNodeParameter('llmModel_google', i);

				const capabilities = this.getNodeParameter('capabilities', i, []) as string[];
				const maxSessionLengthMinutes = this.getNodeParameter(
					'maxSessionLengthMinutes',
					i,
				) as number;
				const body: IDataObject = {
					agent_name: this.getNodeParameter('name', i),
					agent_system_prompt: this.getNodeParameter('system_prompt', i),
					record: this.getNodeParameter('record', i),
					callback_events: this.getNodeParameter('callback_events', i),
					callback_url: this.getNodeParameter('callback_url', i),
					avatars: [
						{
							avatar_key_id: avatarId,
							persona_name: this.getNodeParameter('name', i),
							persona_prompt: this.getNodeParameter('system_prompt', i),
							config: {
								llm: { provider: llmProvider, model: llmModel },
								stt: {
									provider: this.getNodeParameter('sttProvider', i),
									model: this.getNodeParameter('sttModel', i),
									language: this.getNodeParameter('sttLanguage', i),
								},
								tts: {
									provider: this.getNodeParameter('ttsProvider', i),
									model_id: this.getNodeParameter('ttsModel_elevenlabs', i),
									voice_id: this.getNodeParameter('ttsVoiceId', i),
								},
								webcam: capabilities.includes('webcam_vision'),
								screen: capabilities.includes('screen_vision'),
							},
							welcome_message: {
								wait_time: 2,
								messages: [this.getNodeParameter('greeting', i)],
							},
						},
					],
					config: {
						timeout: maxSessionLengthMinutes * 60,
					},
				};

				response = await this.helpers.httpRequest({
					method: 'POST',
					url: 'https://api.trugen.ai/v1/ext/agent',
					headers: { 'x-api-key': credentials.apiKey as string },
					body,
					json: true,
				});
			}

			if (operation === 'getAvatars') {
				response = await this.helpers.httpRequest({
					method: 'GET',
					url: 'https://api.trugen.ai/v1/ext/avatars',
					headers: { 'x-api-key': credentials.apiKey as string },
					json: true,
				});
			}

			if (operation === 'getConversation') {
				response = await this.helpers.httpRequest({
					method: 'GET',
					url: `https://api.trugen.ai/v1/ext/conversation/${this.getNodeParameter(
						'conversation_id',
						i,
					)}`,
					headers: { 'x-api-key': credentials.apiKey as string },
					json: true,
				});
			}

			results.push({
				json: trugenHelpers.formatResponse(response),
				pairedItem: { item: i },
			});
		}

		return this.prepareOutputData(results);
	}
}
