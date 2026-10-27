# Blog setup guide (phase 1)

You only do this once. Everything is free.

## 0. Install the two new packages
In the project folder run:

    npm install better-auth mongodb

## 1. Create `.env.local`
Copy `.env.example` to a new file named `.env.local` (same folder). Fill the values below.

## 2. MongoDB (the database)
1. Go to https://cloud.mongodb.com and open your project / cluster (the one you used for BazarDor is fine).
2. Click **Connect** -> **Drivers** and copy the connection string.
3. Replace `<password>` with your database user's password.
4. Paste it as `MONGODB_URI=...` in `.env.local`.
5. In Atlas -> **Network Access**, allow `0.0.0.0/0` (needed for Vercel).

## 3. Login secret
Set `BETTER_AUTH_SECRET=` to any long random text (32+ characters).
Set `BETTER_AUTH_URL=http://localhost:3000` for local testing.

## 4. GitHub login (for the admin)
1. GitHub -> Settings -> Developer settings -> OAuth Apps -> **New OAuth App**.
2. Homepage URL: `http://localhost:3000`
3. Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy the **Client ID** and generate a **Client secret**.
5. Put them in `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`.

For the live site create a second OAuth App with `https://lamiakajal.com` and
`https://lamiakajal.com/api/auth/callback/github`, and use its keys on Vercel.

Google login works the same way (Google Cloud Console -> Credentials -> OAuth client ID,
callback `http://localhost:3000/api/auth/callback/google`).

## 5. Images (Cloudinary)
1. Make a free account at https://cloudinary.com
2. On the dashboard copy **Cloud name**, **API Key**, **API Secret** into the three `CLOUDINARY_*` values.

## 6. Run and test
    npm run dev

1. Open http://localhost:3000/login and **sign in with GitHub** (use the GitHub account whose
   email is lamiakajal@gmail.com, or change `ADMIN_EMAILS`).
2. Click your avatar in the navbar -> **Write a post**.
3. Write something, press **Save post** with status "Published".
4. Open http://localhost:3000/blog to see it.

## Vercel (live site)
Add ALL the same variables in Vercel -> Settings -> Environment Variables
(use `BETTER_AUTH_URL=https://lamiakajal.com` and the live GitHub keys), then redeploy.

## Good to know
- Only people whose **verified** email is in `ADMIN_EMAILS` can write posts.
- Other visitors can create an account (needed for reactions/comments in phase 2).
