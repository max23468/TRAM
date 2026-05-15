# TRAM - Indice Documentazione

Questo indice è il punto di ingresso per la documentazione viva di TRAM. I vecchi documenti di `docs/planning`, `docs/analysis`, `docs/runbooks` e `docs/design` sono stati assorbiti in questo set minimo e restano recuperabili dallo storico Git.

## Ordine Di Lettura

1. [`README.md`](../README.md) - orientamento rapido.
2. [`ROADMAP.md`](../ROADMAP.md) - priorità, milestone, debiti.
3. [`docs/CONTEXT.md`](CONTEXT.md) - prodotto, perimetro e principi.
4. [`docs/ARCHITECTURE.md`](ARCHITECTURE.md) - architettura e data model.
5. [`docs/AI_AND_DOCUMENT_PIPELINE.md`](AI_AND_DOCUMENT_PIPELINE.md) - pipeline documentale, AI, privacy e provider.
6. [`docs/UX_REVIEW_WORKFLOW.md`](UX_REVIEW_WORKFLOW.md) - dashboard, review queue e stati utente.
7. [`docs/OPERATIONS.md`](OPERATIONS.md) - setup, verifiche, segreti, deploy futuro.
8. [`docs/BRAND.md`](BRAND.md) - direzione visiva e tono.
9. [`docs/DECISIONS.md`](DECISIONS.md) - decisioni stabili e pendenti.

## Regole

- `AGENTS.md` resta fonte primaria per agenti e collaboratori.
- I documenti in questo indice sono fonti governanti.
- I documenti storici assorbiti non devono guidare nuove decisioni se non tramite il contenuto consolidato qui.
- Lo storico dei documenti rimossi resta recuperabile da Git.

## Copertura Del Consolidamento

I documenti storici sono stati assorbiti per famiglie, non copiati uno a uno. La copertura governante è questa:

- Product brief, perimetro, benchmark package, procurement stage taxonomy e policy di ricerca dominio: [`CONTEXT.md`](CONTEXT.md).
- Roadmap MVP, criteri di successo, criteri di fallimento, milestone V1.1-V1.4, V2 e V3: [`ROADMAP.md`](../ROADMAP.md).
- Architettura MVP, data model, data contract, ruoli, permessi, resolver di versioni documentali e ADR normalizer: [`ARCHITECTURE.md`](ARCHITECTURE.md) e [`decisions/0001-normalizer-runtime-placement.md`](decisions/0001-normalizer-runtime-placement.md).
- Strategia AI gratuita, provider, routing T1-T8, prompt schema, benchmark, normalizzazione, privacy, minimizzazione e audit delle chiamate: [`AI_AND_DOCUMENT_PIPELINE.md`](AI_AND_DOCUMENT_PIPELINE.md).
- Wireframe funzionali, dashboard, review queue, indicatori, design degli stati, source inspector, UX mobile e visual audit widget: [`UX_REVIEW_WORKFLOW.md`](UX_REVIEW_WORKFLOW.md).
- Toolchain documentale locale, sviluppo app, storage runtime, Git, segreti, OCI/VPS futuro e verifiche documentali: [`OPERATIONS.md`](OPERATIONS.md).
- Brand light, direzione visiva, pattern TPL, tono, componenti e accessibilità: [`BRAND.md`](BRAND.md).
- Decisioni accettate, decisioni rinviate e debiti da recuperare: [`DECISIONS.md`](DECISIONS.md).

## Cartelle

- `docs/decisions/`: ADR puntuali numerati quando serve una decisione stabile dettagliata.
- `docs/plans/`: piani temporanei e fasi di lavoro, da rimuovere o chiudere quando assorbiti.
- `data/`: configurazioni e fixture applicative, non documentazione prodotto principale.
