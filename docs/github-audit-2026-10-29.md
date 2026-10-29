# GitHub audit — nalla-dinesh

**Audit date:** 2026-10-29  
**Source:** public GitHub REST API (`/users/nalla-dinesh`, `/repos`, `/languages`, `/readme`) and selected public source files.  
**Scope:** public repositories only. No private repositories, no `.env` contents, no secrets.

## Method

1. Fetch public profile and repository list.
2. Count repositories by GitHub's primary language.
3. Fetch language byte counts, but treat them as weak evidence because generated Flutter platform scaffolding can inflate C++/CMake/Swift/HTML bytes.
4. Read selected READMEs and public source files to identify concrete engineering concerns.
5. Separate verified public code evidence from founder-reported client work and self-described claims.

## Profile snapshot

| Field | Value |
|---|---|
| Login | `nalla-dinesh` |
| Display name | `dinesh-nalla` |
| Public repositories | 15 |
| Followers | 0 |
| Account created | 2026-04-16 |
| Bio / blog | empty at audit time |

The account creation date is not used as a proxy for experience. The journey dates come from Dinesh's résumé and direct confirmation.

## Primary-language repository counts

| Primary language | Repositories |
|---|---:|
| Dart | 4 |
| Python | 3 |
| JavaScript | 3 |
| HTML | 3 |
| CSS | 1 |
| Unspecified / empty | 1 |

Language bytes were inspected but are not converted into proficiency percentages.

## Repository inventory

| Repository | Primary language | Evidence / notes |
|---|---|---|
| [`AIOS`](https://github.com/nalla-dinesh/AIOS) | Python | Eight-agent system; LangChain/LangGraph, Groq/Ollama routing, ChromaDB/RAG, hallucination detection, PostgreSQL/Redis/Docker/Streamlit. README self-describes production grade; test/coverage claims were not independently verified. |
| [`insiderlens`](https://github.com/nalla-dinesh/insiderlens) | Python | FastAPI, SQLAlchemy, PostgreSQL, React/Vite/Tailwind, Cytoscape, NetworkX, Alembic, Docker/nginx, 13 rules. README reports synthetic-ground-truth P/R/F1 = 1.0 and 162 tests; earlier CI status was failing, so badges are not repeated as current proof. |
| [`walkmate-v2`](https://github.com/nalla-dinesh/walkmate-v2) | Dart | Flutter + Kotlin foreground service, Haversine distance, GPS filtering, OEM battery guidance, crash recovery, Riverpod, SQLite, flutter_map/OSM. |
| [`kajibook`](https://github.com/nalla-dinesh/kajibook) | Dart | Offline Flutter billing, integer-paise money, FIFO allocation, Drift, Riverpod, go_router, AGP/Gradle/Kotlin toolchain notes. |
| [`queuekisan-working-updated`](https://github.com/nalla-dinesh/queuekisan-working-updated) | JavaScript | Admin/counter/farmer role apps, Supabase, Firebase Auth, hosted smoke-test notes. Public tree contains `.env` paths; contents were not read. |
| [`queuekisan`](https://github.com/nalla-dinesh/queuekisan) | JavaScript | Earlier/alternate QueueKisan tree; public tree contains `.env` paths under `zip/`; contents were not read. |
| [`mashru-2035`](https://github.com/nalla-dinesh/mashru-2035) | CSS | Custom WebGL weave shaders, single-file build, original imagery; live site linked from repo. |
| [`Valvix`](https://github.com/nalla-dinesh/Valvix) | HTML | VALVIX studio site; live homepage `valvix.vercel.app`. |
| [`Valvix-Tech`](https://github.com/nalla-dinesh/Valvix-Tech) | HTML | VALVIX tech site; live homepage `valvix-tech.vercel.app`. |
| [`dominal-ecommerce-web`](https://github.com/nalla-dinesh/dominal-ecommerce-web) | JavaScript | Clothing storefront web app; live homepage. This is web evidence, not Android-internship proof by itself. |
| [`DN_Portfolio`](https://github.com/nalla-dinesh/DN_Portfolio) | HTML | Older portfolio. Some claims conflict with résumé/direct confirmation; newer confirmed facts are preferred. |
| [`BillBook`](https://github.com/nalla-dinesh/BillBook) | Dart | README is a default Flutter template; weak feature evidence. |
| [`walkmate-app`](https://github.com/nalla-dinesh/walkmate-app) | Dart | Earlier walking tracker repository; description claims Android accuracy focus. |
| [`binance-futures-trading-bot`](https://github.com/nalla-dinesh/binance-futures-trading-bot) | Python | README describes Binance Futures Testnet CLI bot; not used as a primary skill claim in the profile README. |
| [`walkma`](https://github.com/nalla-dinesh/walkma) | none | Empty/unspecified repository. |

## Evidence-backed skill clusters

### Agentic AI
Strongest public evidence: `AIOS`. Concrete concerns include agent orchestration, model routing, retrieval, memory, evaluation and hallucination checks. The portfolio replay is scripted and is not presented as a live autonomous run.

### Android / Flutter
Strongest public evidence: `walkmate-v2` and `kajibook`. Concrete concerns include foreground services, GPS filtering, OEM battery constraints, crash recovery, offline-first persistence and careful money arithmetic.

### Backend / data
Strongest public evidence: `insiderlens` and `queuekisan-working-updated`. Concrete concerns include FastAPI services, PostgreSQL, Redis, Supabase, Firebase Auth, Docker, graph analysis and role-based applications.

### Frontend / interactive web
Evidence: React/TypeScript in `insiderlens`, JavaScript role apps in QueueKisan, custom WebGL in `mashru-2035`, studio sites in `Valvix`/`Valvix-Tech`, and this Three.js portfolio.

## Honesty rules used in the README

- Do not convert language bytes into skill percentages.
- Do not repeat synthetic benchmark scores as real-world accuracy.
- Do not repeat unverified test counts or coverage claims.
- Do not present NDA client apps as public code evidence.
- Label VALVIX shipment counts as founder-reported.
- Prefer résumé + direct confirmation over older portfolio claims when they conflict.

## Repository hygiene recommendations

1. **Verify and rotate secrets.** `queuekisan-working-updated` and `queuekisan` expose `.env` paths in the public tree. This audit did not read their contents. If they contain real keys, rotate them immediately, remove them from history, and replace with `.env.example`.
2. Add concise descriptions and screenshots to repositories that currently have none.
3. Add licenses where reuse is intended.
4. Archive or rename duplicate/obsolete repositories so the strongest work is obvious.
5. Add CI badges only when the workflow is passing.
6. Keep synthetic evaluation datasets clearly labelled.
