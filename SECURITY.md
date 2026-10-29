# Security

## Reporting

Please report security issues privately to **nalladinesh53@gmail.com**. Do not open a public issue containing secrets, tokens, personal data or exploit details.

## Repository rules

- Never commit `.env` files, service-role keys, API tokens or private client code.
- Use `.env.example` for required variable names only.
- Rotate any key that has ever been committed to a public repository.
- Treat synthetic evaluation data as synthetic; do not present it as real user data.

## Known public-repository hygiene note

At the 2026-10-29 audit, `queuekisan-working-updated` and `queuekisan` exposed `.env` paths in their public trees. Their contents were not read for this project. Verify and rotate any real secrets before promoting those repositories.
