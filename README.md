# GROOVYLINEPICS — Concert Tracker
### Deploy guide for Railway (free hosting)

---

## Your files

```
groovylinepics-backend/
├── server.js          ← the backend
├── package.json       ← dependencies
├── README.md          ← this file
└── public/
    └── index.html     ← the app frontend
```

---

## Step 1 — Create a free Railway account

Go to → https://railway.app
Sign up with GitHub (easiest) or email.

---

## Step 2 — Upload your files to GitHub

1. Go to https://github.com and create a free account if you don't have one
2. Click **"New repository"** → name it `groovylinepics-tracker` → click **Create**
3. Upload all your files (drag & drop in the GitHub interface):
   - `server.js`
   - `package.json`
   - `public/index.html`  ← make sure it's inside a `public` folder

---

## Step 3 — Deploy on Railway

1. Go to https://railway.app/new
2. Click **"Deploy from GitHub repo"**
3. Select your `groovylinepics-tracker` repo
4. Railway will auto-detect it's a Node.js app and deploy it

---

## Step 4 — Set your password (IMPORTANT)

In Railway, go to your project → **Variables** tab → add these:

| Variable | Value |
|---|---|
| `ADMIN_PASSWORD` | your chosen password (e.g. `darkstage2024`) |
| `JWT_SECRET` | any random string (e.g. `glp-xk29-secret-abc`) |

Click **Deploy** again after adding variables.

⚠️ If you skip this, the default password is `groovy123` — change it!

---

## Step 5 — Get your URL

Railway gives you a free URL like:
`https://groovylinepics-tracker-production.up.railway.app`

Open it on your phone, log in with your password, and **add it to your home screen!**

---

## Changing your password later

In Railway → Variables → change `ADMIN_PASSWORD` → redeploy.

---

## Notes

- Your data is stored in a SQLite database file on Railway's server
- Railway free tier: 500 hours/month (enough for personal use)
- Data syncs instantly across all devices (phone, laptop, tablet)
- Login stays active for 30 days before asking again
