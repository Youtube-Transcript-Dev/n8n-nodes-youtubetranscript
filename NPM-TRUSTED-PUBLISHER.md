# npm Trusted Publisher (one-time)

Required for Creator Portal verification (npm provenance via GitHub Actions).
Default branch must be **`main`** (`n8n-node release` requires it).

## Why token-first

npm cannot attach a Trusted Publisher until the package **already exists**.  
n8n also rejects packages published only from a laptop (no provenance).  
So the first release uses **GitHub Actions + `NPM_TOKEN`** (still gets provenance). After that, switch to Trusted Publisher (OIDC) and drop the token.

## Step A — First publish (token)

1. Sign in at https://www.npmjs.com/login (account that should own the package).
2. Create a **Granular Access Token** with permission to publish / create packages:
   - https://www.npmjs.com/settings/~/tokens → Generate New Token → Granular Access Token  
   - Permissions: Read and write (packages). Expiration: short-lived is fine for bootstrap.
3. Add it as a GitHub Actions secret on this repo:

```bash
gh secret set NPM_TOKEN --repo Youtube-Transcript-Dev/n8n-nodes-youtubetranscript
# paste token when prompted
```

4. From a clean `main` working tree:

```bash
npm run release
```

Local release **does not** publish to npm. It bumps version, tags `x.y.z`, pushes, and opens a GitHub Release. The tag triggers [`.github/workflows/publish.yml`](.github/workflows/publish.yml), which runs `npm publish` with `NPM_CONFIG_PROVENANCE=true`.

5. Validate:

```bash
npm view n8n-nodes-youtubetranscript version
# On the npm package page, confirm “Provenance” / “Built and signed on GitHub Actions”
```

## Step B — Trusted Publisher (after package exists)

1. https://www.npmjs.com/package/n8n-nodes-youtubetranscript → **Settings** → **Trusted Publisher**
2. Add GitHub Actions:
   - Repository owner: `Youtube-Transcript-Dev`
   - Repository name: `n8n-nodes-youtubetranscript`
   - Workflow filename: `publish.yml`
   - Environment: leave blank
   - Allow `npm publish` (required)
3. Optional: delete the `NPM_TOKEN` repo secret once Trusted Publisher works on the next release.
