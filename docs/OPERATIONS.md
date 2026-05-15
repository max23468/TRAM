# TRAM - Operations

Questo documento governa setup locale, verifiche, segreti, dati esclusi e deploy futuri.

## Setup Locale

Requisiti attuali:

- Node.js compatibile con Next.js 16;
- npm;
- Python 3.12 nella `.venv` per toolchain documentale futura;
- tool documentali locali quando richiesti da pipeline o benchmark.

Comandi:

```bash
npm install
npm run dev
npm run verify
```

`npm run verify` esegue lint, typecheck, test e build.

Verifica tecnica più recente sul branch `codex/docs-consolidation`: `npm run verify` completato con lint, typecheck, 16 test Vitest e build Next passati.

## Git

- Controllare sempre `git status --short` prima di modifiche.
- Lavori non banali su branch dedicato `codex/<tema>`.
- Commit atomici e Conventional Commit.
- Non usare comandi distruttivi senza conferma.
- Non fare push, deploy o release se non richiesto e se la policy non è chiara.

## Dati Esclusi Da Git

Esclusi da `.gitignore`:

- `.env`, `.env.*` salvo `.env.example`;
- chiavi e certificati;
- `.venv/`;
- `.next/`;
- `.playwright-cli/`;
- `node_modules/`;
- `.local/`;
- `data/packages/`;
- `data/keys/`;
- `data/private/`;
- `data/working/`;
- `data/ocr/`;
- `data/extracts/`;
- `data/exports/`;
- database, dump, backup, report ed export locali.

## Toolchain Documentale

Direzione prevista:

- Poppler;
- Tesseract/OCRmyPDF;
- qpdf;
- Ghostscript/unpaper;
- OpenJDK, Ant, Maven, MPXJ;
- Python libs per PDF, DOCX, XLSX, XLS, MPP, OCR e tabelle.

Python 3.12 è scelta intenzionale per stabilità delle librerie native/documentali. Non cambiarla senza motivazione e test.

## Verifiche Documentali

Per modifiche solo documentali:

```bash
find . -path './.venv' -prune -o -path './node_modules' -prune -o -path './data/packages' -prune -o -name '*.md' -type f -print | awk -F/ '{print $NF}' | sort | uniq -d
```

```bash
rg -n "perche|piu|attivita|qualita|criticita|possibilita|responsabilita|modalita" docs data --glob '*.md' --glob '!data/packages/**'
```

## Deploy Futuro

TRAM non ha ancora una policy release/deploy stabile.

Fino a nuova decisione:

- “pubblica” significa al massimo pubblicare su GitHub;
- “deploya” richiede runbook e target confermato;
- “rilascia” richiede policy versioning/release;
- VPS, backup, restore, migrazioni e cleanup remoto richiedono conferma o runbook approvato.
