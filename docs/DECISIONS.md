# TRAM - Decisions

Questo documento è il punto di ingresso per decisioni stabili e decisioni pendenti. Gli ADR puntuali restano in `docs/decisions/` quando serve dettaglio.

## Decisioni Accettate

| ID | Decisione | Stato | Dettaglio |
| --- | --- | --- | --- |
| D001 | TRAM segue un modello evidence-first | accepted | Un dato critico senza fonte non viene consolidato |
| D002 | AI V1 free-first, provider-agnostic, human-in-the-loop | accepted | Nessun fallback automatico a pagamento |
| D003 | Nessun pacchetto completo inviato a LLM | accepted | Parsing/OCR prima, chunk minimizzati poi |
| D004 | Normalizzatori AI fuori dal client | accepted | Vedi ADR 001 |
| D005 | Documenti governanti con nomi generici | accepted | Niente `tram-` o `v1` nei filename vivi |
| D006 | Roadmap separata | accepted | `ROADMAP.md` governa milestone e debiti |
| D007 | Nessun archivio massivo dei vecchi Markdown | accepted | Dopo consolidamento, storico affidato a Git |

## ADR

- `docs/decisions/tram-adr-001-normalizer-runtime-placement-v0-1.md`: sede runtime dei normalizzatori AI.

## Decisioni Pendenti

- Se conservare alcune evidenze benchmark non sintetizzabili oltre allo storico Git.
- Se `data/tram-data-packages-guide.md` resta in `data/` o viene assorbito del tutto nei documenti governanti.
- Quando introdurre `CHANGELOG.md`.
- Quando e come pubblicare TRAM su GitHub.
- Policy versioning/release.
- Target e runbook deploy futuri.
