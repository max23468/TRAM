# TRAM V1 - Registro chiamate AI e gate privacy/costo v0.1

Data: 2026-05-13
Stato: proposta operativa per V1, da trasformare in schema tecnico durante lo sviluppo
Ambito: AI gateway, audit, privacy, cost control, review umana

## Scopo

Questo documento definisce il registro tecnico delle chiamate AI e i gate minimi che TRAM deve applicare prima di inviare contenuti a provider esterni o a modelli self-hosted.

Serve a chiudere un punto critico della strategia V1: TRAM può usare AI gratuita, ma ogni chiamata deve essere governata, tracciabile, minimizzata e reversibile. Il fatto che un provider sia gratuito non basta per renderlo utilizzabile su dati riservati.

Il registro non è un log generico. È una parte del modello evidence-first: consente di capire quale output è stato generato, da quale modello, con quale input minimizzato, con quale costo/quota, sotto quale policy e con quali vincoli di validazione.

## Principi

- Nessun pacchetto completo va inviato a un LLM.
- Ogni chiamata AI deve avere uno scopo dichiarato e collegato a uno Tender.
- Ogni input deve essere classificato per sensibilità, minimizzato e collegato a fonti.
- Ogni output AI resta una proposta, non una verità consolidata.
- Ogni costo deve essere stimato e bloccato prima della chiamata.
- Nessun fallback automatico verso piani paid.
- Se quota, privacy, policy o clausole di gara non sono chiare, il job si sospende.
- I provider restano intercambiabili: il dominio applicativo non deve dipendere da Gemini, Mistral o altri nomi specifici.

## Relazione con `ExtractionRun`

`ExtractionRun` rappresenta una run di business della pipeline: ingestion, parsing, estrazione AI, riconciliazione o refresh.

`AiCall` rappresenta una singola chiamata a un modello o endpoint AI.

Relazione proposta:

- una `ExtractionRun` può non avere chiamate AI, per esempio parsing deterministico;
- una `ExtractionRun` può avere una o molte `AiCall`;
- una `AiCall` può produrre zero, una o molte `Extraction`;
- una `AiCall` può fallire senza invalidare tutta la `ExtractionRun`;
- una `AiCall` non deve contenere testo integrale in log applicativi ordinari.

## Livelli di sensibilità

| Livello | Descrizione | Esempi | Regola V1 |
| --- | --- | --- | --- |
| `L0_public_or_low` | Dati pubblici, metadati, titoli, indici, classificazione documentale senza estratti sensibili | titolo file, tipo documento, versione, ruolo documentale, fase pacchetto | Ammesso su provider approvati se costo e policy sono ok |
| `L1_controlled` | Estratti mirati da documenti di gara, senza dati personali e senza sezioni economicamente o contrattualmente sensibili | definizioni, requisiti generali, deliverable non economici, schedule pubblica | Richiede gate privacy, clausole pacchetto e minimizzazione |
| `L2_sensitive` | Dati personali, clausole riservate, payment mechanism dettagliato, penali, KPI con impatto economico, chiarimenti critici, materiale non pubblico | formule bonus/malus, prezzi, dati personali, obblighi critici, dispute | Bloccato verso provider esterni salvo approvazione esplicita e base privacy documentata |

Regola pratica: in caso di dubbio, classificare il chunk al livello più alto.

## Entità concettuali

### AiGateDecision

Registra la decisione pre-flight prima di una chiamata AI.

Campi minimi:

| Campo | Note |
| --- | --- |
| `id` | Identificativo |
| `tender_tender_id` | Spazio gara |
| `document_package_id` | Pacchetto, se applicabile |
| `document_version_id` | Versione documento, se applicabile |
| `task_id` | Esempio: `T1`, `T2`, `contradiction_scan` |
| `task_category` | classification, extraction, reconciliation, contradiction, clarification, summary |
| `requested_privacy_level` | Livello richiesto dal task |
| `effective_privacy_level` | Livello effettivo dopo classificazione input |
| `content_classes` | Classi `dc_*` definite nella matrice provider |
| `provider_candidate` | Provider scelto o candidato |
| `model_candidate` | Modello scelto o candidato |
| `policy_status` | allowed, blocked, requires_human_approval, requires_policy_review, requires_cost_review |
| `policy_reasons` | Motivi sintetici e non sensibili |
| `clause_scan_status` | not_needed, not_started, no_blocker_found, blocker_found, unclear |
| `cost_gate_status` | allowed_free, blocked_budget, blocked_quota, unknown_usage_requires_review |
| `human_approval_required` | Boolean |
| `human_approval_id` | Collegamento futuro a validation/approval |
| `created_at` | Audit |

### AiCall

Registra la chiamata effettiva.

Campi minimi:

