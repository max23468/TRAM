# TRAM V1 - Specifica normalizzatori AI T4-T8 v0.1

Data: 2026-05-13
Stato: specifica operativa per MVP e benchmark
Ambito: normalizzatori deterministici post-AI per T4, T6, T7 e T8

## Scopo

Questo documento definisce come TRAM deve trasformare output AI non perfettamente aderenti allo schema in record applicativi controllati, citabili e review-first.

La decisione principale è: il normalizzatore non serve a “fidarsi di più” dell’AI. Serve a limitare l’AI a campi ammessi, ripristinare i valori deterministici, applicare gate privacy/review e impedire che un output formalmente buono diventi verità applicativa.

Questa specifica nasce dal benchmark provider T4-T8 v0.1:

- T4 passa con Mistral `mistral-medium-3.5` come pipeline normalizzata;
- T6 passa con Mistral `mistral-medium-3.5` come pipeline normalizzata;
- T7 non è promosso come task AI autonomo;
- T8 passa solo su subset L1/L0 con Mistral `mistral-small-2603` e normalizzatore human-first;
- T5 non resta fuori dai provider esterni per categoria: Financials è analizzabile su L0/L1 minimizzato e approvato, mentre L2 effettivo resta bloccato.

## Non obiettivi

I normalizzatori T4-T8 v0.1 non devono:

- leggere pacchetti completi;
- estrarre nuovi requisiti, KPI, financial item, contraddizioni o chiarimenti;
- inventare fonti o source refs;
- decidere quale fonte prevale;
- correggere sostanzialmente una formula, una soglia, una data, un importo o un requisito formale;
- validare un chiarimento o inviarlo;
- sostituire review queue e validazione utente.

Se il normalizzatore incontra un caso ambiguo o fuori schema, deve degradare a review o blocco, non forzare una soluzione.

## Contratto comune

Ogni normalizzatore riceve quattro input logici:

| Input | Origine | Uso |
| --- | --- | --- |
| `prompt_envelope` | parser/regole/gateway | Fonte dei valori deterministici e degli ID ammessi |
| `ai_output_raw` | provider AI o adapter | Output da validare e normalizzare |
| `route_decision` | AI gateway | Provider, modello, privacy, quota, policy e clausole |
| `normalizer_config` | versione applicativa | Enum, alias, gate review, soglie di confidenza |

Ogni normalizzatore produce cinque output logici:

| Output | Uso |
| --- | --- |
| `normalized_items` | Record candidati puliti per la pipeline |
| `dropped_fields` | Campi eliminati perché vietati o non affidabili |
| `normalization_warnings` | Avvisi auditabili |
| `review_items` | Decisioni da portare in review queue |
| `normalized_run_status` | Stato finale del run normalizzato |

## Ordine delle operazioni

L’ordine è vincolante:

1. validare JSON e `task_id`;
2. verificare `schema_version` e `dataset_id`;
3. rifiutare output che non contiene la collection attesa;
4. mappare alias noti della collection, per esempio `output` verso `items` o `cost_drivers`;
5. verificare corrispondenza uno a uno con gli ID dell’envelope;
6. rimuovere item non presenti nell’envelope;
7. creare warning per item mancanti;
8. rimuovere campi vietati;
9. normalizzare enum e alias;
10. ripristinare campi rule-owned dall’envelope;
11. applicare gate privacy e sensitivity;
12. applicare gate review;
13. calcolare stato e rischio per review queue;
14. salvare raw hash, normalized hash, dropped fields e warnings;
15. produrre record normalizzati e review item.

Un output normalizzato può passare anche quando il raw output non passa, ma solo se tutte le correzioni sono deterministiche e dichiarate.

## Stati normalizzati

| Stato | Significato |
| --- | --- |
| `normalized_pass` | Output completo e normalizzabile senza blocchi |
| `normalized_pass_with_warnings` | Output usabile, ma con warning non bloccanti |
| `partial_requires_review` | Output parziale o ambiguo, record creati solo come review |
| `blocked_privacy` | Privacy o clausole impediscono uso del provider esterno |
| `blocked_schema` | Schema non recuperabile in modo deterministico |
| `blocked_missing_items` | Mancano item attesi non recuperabili |
| `blocked_sensitive` | Contenuto L2 o strategico non gestibile da provider esterno |

