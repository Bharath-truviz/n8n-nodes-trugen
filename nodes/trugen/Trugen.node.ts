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
		defaults: {
			name: 'Trugen',
		},
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

			/* ------------------------- CREATE AGENT ------------------------- */

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
				default: '',
				displayOptions: {
					show: { operation: ['createAgent'], avatarSource: ['stock'] },
				},
			},
			{
				displayName: 'Avatar ID',
				name: 'avatarId',
				type: 'string',
				default: '',
				displayOptions: {
					show: { operation: ['createAgent'], avatarSource: ['manual'] },
				},
			},
			{
				displayName: 'Greeting',
				name: 'greeting',
				type: 'string',
				default: 'Hello! How can I help you today?',
				displayOptions: { show: { operation: ['createAgent'] } },
			},
			{
				displayName: 'Max Session Length (Minutes)',
				name: 'maxSessionLengthMinutes',
				type: 'number',
				default: 30,
				displayOptions: { show: { operation: ['createAgent'] } },
			},

			/* ---------------------------- GET CONVERSATION ---------------------------- */

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

			/* ------------------------- CREATE AGENT ------------------------- */
			if (operation === 'createAgent') {
				const avatarSource = this.getNodeParameter('avatarSource', i) as string;
				const avatarId =
					avatarSource === 'stock'
						? (this.getNodeParameter('avatarStockId', i) as string)
						: (this.getNodeParameter('avatarId', i) as string);

				const maxSessionLengthMinutes = this.getNodeParameter(
					'maxSessionLengthMinutes',
					i,
				) as number;

				const body: IDataObject = {
					agent_name: this.getNodeParameter('name', i),
					agent_system_prompt: this.getNodeParameter('system_prompt', i),
					avatars: [
						{
							avatar_key_id: avatarId,
							persona_name: this.getNodeParameter('name', i),
							persona_prompt: this.getNodeParameter('system_prompt', i),
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

			/* ------------------------- GET STOCK AVATARS ------------------------- */
			if (operation === 'getAvatars') {
				response = await this.helpers.httpRequest({
					method: 'GET',
					url: 'https://api.trugen.ai/v1/ext/avatars',
					headers: { 'x-api-key': credentials.apiKey as string },
					json: true,
				});
			}

			/* ------------------------- GET CONVERSATION ------------------------- */
			if (operation === 'getConversation') {
				const conversationId = this.getNodeParameter('conversation_id', i) as string;

				response = await this.helpers.httpRequest({
					method: 'GET',
					url: `https://api.trugen.ai/v1/ext/conversation/${conversationId}`,
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
