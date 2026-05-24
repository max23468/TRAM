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
| D006 | Roadmap separata | accepted | `docs/ROADMAP.md` governa milestone e stato operativo |
| D026 | Basename Markdown univoci prevalgono sul template Atlas | accepted | `docs/DECISIONS.md` resta indice ADR; niente `docs/decisions/README.md` |
| D007 | Nessun archivio massivo dei vecchi Markdown | accepted | Dopo consolidamento, storico affidato a Git |
| D008 | Dashboard direzionale first | accepted | La prima esperienza utile è overview Tender, non chat o file browser |
| D009 | Review queue core prodotto | accepted | Validazione umana, fonte e audit sono parte del flusso principale |
| D010 | V1 non confronta l’offerta preparata | accepted | Confronto offerta-gara resta V2 |
| D011 | Benchmark cross-gara resta V3 | accepted | Memoria storica e best practice non vanno anticipate se complicano V1 |
| D012 | Worker Python documentale separato | accepted | Parsing/OCR/tabelle/MPP non devono restare nel solo processo web stabile |
| D013 | Postgres standard come base dati direzionale | accepted | DB, audit e job queue iniziale devono restare portabili |
| D014 | Storage documentale fuori repo | accepted | Pacchetti, OCR, estratti, export e dati reali restano esclusi da Git |
| D015 | Currentness resolver deterministico | accepted | Famiglia/versione/vigente-superato-dubbio non sono decisioni AI pure |
| D016 | T2/T3 parser-owned sui campi formali | accepted | Date, deadline, obbligatorietà, formati, limiti e fonti non sono delegate all’AI |
| D017 | T5 non è L2 per categoria | accepted | Financials del Tender sono analizzabili se policy/input/provider lo consentono |
| D018 | T8 human-first | accepted | Nessun invio automatico di domande o chiarimenti |
| D019 | Gemini route promossa per T1 L0 | accepted | Con normalizzatore deterministico e resolver; non come default generale assoluto |
| D020 | Groq e Cloudflare limitati a micro-task L0 | accepted | Non usare per envelope completi o dati sensibili |
| D021 | OpenRouter solo smoke/confronto salvo policy pinned | accepted | Richiede modello pinned e data policy verificata per uso reale |
| D022 | UI italiana con stati tradotti | accepted | Codici raw restano nel modello, non nella superficie primaria |
| D023 | Fixture sintetiche come base app | accepted | Pacchetti reali restano benchmark riservati o rappresentativi fuori Git |
| D024 | GitHub non implica deploy/release | accepted | Pubblicare, deployare e rilasciare restano azioni distinte |
| D025 | TRAM pubblicata su GitHub privato | accepted | `max23468/TRAM`, CI/igiene repo senza deploy e senza branch protection premium |

## ADR

- `docs/decisions/0001-normalizer-runtime-placement.md`: sede runtime dei normalizzatori AI.
- `docs/decisions/0002-github-publishing-and-repo-governance.md`: pubblicazione GitHub e governance repository.
- `docs/decisions/0000-template.md`: template per nuove ADR TRAM.

## Decisioni Pendenti

- Se conservare alcune evidenze benchmark non sintetizzabili oltre allo storico Git.
- Quando introdurre `CHANGELOG.md`.
- Policy versioning/release.
- Target e runbook deploy futuri.
- Hosting condiviso prima della V1: VPS, OCI, Vercel/Supabase o altro stack.
- Policy definitiva per dati L1/L2 e provider esterni su Tender reali.
- Ruoli applicativi completi e workflow approvativo oltre i permessi minimi.
- Formato export controllato per Q&A, review, report o Excel.
- Se e quando creare ADR dedicati per storage, AI provider policy e versioning.

## Debiti Da Recuperare

- Verificare sul codice che tutte le route MVP siano ancora allineate alla roadmap dopo ogni slice Fase 4.
- Trasformare le policy AI in test/fixture quando il gateway sarà implementato.
- Creare runbook deploy solo quando il target sarà deciso.
- Valutare `CHANGELOG.md` solo quando inizierà una release policy reale.
- Conservare nello storico Git i vecchi Markdown senza rimetterli come fonte operativa.
- Usare `docs/BACKLOG.md` per debiti e idee non ancora promosse in roadmap.