## Ownership campi

Legenda:

- `AI-owned`: campo che l’AI può proporre.
- `Rule-owned`: campo che arriva da parser, regole o resolver e prevale sempre.
- `Review-owned`: campo che richiede conferma utente prima di consolidamento.
- `Normalizer-owned`: campo forzato dal normalizzatore per sicurezza, schema o policy.

### T4 requisiti O&M e KPI

| Campo | Ownership | Regola |
| --- | --- | --- |
| `item_id` | Rule-owned | Deve esistere nell’envelope |
| `item_type` | AI-owned con override | Se linkage economico, forzare `escalate_to_t5` |
| `text_or_name_normalized` | AI-owned | Ammesso se non riscrive il testo integrale |
| `requirement_family` | AI-owned | Enum canonico o `unknown` |
| `kpi_family` | AI-owned | Enum canonico o `unknown`; null se non KPI |
| `o_and_m_domain` | AI-owned | Enum canonico; `pricing_financial` scala a review/T5 |
| `impact_tags` | AI-owned con merge | Unire tag AI con tag rule-owned senza perdere `financial_escalation` |
| `linked_deliverable_ids` | Rule-owned | Ripristinare dall’envelope se presente |
| `criticality` | Review-owned con floor deterministico | AI può proporre, ma regole possono alzare |
| `review_required` | Normalizer-owned | Forzare true nei casi critici |
| `confidence` | AI-owned | Usare per priorità, non per consolidamento |
| `cluster_label` | AI-owned | Ammesso come label di supporto |
| `uncertainties` | AI-owned | Conservare se specifiche e utili |
| `requirement_text_raw` | Rule-owned | Non accettare dall’AI |
| `formula_raw` | Rule-owned | Non accettare dall’AI |
| `target_raw` | Rule-owned | Non accettare dall’AI |
| `threshold_raw` | Rule-owned | Non accettare dall’AI |
| `mandatory_candidate` | Rule-owned/Review-owned | Non accettare dall’AI |

#### Regole T4

Il normalizzatore T4 deve:

- accettare solo item con `item_id` presente in `input_items`;
- eliminare testo completo, formula, target, soglie, obbligatorietà e valori economici restituiti dall’AI;
- mappare enum non canonici su enum ufficiali solo se il mapping è esplicito;
- forzare `review_required=true` per mandatory, MR, KPI con formula, target, soglia, safety/security, cyber, AI/privacy, compliance critica e OCR incerto;
- forzare `impact_tags` a includere `financial_linked` se l’envelope o l’AI segnala payment, bonus/malus, deductions, penali o pricing;
- forzare `item_type=escalate_to_t5` se emerge contenuto economico sostanziale;
- non abbassare `criticality` sotto `high` quando un item è mandatory, compliance critica o economic-linked;
- creare `ReviewItem` per KPI con formule, mandatory critici e casi T5 che richiedono validazione.

#### Output applicativo T4

T4 può alimentare:

- `Requirement`;
- `KPI`;
- `Extraction`;
- `ReviewItem`;
- link verso `TenderDeliverable`;
- collegamento verso `FinancialItem`/T5 come contenuto analizzabile se ammesso dalla policy.

## T6 cost driver O&M

| Campo | Ownership | Regola |
| --- | --- | --- |
| `cost_driver_id` | Rule-owned | Deve esistere nell’envelope |
| `driver_family` | AI-owned | Enum canonico o `unknown` |
| `description_normalized` | AI-owned | Sintesi ammessa senza importi o strategia |
| `o_and_m_domain` | AI-owned | Enum canonico, con escalation se financial |
| `cost_confidence` | AI-owned con override | Se financial-linked, forzare `financial_linked_review` |
| `risk_level` | Review-owned con floor deterministico | AI può proporre, ma regole possono alzare |
| `linked_requirement_ids` | Rule-owned | Ripristinare dall’envelope |
| `linked_deliverable_ids` | Rule-owned | Ripristinare dall’envelope |
| `linked_kpi_ids` | Rule-owned | Ripristinare dall’envelope |
| `linked_financial_item_ids` | Rule-owned | Ripristinare dall’envelope, senza valori |
| `review_required` | Normalizer-owned | Forzare true per rischi e linkage sensibili |
| `confidence` | AI-owned | Segnale di priorità, non verità |
| `uncertainties` | AI-owned | Conservare se utili |
| importi, stime, unit rate, margini | Vietato | Eliminare sempre |

