# Manual setup steps

What has to be set up by hand, outside the code, to run this project on an
account of your own, and why. Everything that *can* be code is: the Cloudflare
database and Worker are `infra/` (see `infra/AGENTS.md`), and the checks and
deployments are `.github/workflows/`.

**Keep this file current.** Add to it in the same pass as any change that
creates, renames or removes something outside the repository: a new resource,
secret, DNS record, console setting or workflow permission. **Never put an
account id, token, secret or personal address in it.**

Placeholders used below:

| Placeholder        | Meaning                                                    |
| ------------------ | ---------------------------------------------------------- |
| `<domain>`         | A domain you own, as a zone on your Cloudflare account     |
| `<site-host>`      | Where the game is served, e.g. `play.<domain>`             |
| `<api-host>`       | Where the API is served: **one label** below `<domain>`    |
| `<account-id>`     | The hex id in your Cloudflare dashboard's address:          |
|                    | `dash.cloudflare.com/<account-id>/home`                    |
| `<owner>/<repo>`   | Your GitHub repository                                     |

This repository's own values are at the end.

## What you need

- A **Cloudflare account** (the free plan is enough; never enable a paid
  Workers plan, which is what keeps the cost at nothing) with `<domain>` as a
  zone.
- A **Google account** to own a Google Cloud project.
- A **GitHub repository** with Pages and Actions.
- A machine with Node (`.nvmrc`) and pnpm.

## What to change in the code first

Three places name the deployment, and a fork changes them:

1. `shared/src/janggi/account/ApiOrigin.ts`: `API_ORIGIN`, the address of the
   API (`https://<api-host>`). Or leave it and build the webapp with
   `VITE_API_ORIGIN=https://<api-host>`.
2. `SITE_ORIGINS` in the deploy environment (step 5): the origins allowed to
   call the API with credentials, comma-separated. Defaults to this
   repository's own site and `http://localhost:3000`.
3. The site's own build (`BASE_PATH`, in `.github/workflows/ci.yml`) if it is
   not served from the root of `<site-host>`.

## 1. The site and its domain

- `<domain>` is a zone on the Cloudflare account, with its DNS there.
- Enable Pages for the repository (Settings, Pages, source *GitHub Actions*)
  and set `<site-host>` as its custom domain. Its DNS record points at GitHub
  Pages and is **DNS only** (not proxied). There is no `CNAME` file in the
  repository, because the deploy is an Actions artifact.

## 2. A contact address

So that neither the Google nor the Cloudflare account needs a personal
address. Uses Cloudflare Email Routing on the zone.

1. `https://dash.cloudflare.com/<account-id>/home`, open `<domain>`.
2. Compute, Email Service, Email Routing. Enable it if it is not (this adds MX
   and SPF records to the zone, so it affects any other mail on the domain),
   and verify your own inbox under Destination addresses.
3. Routing Rules, Create routing rule: pattern e.g. `janggi`, action *Send to an
   email*, destination your verified inbox. Send it a test message.

It only forwards. It cannot send *as* the address.

## 3. A Google OAuth client

The one thing no tool can create. Only the `openid` scope is ever asked for,
so the app does not need sensitive- or restricted-scope verification. A public
production app may still need brand verification.

1. Project: `https://console.cloud.google.com/projectcreate`.
2. Branding and audience: `https://console.cloud.google.com/auth/overview`
   (*Get started*).
   - **User support email** is a dropdown of the signed-in Google account and
     any Google Group it manages, so it cannot be an arbitrary address. Use a
     Google Group you own (with its member list hidden), or the account's own
     address. This is shown to people on the consent screen.
   - **Developer contact email** is free text: the address from step 2.
   - **App home page:** `https://<site-host>/`.
   - **Privacy policy:** `https://<site-host>/privacy.html`.
   - **Terms of service:** `https://<site-host>/terms.html`.
   - Add `<domain>` under *Authorised domains*. Before publishing, verify the
     domain in Search Console with an account that owns or edits the project;
     Google requires that for brand verification.
   - Audience *External*. While it is in *Testing*, only accounts listed under
     *Test users* (`https://console.cloud.google.com/auth/audience`) can sign
     in; *Publish app* on that page lets anyone.
