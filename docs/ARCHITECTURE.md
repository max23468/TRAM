# TRAM - Architecture

Questo documento governa architettura, data model e verità applicativa.

## Direzione Tecnica

TRAM deve restare:

- free-first;
- self-hostable;
- provider-agnostic;
- containerizzabile;
- basata su Postgres standard;
- con storage controllato e astratto;
- con worker Python documentale separato;
- con AI gateway interno gratuito/capped;
- con job queue inizialmente basata su Postgres;
- evidence-first e review-first.

Vercel, Supabase e OpenAI sono alternative possibili o fonti utili, non default automatici.

## Stack Attuale

App locale:

- Next.js 16;
- React 19;
- TypeScript;
- Tailwind CSS;
- Vitest;
- ESLint;
- storage adapter `filesystem | oci`;
- fixture sintetiche in `data/fixtures/`.

Comandi principali:

```bash
npm run dev
npm run verify
```

## Concetti Core

- `Tender`: contenitore operativo di una gara o fase di gara.
- `Document`: concetto logico.
- `DocumentVersion`: versione fisica o documentale.
- `SourceReference`: riferimento centrale a documento, pagina, sezione, tabella o cella.
- `Extraction`: proposta derivata da parser, regole o AI.
- `IndicatorValue`: valore normalizzato o aggregato, sempre collegato a fonte.
- `ReviewItem`: elemento da validare, correggere, contestare o chiarire.

## Stati Dato

Ogni dato rilevante deve avere uno stato esplicito:

- estratto;
- proposto;
- confermato;
- corretto;
- contestato;
- da chiarire;
- superato;
- non applicabile.

## Storage E Sicurezza

I pacchetti gara, estrazioni, OCR, tabelle, working extract, export e dati sensibili non devono stare in Git. Lo storage documentale deve essere separato dal repository.

La chiave locale `ssh-key-tram.key` è un segreto: non leggerla, non copiarla, non committarla.

Lo storage applicativo è già astratto in `src/lib/storage/`:

- `filesystem` è il driver locale di default, con root `.local/tram-storage`;
- `oci` è predisposto ma fail-closed finché mancano bucket, IAM e runbook approvati;
- le storage key non sicure vengono rifiutate.

## Configurazioni Applicative

File applicativi oggi ammessi in Git:

- `data/config/tram-v1-normalizer-config-t4-t8-v0-1.json`;
- `data/fixtures/manifest.json`;
- `data/fixtures/tram-v1-mvp-synthetic-fixtures.json`.

Il suffisso `v1` può rimanere in config o fixture storiche, ma i documenti governanti non devono usarlo nel filename.