#### Regole T6

Il normalizzatore T6 deve:

- accettare solo driver con `cost_driver_id` presente in `input_cost_drivers`;
- ripristinare sempre link deterministici a requisiti, deliverable, KPI e financial item;
- eliminare importi, stime, unit rates, margini, prezzi e raccomandazioni economiche;
- ereditare il privacy level massimo dalle fonti collegate;
- bloccare provider esterno se il driver eredita `L2_sensitive` effettivo;
- forzare `review_required=true` per driver financial-linked, workforce, mobilisation, safety/security, compliance, asset condition, spares critici e rischio alto/critico;
- forzare `cost_confidence=financial_linked_review` quando esiste almeno un `linked_financial_item_id`;
- non abbassare `risk_level` sotto `high` per financial-linked, compliance critica o safety/security;
- creare `ReviewItem` quando il driver può impattare costi, risk allocation o dashboard headline.

#### Output applicativo T6

T6 può alimentare:

- `CostDriver`;
- `Extraction`;
- `ReviewItem`;
- link a `Requirement`, `KPI`, `TenderDeliverable` e `FinancialItem`.

Non può alimentare:

- importi offerta;
- stime economiche;
- pricing strategy;
- margini o sensitività economiche.

## T7 contraddizioni candidate

T7 è il task più delicato del gruppo: dopo il benchmark v0.1 nessun provider è promosso per decidere severity, action o review gate.

| Campo | Ownership | Regola |
| --- | --- | --- |
| `contradiction_id` | Rule-owned | Deve esistere nell’envelope |
| `issue_title` | AI-owned opzionale | Ammesso come titolo prudente |
| `issue_type` | Rule-owned con alias AI | La regola prevale; AI può suggerire solo se manca |
| `why_it_may_be_a_conflict` | AI-owned | Ammesso solo se prudente e citabile |
| `severity_candidate` | Rule-owned/Review-owned | Non consolidare da AI |
| `recommended_action` | Rule-owned/Review-owned | Non consolidare da AI |
| `review_required` | Normalizer-owned | Default true salvo falsi positivi a basso rischio |
| `confidence` | AI-owned | Solo informativo |
| `uncertainties` | AI-owned | Conservare se utili |
| `conflicting_values` | Rule-owned | Ripristinare dall’envelope |
| `documents_involved` | Rule-owned | Ripristinare dall’envelope |
| `source_refs` | Rule-owned | Ripristinare dall’envelope |
| valore finale prevalente | Vietato | Eliminare sempre |

#### Regole T7

Il normalizzatore T7 deve:

- accettare solo candidate con `contradiction_id` presente in `input_candidates`;
- ripristinare `conflicting_values`, `documents_involved`, `rule_reason`, privacy e source refs dall’envelope;
- non accettare dall’AI un valore finale, una fonte prevalente o una risoluzione definitiva;
- usare `candidate_type_hint` come base per `issue_type`, salvo alias deterministici più precisi;
- calcolare `severity_candidate` con regole locali, non dal modello;
- calcolare `recommended_action` con regole locali, non dal modello;
- forzare `review_required=true` per date mismatch, version conflict, obligation conflict, missing document, document list mismatch, legal reference mismatch, ambiguity su mandatory, KPI/formule e casi economici;
- consentire `review_required=false` solo per `not_a_conflict` o `parser_issue` a basso rischio prodotti da regole, non solo dall’AI;
- bloccare provider esterno se il caso eredita L2.

#### Regole iniziali severity T7

| Condizione | Severity minima |
| --- | --- |
| Payment, penali, valori economici, garanzie | `critical` |
| Deadline gara, submission, tender opening, BAFO | `critical` |
| Mandatory requirement, MR, compliance critica | `high` |
| KPI formula, target o deductions | `high` |
| Documento mancante essenziale | `high` |
| Ambiguità descrittiva non bloccante | `medium` |
| Parser issue isolato e non usato in dashboard | `low` |

