# TRAM V1 - Policy minimizzazione e redazione chunk AI v0.1

Data: 2026-05-13
Stato: proposta operativa V1, da usare come base per prompt, gate e worker
Ambito: AI gateway, chunking, redazione, provider esterni, self-hosted, review umana

## Scopo

Questo documento definisce cosa può entrare in un prompt AI, cosa deve restare fuori e quando un chunk deve essere bloccato, redatto o inviato solo a un modello locale/self-hosted.

La policy applica tre principi TRAM:

- nessun pacchetto completo a un LLM;
- output AI sempre evidence-first e human-in-the-loop;
- input minimizzato in base al task, non in base alla comodità tecnica.

La policy parte da tre casi pilota:

1. classificazione documentale `L0`;
2. requisiti O&M `L1`;
3. payment mechanism `L1` se estratto da Tender e minimizzato, `L2` solo se contiene dati interni/offerta, dati personali, clausole incompatibili o payload non isolabile.

## Fonti e criteri

Questa non è una valutazione legale definitiva. È una policy tecnica prudenziale per TRAM V1.

Fonti e riferimenti:

- GDPR, art. 5, principio di data minimisation: https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32016R0679
- Gemini API Terms: https://ai.google.dev/gemini-api/terms
- Mistral training policy: https://help.mistral.ai/en/articles/347617-do-you-use-my-user-data-to-train-your-artificial-intelligence-models
- Mistral Experiment plan: https://help.mistral.ai/en/articles/455206-how-can-i-try-the-api-for-free-with-the-experiment-plan
- Cloudflare Workers AI data usage: https://developers.cloudflare.com/workers-ai/platform/data-usage/
- Groq data policy: https://console.groq.com/docs/your-data
- OpenRouter ZDR: https://openrouter.ai/docs/guides/features/zdr
- OpenRouter provider logging: https://openrouter.ai/docs/guides/privacy/provider-logging
- Cerebras privacy policy: https://www.cerebras.ai/privacy-policy

## Definizioni

| Termine | Significato TRAM |
| --- | --- |
| `chunk` | Unità minima di contenuto candidata a un task AI |
| `prompt envelope` | Oggetto completo inviato al provider: istruzioni, schema, metadati, chunk e source refs |
| `source reference` | Riferimento verificabile a documento, versione, pagina, sezione, tabella o cella |
| `redazione` | Rimozione o mascheramento irreversibile di dati non necessari |
| `pseudonimizzazione` | Sostituzione stabile di un dato con un token interno, utile per collegare elementi senza rivelarli |
| `minimization_summary` | Sintesi auditabile di cosa è stato incluso, escluso e perché |
| `redaction_policy_id` | Identificativo della policy applicata al chunk |

## Regole generali

1. Ogni chunk deve avere un solo task primario.
2. Il chunk deve contenere solo il minimo necessario per quel task.
3. Ogni chunk deve avere almeno una `SourceReference`.
4. Ogni prompt deve includere source refs, non documenti interi.
5. Ogni prompt deve dichiarare `content_classes`, privacy level e provider candidato.
6. Se il chunk contiene dati L2, provider esterni bloccati in V1.
7. Se il chunk contiene dati personali non necessari, il chunk va redatto o bloccato.
8. Se la redazione elimina informazioni essenziali, il task va spostato su review umana o self-hosted.
9. Non loggare raw prompt o raw output in log applicativi ordinari.
10. Salvare hash input/output, usage, provider, modello, prompt version, schema version e minimization summary.

## Cosa non deve entrare nei prompt esterni V1

Verso provider esterni non devono entrare:

