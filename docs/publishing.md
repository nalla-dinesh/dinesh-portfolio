# Publishing to GitHub

## 1. Publish the portfolio repository

Create an empty GitHub repository, for example `nalla-dinesh/builders-room`. Do not initialize it with a README if you are pushing this folder.

```bash
cd Dinesh-Nalla-GitHub-Repo
git init
git add .
git commit -m "feat: investigation-room portfolio, profile README and GitHub evidence audit"
git branch -M main
git remote add origin https://github.com/nalla-dinesh/builders-room.git
git push -u origin main
```

Then import the repository in Vercel using [`vercel-github.md`](vercel-github.md).

## 2. Publish the animated GitHub profile README

GitHub profile READMEs live in a special repository named exactly like the username:

```text
nalla-dinesh/nalla-dinesh
```

Create that repository if it does not exist, then copy:

```text
profile/README.md  →  README.md
profile/assets/    →  assets/
```

Commit and push. GitHub will render the animated SVGs on the profile page.

## 3. Verify

- Portfolio repository: CI workflow passes.
- Vercel production deployment succeeds.
- Profile repository: README displays hero, journey and capability map.
- No `.env` files or secrets are present.

## 4. Refresh later

When public repositories or résumé facts change:

1. Update `src/data.ts`.
2. Update both READMEs.
3. Add a new dated audit document or update the existing one.
4. Run `npm run verify`.