| Campo | Note |
| --- | --- |
| `id` | Identificativo |
| `tender_tender_id` | Spazio gara |
| `extraction_run_id` | Run che ha generato la chiamata |
| `gate_decision_id` | Gate autorizzativo |
| `provider_policy_snapshot_id` | Policy provider usata al momento della chiamata |
| `provider` | Gemini, Mistral, Cloudflare, Groq, Cerebras, OpenRouter, self_hosted |
| `model` | Nome esatto del modello |
| `endpoint_family` | chat, responses, structured_output, embeddings, rerank, OCR, altro |
| `endpoint_region` | Se nota o configurabile |
| `account_tier` | free, experiment, paid_capped, enterprise, self_hosted |
| `billing_mode` | free_quota, credit, capped_paid, self_hosted_compute |
| `prompt_pack_id` | Pack prompt/schema usato |
| `prompt_version` | Versione prompt |
| `schema_version` | Versione schema |
| `input_hash` | Hash dell’input effettivo inviato |
| `output_hash` | Hash dell’output grezzo |
| `input_size_chars` | Dimensione stimata |
| `input_token_estimate` | Token stimati o dichiarati |
| `output_token_estimate` | Token stimati o dichiarati |
| `provider_usage_json` | Usage provider normalizzato, senza contenuti |
| `estimated_cost_amount` | Deve restare 0 in V1 salvo decisione esplicita |
| `estimated_cost_currency` | EUR, USD o n/a |
| `quota_snapshot_before` | Se disponibile |
| `quota_snapshot_after` | Se disponibile |
| `quota_observability` | available, unavailable, delayed, manual |
| `source_reference_ids` | Fonti usate per costruire input |
| `redaction_policy_id` | Policy di redazione/minimizzazione |
| `minimization_summary` | Sintesi di cosa è stato incluso/escluso |
| `raw_input_storage_ref` | Null di default; solo storage controllato se necessario |
| `raw_output_storage_ref` | Storage controllato se serve audit tecnico |
| `parsed_output_ref` | Output strutturato validato |
| `status` | planned, queued, running, completed, completed_with_warnings, failed, suspended_quota, suspended_budget, blocked_policy, blocked_privacy, blocked_clauses |
| `error_class` | Quota, timeout, schema, provider, policy, altro |
| `error_message_redacted` | Messaggio senza contenuti riservati |
| `started_at` | Audit |
| `completed_at` | Audit |
| `latency_ms` | Latenza |

### AiProviderPolicySnapshot

Fotografa la policy provider usata per decidere.

Campi minimi:

| Campo | Note |
| --- | --- |
| `id` | Identificativo |
| `provider` | Provider |
| `policy_checked_at` | Data verifica |
| `policy_source_urls` | Fonti ufficiali consultate |
| `training_use_status` | yes_by_default, no_by_default, opt_out_available, unclear |
| `retention_status` | none_claimed, limited, abuse_monitoring, unclear |
| `data_region_status` | eu, global, us, configurable, unclear |
| `dpa_status` | available, unavailable, not_checked, not_applicable |
| `free_tier_notes` | Sintesi dei vincoli free |
| `allowed_privacy_levels` | L0, L1, L2 o blocco |
| `review_before_next_l1_l2` | Boolean |

### AiBudgetPolicy

Definisce limiti di costo e quota.

Campi minimi:

| Campo | Note |
| --- | --- |
| `id` | Identificativo |
| `tender_tender_id` | Spazio gara o null per policy globale |
| `provider` | Provider |
| `max_cost_per_call` | Default V1: 0 |
| `max_cost_per_day` | Default V1: 0 |
| `allow_paid_fallback` | Default V1: false |
| `require_manual_approval_above` | Default V1: 0 |
| `quota_check_required` | Boolean |
| `unknown_usage_policy` | suspend_batch, allow_single_test, block |

## Gate pre-flight

Ogni chiamata AI passa da questi controlli:

1. Classificare task e contenuto: L0, L1 o L2.
2. Verificare se il documento o lo Tender è marcato come non inviabile a provider esterni.
3. Cercare o recuperare lo stato delle clausole su riservatezza, AI, data processing, subprocessor e vendor esterni.
4. Verificare il provider policy snapshot più recente.
5. Verificare che il provider sia ammesso per il livello di sensibilità.
6. Minimizzare input: solo chunk necessari, niente pacchetti interi.
7. Redigere o anonimizzare se previsto.
8. Stimare consumo e costo.
9. Verificare quota gratuita, cap e assenza di fallback paid.
10. Richiedere approvazione umana se il gate la impone.
11. Eseguire la chiamata.
12. Validare formato/schema dell’output.
13. Creare `Extraction`, `ReviewItem` o stato di errore.
14. Salvare `AiCall` con hash, usage, stato e riferimenti fonte.

## Matrice provider V1

