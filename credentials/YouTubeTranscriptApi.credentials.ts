import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
	Icon,
} from 'n8n-workflow';

export class YouTubeTranscriptApi implements ICredentialType {
	name = 'youTubeTranscriptApi';

	displayName = 'YouTube Transcript API';

	icon: Icon = {
		light: 'file:../nodes/YouTubeTranscript/youtubetranscript.svg',
		dark: 'file:../nodes/YouTubeTranscript/youtubetranscript.dark.svg',
	};

	documentationUrl = 'https://www.youtubetranscript.dev/api-docs';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description:
				'API key from https://www.youtubetranscript.dev/dashboard (starts with yt_sk_live_)',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://www.youtubetranscript.dev/api/v2',
			url: '/credits',
			method: 'GET',
		},
	};
}