#### Regole iniziali action T7

| Condizione | Azione |
| --- | --- |
| Candidate plausibile e impatto alto/critico | `review_and_consider_clarification` |
| Valore interno da aggiornare, senza chiarimento esterno | `review_and_update_value` |
| Evidenza insufficiente | `mark_as_missing_evidence` |
| Errore tecnico di parsing | `mark_as_parser_issue` |
| Falso positivo certo da regole | `dismiss_candidate` |
| Dubbio non urgente | `review_only` |

#### Output applicativo T7

T7 può alimentare:

- `ContradictionCandidate`;
- `ReviewItem`;
- seed per T8 solo dopo review o regola di plausibilità alta.

Non può alimentare:

- dato consolidato;
- source prevalente;
- chiarimento inviato;
- dashboard “validata” senza review.

## T8 chiarimenti/Q&A

T8 è sempre human-first. Il normalizzatore deve impedire che una bozza diventi approvata o inviabile senza utente.

Nota compatibilità: i benchmark v0.1 salvati in `data/working/t8-query-draft-compact-v0-1/` possono usare ancora `query_draft_id`. Il normalizzatore deve mapparlo a `clarification_thread_id` senza cambiare il significato applicativo.

| Campo | Ownership | Regola |
| --- | --- | --- |
| `clarification_thread_id` | Rule-owned | Deve esistere nell’envelope |
| `linked_contradiction_id` | Rule-owned | Ripristinare dall’envelope |
| `subject` | AI-owned/template-owned | Ammesso se neutro e citabile |
| `question_draft` | AI-owned/template-owned | Ammesso solo se supportato da fatti |
| `facts_cited` | Rule-owned con formatting AI | Deve derivare da `facts_to_cite` |
| `requested_clarification` | AI-owned/template-owned | Ammesso se coerente con hint |
| `tone` | AI-owned con enum | Se dubbio, `needs_user_tone_review` |
| `human_approval_required` | Normalizer-owned | Sempre true |
| `status` | Normalizer-owned | Mai approvato o inviato |
| `confidence` | AI-owned | Solo informativo |
| `uncertainties` | AI-owned | Conservare se utili |
| strategia interna | Vietato | Eliminare o bloccare |

#### Regole T8

Il normalizzatore T8 deve:

- accettare solo bozze con `clarification_thread_id` presente nell’envelope;
- forzare sempre `human_approval_required=true`;
- impedire stati equivalenti a `approved`, `sent`, `ready_to_send` o `approved_for_export`;
- forzare `status=blocked_sensitive` se `privacy_level_effective=L2_sensitive` e il provider è esterno;
- forzare `status=do_not_send` se la fonte è debole, il caso è parser issue, la questione è già superata o la bozza rivelerebbe strategia interna;
- rimuovere affermazioni non presenti in `facts_to_cite`;
- rimuovere tono accusatorio o trasformarlo in `needs_more_review`;
- rimuovere riferimenti a strategia d’offerta, pricing interno, margini, stime, note private o valutazioni non destinate alla stazione appaltante;
- preservare solo testo professionale, neutro e citato.

#### Regole status T8

| Condizione | Status normalizzato |
| --- | --- |
| Fonte L2 o chiarimento strategico su provider esterno | `blocked_sensitive` |
| Evidenza debole o non verificata | `needs_more_review` |
| Parser issue o falso positivo probabile | `do_not_send` |
| Contraddizione plausibile e fonti citabili | `draft_for_review` |
| Tono non recuperabile automaticamente | `needs_more_review` |

#### Output applicativo T8

T8 può alimentare:

- `ClarificationThread`;
- `ReviewItem` famiglia `clarifications`;
- export futuro solo dopo `ValidationAction` umana.

Non può alimentare:

- invio automatico;
- approvazione automatica;
- testo esterno senza review;
- chiarimenti su contenuti L2 verso provider esterno.

## Alias iniziali ammessi

Il normalizzatore può correggere solo alias espliciti e auditabili.