| Provider | Uso ammesso ora | L0 | L1 | L2 | Nota operativa |
| --- | --- | --- | --- | --- | --- |
| Gemini `gemini-2.5-flash-lite` | Primario T1 L0 | Ammesso | Da approvare | Bloccato | Su servizi gratuiti e account EEA/CH/UK la policy va letta con attenzione; per Paid Services Google dichiara trattamento diverso dei dati rispetto all’unpaid |
| Mistral `mistral-medium-3.5` | Secondario T1 L0 | Ammesso | Da approvare | Bloccato | Piano Experiment gratuito: input/output possono essere usati per training salvo opt-out; Scale è fuori dal vincolo free-first salvo diversa decisione |
| Cloudflare Workers AI | Micro-task L0 e fallback leggero | Ammesso su task piccoli | Da approvare | Bloccato | Buona postura data usage, ma benchmark T1 completo non passato |
| Groq | Sperimentale | Solo test | Bloccato | Bloccato | Non promosso su envelope Copenhagen completo |
| Cerebras | Sperimentale tecnico | Solo test | Bloccato | Bloccato | Qualità e privacy/DPA non chiuse |
| OpenRouter | Smoke test L0 | Solo test con modello pinned | Bloccato | Bloccato | Routing/provider sottostanti da verificare; evitare router generico per dati non banali |
| VPS/self-hosted | Fallback privacy-first | Ammesso | Ammesso se runbook ok | Possibile con approvazione | Richiede modello, risorse e runbook; accetta qualità e velocità inferiori |

## Regole per L1 e L2

L1 può essere abilitato solo quando:

- il pacchetto non vieta uso di provider esterni o subprocessor;
- il chunk è minimizzato;
- non ci sono dati personali non necessari;
- la policy provider consente il livello;
- il costo è bloccato;
- il primo uso del provider su quel pacchetto è approvato da un utente.

L2 resta bloccato verso provider esterni in V1, salvo decisione esplicita e documentata. Se serve analizzare L2, usare una delle tre strade:

- parsing deterministico locale;
- revisione umana;
- modello self-hosted su ambiente controllato, dopo runbook e approvazione.

## Stati di blocco

Stati minimi da mostrare nel prodotto:

- `blocked_policy`: policy provider non compatibile o non verificata;
- `blocked_privacy`: contenuto troppo sensibile;
- `blocked_clauses`: clausola gara o dubbio contrattuale non risolto;
- `suspended_quota`: quota gratuita finita o non verificabile;
- `suspended_budget`: costo potenziale non ammesso;
- `requires_human_approval`: l’AI può procedere solo dopo consenso utente;
- `completed_with_warnings`: output disponibile ma con warning su costo, usage, quota o confidenza.

## Logging e storage

Regola base: non loggare contenuti integrali nei log applicativi ordinari.

Salvare sempre:

- provider e modello;
- endpoint family;
- prompt/schema version;
- input hash e output hash;
- source reference;
- usage e costo stimato;
- quota se disponibile;
- stato del gate;
- motivazione del task;
- errori redatti.

Salvare raw input/output solo se serve audit tecnico, in storage controllato e con retention definita. Per la V1, il default deve essere hash più output strutturato, non dump completo.

## Fonti provider verificate

Le fonti provider sono variabili e vanno ricontrollate prima di L1/L2. Alla data del documento:

- Gemini API Terms: https://ai.google.dev/gemini-api/terms
- Mistral training policy: https://help.mistral.ai/en/articles/347617-do-you-use-my-user-data-to-train-your-artificial-intelligence-models
- Mistral Experiment plan: https://help.mistral.ai/en/articles/455206-how-can-i-try-the-api-for-free-with-the-experiment-plan
- Cloudflare Workers AI data usage: https://developers.cloudflare.com/workers-ai/platform/data-usage/
- Cloudflare Workers AI pricing: https://developers.cloudflare.com/workers-ai/platform/pricing/

Sintesi operativa:

- Gemini è forte su qualità T1 L0, ma il regime unpaid/paid e EEA va gestito prima di dati più sensibili.
- Mistral è forte come secondo provider, ma Experiment richiede opt-out/policy review prima di L1.
- Cloudflare ha una postura interessante sui dati, ma per ora non è sufficiente sull’envelope T1 completo.

## Impatti sui documenti TRAM

Questo documento aggiorna le decisioni di:

- data model: introdurre `AiGateDecision`, `AiCall`, `AiProviderPolicySnapshot`, `AiBudgetPolicy`;
- architettura: AI gateway come componente governato, non solo adapter tecnico;
- strategia AI: la scelta provider deve passare dalla matrice classi documentali x privacy level x provider;
- review workflow: output critici e gate bloccati generano review item o approvazioni utente.

La matrice operativa è documentata in:

- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-ai-document-class-provider-matrix-v0-1.md`

La policy di minimizzazione/redazione è documentata in:

- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-ai-chunk-minimization-redaction-policy-v0-1.md`

## Debiti da recuperare

- Estendere la policy di redazione e minimizzazione chunk a tutte le classi `dc_*`.
- Definire retention raw input/output per audit tecnico.
- Decidere se il primo schema DB materializzerà subito tutte le entità AI o se alcune partiranno come JSON audit dentro `AiCall`.
- Definire un micro-task Cloudflare solo se serve confermare il ruolo di fallback leggero.

## Prossimo passo consigliato

Applicare il registro AI/gate alle fixture future del workflow ingestion-dashboard, usando la data policy per spazio e il registro `indicator_key` P0/P1.

I prompt/schema pack e il registro operativo sono documentati in:

- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-free-ai-prompt-schema-pack-v0-3.md`
- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-free-ai-prompt-schema-pack-v0-4.md`
- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-indicator-key-registry-p0-p1-v0-1.md`