- pacchetti completi;
- documenti integrali;
- workbook Excel completi;
- `.mpp` completi;
- allegati tecnici completi se contengono mappe, disegni o confini sensibili;
- dati personali non necessari;
- CV, nominativi, email, telefoni, firme, indirizzi o certificazioni individuali;
- workbook completi, sheet completi, dati interni/offerta, assunzioni economiche interne o formule economiche non isolate/minimizzate;
- bonus/malus, deductions, penali, garanzie o cap economici;
- clausole su AI, data protection, riservatezza, subprocessor o vendor esterni;
- cyber/security dettagliata, access control o incident response;
- note interne, valutazioni strategiche dell’utente o feedback non destinato a terzi;
- chiarimento pronto per invio esterno.

## Redazione minima

### Dati personali

Redigere o sostituire con token:

- nomi e cognomi non necessari;
- email;
- numeri di telefono;
- indirizzi fisici;
- firme;
- CV o biografie individuali;
- matricole, identificativi personali o certificazioni personali.

Esempio:

| Prima | Dopo |
| --- | --- |
| `Mario Rossi, Project Director, mario.rossi@example.com` | `[PERSON_1], Project Director, [EMAIL_1]` |

### Dati economici

Per provider esterni V1, non redigere semplicemente: bloccare o spostare locale/self-hosted.

Motivo: Financials deve essere analizzabile, ma non tramite dump completi. Meglio isolare chunk, tabelle o clausole con source refs e bloccare solo ciò che resta L2 effettivo.

### Clausole critiche

Clausole su claims, termination, step-in, indemnity, AI, data protection, security e confidentiality restano L2 se il task richiede interpretazione o sintesi sostanziale.

Possono essere usati solo metadati L0, per esempio:

- documento contiene sezione `Artificial Intelligence`;
- documento contiene appendice `Data Processing Agreement`;
- clausola da analizzare localmente.

## Policy pilota 1 - Classificazione documentale L0

### Obiettivo

Classificare documento, fase pacchetto, natura, ruolo, versione e stato corrente/superato.

Classi tipiche:

- `dc_file_metadata`;
- `dc_document_classification`;
- `dc_public_procurement_metadata`;
- `dc_document_map_versioning` quando usa solo metadati.

### Input ammesso

Verso provider esterni può entrare:

- nome file normalizzato;
- estensione, mime type, page count, file size bucket;
- path logico ridotto, senza path macchina completo se non serve;
- titolo rilevato;
- document ID;
- version label;
- issue date;
- intestazioni principali;
- indice o table of contents ridotto;
- prime righe del front matter solo se non contengono dati personali o pricing;
- lista di documenti collegati senza contenuto.

### Input vietato

Non includere:

- corpo completo del documento;
- capitoli sostanziali;
- allegati completi;
- prezzi;
- CV o nominativi;
- clausole contrattuali lunghe;
- dettagli cyber/security;
- path locale completo se contiene informazioni non necessarie.

### Limiti consigliati

| Campo | Limite V1 |
| --- | --- |
| `metadata_items` | tutti quelli tecnici necessari |
| `heading_count` | massimo 40 heading |
| `toc_excerpt_chars` | massimo 4.000 caratteri |
| `front_matter_excerpt_chars` | massimo 1.500 caratteri |
| `source_refs` | almeno 1, preferibilmente 2 se il documento ha versioni |

### Provider ammessi

- Gemini: ammesso;
- Mistral: ammesso;
- Cloudflare: solo micro-task o controllo secondario;
- Groq/Cerebras/OpenRouter: solo smoke test;
- self-hosted: ammesso.

### Output atteso

Output strutturato:

- `package_phase`;
- `document_nature`;
- `document_role`;
- `version_label`;
- `currentness`;
- `evidence`;
- `confidence`;
- `needs_review`.

### Blocco automatico

Bloccare o degradare a locale se:

- il front matter contiene dati personali non redigibili;
- il documento è marcato non inviabile;
- il titolo o indice rivela contenuti L2 che non servono alla classificazione;
- la clausola del pacchetto vieta provider esterni.

## Policy pilota 2 - Requisiti O&M L1

### Obiettivo

Estrarre obblighi e requisiti O&M, classificarli e collegarli a cost driver, deliverable, KPI o review item.