3. The client: `https://console.cloud.google.com/auth/clients/create`.
   - Type *Web application*.
   - Authorised redirect URIs:
     - `https://<api-host>/api/auth/google/callback`
     - `http://localhost:8787/api/auth/google/callback` (local development)
   - Copy the client id and secret; the secret may not be shown again.

## 4. A Cloudflare API token

For `infra/` and CI. `https://dash.cloudflare.com/<account-id>/api-tokens`,
*Create Token*, *Create Custom Token*:

- **Workers**, role **Admin** (creating a Worker needs Admin; the legacy
  *Workers Scripts · Edit* is being replaced by these roles), scope *All
  Workers*.
- **D1 · Edit**. D1 is its own permission: the Workers roles do not cover it.
- Account Settings · Read is optional, and was not needed.

Account Resources: include the account. No zone permissions: the custom domain
is attached by hand (step 6), so the token never touches DNS.

## 5. The first deploy

From a machine, with these set in the environment (`infra/AGENTS.md` says what
each is): `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` (your `<account-id>`),
`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `VAPID_PRIVATE_KEY` (step 7b), `ALCHEMY_PASSWORD` (any long random
string, e.g. `openssl rand -base64 32`; keep it, CI needs the same one), and
optionally `SITE_ORIGINS`.

```bash
pnpm --filter @janggi/infra provision
```

It makes the `janggi` D1 database (migrations applied) and the `janggi-api`
Worker, and prints the Worker's `workers.dev` address. The names are fixed, so
there is one of each per Cloudflare account. The script is called `provision`
because `pnpm deploy` is a built-in pnpm command.

The Worker is also configured for persistent Workers Logs at 100% sampling.
It retains only the API's structured `api_request` and `game_room` events;
Cloudflare's automatic invocation logs and traces are disabled. This does not
enable Workers Paid.

After the first deployment, make a few requests containing distinctive,
non-secret sample values: an unknown path with a query string, the Google
callback with an error query, and a WebSocket upgrade with a made-up room code
and origin. In the Worker's *Observability* → *Logs* page:

1. Check that the corresponding structured events contain only the documented
   route, transport, outcome, status, operation and exception-name fields.
2. Search for every sample path, query value, callback value, room code and
   origin; none should be present.
3. Check that there are no automatic invocation-log entries or traces.

The first real deployment is the infrastructure test for this setting. Do not
put a real session token, Google code, player value or secret into a probe.

## 6. The Worker's custom domain

By hand, because whose domain it is, and where its DNS lives, is the owner's.

1. `https://dash.cloudflare.com/<account-id>/workers/services/view/janggi-api/production/settings`
2. Domains & Routes, Add, Custom domain, `<api-host>`.

**One label below the domain, not two.** Cloudflare's free certificate covers
`<domain>` and `*.<domain>`; a name like `api.<site-host>` is a level too deep,
and browsers fail the handshake (Firefox: `SSL_ERROR_NO_CYPHER_OVERLAP`;
Chrome: "not encrypted"). Cloudflare issues a certificate for the custom domain
itself within minutes; an entry left "Pending Validation" on the certificates
page is a different, unneeded order.

**It must be a custom domain on the same registrable domain as the site, not
`workers.dev`.** The session cookie is `SameSite=Lax`, which only works between
a site and an API under one domain.

## 7. GitHub Actions secrets

`https://github.com/<owner>/<repo>/settings/secrets/actions`:
`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `ALCHEMY_PASSWORD`,
`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `VAPID_PRIVATE_KEY`. From then on every green `main`
runs `deploy-api` in `.github/workflows/ci.yml`, which re-runs the same
`provision`. Until `CLOUDFLARE_API_TOKEN` exists that job does nothing.

## 7b. The key turn notifications are signed with

