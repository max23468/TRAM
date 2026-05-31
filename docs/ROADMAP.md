# TRAM - Roadmap

Questa roadmap governa direzione, priorità, milestone e prossimi passi. I
dettagli di pilot, feedback, rotte, fixture e verifiche storiche stanno in
[`ROADMAP_OPERATING_RECORD.md`](ROADMAP_OPERATING_RECORD.md); backlog e idee non
promosse stanno in [`BACKLOG.md`](BACKLOG.md).

## Ora

- Chiudere **Fase 7 - Pilot interno e stabilizzazione MVP** con scenario reale o
  rappresentativo, tre utenti interni e feedback classificati `P0`/`P1`/`P2`
  senza dati riservati.
- Usare il pacchetto Copenhagen come prossimo pilot reale/rappresentativo,
  mantenendo documenti, OCR, estratti grezzi, screenshot e contenuti riservati
  fuori da Git.
- Correggere i `P0` prima di dichiarare MVP stabile; decidere owner e priorità
  dei `P1`.
- Eseguire `npm run verify` e smoke browser proporzionati quando cambiano
  superfici UI.

## Prossimo

- **Fase 8 - Robustezza T1/T2/T3**: rafforzare document map, confronto MPP/PDF
  per timeline, checklist deliverable, fixture estese e metriche su falsi
  positivi/falsi negativi.
- **Fase 9 - Estensioni T4-T8 controllate**: normalizzazione requisiti/KPI,
  financials, cost driver, criticità e Q&A, mantenendo review-first e policy
  dati.
- **Fase 10 - Preparazione V1 operativa**: perimetro minimo V1, ruoli, backup,
  retention, logging, performance, runbook e scelta hosting/storage.

## Più avanti

- **V1**: prima versione operativa solo dopo pilot interno, policy dati,
  hardening e runbook sufficienti.
- **V2**: confronto offerta-gara solo quando TRAM sa leggere, versionare e
  validare bene la gara.
- **V3**: memoria storica e benchmark cross-gara solo con policy privacy,
  comparabilità e spiegabilità adeguate.

## Bloccato

- V1 è bloccata finché il pilot interno non è completato e i P0/P1 non hanno
  esito o decisione owner.
- Deploy e runtime condiviso restano bloccati finché non esiste un target
  approvato e un runbook produttivo.
- `CHANGELOG.md` va creato solo con la prima release applicativa.

## Fatto recente

- Fasi 0-6 chiuse o pilot-ready: governance, wireframe, fixture, data contract,
  prototipo, ingestion/parsing locale ed estrazioni T1-T8 review-first.
- La UI MVP è stata rifondata su un percorso unico per gare locali, fixture
  sintetiche e Copenhagen, con renderer workspace condiviso.
- La preparazione gara crea workspace locale controllato in `.local/`, escluso
  da Git.
- Policy dati, review umana, source reference e blocco AI su contenuti non
  ammessi sono parte del modello MVP.

## Regole

- La roadmap non è un changelog.
- La roadmap non conserva log di pilot, verifiche, rotte o slice completate come
  archivio.
- Le idee non promosse stanno in `BACKLOG.md`.
- Le decisioni stabili stanno in `DECISIONS.md` o negli ADR.
- Dettagli operativi e storico restano in `ROADMAP_OPERATING_RECORD.md` o nei
  documenti di area.
- Ogni voce attiva deve indicare un prossimo passo operativo reale.
