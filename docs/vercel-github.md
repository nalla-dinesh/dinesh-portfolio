# Host the portfolio on Vercel using GitHub

This repository is configured for Vercel. No environment variables are required.

## 1. Push this folder to GitHub

Create an empty GitHub repository, for example `nalla-dinesh/dinesh-portfolio`.

```bash
cd Dinesh-Portfolio-Vercel
git init
git add .
git commit -m "feat: Vercel-ready 3D portfolio"
git branch -M main
git remote add origin https://github.com/nalla-dinesh/dinesh-portfolio.git
git push -u origin main
```

## 2. Import the repository in Vercel

1. Open Vercel and choose **Add New → Project**.
2. Connect GitHub if prompted.
3. Import the repository you just pushed.
4. Use these settings:

```text
Framework Preset: Vite
Root Directory: ./
Install Command: npm ci
Build Command: npm run build
Output Directory: dist
Node.js Version: 22.x
Environment Variables: none
```

`vercel.json` already defines the install/build/output settings. If Vercel shows different values, override them with the values above.

5. Click **Deploy**.

## 3. Automatic deployments

After the first import:

- Push to `main` → production deployment.
- Pull request → preview deployment.
- Vercel runs `npm ci` and `npm run build` automatically.

## 4. Custom domain optional

In Vercel: **Project → Settings → Domains**. Add your domain and update DNS as instructed.

## Troubleshooting

| Problem | Fix |
|---|---|
| Build fails on Node version | Set Node.js to **22.x** in Vercel project settings. |
| 404 after deploy | Confirm output directory is `dist` and `vercel.json` is at repo root. |
| Blank page | Confirm build command is `npm run build`; the app uses relative asset base. |
| Old version still visible | Hard refresh; check the latest deployment commit in Vercel. |