A "your turn" push must be signed with a key pair (VAPID, RFC 8292). The public
half is in the repository, as `VAPID_PUBLIC_KEY` in
`shared/src/janggi/online/VapidPublicKey.ts`; the private half is a secret,
`VAPID_PRIVATE_KEY`, in the environment for step 5 and in the GitHub secrets
for step 7. To make a pair (a fork, or a rotation):

```bash
node -e 'const {generateKeyPairSync}=require("crypto");const j=generateKeyPairSync("ec",{namedCurve:"P-256"}).privateKey.export({format:"jwk"});const b=s=>Buffer.from(s,"base64url");console.log("PUBLIC ",Buffer.concat([Buffer.from([4]),b(j.x),b(j.y)]).toString("base64url"));console.log("PRIVATE",j.d)'
```

Put the public one in `VapidPublicKey.ts` and keep the private one as the secret.
The push services are told the Worker's contact address, `VAPID_SUBJECT`
(defaults to the site; an https or `mailto:` address). Rotating the pair means
every device must turn notifications on again.

## 8. Local development against the real API (optional)

Needs the OAuth client from step 3 with the localhost redirect URI. See
`api/AGENTS.md`: `api/.dev.vars` (git-ignored) with the client id, secret and
`GOOGLE_REDIRECT_URI=http://localhost:8787/api/auth/google/callback`, and
`VAPID_PRIVATE_KEY` and `VAPID_SUBJECT` if you want pushes to be sent, then
`pnpm api:dev` and `VITE_API_ORIGIN=http://localhost:8787 pnpm start`.

## 9. Search engines, for the Korean page

Once `/ko/` is deployed (see `docs/seo.md`), tell the search engines about it.
Neither step needs a secret in the repository.

- **Google Search Console.** Add the site (a domain property verified by a DNS
  TXT record on the `neilarmstrong.dev` zone, or the URL prefix), submit
  `https://janggi.neilarmstrong.dev/sitemap.xml`, and use URL Inspection on `/`
  and `/ko/`. Check that Google reports the two as alternates.
- **Naver Search Advisor** (`searchadvisor.naver.com`, the leading search
  engine in Korea). Register the site and verify ownership with the HTML tag or
  file it offers: add it to the head of `webapp/index.html` and
  `webapp/ko/index.html` (or the file to `webapp/public/`), then submit the
  sitemap. Record here only that it was done, never the token.
- **Bing Webmaster Tools** is optional and can import the Search Console site.

## Rotating or removing

- **A leaked Cloudflare token:** roll it in the dashboard, then update the
  GitHub secret and your local environment.
- **A rotated VAPID key:** step 7b, then every player turns notifications on again.
- **A rotated Google client secret:** update `GOOGLE_CLIENT_SECRET` in GitHub
  and re-run `provision` (or push to `main`); it is stored as a Worker secret.
- **Tearing it down:** `pnpm --filter @janggi/infra destroy`, then delete the
  custom domain (step 6), the Google OAuth client and project (step 3), the
  routing rule (step 2), the GitHub secrets (step 7) and the search-engine
  registrations (step 9).

## This repository's own setup

| Placeholder   | Value                                                          |
| ------------- | -------------------------------------------------------------- |
| `<domain>`    | `neilarmstrong.dev` (a Cloudflare zone, DNS there)             |
| `<site-host>` | `janggi.neilarmstrong.dev`, GitHub Pages                       |
| `<api-host>`  | `janggi-api.neilarmstrong.dev`, the `janggi-api` Worker        |
| `<owner>/<repo>` | `neil-armstrong-fig/janggi`                                 |

Choices made here that a fork may make differently:

- The contact address is a Cloudflare Email Routing rule on the zone, already
  enabled for the personal site's contact form.
- The Google support email is not the custom contact address: the dropdown
  only offers the signed-in account or a Google Group, and a new Google account
  on the custom address could not be made (the phone number was over Google's
  limit).
- The Cloudflare token holds Workers (Admin) and D1 (Edit) only.
- The Google OAuth app is published (*In production*), so any Google account
  can sign in. It was held in *Testing*, with only the owner's account as a
  test user, until then.
