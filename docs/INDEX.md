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
- Roadmap MVP, criteri di successo, criteri di fallimento, fasi 7-10 prima della V1, V2 e V3: [`ROADMAP.md`](../ROADMAP.md).
- Architettura MVP, data model, data contract, ruoli, permessi, resolver di versioni documentali e ADR: [`ARCHITECTURE.md`](ARCHITECTURE.md), [`decisions/0001-normalizer-runtime-placement.md`](decisions/0001-normalizer-runtime-placement.md) e [`decisions/0002-github-publishing-and-repo-governance.md`](decisions/0002-github-publishing-and-repo-governance.md).
- Strategia AI gratuita, provider, routing T1-T8, prompt schema, benchmark, normalizzazione, privacy, minimizzazione e audit delle chiamate: [`AI_AND_DOCUMENT_PIPELINE.md`](AI_AND_DOCUMENT_PIPELINE.md).
- Wireframe funzionali, dashboard, review queue, indicatori, design degli stati, source inspector, UX mobile e visual audit widget: [`UX_REVIEW_WORKFLOW.md`](UX_REVIEW_WORKFLOW.md).
- Toolchain documentale locale, sviluppo app, storage runtime, Git, segreti, OCI/VPS futuro e verifiche documentali: [`OPERATIONS.md`](OPERATIONS.md).
- Brand light, direzione visiva, pattern TPL, tono, componenti e accessibilità: [`BRAND.md`](BRAND.md).
- Decisioni accettate, decisioni rinviate e debiti da recuperare: [`DECISIONS.md`](DECISIONS.md).

## Matrice Di Assorbimento

Questa matrice collega le famiglie dei vecchi Markdown allo spazio governante attuale. Serve per tracciabilità: se un tema non è qui, va recuperato prima di considerare l’archivio solo storico.

