# Creator Portal submission checklist

## Before submit

- [ ] Package published to npm via GHA + provenance (`0.1.0` or later)
- [ ] `npm run lint` and `npm run build` clean
- [ ] Tested on **self-hosted** n8n (Cloud install of unverified community nodes may differ)
- [ ] Credential test succeeds (Get Credits)
- [ ] Transcribe + Get Transcript (or Translate) run successfully
- [ ] Node usable as AI agent tool (`usableAsTool: true`)

## Portal fields (draft)

| Field | Value |
| --- | --- |
| Integration name | YouTube Transcript |
| Short description | Transcribe YouTube videos, fetch stored transcripts, and translate them with the YouTube Transcript API. |
| npm package | `n8n-nodes-youtubetranscript` |
| Website | https://www.youtubetranscript.dev |
| Docs | https://www.youtubetranscript.dev/api-docs |

Portal: https://creators.n8n.io/ (or the current Creator Portal URL from n8n docs)

## Demo video script (one take, no cuts)

Record on self-hosted n8n with the **exact** published package version.

1. Show terminal or n8n UI installing `n8n-nodes-youtubetranscript@x.y.z`.
2. Restart / open n8n → add **YouTube Transcript** credentials with a live API key → test connection.
3. Workflow: **Manual Trigger** → **YouTube Transcript** (Transcribe a short public video, captions_only).
4. Second node or second run: **Get Transcript** (same video ID) or **Translate** to `es`.
5. Optional: show the node in an AI Agent tools list.
6. Stop. Export nothing secret (blur key if visible).

Review can take up to four weeks.
