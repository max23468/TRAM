# TRAM V1 - Runbook sviluppo app locale

Data: 2026-05-13  
Stato: attivo da Slice 0  
Scope: scaffold Next.js App Router, fixture sintetiche, storage adapter locale/OCI

## Scopo

Questo runbook descrive come avviare e verificare localmente lo scaffold applicativo TRAM.

Lo Slice 0 non usa documenti reali, non carica file su cloud e non attiva provider AI. Le fixture sono sintetiche e vivono in `data/fixtures/`.

## Stack installato

- Node.js `26.0.0`;
- npm `11.14.1` con `package-lock.json`;
- Next.js App Router `16.2.6`;
- React `19.2.6`;
- `@types/node` `25.7.0`;
- TypeScript `5.9.3`;
- Tailwind CSS `4.3.0`;
- componenti UI shadcn-compatible in `src/components/ui`;
- Zod `4.4.3` per validazione fixture;
- Vitest `4.1.6` per test base;
- `patch-package` `8.0.1` per patch temporanee e tracciate di dipendenze;
- storage adapter:
  - `filesystem`, attivo per sviluppo locale;
  - `oci`, predisposto ma fail-closed finché bucket, IAM e SDK non sono approvati.

Le versioni applicative sono state risolte come latest stable al momento dello scaffold e fissate in modo esplicito nel `package.json`. Il runtime locale deciso è Node.js 26, linea Current. Il lockfile resta la fonte riproducibile per installazioni future.

## Comandi

Installazione:

```bash
npm install
```

Sviluppo:

```bash
npm run dev
```

URL locale:

```text
http://localhost:3000
```

Verifiche:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Verifica completa:

```bash
npm run verify
```

## Route Slice 0

Route create:

- `/`;
- `/tenders`;
- `/tenders/[tenderId]/overview`;
- `/tenders/[tenderId]/documents`;
- `/tenders/[tenderId]/timeline`;
- `/tenders/[tenderId]/deliverables`;
- `/tenders/[tenderId]/requirements`;
- `/tenders/[tenderId]/financials`;
- `/tenders/[tenderId]/cost-drivers`;
- `/tenders/[tenderId]/contradictions`;
- `/tenders/[tenderId]/queries`;
- `/tenders/[tenderId]/review`;
- `/tenders/[tenderId]/audit`.

Le route sono scheletri funzionali: servono a validare routing, fixture, stati base e navigazione. I wireframe completi restano nei documenti di pianificazione.

## Fixture

File principali:

- `data/fixtures/manifest.json`;
- `data/fixtures/tram-v1-mvp-synthetic-fixtures.json`;
- `src/lib/fixtures.ts`;
- `src/lib/fixtures.test.ts`.

Regole:

- nessun riferimento a `data/packages/`;
- nessun riferimento a `data/private/`;
- nessun riferimento a `ssh-key-tram.key`;
- nessun valore economico reale;
- nessun documento reale.

## Storage

File principali:

- `src/lib/storage/types.ts`;
- `src/lib/storage/filesystem.ts`;
- `src/lib/storage/oci.ts`;
- `src/lib/storage/index.ts`;
- `src/lib/storage/storage.test.ts`.

Sviluppo locale:

```bash
TRAM_STORAGE_DRIVER=filesystem
TRAM_LOCAL_STORAGE_ROOT=.local/tram-storage
```

OCI:

```bash
TRAM_STORAGE_DRIVER=oci
```

Il driver OCI in Slice 0 non invia chiamate: valida la configurazione e fallisce in modo esplicito finché non sono approvati bucket, IAM e implementazione SDK.

## Variabili d’ambiente

Usare `.env.example` come riferimento. Non salvare segreti in repo.

La futura `.env` locale deve restare esclusa da Git.

## Verifica browser

Smoke eseguito su Safari il 2026-05-13:

- `http://localhost:3000`;
- `http://localhost:3000/tenders`;
- `http://localhost:3000/tenders/tender_fx_cop_metro_om/overview`.

Le pagine si renderizzano e mostrano fixture sintetiche, badge privacy/stato e review item.

## Stato audit npm

`npm audit` è pulito dopo override mirato di `postcss`.

Contesto:

- `next@16.2.6` dichiara ancora `postcss@8.4.31`;
- `postcss@8.4.31` è vulnerabile secondo npm audit;
- `package.json` forza `postcss@8.5.14` tramite `overrides`;
- `npm ls postcss` deve mostrare `next@16.2.6 -> postcss@8.5.14 deduped`;
- `npm audit` deve riportare zero vulnerabilità.

Non rimuovere l’override finché Next non aggiorna la propria dipendenza interna a una versione sicura.

## Stato deprecation Node 26

Con Node.js `26.0.0`, `@tailwindcss/node@4.3.0` emetteva `DEP0205` perché registrava il loader ESM con `module.register()`, API deprecata a runtime in Node 26.

TRAM resta su Node 26. La correzione locale è tracciata in:

- `patches/@tailwindcss+node+4.3.0.patch`;
- script `postinstall` in `package.json`.

La patch usa `module.registerHooks()` quando disponibile e conserva il fallback a `module.register()` sulle versioni Node precedenti. Rimuoverla appena Tailwind rilascia una versione stabile che elimina `DEP0205`.

Verifiche eseguite dopo la patch:

```bash
NODE_OPTIONS=--trace-deprecation npm run test
NODE_OPTIONS=--trace-deprecation npm run build
```

Entrambe le verifiche devono restare senza warning `DEP0205`.

## Prossimo passo

Passare allo Slice 1: ampliare fixture e data contract tecnico, creare tipi più completi e iniziare il validatore fixture automatico.