Classi tipiche:

- `dc_general_requirements`;
- `dc_operations_requirements`;
- `dc_maintenance_asset_requirements`;
- `dc_submission_deliverables`;
- `dc_kpi_non_financial`;
- `dc_compliance_standard` se non sensibile.

### Input ammesso

Verso provider esterni può entrare solo dopo gate L1:

- clause id;
- heading e subheading;
- paragrafo del requisito;
- massimo un paragrafo precedente e uno successivo se necessari al contesto;
- definizioni strettamente necessarie;
- tabella requisito isolata;
- source reference completa;
- metadati documento: titolo, versione, currentness.

### Input vietato

Non includere:

- intere sezioni lunghe;
- capitoli completi;
- appendici complete;
- importi, unit rates o formule di pagamento;
- bonus/malus e deductions;
- dati personali;
- dettagli cyber/security;
- clausole data protection/AI/subprocessor;
- note interne o commenti utente.

### Limiti consigliati

| Campo | Limite V1 |
| --- | --- |
| `requirement_excerpt_chars` | massimo 3.000 caratteri per requisito |
| `context_before_after` | massimo 1 paragrafo prima e 1 dopo |
| `definitions` | massimo 5 definizioni mirate |
| `requirements_per_call` | massimo 5 requisiti omogenei |
| `source_refs` | obbligatorie per ogni requisito |

### Provider ammessi

- Gemini: richiede policy provider aggiornata, clausole pacchetto ok e primo uso approvato;
- Mistral: richiede opt-out training o base privacy equivalente, clausole pacchetto ok e primo uso approvato;
- Cloudflare: solo micro-task su classificazioni semplici, non estrazione massiva;
- Groq/Cerebras/OpenRouter: bloccati per uso operativo L1;
- self-hosted: ammesso se runbook ok.

### Output atteso

Output strutturato:

- `requirement_text`;
- `requirement_type`;
- `owner`;
- `action`;
- `object`;
- `frequency`;
- `deadline`;
- `linked_deliverable`;
- `linked_kpi`;
- `cost_driver_candidate`;
- `risk_class`;
- `source_refs`;
- `confidence`;
- `review_required`.

### Escalation a L2

Scalare a L2 se il requisito o item contiene:

- importi o formule economiche;
- bonus/malus o deductions;
- penali;
- claim, termination, step-in o indemnity;
- dati personali;
- cyber/security dettagliata;
- AI/data processing/subprocessor;
- contenuto marcato confidential/non-disclosable.

## Policy pilota 3 - Financials/payment analizzabile con gate

### Obiettivo

Analizzare payment mechanism, pricing structure, deductions, bonus/malus, indexation, caps, penalties e garanzie.

Classi tipiche:

- `dc_payment_mechanism`;
- `dc_financials_pricing`;
- `dc_kpi_financial_linked`;
- `dc_penalties_guarantees`;
- `dc_risk_allocation_contract` quando collegata al payment.

### Regola V1

Provider esterni ammessi su L0/L1 minimizzato e approvato. L2 effettivo bloccato verso provider esterni.

La V1 può usare:

- parser locale;
- Excel parser locale;
- estrazione tabelle locale;
- review umana;
- modello self-hosted solo dopo runbook approvato.

### Input ammesso a provider esterni

Solo metadati L0, se servono a classificare il documento:

- titolo documento;
- nome allegato;
- presenza di `Payment Attachment`;
- presenza di tab `Schedule of Prices`;
- file type;
- version label.

Inviare solo testo sostanziale minimizzato e necessario del payment mechanism, con source refs e senza workbook/sheet completi.

### Input ammesso a locale/self-hosted

Se esiste runbook e storage controllato:

- clause id;
- tabella o cella;
- formule Excel;
- importi;
- currency;
- indexation;
- deduction formula;
- bonus/malus link;
- source refs.

### Output atteso

