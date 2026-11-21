# Slack note for Akash (n8n listing)

Looked into the n8n listing approach — it matches their verified community-node path (credential + a few ops, public GitHub repo, npm publish via GHA with provenance, Creator Portal, uncut self-hosted demo). Review can take up to ~4 weeks; we get a dedicated n8n.com page + dofollow.

Recommend we start with **YouTube Transcript** (best OpenAPI, clear ops: transcribe / get transcript / translate), then **removebackground**, then **sociallinks**. MM/Kovered can reuse the same pattern after MCP. Edge Add-ons is a separate track (only if we have/want a small Chromium extension).

No API redesign needed — thin wrappers on existing V2. Scaffolding `n8n-nodes-youtubetranscript` now.
