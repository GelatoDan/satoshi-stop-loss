# Satoshi Stop Loss — Setup Guide

Complete step-by-step instructions for deploying the MVP.
Estimated time: 2–3 hours if all accounts are ready.

---

## Before You Start

You need accounts at:
- [GitHub](https://github.com) ✅ (you have this)
- [Supabase](https://supabase.com) — database
- [Resend](https://resend.com) — email delivery
- [Vercel](https://vercel.com) — website hosting (connect with GitHub login)
- [Railway](https://railway.app) — 24/7 monitor (~$5/month)

---

## Step 1 — Get your Supabase service role key

You already have the Supabase URL and anon key. You also need the **service role key** (this one has admin access — never share it publicly).

1. Go to [supabase.com](https://supabase.com) → your project
2. Click **Settings** (gear icon in left sidebar)
3. Click **API**
4. Under "Project API keys", copy the **service_role** key (labelled "secret")

Keep this safe — you'll need it in Step 3.

---

## Step 2 — Set up the database

1. Go to your Supabase project dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New query**
4. Open the file `supabase/schema.sql` from this project
5. Copy the entire contents and paste into the SQL editor
6. Click **Run**

You should see "Success. No rows returned." — that means it worked.

---

## Step 3 — Set up Resend (email)

1. Go to [resend.com](https://resend.com) and log in
2. Click **Domains** in the left sidebar
3. Click **Add Domain**
4. Enter: `nput.foundation`
5. Resend will show you DNS records to add — copy these
6. Go to your domain registrar (wherever you bought nput.foundation) and add those DNS records
7. Wait 10–30 minutes, then click **Verify** in Resend
8. Once verified, go to **API Keys** and copy your key (starts with `re_`)

---

## Step 4 — Push code to GitHub

1. Clone your repo locally:
   ```
   git clone https://github.com/GelatoDan/satoshi-stop-loss.git
   cd satoshi-stop-loss
   ```

2. Copy all the files from this project into the cloned folder

3. Create your `.env.local` file (this is gitignored — never committed):
   ```
   cp .env.example .env.local
   ```
   Then edit `.env.local` and fill in:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://wngeuzstyvpxbcrnhpmr.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci... (your anon key)
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGci... (your service role key from Step 1)
   RESEND_API_KEY=re_... (your Resend key from Step 3)
   NEXT_PUBLIC_SITE_URL=https://nput.foundation
   NEXT_PUBLIC_FROM_EMAIL=alerts@nput.foundation
   ```

4. Push the code to GitHub:
   ```
   git add .
   git commit -m "Initial build"
   git push
   ```

---

## Step 5 — Deploy the website to Vercel

1. Go to [vercel.com](https://vercel.com) and log in with GitHub
2. Click **Add New Project**
3. Select your `satoshi-stop-loss` repository
4. Vercel will auto-detect Next.js — no changes needed in build settings
5. Before clicking Deploy, click **Environment Variables** and add:
   - `NEXT_PUBLIC_SUPABASE_URL` → your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → your anon key
   - `SUPABASE_SERVICE_ROLE_KEY` → your service role key
   - `RESEND_API_KEY` → your Resend API key
   - `NEXT_PUBLIC_SITE_URL` → `https://nput.foundation`
   - `NEXT_PUBLIC_FROM_EMAIL` → `alerts@nput.foundation`
6. Click **Deploy**
7. Once deployed, go to **Settings → Domains** and add `nput.foundation`
8. Vercel will show DNS records to point your domain — add these at your registrar

---

## Step 6 — Deploy the monitor to Railway

The monitor is the 24/7 process that watches the blockchain.

1. Go to [railway.app](https://railway.app) and sign up/log in with GitHub
2. Click **New Project** → **Deploy from GitHub repo**
3. Select `satoshi-stop-loss` repo
4. Railway will ask which folder to deploy — select `monitor/`
5. Go to your service → **Variables** tab and add:
   - `SUPABASE_URL` → your Supabase URL
   - `SUPABASE_SERVICE_ROLE_KEY` → your service role key
   - `RESEND_API_KEY` → your Resend API key
   - `SITE_URL` → `https://nput.foundation`
   - `FROM_EMAIL` → `alerts@nput.foundation`
6. Go to **Settings → Deploy** and set Start Command to: `node index.js`
7. Click **Deploy**

To verify it's working:
- Go to the **Logs** tab in Railway
- You should see: `✅ Connected to mempool.space` and `📦 New block: ...`
- If you see those, the monitor is live

---

## Step 7 — Load the Patoshi addresses

The monitor won't alert on anything until the address database is populated.

1. Read `data/README.md` for instructions on sourcing the full address list
2. Load addresses using the Supabase SQL editor (see the README)
3. After loading, run: `SELECT refresh_address_count();`
4. The homepage should now show the correct address count

For a quick test before loading the full set:
```sql
INSERT INTO patoshi_addresses (address, confidence)
VALUES ('12c6DSiU4Rq3P4ZxziKxzrL5LmMBrzjrJX', 'high');
SELECT refresh_address_count();
```

---

## Step 8 — Test end-to-end

Before announcing:

1. **Test signup:** Go to your site, enter your own email, and submit
2. **Check Supabase:** Go to Table Editor → subscribers — your row should appear with `confirmed: false`
3. **Check your email:** You should get a confirmation email within 1 minute
4. **Confirm:** Click the link — you should land on the confirm page and see a success message
5. **Check Supabase again:** Your row should now show `confirmed: true`
6. **Check Railway logs:** Make sure the monitor is still running and receiving new blocks

---

## Step 9 — Set up uptime monitoring (free)

1. Go to [uptimerobot.com](https://uptimerobot.com) and create a free account
2. Add a new monitor:
   - Type: HTTP(s)
   - URL: `https://nput.foundation/api/stats`
   - Check interval: every 5 minutes
3. Add your email for downtime alerts

---

## You're live. Now what?

1. Share the URL — Twitter, BitcoinTalk, crypto subreddits
2. Load the full Patoshi address database (see `data/README.md`)
3. Watch Railway logs to confirm the monitor is healthy
4. Check Supabase → subscribers to track signups

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Emails not arriving | Check Resend dashboard → logs for errors; verify domain DNS |
| Monitor logs say "0 addresses loaded" | Load addresses via Supabase SQL editor |
| Website not loading | Check Vercel deployment logs; verify environment variables |
| Confirmation link doesn't work | Check `NEXT_PUBLIC_SITE_URL` env var is set correctly |
| Railway monitor crashes | Check logs for error message; most common issue is missing env vars |

---

## Rotating your API keys

Since you shared your keys in chat during setup, rotate them now that everything is deployed:

1. **Resend:** Go to API Keys → delete old key → create new key → update in Vercel + Railway
2. **Supabase service role:** This can't be rotated — it's tied to your project. Keep it safe going forward.
