# npm Trusted Publisher (one-time)

Required for Creator Portal verification (npm provenance via GitHub Actions).

1. Create the public GitHub repo `Youtube-Transcript-Dev/n8n-nodes-youtubetranscript` and push `main`.
2. On [npmjs.com](https://www.npmjs.com/), create an account/org that can own `n8n-nodes-youtubetranscript`.
3. Publish once is not required for Trusted Publisher setup on a new package name — add the publisher after the package exists, or use Option B below for the first publish.
4. Package **Settings → Publish access → Trusted Publishers → Add a publisher**:
   - Provider: GitHub Actions
   - Repository owner: `Youtube-Transcript-Dev`
   - Repository name: `n8n-nodes-youtubetranscript`
   - Workflow filename: `publish.yml`
   - Environment: leave blank
5. Do **not** set `NPM_TOKEN` if using OIDC (Option A).

## First publish

Locally (with npm login + publish rights), or via token:

```bash
npm run release
```

That bumps the version, tags `x.y.z`, and pushes; [`.github/workflows/publish.yml`](.github/workflows/publish.yml) then publishes with provenance.

### Option B — NPM_TOKEN fallback

GitHub repo → Settings → Secrets → Actions → `NPM_TOKEN` = granular npm token with publish on this package.