Output strutturato, sempre da review:

- payment component;
- formula;
- frequency;
- trigger;
- exclusions;
- cap/collar;
- affected KPI;
- affected service area;
- pricing sheet reference;
- risk class;
- source refs;
- review_required = true.

### Blocco automatico

Bloccare provider esterno se il chunk contiene:

- importi;
- formule;
- prezzo unitario;
- tabella prezzi;
- deduction;
- bonus/malus;
- cap/collar;
- garanzia;
- payment frequency collegata a importi;
- valutazioni economiche dell’utente.

## Prompt envelope minimo

Ogni prompt AI deve essere costruito con questo envelope logico:

| Campo | Regola |
| --- | --- |
| `task_id` | Obbligatorio |
| `content_classes` | Obbligatorio, valori `dc_*` |
| `privacy_level` | Obbligatorio |
| `provider_candidate` | Obbligatorio |
| `prompt_version` | Obbligatorio |
| `schema_version` | Obbligatorio |
| `source_refs` | Obbligatorie |
| `input_chunks` | Minimi e già redatti |
| `excluded_content_summary` | Obbligatorio se qualcosa è stato escluso |
| `redaction_policy_id` | Obbligatorio |
| `minimization_summary` | Obbligatorio |

## `minimization_summary`

Ogni `AiCall` deve salvare una sintesi come:

```json
{
  "redaction_policy_id": "tram-ai-min-v0-1-l1-requirements",
  "included": [
    "clause_id",
    "heading",
    "requirement_paragraph",
    "source_reference"
  ],
  "excluded": [
    "pricing_tables",
    "personal_names",
    "unrelated_sections"
  ],
  "reason": "Task limited to O&M requirement extraction; pricing and personal data are not needed.",
  "escalation": "none"
}
```

Per dati L2 bloccati:

```json
{
  "redaction_policy_id": "tram-ai-min-v0-1-l2-payment",
  "included": [
    "document_title",
    "version_label",
    "source_reference"
  ],
  "excluded": [
    "payment_formula",
    "unit_prices",
    "deductions"
  ],
  "reason": "Payment mechanism chunk is L2 effective or not minimizable for external providers.",
  "escalation": "local_only_or_human_review"
}
```

## Stati generati dalla policy

La policy può produrre:

- `allowed_minimized`: prompt ammesso;
- `allowed_redacted`: prompt ammesso dopo redazione;
- `requires_human_approval`: primo uso L1 o contenuto ambiguo;
- `requires_policy_review`: provider o clausola non chiara;
- `blocked_privacy`: contenuto L2 o dati personali non necessari;
- `blocked_clauses`: clausola gara ostativa o non risolta;
- `local_only`: analisi ammessa solo locale/self-hosted;
- `human_only`: analisi solo umana.

## Impatti sui documenti TRAM

Questa policy completa:

- matrice provider/classi documentali;
- registro `AiCall`;
- gate `AiGateDecision`;
- prompt/schema pack;
- review queue critical-first.

Documenti collegati:

- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-ai-document-class-provider-matrix-v0-1.md`
- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-ai-call-registry-and-gates-v0-1.md`
- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-free-ai-prompt-schema-pack-v0-2.md`
- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-free-ai-prompt-schema-pack-v0-3.md`
- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-review-queue-design.md`

## Debiti da recuperare

- Definire policy specifica per immagini, mappe e OCR tecnico.
- Definire retention raw input/output per L1 e self-hosted L2.
- Definire pattern automatici di rilevamento PII e contenuti L2.
- Definire schema JSON tecnico del prompt envelope.
- Decidere se creare un documento separato per `redaction_policy_id` versionati.

## Prossimo passo consigliato

Applicare questa policy alle fixture future del workflow ingestion-dashboard, in particolare a T2/T3 L1 minimizzati, T5 Financials L0/L1 analizzabili e T8 human-first; bloccare verso provider esterni solo L2 effettivo.
