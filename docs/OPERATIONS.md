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

## Sviluppo App Locale

Regole operative:

- non scrivere codice applicativo nuovo se il piano di area non è chiaro o se la richiesta è solo documentale;
- usare fixture sintetiche in Git e tenere i pacchetti reali fuori dal repo;
- evitare integrazioni produttive, webhook, token persistenti, job schedulati o deploy finché non sono documentati;
- mantenere `npm` come package manager salvo decisione esplicita;
- controllare route e stati principali con browser quando si tocca UI sostanziale;
- non trasformare warning di audit o deprecazioni Node in policy di stack senza analisi.

Route locali minime da verificare quando esistono:

- `/tenders`;
- `/tenders/:tender_id/overview`;
- `/tenders/:tender_id/documents`;
- `/tenders/:tender_id/review`;
- route specialistiche T2-T8 quando toccate.

Storage locale:

- root default `.local/tram-storage`;
- nessun documento reale in Git;
- storage key validate e fail-closed;
- driver `oci` inattivo se bucket, IAM e runbook non sono approvati.

## Git

- Controllare sempre `git status --short` prima di modifiche.
- Lavori non banali su branch dedicato `codex/<tema>`.
- Commit atomici e Conventional Commit.
- Non usare comandi distruttivi senza conferma.
- Non fare push, deploy o release se non richiesto e se la policy non è chiara.

Quando TRAM sarà pubblicata su GitHub:

- GitHub diventa fonte primaria della documentazione pubblicata;
- branch `codex/<tema>` per lavori non banali;
- self-review del diff prima di PR o merge;
- nessuna GitHub Action, bot o release automation senza decisione esplicita;
- pulizia branch `codex/*` assorbiti;
- Conventional Commit coerente con l’impatto reale.

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

Sono bloccanti prima di commit:

- chiavi SSH, incluso `ssh-key-tram.key`;
- token, `.env`, certificati, credenziali;
- pacchetti in `data/packages/`;
- OCR, working extract, tabelle estratte, export e log con contenuto reale;
- dump database o backup;
- screenshot o fixture con dati non sanificati;
- contenuti integrali di documenti gara.

File ammessi in Git solo se sintetici o configurativi:

- config applicative;
- fixture sintetiche non riservate;
- test;
- documenti governanti;
- mock visuali senza dati reali.

## Toolchain Documentale

Direzione prevista:

- Poppler;
- Tesseract/OCRmyPDF;
- qpdf;
- Ghostscript/unpaper;
- OpenJDK, Ant, Maven, MPXJ;
- `pypdf`;
- `pdfplumber`;
- `pymupdf`;
- `python-docx`;
- `openpyxl`;
- `pandas`;
- `xlrd`;
- `olefile`;
- `rich`;
- `typer`;
- `beautifulsoup4`;
- `lxml`;
- `tabulate`;
- `ocrmypdf`;
- `pytesseract`;
- `pdf2image`;
- `mpxj`;
- `jpype1`.

Python 3.12 è scelta intenzionale per stabilità delle librerie native/documentali. Non cambiarla senza motivazione e test.

`google-genai` può essere installato nella `.venv` per benchmark Gemini API controllati, ma non rende Gemini un default architetturale.

Strumenti opzionali/futuri:

- Docker Desktop per container locali;
- `psql` per Postgres;
- `gh` per GitHub;
- OCI CLI o SDK per runtime/storage futuro;
- Wrangler solo se Cloudflare viene deciso per smoke, edge o provider test.

Test documentali futuri devono coprire almeno:

- PDF testuale;
- PDF scansionato/OCR;
- PDF con tabelle;
- DOCX;
- XLSX;
- XLS legacy;
- MPP;
- file corrotto o non leggibile;
- documento duplicato o versione superata.

## Verifiche Documentali

Per modifiche solo documentali:

```bash
find . -path './.venv' -prune -o -path './node_modules' -prune -o -path './data/packages' -prune -o -name '*.md' -type f -print | awk -F/ '{print $NF}' | sort | uniq -d
```

```bash
rg -n "perche|piu|attivita|qualita|criticita|possibilita|responsabilita|modalita" docs data --glob '*.md' --glob '!data/packages/**'
```

Per modifiche documentali consistenti controllare anche:

```bash
git ls-files '*.md' | sort
```

```bash
find . -path './.git' -prune -o -path './node_modules' -prune -o -path './.venv' -prune -o -path './data/packages' -prune -o -type f \( -name '*.key' -o -name '*.pem' -o -name '.env*' \) -print
```

La verifica è documentale quando non tocca codice applicativo. Non inventare test applicativi non eseguiti.

## Deploy Futuro

TRAM non ha ancora una policy release/deploy stabile.

Fino a nuova decisione:

- “pubblica” significa al massimo pubblicare su GitHub;
- “deploya” richiede runbook e target confermato;
- “rilascia” richiede policy versioning/release;
- VPS, backup, restore, migrazioni e cleanup remoto richiedono conferma o runbook approvato.

## OCI/VPS Futuro

OCI o VPS possono diventare runtime/storage MVP solo con runbook approvato. Il runbook dovrà indicare:

- tenancy/progetto o host;
- utenti e permessi;
- path applicativi;
- bucket/storage e retention;
- backup e restore;
- variabili ambiente;
- porte e servizi;
- health check;
- log consultabili;
- deploy e rollback;
- stop conditions;
- policy per primi upload reali.

Prima di caricare documenti reali:

- confermare storage fuori Git;
- verificare retention e backup;
- verificare accessi e ruoli;
- confermare policy AI/provider del Tender;
- eseguire smoke su fixture;
- verificare che log e screenshot non contengano contenuti integrali;
- avere procedura di cancellazione e rollback.

Stop conditions operative:

- host o bucket non confermato;
- chiave o segreto in path non sicuro;
- runbook assente;
- backup assente per dati reali;
- policy provider non verificata;
- costo non controllato;
- rischio di loggare documenti o OCR integrali.
