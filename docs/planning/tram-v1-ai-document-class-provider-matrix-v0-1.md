# TRAM V1 - Matrice classi documentali, provider AI e privacy level v0.1

Data: 2026-05-13
Stato: proposta operativa V1, da usare come base per `AiGateDecision`
Ambito: Copenhagen M1-M4, Dublin Luas, AI gateway, provider gratuiti, privacy e minimizzazione input

## Scopo

Questo documento traduce la strategia AI V1 in una matrice operativa: per ogni classe documentale o informativa indica il livello privacy di default, i provider ammessi, i blocchi e la review richiesta.

La matrice serve a evitare due errori opposti:

- usare AI esterna su contenuti che dovrebbero restare locali o umani;
- bloccare per prudenza anche task innocui come classificazione documentale e metadati.

Questa matrice non sostituisce il giudizio dell’utente. È il default applicativo iniziale: se il pacchetto contiene clausole più restrittive, prevalgono le clausole del pacchetto.

La tassonomia task T1-T8 che usa questa matrice come gate operativo è documentata in:

- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-tx-task-taxonomy-t1-t8.md`

## Regola superiore

Prima di inviare qualunque contenuto a provider esterni, TRAM deve verificare:

1. livello privacy del contenuto;
2. clausole del pacchetto su riservatezza, AI, data processing, subprocessor e vendor esterni;
3. policy provider aggiornata;
4. quota gratuita e budget;
5. minimizzazione del chunk;
6. necessità di approvazione umana.

Se uno di questi punti è ignoto e il contenuto non è chiaramente `L0`, il gate deve sospendere il job.

## Legenda

### Privacy level

| Livello | Significato operativo |
| --- | --- |
| `L0_public_or_low` | Metadati, titoli, classificazione documentale, dati già pubblici o a basso rischio |
| `L1_controlled` | Estratti mirati da documenti di gara, senza dati personali e senza contenuti economici/contrattuali sensibili |
| `L2_sensitive` | Dati personali, dati interni/offerta, assunzioni economiche interne, cyber/security dettagliata, chiarimenti critici, note interne o contenuti vietati da clausole del pacchetto |

### Stato provider

| Stato | Significato |
| --- | --- |
| `A` | Ammesso in V1 con gate standard |
| `H` | Ammesso solo con approvazione umana o primo uso approvato sul pacchetto |
| `P` | Richiede policy review prima dell’uso |
| `M` | Ammesso solo per micro-task o input ridottissimi |
| `T` | Solo test/smoke, non uso operativo |
| `B` | Bloccato verso provider esterno |
| `L` | Solo locale, self-hosted o revisione umana |

## Matrice provider sintetica

| Provider | L0 | L1 | L2 | Default V1 |
| --- | --- | --- | --- | --- |
| Gemini `gemini-2.5-flash-lite` | `A` | `P/H` | `B` | Primario per T1 L0 e classificazione controllata |
| Mistral `mistral-medium-3.5` | `A` | `P/H` | `B` | Secondario forte per T1 L0; L1 solo dopo opt-out/policy review |
| Cloudflare Workers AI | `M` | `P/H` | `B` | Micro-task L0 o fallback leggero, non envelope completo |
| Groq | `M` | `B` | `B` | Micro-task L0; non promosso su Copenhagen T1 completo |
| Cerebras | `T` | `B` | `B` | Test tecnico; privacy/DPA e qualità non chiuse |
| OpenRouter | `T/M` | `B` | `B` | Smoke L0 con modello pinned e ZDR; evitare routing generico |
| VPS/self-hosted | `A` | `A/H` | `H/L` | Fallback privacy-first se esistono runbook e risorse |

## Matrice classi documentali

| Codice | Classe | Esempi Copenhagen/Luas | Privacy default | Provider esterni V1 | Review | Note di minimizzazione |
| --- | --- | --- | --- | --- | --- | --- |
| `dc_file_metadata` | Metadati tecnici file | nome file, estensione, hash, dimensione, page count, lingua stimata | L0 | Gemini `A`, Mistral `A`, Cloudflare `M`, altri `T` | No, salvo ambigui | Solo metadati, mai contenuto documento |
| `dc_document_classification` | Classificazione documento | package phase, document nature, document role, versione, current/superseded | L0 | Gemini `A`, Mistral `A`, Cloudflare `M`, altri `T` | Campione su documenti critici | Titolo, path, prime righe, indice o abstract; no documento intero |
| `dc_document_map_versioning` | Mappa documenti e versioning | track changes, clean version, addendum, clarification, replaced document | L0/L1 | Gemini `A` su L0, Mistral `A` su L0, L1 `P/H` | Sì se cambia stato corrente | Invia solo coppie documento/versione e brevi estratti differenziali |
| `dc_public_procurement_metadata` | Metadati gara pubblici | stazione appaltante, procedura, contract notice, fase, CPV, paese | L0 | Gemini `A`, Mistral `A`, Cloudflare `M` | No | Preferire fonti web ufficiali o metadati, non allegati riservati |
| `dc_network_scope` | Scope network e O&M | linee, km, stazioni, CMC, sistemi, materiale rotabile, 24/7 | L0/L1 | Gemini `A` se L0, Mistral `A` se L0, L1 `P/H` | Sì su mismatch o valori economici collegati | Estratti brevi con fonte; evitare mappe tecniche complete |
| `dc_procurement_timeline` | Timeline gara | submission, negotiation, BAFO, standstill, award, signing | L0/L1 | Gemini `A`, Mistral `A`, Cloudflare `M` su date isolate | Sì su date divergenti o condizionate | Tabelle/date isolate; includere timezone e documento fonte |
| `dc_contract_timeline` | Timeline contratto | mobilisation, Start of Operation, operation period, estensioni, handover | L1 | Gemini `P/H`, Mistral `P/H`, Cloudflare `M` solo date semplici | Sì su milestone critiche | Invia solo clausole/righe pertinenti, non intere conditions |
| `dc_submission_deliverables` | Deliverable di gara | form, schedule of prices, page limits, quality sections, CV requirements | L1 | Gemini `P/H`, Mistral `P/H`, Cloudflare `M` solo su micro-classificazioni L0 | Sì su checklist finale | Estratti da istruzioni e appendici; AI solo su normalizzazione, dipendenze e incertezze; requisiti formali restano parser/regole |
| `dc_definitions_glossary` | Definizioni e abbreviazioni | Appendix Definitions, termini contrattuali, acronimi O&M | L1 | Gemini `P/H`, Mistral `P/H`, Cloudflare `M` su singole definizioni | No su definizioni semplici, sì su ambigue | Segmenti definizione per definizione |
| `dc_general_requirements` | Requisiti generali e obblighi | shall/must, MR, reporting, plans, procedures, governance | L1 | Gemini `P/H`, Mistral `P/H` | Sì su mandatory/high impact | Chunk piccoli con clause id e fonte |
| `dc_operations_requirements` | Requisiti operations | headway, disruption, control room, passenger information, events | L1 | Gemini `P/H`, Mistral `P/H` | Sì su impatto costo/rischio | Estratti per requisito, non capitoli interi |
| `dc_maintenance_asset_requirements` | Manutenzione e asset | preventive/corrective maintenance, CMMS, spares, asset condition, inspections | L1 | Gemini `P/H`, Mistral `P/H` | Sì su asset critici o scope incerto | Estratti con asset class, obbligo e fonte |
| `dc_kpi_non_financial` | KPI non economici | service availability, precision, customer satisfaction, asset condition target | L1 | Gemini `P/H`, Mistral `P/H` | Sì su formule/target | Invia formula o tabella KPI isolata; non payment mechanism |
| `dc_kpi_financial_linked` | KPI con bonus/malus o deductions | target con penali, bonus, malus, cap, exclusions economiche | L1/L2 | Gemini `P/H`, Mistral `P/H`; L2 `B` | Obbligatoria | AI ammessa su estratti minimizzati; L2 solo se contiene dati interni/offerta o clausole incompatibili |
| `dc_financials_pricing` | Prezzi e pricing workbook | schedule of prices, unit prices, financial model, evaluated price formula dettagliata | L1/L2 | Gemini `P/H`, Mistral `P/H`; L2 `B` | Obbligatoria | Parser Excel locale + AI su chunk minimizzati; mai workbook completo a provider esterni |
| `dc_payment_mechanism` | Payment mechanism | Attachment Payment, deductions, payment frequency, indexation, caps/collars | L1/L2 | Gemini `P/H`, Mistral `P/H`; L2 `B` | Obbligatoria | AI ammessa su estratti clause-by-clause minimizzati; L2 solo per dati interni/offerta o policy incompatibile |
| `dc_penalties_guarantees` | Penali, garanzie e securities | liquidated damages, performance guarantee, warranty guarantee, parent company guarantee | L1/L2 | Gemini `P/H`, Mistral `P/H`; L2 `B` | Obbligatoria | Estratti clause-by-clause con source refs; review umana |
| `dc_risk_allocation_contract` | Allocazione rischi e clausole contrattuali critiche | claims notice, force majeure, step-in, termination, change management | L2 | Provider esterni `B`; VPS/self-hosted `H/L` | Obbligatoria | Review umana prioritaria; AI esterna bloccata |
| `dc_compliance_standard` | Compliance non sensibile | environmental reporting, safety management generale, sanctions declaration | L1/L2 | L1 `P/H`, L2 `B` | Sì su obblighi mandatory | Classificare per contenuto: dichiarazioni standard L1, dettagli sensibili L2 |
| `dc_data_protection_ai_clause` | Clausole data protection, AI e subprocessor | DPA, AI clause, restrictions on external vendors | L2 | Provider esterni `B`; VPS/self-hosted `H/L` | Obbligatoria | Questa classe governa il gate: analisi locale prima di AI esterna |
| `dc_cyber_security` | Cyber e security | IT security, access control, incident response, architecture details | L2 | Provider esterni `B`; VPS/self-hosted `H/L` | Obbligatoria | Trattare come sensibile anche se il documento è nel tender pack |
| `dc_personal_workforce` | Dati personali e workforce transfer | key persons, CV, employee transfer, nominativi, certificazioni individuali | L2 | Provider esterni `B`; VPS/self-hosted `H/L` | Obbligatoria | Anonimizzare o restare locale; evitare provider esterni in V1 |
| `dc_technical_maps_drawings` | Mappe, disegni, confini manutenzione | maintenance boundary maps, asset maps, station/track drawings | L1/L2 | L1 `P/H`, L2 `B` | Sì | OCR/vision locale preferito; non inviare immagini tecniche complete |
| `dc_vdr_data_room` | Virtual Data Room e data room | liste VDR, data room agreements, file non presenti nel pacchetto locale | L1/L2 | L1 `P/H`, L2 `B` | Sì | Lista documenti può essere L1; contenuto VDR spesso L2 o non inviabile |
| `dc_contradiction_candidate` | Contraddizioni candidate | mismatch km, date divergenti, doc list non allineate, version conflict | Max fonte | Dipende dal livello fonte; L2 `B` | Obbligatoria | Non inviare più fonti del necessario; output sempre review item |
| `dc_clarification_thread` | Chiarimenti/Q&A verso stazione appaltante | domande su errori, chiarimenti, incongruenze, risposte ente | L2 | Provider esterni `B` in V1 salvo approvazione esplicita | Obbligatoria | Bozza solo dopo validazione fonti; mai invio automatico |
| `dc_dashboard_summary` | Sintesi dashboard | executive summary, risk flags, status gara, blocker | Max input | Ammesso solo se input L0/L1 approvato; L2 `B` | Sì prima di consolidare | La sintesi eredita il livello più alto delle fonti |
| `dc_user_feedback_internal` | Feedback utente e correzioni | note, contestazioni, correzioni benchmark, decisioni strategiche | L2 | Provider esterni `B` | Obbligatoria se riusata | Non usare per training opaco; salvare come regola o tassonomia controllata |
| `dc_offer_documents_future` | Offerta preparata dal bidder | offerta tecnica, economica, amministrativa | L2 | Fuori V1; provider esterni `B` | Obbligatoria | Funzione V2, da annotare ma non implementare ora |

## Regole di escalation

Un contenuto scala automaticamente a `L2_sensitive` se contiene:

- dati personali, nominativi, CV, certificazioni individuali o dati HR;
- dati interni/offerta, assunzioni economiche interne, workbook completi non minimizzati o formule non isolabili;
- bonus/malus, deductions, penali, garanzie o cap economici;
- clausole contrattuali che incidono su claims, termination, step-in, indemnity o risk allocation;
- cyber/security, access control, architetture tecniche sensibili o incident response;
- clausole su AI, data processing, subprocessor o riservatezza;
- note interne, valutazioni strategiche dell’utente o feedback non destinato a terzi;
- chiarimento pronto per invio esterno.

Un contenuto può restare `L0_public_or_low` solo se:

- è metadato tecnico o classificazione documentale;
- non contiene estratti sostanziali;
- non contiene dati personali;
- non contiene pricing, KPI economici o clausole critiche;
- è già pubblico o equivalente a dato bibliografico/documentale.

## Provider per classe: decisione V1

### Gemini

Uso V1:

- primario per `dc_file_metadata`, `dc_document_classification`, `dc_public_procurement_metadata`;
- possibile su L1 solo dopo gate provider, clausole pacchetto e approvazione del primo uso;
- bloccato su L2.

Motivo: miglior benchmark T1 L0. Rischio: regime privacy e billing vanno verificati prima di L1/L2, soprattutto per EEA/CH/UK.

### Mistral

Uso V1:

- secondo provider per L0 e confronto qualità;
- possibile su L1 solo dopo opt-out training o base privacy equivalente;
- bloccato su L2.

Motivo: buona qualità su T1 L0 e provider europeo. Rischio: il piano Experiment gratuito può usare input/output per training salvo opt-out.

### Cloudflare Workers AI

Uso V1:

- micro-task L0;
- classificazioni elementari o task ridotti;
- possibile rivalutazione futura su embedding o workflow edge.

Motivo: data usage interessante e pass su micro-benchmark v0.4. Rischio: non passa l’envelope Copenhagen T1 completo.

### Groq

Uso V1:

- micro-task L0;
- JSON semplice;
- classificazioni corte quando quota free disponibile.

Motivo: pass su micro-benchmark v0.4 con `llama-3.3-70b-versatile`. Rischio: non passa il T1 completo già testato e prima di L1 servono policy dati, rate limit e controlli quota più solidi.

### Cerebras e OpenRouter

Uso V1:

- solo test/smoke L0;
- nessun uso operativo L1/L2;
- nessun routing generico per contenuti non banali.

Motivo: qualità, policy, routing, data location o accesso modello non sono sufficientemente chiusi per diventare default. OpenRouter può funzionare su L0 con modello pinned, ma il free tier è instabile; Cerebras non è promosso nemmeno come micro-task dopo v0.4.

### VPS/self-hosted

Uso V1:

- fallback privacy-first per L1/L2;
- batch lenti e task non urgenti;
- utile quando le clausole vietano o rendono rischioso l’uso di provider esterni.

Condizione: serve runbook con host, modello, storage, log, retention, costo compute e limiti qualità.

## Comportamento UI suggerito

La UI non deve mostrare questa matrice in forma tecnica all’utente finale, ma deve trasformarla in stati chiari:

- “AI esterna ammessa”;
- “AI esterna da approvare”;
- “Solo analisi locale”;
- “Bloccato per clausola o privacy”;
- “Quota gratuita esaurita”;
- “Output da validare”.

Per ogni blocco, l’utente deve vedere:

- contenuto o documento coinvolto;
- motivo del blocco;
- provider richiesto;
- livello privacy;
- azione possibile: approva, usa locale, marca non inviabile, modifica classificazione o salta.

## Impatti su `AiGateDecision`

La matrice popola o governa questi campi:

- `content_classes`;
- `requested_privacy_level`;
- `effective_privacy_level`;
- `provider_candidate`;
- `model_candidate`;
- `policy_status`;
- `policy_reasons`;
- `human_approval_required`;
- `clause_scan_status`;
- `cost_gate_status`.

Esempio operativo:

- se un chunk è `dc_document_classification`, `effective_privacy_level = L0`, Gemini e Mistral possono essere ammessi con gate standard;
- se un chunk è `dc_payment_mechanism`, `effective_privacy_level = L1` se proviene dal Tender ed è minimizzato; scala a L2 solo per dati interni/offerta, clausole incompatibili o payload non isolabile;
- se un chunk è `dc_kpi_non_financial` ma include bonus/malus, la classe diventa `dc_kpi_financial_linked` e resta analizzabile se L1 minimizzato.

## Fonti provider verificate

Fonti consultate o da ricontrollare prima di L1/L2:

- Gemini API Terms: https://ai.google.dev/gemini-api/terms
- Mistral training policy: https://help.mistral.ai/en/articles/347617-do-you-use-my-user-data-to-train-your-artificial-intelligence-models
- Mistral Experiment plan: https://help.mistral.ai/en/articles/455206-how-can-i-try-the-api-for-free-with-the-experiment-plan
- Cloudflare Workers AI data usage: https://developers.cloudflare.com/workers-ai/platform/data-usage/
- Cloudflare Workers AI pricing: https://developers.cloudflare.com/workers-ai/platform/pricing/
- Groq rate limits: https://console.groq.com/docs/rate-limits
- Groq data policy: https://console.groq.com/docs/your-data
- OpenRouter ZDR: https://openrouter.ai/docs/guides/features/zdr
- OpenRouter free models router: https://openrouter.ai/docs/guides/routing/routers/free-models-router
- OpenRouter provider logging: https://openrouter.ai/docs/guides/privacy/provider-logging
- Cerebras privacy policy: https://www.cerebras.ai/privacy-policy
- Cerebras rate limits: https://inference-docs.cerebras.ai/support/rate-limits

## Debiti da recuperare

- Estendere la policy di redazione/minimizzazione a tutte le classi `dc_*`.
- Definire retention raw input/output per classi L1 e L2.
- Verificare se Gemini con billing/cap minimo è effettivamente compatibile con L1 in EEA.
- Verificare opt-out Mistral Experiment e se basta per L1.
- Collegare il micro-benchmark v0.4 alla futura logica `AiRouteDecision`.
- Decidere se `dc_technical_maps_drawings` richiede una policy separata per immagini/OCR/vision.

## Prossimo passo consigliato

Usare la specifica normalizzatori T4-T8 in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-ai-normalizer-spec-t4-t8-v0-1.md`, il config `/Users/Matteo/Documents/TRAM/data/config/tram-v1-normalizer-config-t4-t8-v0-1.json`, la fixture spec `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-ai-normalizer-fixture-test-spec-t4-t8-v0-1.md` e l’ADR `/Users/Matteo/Documents/TRAM/docs/decisions/tram-adr-001-normalizer-runtime-placement-v0-1.md`. T4, T5 e T6 possono usare AI su L1 minimizzato con normalizzazione; T8 resta limitato al subset L1/L0 e human-first; T7 non ha provider promosso e deve restare rules/review-first.

La policy iniziale è documentata in:

- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-ai-chunk-minimization-redaction-policy-v0-1.md`

Il prompt/schema pack v0.3 è documentato in:

- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-free-ai-prompt-schema-pack-v0-3.md`

I prompt/schema pack T4-T8 sono documentati in:

- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-free-ai-prompt-schema-pack-t4-requirements-kpi-v0-1.md`
- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-free-ai-prompt-schema-pack-t5-financials-payment-v0-1.md`
- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-free-ai-prompt-schema-pack-t6-cost-drivers-v0-1.md`
- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-free-ai-prompt-schema-pack-t7-contradictions-v0-1.md`
- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-free-ai-prompt-schema-pack-t8-query-draft-v0-1.md`

La matrice routing AI aggiornata è documentata in:

- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-ai-routing-matrix-v0-1.md`
