# TRAM

TRAM, nome in codice per Tender Requirements Analysis & Monitoring, è una web app interna per analizzare, mappare e monitorare documenti di gara relativi al trasporto pubblico locale, con focus operation and maintenance.

Lo scopo iniziale non è “fare parlare i PDF”, ma trasformare pacchetti documentali complessi in una mappa standardizzata, verificabile e criticabile: documenti, versioni, fonti, timeline, deliverable, requisiti, indicatori, cost driver, contraddizioni candidate, chiarimenti e stato della review.

## Stato

TRAM è in fase MVP iniziale, con roadmap viva fino a V1.4 e perimetro futuro V2/V3 già tracciato. Esiste una prima app Next.js con fixture sintetiche e navigazione tender, ma il progetto resta governato da documentazione e validazione manuale: nessuna pipeline produttiva, invio AI esterno, deploy o release va considerata implicita.

Repository:

- GitHub: `max23468/TRAM`, repository privata;
- branch base: `main`;
- lavori non banali: branch `codex/<tema>`;
- pubblicazione GitHub governata da [`docs/decisions/0002-github-publishing-and-repo-governance.md`](docs/decisions/0002-github-publishing-and-repo-governance.md);
- dati sensibili e pacchetti gara esclusi da Git tramite `.gitignore`.

## Documenti Principali

- [Roadmap](ROADMAP.md)
- [Indice documentazione](docs/INDEX.md)
- [Contesto prodotto](docs/CONTEXT.md)
- [Architettura](docs/ARCHITECTURE.md)
- [AI e pipeline documentale](docs/AI_AND_DOCUMENT_PIPELINE.md)
- [UX e review workflow](docs/UX_REVIEW_WORKFLOW.md)
- [Operations](docs/OPERATIONS.md)
- [Brand](docs/BRAND.md)
- [Decisioni](docs/DECISIONS.md)

## Comandi Locali

```bash
npm run dev
```

```bash
npm run verify
```

## Guardrail

- Non committare pacchetti gara, working extract, OCR, export, log, database locali, chiavi o `.env`.
- Non inviare dati a provider AI esterni senza minimizzazione, policy provider e consenso operativo.
- Non creare automazioni produttive, deploy, release o runtime esterni senza runbook approvato.
- Le estrazioni non sono verità applicativa: ogni dato critico richiede fonte, stato e review.
- L’archivio storico dei Markdown rimossi serve solo per tracciabilità: le decisioni operative devono stare nei documenti governanti indicati sopra.
