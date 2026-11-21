import type {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	JsonObject,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeApiError, NodeOperationError } from 'n8n-workflow';

const API_BASE = 'https://www.youtubetranscript.dev/api/v2';

export class YouTubeTranscript implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'YouTube Transcript',
		name: 'youTubeTranscript',
		icon: {
			light: 'file:youtubetranscript.svg',
			dark: 'file:youtubetranscript.dark.svg',
		},
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Transcribe, fetch, and translate YouTube video transcripts',
		defaults: {
			name: 'YouTube Transcript',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'youTubeTranscriptApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Get Credits',
						value: 'getCredits',
						action: 'Get credit balance',
						description: 'Return the account credit balance and plan',
					},
					{
						name: 'Transcribe',
						value: 'transcribe',
						action: 'Transcribe a video',
						description: 'Transcribe a YouTube URL or video ID (native captions by default)',
					},
					{
						name: 'Get Transcript',
						value: 'getTranscript',
						action: 'Get a stored transcript',
						description: 'Fetch a stored transcript for a video ID',
					},
					{
						name: 'Translate',
						value: 'translate',
						action: 'Translate a stored transcript',
						description: 'Translate an owned transcript into a target language',
					},
				],
				default: 'transcribe',
			},

			// Transcribe
			{
				displayName: 'Video',
				name: 'video',
				type: 'string',
				default: '',
				required: true,
				placeholder: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
				description: 'YouTube URL or 11-character video ID',
				displayOptions: { show: { operation: ['transcribe'] } },
			},
			{
				displayName: 'Language',
				name: 'language',
				type: 'string',
				default: '',
				placeholder: 'en',
				description: 'Preferred transcript language (ISO 639-1). Leave empty for auto.',
				displayOptions: { show: { operation: ['transcribe', 'getTranscript'] } },
			},
			{
				displayName: 'Mode',
				name: 'mode',
				type: 'options',
				options: [
					{ name: 'Auto (Captions, Then ASR If Needed)', value: 'auto' },
					{ name: 'Captions Only', value: 'captions_only' },
					{ name: 'Speech to Text Only (ASR)', value: 'speech_to_text_only' },
					{ name: 'Human Captions Only', value: 'human_captions_only' },
				],
				default: 'captions_only',
				description: 'How to obtain the transcript. captions_only is the cheapest default.',
				displayOptions: { show: { operation: ['transcribe'] } },
			},

			// Get transcript
			{
				displayName: 'Video ID',
				name: 'videoId',
				type: 'string',
				default: '',
				required: true,
				placeholder: 'dQw4w9WgXcQ',
				description: 'YouTube video ID (11 characters)',
				displayOptions: { show: { operation: ['getTranscript', 'translate'] } },
			},
			{
				displayName: 'Include Timestamps',
				name: 'includeTimestamps',
				type: 'boolean',
				default: true,
				displayOptions: { show: { operation: ['getTranscript'] } },
			},

			// Translate
			{
				displayName: 'Target Language',
				name: 'targetLanguage',
				type: 'string',
				default: '',
				required: true,
				placeholder: 'es',
				description: 'Language to translate into (ISO 639-1)',
				displayOptions: { show: { operation: ['translate'] } },
			},
			{
				displayName: 'Source Language',
				name: 'sourceLanguage',
				type: 'string',
				default: '',
				placeholder: 'en',
				description: 'Source language of the owned transcript. Leave empty to auto-detect.',
				displayOptions: { show: { operation: ['translate'] } },
			},
			{
				displayName: 'Provider',
				name: 'provider',
				type: 'options',
				options: [
					{ name: 'AI (Google Translate)', value: 'ai' },
					{ name: 'YouTube', value: 'youtube' },
				],
				default: 'ai',
				displayOptions: { show: { operation: ['translate'] } },
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const operation = this.getNodeParameter('operation', itemIndex) as string;
				let response: IDataObject;

				if (operation === 'getCredits') {
					response = await apiRequest.call(this, 'GET', '/credits');
				} else if (operation === 'transcribe') {
					const video = this.getNodeParameter('video', itemIndex) as string;
					const language = this.getNodeParameter('language', itemIndex, '') as string;
					const mode = this.getNodeParameter('mode', itemIndex) as string;
					const body: IDataObject = { video, mode };
					if (language) body.language = language;
					response = await apiRequest.call(this, 'POST', '/transcribe', {}, body);
				} else if (operation === 'getTranscript') {
					const videoId = this.getNodeParameter('videoId', itemIndex) as string;
					const language = this.getNodeParameter('language', itemIndex, '') as string;
					const includeTimestamps = this.getNodeParameter(
						'includeTimestamps',
						itemIndex,
						true,
					) as boolean;
					const qs: IDataObject = { include_timestamps: includeTimestamps };
					if (language) qs.language = language;
					response = await apiRequest.call(
						this,
						'GET',
						`/transcripts/${encodeURIComponent(videoId)}`,
						qs,
					);
				} else if (operation === 'translate') {
					const videoId = this.getNodeParameter('videoId', itemIndex) as string;
					const targetLanguage = this.getNodeParameter('targetLanguage', itemIndex) as string;
					const sourceLanguage = this.getNodeParameter('sourceLanguage', itemIndex, '') as string;
					const provider = this.getNodeParameter('provider', itemIndex) as string;
					const body: IDataObject = {
						target_language: targetLanguage,
						provider,
					};
					if (sourceLanguage) body.source_language = sourceLanguage;
					response = await apiRequest.call(
						this,
						'POST',
						`/transcripts/${encodeURIComponent(videoId)}/translate`,
						{},
						body,
					);
				} else {
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, {
						itemIndex,
					});
				}

				returnData.push({ json: response, pairedItem: { item: itemIndex } });
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: error.message },
						pairedItem: { item: itemIndex },
					});
					continue;
				}
				if (error.context) {
					error.context.itemIndex = itemIndex;
					throw error;
				}
				throw new NodeOperationError(this.getNode(), error, { itemIndex });
			}
		}

		return [returnData];
	}
}

async function apiRequest(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	path: string,
	qs: IDataObject = {},
	body?: IDataObject,
): Promise<IDataObject> {
	try {
		return (await this.helpers.httpRequestWithAuthentication.call(this, 'youTubeTranscriptApi', {
			method,
			url: `${API_BASE}${path}`,
			qs,
			body,
			json: true,
		})) as IDataObject;
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}
