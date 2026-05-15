# TRAM V1 - Specifiche operative T2 timeline e T3 deliverable v0.1

Data: 2026-05-13  
Stato: decisione operativa iniziale  
Ambito: task T2 e T3, parser/regole, AI minimizzata, review queue e dashboard MVP

## Scopo

Questo documento trasforma i prompt/schema pack T2 e T3 in specifiche operative di prodotto.

I prompt pack restano la specifica di envelope AI:

- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-free-ai-prompt-schema-pack-t2-timeline-v0-1.md`
- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-free-ai-prompt-schema-pack-t3-deliverables-v0-1.md`

Questo documento dice invece come T2 e T3 entrano nel workflow MVP, nella review queue e nella dashboard.

## Decisione comune

T2 e T3 sono task **parser/rules-first con AI minimizzata**.

L’AI può aiutare su:

- nome normalizzato;
- categoria;
- dominio O&M;
- dipendenze;
- incertezze leggibili.

L’AI non consolida:

- date;
- orari;
- durate;
- timezone;
- obbligatorietà;
- limiti pagina;
- formati richiesti;
- pesi o punteggi;
- valori economici;
- checklist finale.

## T2 - Timeline gara/contratto

### Obiettivo

Costruire una timeline verificabile di:

- procurement;
- chiarimenti;
- negotiation/revised tender/BAFO;
- standstill/award/signing;
- mobilitazione;
- Start of Operation;
- durata e opzioni;
- milestone contrattuali;
- eventi condizionati o relativi.

### Fonti tipiche

| Fonte | Parser/regola |
| --- | --- |
| Instructions to Tender/Negotiate | estrazione date e deadline da testo/tabelle |
| Procurement Schedule PDF | estrazione tabelle e date |
| MPP | MPXJ, righe attività, date start/end, milestone |
| Contract conditions | commencement, duration, extension, handover |
| Clarifications/addendum | aggiornamenti a date precedenti |
| PQQ/PQP | scadenze prequalifica e fase successiva |
| Timetable allegati | solo se rilevante per operations/servizio, non per submission |

### Campi deterministici

Questi campi sono prodotti da parser/regole, non da AI:

- `date_start`;
- `date_end`;
- `time`;
- `timezone`;
- `duration`;
- `date_precision`;
- `is_window`;
- `is_relative`;
- `condition`;
- `source_refs`;
- `conflict_group_id`;
- `review_required` base;
- `criticality` base se regola chiara.

### Campi AI ammessi

- `event_name_normalized`;
- `timeline_type`;
- `event_type`;
- `semantic_role`;
- `uncertainties`;
- `dependency_hint`;

### Event type iniziali

| Enum | Uso |
| --- | --- |
| `submission_deadline` | consegna offerta/domanda |
| `clarification_deadline` | termine quesiti |
| `clarification_response` | risposta stazione appaltante |
| `negotiation_meeting` | meeting/negoziazione |
| `revised_tender` | revised tender/second revised tender |
| `bafo` | best and final offer |
| `opening` | apertura offerte |
| `award` | aggiudicazione |
| `standstill` | standstill |
| `contract_signing` | firma contratto |
| `mobilisation_start` | inizio mobilitazione |
| `service_start` | avvio servizio |
| `operation_period` | periodo operativo |
| `extension_option` | opzione estensione |
| `handover` | handover/demobilitazione |
| `other` | fallback con review se P0 |

### Timeline type iniziali

- `procurement`;
- `contract`;
- `mobilisation`;
- `operation`;
- `handover`;
- `clarification`;
- `prequalification`;
- `other`.

### Review gate T2

Generare review obbligatoria se:

- due fonti danno date diverse;
- la data è relativa e incide su scadenza critica;
- la milestone è P0;
- MPP e PDF schedule divergono;
- addendum o chiarimenti modificano una data già validata;
- timezone o ora non sono chiari;
- il parser non sa distinguere data evento da data pubblicazione documento;
- la data alimenta T8 chiarimenti/Q&A.

### Output dashboard

T2 alimenta:

- `procurement.deadline.next_critical`;
- `procurement.deadline.questions`;
- `procurement.deadline.submission`;
- `procurement.timeline.standstill`;
- `procurement.timeline.negotiation_events`;
- `contract.duration.base`;
- `contract.duration.extension_options`;
- `contract.mobilisation.start`;
- `contract.operation.start`;
- `contract.operation.end`;
- `contradictions.timeline_count`.

### Casi benchmark da preservare

Il benchmark compatto ha già identificato tre casi critici:

- Copenhagen: MPP e PDF divergono su opening revised tenders;
- Copenhagen: MPP e PDF divergono su second revised tenders;
- Milano: chiarimenti “almeno trenta giorni prima” ma data uguale alla submission deadline.

Questi casi sono fixture concettuali MVP per review timeline.

## T3 - Deliverable di gara

### Obiettivo

Costruire una checklist verificabile dei deliverable richiesti:

- amministrativi;
- tecnici;
- economici/finanziari;
- qualification/prequalification;
- form e dichiarazioni;
- piani O&M;
- modelli/workbook;
- allegati e template;
- dipendenze e scadenze.

### Fonti tipiche