| Famiglia storica | Vecchi documenti coperti | Documento vivo | Cosa resta governato |
| --- | --- | --- | --- |
| Regole agente | `AGENTS.md` | [`../AGENTS.md`](../AGENTS.md) | Priorità istruzioni, guardrail repo, Git, sicurezza, AI, dati, workflow operativo. |
| Orientamento progetto | `tram-v1-product-brief.md`, `tram-brand-positioning-notes.md` | [`CONTEXT.md`](CONTEXT.md), [`BRAND.md`](BRAND.md), [`../ROADMAP.md`](../ROADMAP.md) | Obiettivo V1, cosa TRAM non è, funzioni candidate, posizionamento, V2/V3. |
| Naming e governance docs | `tram-documentation-naming-conventions.md` | [`INDEX.md`](INDEX.md), [`../AGENTS.md`](../AGENTS.md), [`DECISIONS.md`](DECISIONS.md) | Nomi univoci, pochi documenti governanti, vecchi Markdown solo storico Git. |
| Dominio e fonti | `tram-domain-research-policy.md`, `tram-procurement-stage-taxonomy.md`, `tram-v1-benchmark-packages.md`, `data/tram-data-packages-guide.md` | [`CONTEXT.md`](CONTEXT.md), [`OPERATIONS.md`](OPERATIONS.md) | Fonti autorevoli, procurement stage, pacchetti benchmark, trattamento dati reali/rappresentativi. |
| Roadmap e criteri successo | `tram-v1-mvp-roadmap-and-success-criteria-v0-1.md`, `tram-v1-mvp-development-verification-checklist-v0-1.md`, `tram-v1-mvp-v0-slice-status-alignment-2026-05-13.md` | [`../ROADMAP.md`](../ROADMAP.md), [`OPERATIONS.md`](OPERATIONS.md) | Fasi 0-6, Fase 4 corrente, slice operative assorbite nelle fasi, criteri successo/fallimento, gate, debiti. |
| Roadmap futura | decisioni emerse nei documenti V1 e nei brief su V2/V3 | [`../ROADMAP.md`](../ROADMAP.md), [`CONTEXT.md`](CONTEXT.md), [`DECISIONS.md`](DECISIONS.md) | Fasi 7-10 prima della V1, V2 confronto offerta-gara, V3 memoria storica e benchmark cross-gara. |
| Architettura MVP | `tram-v1-mvp-architecture.md`, `tram-v1-data-model.md`, `tram-v1-mvp-data-contract-v0-1.md`, `tram-v1-mvp-roles-permissions-v0-1.md` | [`ARCHITECTURE.md`](ARCHITECTURE.md), [`DECISIONS.md`](DECISIONS.md) | Componenti logici, data model, data contract, ruoli, permessi, stati, alternative e rischi. |
| Resolver documentale | `tram-v1-document-family-version-currentness-resolver-v0-1.md` | [`ARCHITECTURE.md`](ARCHITECTURE.md), [`UX_REVIEW_WORKFLOW.md`](UX_REVIEW_WORKFLOW.md) | Famiglia, versione, vigente/superato/dubbio, addendum, redline, review per conflitti. |
| ADR normalizzatori | `docs/decisions/tram-adr-001-normalizer-runtime-placement-v0-1.md` | [`decisions/0001-normalizer-runtime-placement.md`](decisions/0001-normalizer-runtime-placement.md), [`ARCHITECTURE.md`](ARCHITECTURE.md), [`AI_AND_DOCUMENT_PIPELINE.md`](AI_AND_DOCUMENT_PIPELINE.md) | Runtime TypeScript canonico, worker Python documentale, config condiviso, test e rischi. |
| ADR GitHub | decisione operativa di pubblicazione repository | [`decisions/0002-github-publishing-and-repo-governance.md`](decisions/0002-github-publishing-and-repo-governance.md), [`OPERATIONS.md`](OPERATIONS.md), [`DECISIONS.md`](DECISIONS.md) | Repository privata, CI/igiene repo, nessuna branch protection premium, nessun deploy o release impliciti. |
| Pipeline documentale | `tram-v1-ingestion-to-dashboard-workflow-v0-1.md`, `tram-v1-tender-data-policy-v0-1.md`, `tram-v1-t2-t3-operational-spec-v0-1.md` | [`AI_AND_DOCUMENT_PIPELINE.md`](AI_AND_DOCUMENT_PIPELINE.md), [`ARCHITECTURE.md`](ARCHITECTURE.md), [`OPERATIONS.md`](OPERATIONS.md) | Ingestion, parsing, OCR, source reference, policy Tender, T2/T3 parser-owned, dashboard/review. |
| Strategia AI gratuita | `tram-v1-free-ai-strategy.md`, `tram-v1-free-ai-provider-recommendation-v0-1.md`, `tram-v1-ai-document-class-provider-matrix-v0-1.md`, `tram-v1-ai-call-registry-and-gates-v0-1.md`, `tram-v1-ai-routing-matrix-v0-1.md` | [`AI_AND_DOCUMENT_PIPELINE.md`](AI_AND_DOCUMENT_PIPELINE.md), [`DECISIONS.md`](DECISIONS.md) | Provider candidati, Gemini route T1 L0, limiti Mistral/Groq/Cloudflare/Cerebras/OpenRouter, registry, gate e budget. |
| Privacy e minimizzazione AI | `tram-v1-ai-chunk-minimization-redaction-policy-v0-1.md`, `tram-v1-tender-data-policy-v0-1.md` | [`AI_AND_DOCUMENT_PIPELINE.md`](AI_AND_DOCUMENT_PIPELINE.md), [`OPERATIONS.md`](OPERATIONS.md) | L0/L1/L2, redazione, contenuti vietati, stop conditions, no pacchetti completi a LLM. |
| Tassonomia T1-T8 | `tram-v1-tx-task-taxonomy-t1-t8.md`, `tram-v1-ai-normalizer-spec-t4-t8-v0-1.md`, `tram-v1-ai-normalizer-fixture-test-spec-t4-t8-v0-1.md` | [`AI_AND_DOCUMENT_PIPELINE.md`](AI_AND_DOCUMENT_PIPELINE.md), [`ARCHITECTURE.md`](ARCHITECTURE.md), [`../ROADMAP.md`](../ROADMAP.md) | Responsabilità parser/regole/AI per T1-T8, normalizzatori T4-T8, fixture e metriche. |
| Prompt pack | `tram-v1-free-ai-prompt-schema-pack-v0-1.md` ... `v0-4.md`, `tram-v1-free-ai-prompt-schema-pack-t2-timeline-v0-1.md`, `t3-deliverables`, `t4-requirements-kpi`, `t5-financials-payment`, `t6-cost-drivers`, `t7-contradictions`, `t8-query-draft` | [`AI_AND_DOCUMENT_PIPELINE.md`](AI_AND_DOCUMENT_PIPELINE.md) | Requisiti prompt/schema correnti, enum controllati, source reference, `unknown`, non invenzione, review mapping. |
| Benchmark AI e provider | `tram-v1-free-ai-benchmark-protocol-v0-1.md`, `tram-ai-routing-micro-benchmark-v0-4-evaluation.md`, `tram-v1-free-ai-provider-readiness-status-2026-05-13.md` | [`AI_AND_DOCUMENT_PIPELINE.md`](AI_AND_DOCUMENT_PIPELINE.md), [`../ROADMAP.md`](../ROADMAP.md) | Metriche, provider readiness, stage-aware benchmark, falsi positivi/negativi, review burden. |
| Analisi pacchetti benchmark | `tram-loaded-packages-inventory-*`, `tram-copenhagen-m1-m4-*`, `tram-dublin-luas-*`, `tram-dublin-metrolink-*`, `tram-milano-lotti-extraurbani-*`, `tram-v1-four-package-compact-benchmark-synthesis-v0-1.md` | [`CONTEXT.md`](CONTEXT.md), [`AI_AND_DOCUMENT_PIPELINE.md`](AI_AND_DOCUMENT_PIPELINE.md), [`../ROADMAP.md`](../ROADMAP.md) | Archetipi benchmark, T1/T2/T3/T4-T8, provider evaluation, limiti dati, output non pubblicabile. |
| Fixture e contratto app | `tram-v1-mvp-application-fixtures-v0-1.md`, `tram-v1-mvp-data-contract-v0-1.md` | [`ARCHITECTURE.md`](ARCHITECTURE.md), [`../ROADMAP.md`](../ROADMAP.md), [`UX_REVIEW_WORKFLOW.md`](UX_REVIEW_WORKFLOW.md) | Fixture sintetiche, route contract, payload per vista, errori, stati dashboard, copertura T1-T8. |
| Wireframe e dashboard | `tram-v1-mvp-functional-wireframes-v0-1.md`, `tram-v1-dashboard-views-t1-t8-v0-1.md`, `tram-v1-first-ui-slice-priority-v0-1.md`, `tram-v1-dashboard-widget-audit-v0-1.md` | [`UX_REVIEW_WORKFLOW.md`](UX_REVIEW_WORKFLOW.md), [`BRAND.md`](BRAND.md), [`../ROADMAP.md`](../ROADMAP.md) | Route MVP, overview direzionale, widget approvati/da evitare, stati, mobile, source inspector. |
| Review e validazione | `tram-v1-human-validation-workflow.md`, `tram-v1-review-queue-design.md` | [`UX_REVIEW_WORKFLOW.md`](UX_REVIEW_WORKFLOW.md), [`ARCHITECTURE.md`](ARCHITECTURE.md), [`DECISIONS.md`](DECISIONS.md) | Review queue core, stati, priorità, azioni, audit, validazione critica e Q&A human-first. |
| Indicatori | `tram-v1-indicator-key-registry-p0-p1-v0-1.md`, `tram-v1-indicator-taxonomy.md` | [`UX_REVIEW_WORKFLOW.md`](UX_REVIEW_WORKFLOW.md), [`ARCHITECTURE.md`](ARCHITECTURE.md) | Indicatori P0/P1, formula, stato, fonte, dipendenze e comportamento su dati stale/contestati. |
| Operations e segreti | `tram-v1-gitignore-and-secrets-policy-v0-1.md`, `tram-v1-local-app-development-runbook-v0-1.md`, `tram-local-document-processing-toolchain.md`, `tram-v1-oci-mvp-runtime-and-storage-runbook-v0-1.md` | [`OPERATIONS.md`](OPERATIONS.md), [`../AGENTS.md`](../AGENTS.md) | Setup locale, toolchain, `.gitignore`, segreti, storage, Git, OCI/VPS futuro, stop conditions. |
| Brand e visual direction | `tram-v1-fase-1c-visual-direction-brand-light-v0-1.md`, `tram-v1-fase-1c-bis-tpl-brand-direction-v0-1.md`, `tram-v1-dashboard-widget-audit-v0-1.md` | [`BRAND.md`](BRAND.md), [`UX_REVIEW_WORKFLOW.md`](UX_REVIEW_WORKFLOW.md) | Direzione light, pattern TPL, route strip, T-node, palette, densità, wording, accessibilità. |
| Automazione | `tram-v1-automation-decision-matrix.md` | [`ARCHITECTURE.md`](ARCHITECTURE.md), [`AI_AND_DOCUMENT_PIPELINE.md`](AI_AND_DOCUMENT_PIPELINE.md), [`DECISIONS.md`](DECISIONS.md) | Automatismi solo con gate, review, policy dati, no invii esterni automatici e no runtime produttivo implicito. |

Vecchi file non nominati singolarmente ma coperti dai pattern sopra restano nello storico Git e non vanno riaperti come fonte viva salvo audit esplicito. Se da un audit emerge una decisione non assorbita, va aggiunta al documento vivo corretto e non ripristinata come Markdown separato.

## Cartelle

- `docs/decisions/`: ADR puntuali numerati quando serve una decisione stabile dettagliata.
- `docs/plans/`: piani temporanei e fasi di lavoro, da rimuovere o chiudere quando assorbiti.
- `data/`: configurazioni e fixture applicative, non documentazione prodotto principale.
