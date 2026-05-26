# TRAM - Toolchain

Questo documento riassume runtime, package manager, lockfile, comandi e verifiche operative di TRAM.

## Runtime

| Area | Versione o vincolo | Fonte |
| --- | --- | --- |
| Node.js | `24.x` in GitHub Actions; locale compatibile con Next.js 16 | `.github/workflows/quality.yml`, `docs/OPERATIONS.md` |
| npm | package manager canonico | `package-lock.json`, `docs/OPERATIONS.md` |
| TypeScript | `6.0.3` | `package.json` |
| Next.js | `16.2.6` | `package.json` |
| React | `19.2.6` | `package.json` |
| Versione applicativa | `package.json` come fonte canonica | `docs/decisions/0003-versioning-release-policy.md` |
| Python documentale | `3.12` nella `.venv` locale, per tool documentali futuri | `AGENTS.md`, `docs/OPERATIONS.md` |

## Package Manager E Lockfile

- JavaScript/TypeScript: npm.
- Lockfile JS: `package-lock.json`.
- Python: `.venv` locale esclusa da Git.
- Lockfile Python: non presente.

## Script Npm

| Comando | Uso |
| --- | --- |
| `npm run dev` | avvia Next.js locale con Turbopack |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript senza emit |
| `npm test` | test Vitest |
| `npm run build` | build Next.js |
| `npm run verify` | lint, typecheck, test e build |
| `npm run quality:react-doctor` | React Doctor completo con fail su errori |
| `npm run demo:inventory` | inventario locale demo, senza committare working data |
| `npm run demo:extract-text` | estrazione testo locale demo, senza contenuti riservati in Git |

## Workflow GitHub

| Workflow | Scopo |
| --- | --- |
| `Quality` | `npm run verify`, audit dipendenze quando cambia manifest/lockfile |
| `Repo Hygiene` | whitespace, path sensibili, basename Markdown univoci, accenti italiani comuni |
| `PR Title` | Conventional Commit nel titolo PR |
| `Codex PR comments` | sincronizza la Codex feedback inbox |
| Dependabot | aggiornamenti npm e GitHub Actions con limiti bassi |

## Verifiche Per Scope

| Tipo modifica | Verifica minima |
| --- | --- |
| Documentazione | rilettura, `git diff --check`, basename Markdown univoci, accenti comuni, path sensibili |
| GitHub metadata/workflow | controlli documentali più review dei workflow modificati |
| Codice TypeScript/React | `npm run verify` |
| UI sostanziale | `npm run verify` più browser desktop/mobile sulle route toccate |
| React release minor o intervento React trasversale | `npm run quality:react-doctor` |
| Pipeline documentale o dati | test mirati più verifica che non entrino in Git pacchetti, OCR, estratti o working data |

## Guardrail

- Non introdurre runtime, deploy, release o provider esterni solo per uniformità.
- Non fare bump versione per modifiche solo documentali, governance GitHub o
  pianificazione.
- Non cambiare Node, npm, Next, React, TypeScript o Python documentale senza aggiornare questo documento e la decisione collegata.
- Non committare `.venv`, pacchetti gara, working data, OCR, estratti, export, dump, `.env` o chiavi.
- `docs/OPERATIONS.md` resta il runbook operativo; questo file è la matrice sintetica della toolchain.