| Task | Alias raw | Valore canonico |
| --- | --- | --- |
| T4 | collection `output` | `items` |
| T6 | collection `output` | `cost_drivers` |
| T6 | `IT_systems`, `it_systems`, `IT` | `IT_systems` |
| T7 | `legal_reference` | `legal_reference_mismatch` |
| T7 | `missing_evidence` | `missing_document` solo se manca un documento; altrimenti `unknown` |
| T8 | `ready_for_review` | `draft_for_review` |
| T8 | `approved`, `sent`, `ready_to_send` | blocco a `needs_more_review` o `blocked_sensitive` secondo policy |

Ogni alias applicato deve generare `normalization_warnings`.

## Review item generati

Mapping iniziale verso `ReviewItem`:

| Task | Family | Risk minimo | Blocking |
| --- | --- | --- | --- |
| T4 mandatory/MR | `requirements` | `high` | true |
| T4 KPI con formula/target | `KPI` | `critical` se economic-linked, altrimenti `high` | true |
| T4 financial escalation | `financials` | `critical` | true |
| T6 financial-linked | `financials` | `critical` | true |
| T6 high/critical cost driver | `requirements` o `financials` | `high` | true se dashboard headline |
| T7 issue plausibile | `contradictions` | severity calcolata | true se high/critical |
| T8 bozza chiarimento | `clarifications` | `critical` | true |
| T8 blocked/do_not_send | `clarifications` | `medium` o `high` | false salvo rischio critico |

`automation_source` deve essere:

- `rule_based` quando il valore deriva dal normalizzatore o da regole;
- `ai_reasoning` solo per testo di supporto, cluster, descrizioni e incertezze;
- mai `ai_extraction` per valori rule-owned.

## Audit minimo

Ogni run normalizzato deve salvare:

- `task_id`;
- `normalizer_version`;
- `prompt_pack_id`;
- `schema_pack_id`;
- `provider`;
- `model`;
- `ai_call_id`;
- `input_hash`;
- `raw_output_hash`;
- `normalized_output_hash`;
- `dropped_fields`;
- `alias_mappings_applied`;
- `review_forces_applied`;
- `blocked_reason_codes`;
- `created_review_item_ids`.

## Criteri di accettazione benchmark

Un normalizzatore passa il benchmark compatto se:

1. restituisce tutti e soli gli ID attesi;
2. non conserva campi vietati;
3. ripristina tutti i campi rule-owned;
4. applica review gate obbligatori;
5. blocca L2 effettivo verso provider esterni;
6. produce warning per ogni correzione non banale;
7. non degrada severity/risk sotto i floor deterministici;
8. non crea chiarimenti approvati o inviabili;
9. mantiene source refs e link auditabili;
10. produce output JSON stabile e confrontabile.

## Impatto sulla pipeline MVP

Ordine raccomandato per implementazione futura:

1. `NormalizerCore`: validazione schema, ID, alias collection, dropped fields e audit.
2. `T4RequirementKpiNormalizer`.
3. `T6CostDriverNormalizer`.
4. `T8ClarificationNormalizer`.
5. `T7ContradictionNormalizer`, ma con severity/action rule-owned.
6. Generazione `ReviewItem`.
7. Collegamento al registro `AiCall`.
8. Test fixture sui benchmark compatti T4-T8.

## Debiti

- Definire mapping enum completo per alias provider reali.
- Config JSON v0.1 creato in `/Users/Matteo/Documents/TRAM/data/config/tram-v1-normalizer-config-t4-t8-v0-1.json`.
- Specifica fixture test v0.1 creata in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-ai-normalizer-fixture-test-spec-t4-t8-v0-1.md`.
- Sede runtime decisa nell’ADR `/Users/Matteo/Documents/TRAM/docs/decisions/tram-adr-001-normalizer-runtime-placement-v0-1.md`: TypeScript canonico lato app/API/AI gateway, config condiviso, Python non canonico.
- Collegare questa specifica al futuro `AiRouteDecision`.
- Creare harness di test che riesegue benchmark raw, normalizzazione e diff baseline.
- Estendere la specifica anche a T2 e T3, che già usano lo stesso principio.
- Definire policy UI per mostrare warning di normalizzazione all’utente senza creare rumore.

## Prossimo passo consigliato

Usare il registro `indicator_key` P0/P1, il primo slice UI e il workflow ingestion-dashboard per definire fixture applicative minime dei normalizzatori T4-T8.