| Fonte | Parser/regola |
| --- | --- |
| Instructions to Tender/Negotiate | submission requirements, form, page limits |
| PQQ/PQP | qualification envelope, capability evidence |
| Disciplinare di gara | buste, documentazione amministrativa, tecnica, economica |
| Schedule of Prices / PEF | presenza e metadati, non valori verso AI |
| Appendici e template | form, dichiarazioni, CV, subcontractors |
| Criteri di valutazione | pesi e sezioni, parser/review |
| Timeline T2 | deadline_ref e dipendenze |

### Campi deterministici

Questi campi sono prodotti da parser/regole, non da AI:

- `code`;
- `name_raw`;
- `mandatory`;
- `page_limit`;
- `format_requirement`;
- `submission_area_raw`;
- `evaluation_weight`;
- `max_marks`;
- `deadline_ref`;
- `source_refs`;
- `sensitive_flag`;
- `review_required` base.

### Campi AI ammessi

- `name_normalized`;
- `deliverable_type`;
- `submission_area`;
- `o_and_m_domain`;
- `dependencies`;
- `uncertainties`;
- `criticality_hint`.

`criticality_hint` non può chiudere review e non può sostituire le regole.

### Deliverable type iniziali

| Enum | Uso |
| --- | --- |
| `form` | form di gara o dichiarazione |
| `pricing_workbook` | schedule of prices, offerta economica, workbook |
| `financial_model` | PEF o modello finanziario |
| `technical_methodology` | relazione/metodologia tecnica |
| `operations_plan` | operation/service plan |
| `maintenance_plan` | maintenance/asset plan |
| `staffing_plan` | staff, key persons, CV |
| `compliance_declaration` | dichiarazioni compliance/sanzioni |
| `qualification_evidence` | PQ/PQP evidence, reference projects |
| `subcontractor_list` | elenco subcontractor |
| `comments_to_tender_documents` | comments/queries/comments appendix, cioè scambi di chiarimenti |
| `other` | fallback con review se mandatory |

### Submission area iniziali

- `administrative`;
- `technical`;
- `financial`;
- `qualification`;
- `legal`;
- `compliance`;
- `pricing`;
- `other`.

### Review gate T3

Generare review obbligatoria se:

- deliverable economico o finanziario;
- PEF, pricing workbook o schedule of prices;
- deliverable valutativo con peso/punteggio;
- page limit o formato non chiaro;
- obbligatorietà non chiara;
- deadline collegata a T2 non validata;
- deliverable tecnico critico per O&M;
- dati personali/CV/key persons;
- chiarimenti/Q&A o commenti a documenti tender;
- deliverable varia tra lotti o combinazioni.

### Output dashboard

T3 alimenta:

- `deliverables.total_count`;
- `deliverables.mandatory_count`;
- `deliverables.next_due`;
- `financial.model.required`;
- `procurement.evaluation.model_summary`;
- `procurement.evaluation.quality_weight`;
- `procurement.evaluation.price_weight`;
- review item collegati.

### Casi benchmark da preservare

Il benchmark compatto ha identificato otto deliverable con review obbligatoria:

- Copenhagen schedule of prices;
- Copenhagen comments to tender documents;
- Luas maintenance plan;
- Luas infrastructure maintenance plan;
- Milano offerta tecnica;
- Milano offerta economica;
- Milano PEF;
- Milano offerta/PEF combinatoria.

Questi casi sono fixture concettuali MVP per review deliverable.

## Collegamento T2-T3

T2 e T3 devono parlarsi:

- un deliverable può avere `deadline_ref` verso evento T2;
- un evento T2 può mostrare deliverable collegati;
- se la deadline T2 è `unclear`, il deliverable resta non confermato;
- se un addendum cambia una deadline, i deliverable collegati diventano stale;
- un thread di chiarimento T8 può nascere da deliverable obbligatorio con deadline o requisiti contraddittori.

## Requisiti UI

### Timeline

La UI deve mostrare:

- vista lista e vista timeline;
- evento;
- data o intervallo;
- precisione;
- fonte;
- stato review;
- conflitti fonte;
- deliverable collegati.

### Deliverable

La UI deve mostrare:

- checklist;
- area submission;
- mandatory;
- formato;
- page limit;
- deadline;
- stato review;
- fonte;
- dipendenze;
- badge sensibile.

## Acceptance criteria T2

T2 è implementabile quando:

- parser e regole estraggono valori temporali senza AI;
- AI non restituisce campi temporali vietati;
- conflitti generano review item;
- eventi P0 alimentano indicatori P0;
- MPP e PDF possono essere confrontati almeno come fonte separata;
- dashboard non mostra una data unica se esiste conflitto aperto.

## Acceptance criteria T3

T3 è implementabile quando:

- parser/regole individuano deliverable candidati;
- obbligatorietà, limiti, formati, pesi e deadline restano deterministici;
- AI normalizza solo campi ammessi;
- deliverable economici/finanziari sono L2 o review-first;
- checklist mostra fonte e stato;
- deliverable collegati a date non validate restano da review.

## Debiti

- Definire parser dedicato per tabelle deliverable nei diversi formati.
- Definire parser MPP robusto e confronto MPP/PDF.
- Definire modello grafico timeline.
- Definire come rappresentare lotti e combinazioni Milano.
- Estendere fixture T2/T3 oltre il dataset compatto prima del codice completo.

## Prossimo passo consigliato

Consolidare in un unico report lo stato benchmark sui quattro pacchetti, così T1-T8, dashboard e routing AI hanno una baseline comune prima dello sviluppo.
