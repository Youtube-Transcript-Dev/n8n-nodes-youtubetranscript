# n8n-nodes-youtubetranscript-dev

Verified-community-node candidate for [YouTube Transcript](https://www.youtubetranscript.dev): transcribe YouTube videos, fetch stored transcripts, translate them, and check credit balance.

Package name uses `-dev` (npm blocked `n8n-nodes-youtubetranscript` as too similar to an unrelated community package `n8n-nodes-youtube-transcript`).

Install from npm (once published) or from the n8n nodes panel after Creator Portal verification.

## Credentials

| Field | Description |
| --- | --- |
| API Key | `yt_sk_live_…` from [Dashboard](https://www.youtubetranscript.dev/dashboard) |

Sent as `Authorization: Bearer …` to `https://www.youtubetranscript.dev/api/v2`.

## Operations

| Operation | API | Notes |
| --- | --- | --- |
| **Get Credits** | `GET /credits` | Free |
| **Transcribe** | `POST /transcribe` | YouTube URL or video ID; default mode `captions_only` |
| **Get Transcript** | `GET /transcripts/{video_id}` | Stored transcript |
| **Translate** | `POST /transcripts/{video_id}/translate` | Needs an owned transcript first |

Full API: [api-docs](https://www.youtubetranscript.dev/api-docs) · OpenAPI: `/api/v2/openapi.json`

## Local development

```bash
npm ci
npm run build
npm run lint
npm run dev   # opens n8n with this node loaded
```

Requires Node 22+.

## Publish (npm provenance)

From May 2026, n8n verification requires GitHub Actions publish with provenance. This repo includes [`.github/workflows/publish.yml`](.github/workflows/publish.yml).

One-time npm setup (Trusted Publisher):

1. Create the package on npm (or publish once).
2. Package settings → **Trusted Publishers** → GitHub Actions:
   - Owner: `Youtube-Transcript-Dev`
   - Repo: `n8n-nodes-youtubetranscript`
   - Workflow: `publish.yml`
3. Locally: `npm run release` (bumps version, tags, pushes → workflow publishes).

Fallback: set repo secret `NPM_TOKEN` (granular publish token).

## Creator Portal + demo video

See [CREATOR-PORTAL.md](./CREATOR-PORTAL.md).

## License

[MIT](./LICENSE.md)
