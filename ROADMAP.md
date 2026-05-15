# TRAM - Roadmap

Questo documento governa priorità, milestone e debiti visibili. I dettagli tecnici vivono nei documenti di area; la roadmap deve restare leggibile e aggiornata.

## Stato Corrente

Fase attuale: **M0 - Fondazioni**.

TRAM ha già:

- Git locale inizializzato;
- primo snapshot su `main`;
- branch `codex/docs-consolidation`;
- app Next.js iniziale con fixture sintetiche;
- policy `.gitignore` per escludere dati sensibili e runtime locali;
- documentazione governante consolidata da 85 a 13 Markdown.

## Milestone

| Milestone | Stato | Obiettivo | Deliverable | Done quando |
| --- | --- | --- | --- | --- |
| M0 - Fondazioni | in corso | Stabilizzare repo, documenti vivi e regole operative | Git locale, documenti governanti, runbook, decision log | `AGENTS.md` e `docs/INDEX.md` puntano al set minimo vivo |
| M1 - Tender Shell | parzialmente avviata | Navigazione app e tender demo con fixture | Tender list, overview, pagine sezione, layout base | L’app è navigabile con fixture e passa verifica locale |
| M2 - Document Map | da fare | Inventario documenti, versioni, currentness e fonti | Document list, source refs, stato versione | Ogni documento demo mostra versione, famiglia e fonte |
| M3 - Review Queue | da fare | Validazione umana dei dati proposti | Queue, stati, correzioni, contestazioni | Un dato proposto può essere confermato, corretto o contestato |
| M4 - Pipeline Locale | da fare | Parsing/OCR e working extract controllati | Worker Python, parsing PDF/DOCX/XLSX/MPP, error handling | Output tracciati con source reference e senza dati committati |
| M5 - AI Free-Gated | da fare | AI gratuita, minimizzata e governata | routing, prompt correnti, registry chiamate | Nessuna chiamata AI parte senza gate costo/privacy e input minimizzato |
| M6 - Dashboard Evidence-First | da fare | Dashboard gara e aggregata basate su stato/fonte/rischio | viste T1-T8, indicatori, contraddizioni, chiarimenti | L’utente vede cosa è fonte, proposta, confermato o da chiarire |

## Debiti Visibili

- Formalizzare la policy release quando TRAM sarà pubblicata su GitHub.
- Definire eventuale `CHANGELOG.md` solo quando inizierà un flusso release reale.

## Regola Di Aggiornamento

Ogni modifica che cambia priorità, milestone, perimetro MVP o debito residuo deve aggiornare questo file nello stesso commit o in un commit documentale immediatamente collegato.
