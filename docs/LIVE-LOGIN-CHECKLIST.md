# Live login checklist (lamiakajal.com)

Open https://lamiakajal.com/api/health first. It shows (without secrets):
- which settings are filled in,
- the exact `loginRedirects` that Google and GitHub receive,
- whether the database connects.

## GitHub (OAuth App for the LIVE site)
- Settings -> Developer settings -> OAuth Apps -> your live app
- Authorization callback URL: `https://lamiakajal.com/api/auth/callback/github`
- A GitHub OAuth App accepts only ONE callback address. Use a second app for localhost
  (callback `http://localhost:3000/api/auth/callback/github`) with its own keys in `.env.local`.

## Google (Google Cloud Console -> APIs & Services -> Credentials -> OAuth client)
- Authorized JavaScript origins: `https://lamiakajal.com` and `http://localhost:3000`
- Authorized redirect URIs:
  - `https://lamiakajal.com/api/auth/callback/google`
  - `http://localhost:3000/api/auth/callback/google`
- OAuth consent screen: if it says "Testing", add your Google email under "Test users", or press "Publish app".
- Changes can take a few minutes to start working.

## Vercel -> Settings -> Environment Variables (Production)
- `BETTER_AUTH_URL` = `https://lamiakajal.com`
- `BETTER_AUTH_SECRET`, `MONGODB_URI`, `ADMIN_EMAILS`, `GITHUB_CLIENT_ID/SECRET`, `GOOGLE_CLIENT_ID/SECRET`
- `ADMIN_EMAILS` must contain EVERY email you log in with (for example
  `lamiakajal@gmail.com,lamia.kajal@gmail.com`).
- After changing variables: Deployments -> Redeploy.

## MongoDB Atlas
- Network Access -> allow `0.0.0.0/0` (Vercel servers have changing addresses).
