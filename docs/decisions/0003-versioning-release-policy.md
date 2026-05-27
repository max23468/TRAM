# ADR 0003 - Policy versioning e release TRAM

## Stato

Accepted.

## Data

2026-05-24.

## Contesto

TRAM è pubblicata come repository privata GitHub, ma GitHub non implica deploy,
hosting o release. Il progetto è ancora in MVP iniziale, ha una app Next.js
locale e non ha un target produttivo approvato.

Prima di questa decisione `package.json` esponeva già `version: 0.1.0`, ma non
era definito quando cambiare versione, quando creare una release e come
distinguere release da deploy.

## Decisione

`package.json` è la fonte canonica della versione applicativa TRAM.

TRAM usa SemVer in fase `0.x` fino alla prima V1 operativa:

- `patch`: bugfix, correzioni di test/build/tooling, hardening locale e
  correzioni di documentazione collegate a una release applicativa già
  esistente;
- `minor`: nuova slice applicativa osservabile, nuova route MVP, nuovo
  estrattore, nuovo data contract compatibile, nuovo flusso di review o
  avanzamento di fase MVP che cambia comportamento utente;
- `major`: riservato a V1+ o a cambi incompatibili di data model, workflow di
  review, policy dati, storage o contratti esterni.

Le modifiche solo documentali, di governance GitHub o di pianificazione non
richiedono bump versione, tag o GitHub Release.

Una release TRAM richiede richiesta esplicita del maintainer e include:

1. bump coerente di `package.json` e `package-lock.json`;
2. aggiornamento o creazione di `CHANGELOG.md` a partire dalla prima release
   applicativa dopo questa policy;
3. verifiche locali proporzionate allo scope;
4. commit dedicato;
5. tag Git `vX.Y.Z`;
6. GitHub Release solo se utile e se non genera automazioni indesiderate.

Se GitHub Actions non è disponibile, la release resta sospesa finché non sono
eseguite le verifiche locali equivalenti documentate e approvate nel runbook:
la pubblicazione esplicita richiede comunque verifiche locali dichiarate e commit/tag tracciati.

Deploy e release restano separati. Una release non deploya TRAM. Un deploy
richiede target e runbook approvati in `docs/OPERATIONS.md` o documento
dedicato.

## Verifiche minime

Per release applicative:

- `npm run verify`;
- `npm run quality:react-doctor` quando cambia React in modo trasversale o dopo
  una release minor che tocca superfici React;
- self-review del diff;
- controllo che non entrino in Git `.env`, chiavi, pacchetti gara, OCR,
  estratti, export o working data.

Per modifiche solo documentali:

- rilettura dei file toccati;
- `git diff --check`;
- controllo dei basename Markdown univoci;
- controllo di accenti italiani comuni.

## Conseguenze

TRAM ora ha una policy release applicabile senza introdurre deploy, hosting o
automazioni nuove.

`CHANGELOG.md` non viene creato per questa decisione perché il diff è solo
documentale. Verrà introdotto con la prima release applicativa.

La decisione non abilita Vercel, Supabase, VPS, OCI, provider AI esterni o
upload di documenti reali.
