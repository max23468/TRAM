# Copenhagen M1-M4 O&M - Dataset benchmark AI gratuito L0/L1

Data: 2026-05-13
Stato: dataset operativo v0.1 per benchmark AI gratuito, senza chiamate a provider
Pacchetto locale: `/Users/Matteo/Documents/TRAM/data/packages/copenhagen-m1-m4-om/`

## Scopo

Questo documento prepara il primo dataset benchmark per testare, in modo controllato, se e come l’AI gratuita può supportare TRAM V1.

Il dataset è costruito su Copenhagen M1-M4 O&M perché:

- il pacchetto è un ITT O&M reale o rappresentativo;
- contiene PDF, DOCX, XLSX e MPP;
- include versioni, track changes, schedule, KPI, payment, allegati tecnici e condizioni contrattuali;
- esiste già una griglia TRAM compilata manualmente da usare come riferimento.

Questo documento non esegue alcuna chiamata AI e non sceglie ancora il provider. Serve a definire un campione piccolo, tracciabile e ripetibile.

## Regole del dataset

- Non inviare pacchetti completi a un provider AI.
- Usare solo titoli, metadati, righe minimizzate e riferimenti fonte.
- Separare sempre dato atteso, fonte e incertezza.
- Considerare ogni output AI come proposta, non come verità.
- Ogni contraddizione è una candidata da validare, non un errore certo.
- Ogni query draft richiede approvazione umana prima di uso esterno.

## Livelli privacy

| Livello | Uso in questo dataset | Regola |
| --- | --- | --- |
| L0 | filename, path, tipo file, ruolo atteso, metadati non sensibili | Usabile per smoke test provider e verifica JSON |
| L1 | chunks minimizzati o dati normalizzati da documenti reali | Usabile per benchmark qualità solo dopo conferma policy provider |
| L2 | payment dettagliato, penali, clausole AI/privacy complete, dati personali, garanzie e contenuti confidenziali estesi | Escluso da questo dataset, salvo singoli red flag citati in modo minimo |

## Identificativo benchmark

| Campo | Valore |
| --- | --- |
| `benchmark_dataset_id` | `cph_m1m4_free_ai_l0_l1_v0_1` |
| `package_slug` | `copenhagen-m1-m4-om` |
| `procurement_stage` | ITT / tender pack O&M |
| `source_language` | Inglese |
| `target_output_language` | Italiano per dashboard TRAM, inglese ammesso per query draft se richiesto |
| `allowed_tasks` | T1, T2, T3, T4, T7, T8 |
| `excluded_tasks` | T5 payment mechanism completo, T6 cost driver completo, L2 privacy/AI/legal review completa |

## T1 - Documenti da classificare

Obiettivo: verificare se il provider distingue ruolo documento, fase gara, versione, stato corrente e incertezze senza inventare contenuti.

| ID | Livello | Input minimo | Ruolo atteso | Fase | Stato atteso | Fonte |
| --- | --- | --- | --- | --- | --- | --- |
| D1 | L0 | `a. Tender documents/1. CM-X-OMRT3-TD-0020 Instructions to Tender v5.pdf` | Istruzioni di gara / ITT | Tender | Candidato corrente | File package; estratto `copenhagen-instructions-to-tender-v5.txt` |
| D2 | L0 | `a. Tender documents/1. CM-X-OMRT3-TD-0020 Instructions to Tender v5 with track changes.pdf` | Versione track changes delle istruzioni | Tender / version comparison | Non usare come testo consolidato senza confronto | File package |
| D3 | L0 | `a. Tender documents/02. ... Procurement Schedule v3.mpp` | Schedule procurement in formato progetto | Tender timeline | Fonte primaria per MPP | `mpp/copenhagen-procurement-schedule-tasks.tsv` |
| D4 | L0 | `a. Tender documents/02. ... Procurement Schedule v2.pdf` | Schedule procurement in PDF | Tender timeline | Fonte secondaria/versione PDF | `text/copenhagen-procurement-schedule-pdf.txt` |
| D5 | L0 | `a. Tender documents/4. CM-X-OMRT3-TD-0006 Form of tender pdf v2.pdf` | Template Form of Tender | Submission | Deliverable formale | File package; ITT lines 602-617 |
| D6 | L0 | `a. Tender documents/06. CM-X-OMRT3-TD-0021 Schedule of Prices Excel Workbook v5.xlsx` | Workbook prezzi | Submission / financial | Fonte strutturale prezzi | `tables/copenhagen-schedule-of-prices-sheets.tsv` |
| D7 | L0 | `b. Conditions .../01. ... Conditions of Contract.pdf` | Condizioni contrattuali | Contract | Fonte contrattuale core | `text/copenhagen-conditions-of-contract.txt` |
| D8 | L0 | `b. Conditions .../02. ... Definitions and Abbreviations...pdf` | Definizioni e abbreviazioni | Contract | Glossario | `text/copenhagen-definitions-abbreviations.txt` |
| D9 | L0 | `c. Contract specification .../01. ... Contract Specifications.pdf` | Specifiche contrattuali O&M | Contract / requirements | Fonte requisiti e KPI core | `text/copenhagen-contract-specifications.txt` |
| D10 | L0/L1 | `c. Contract specification .../02. ... Attachment A Payment.pdf` | Allegato Payment | Contract / payment | L2 per sintesi completa; L1 solo per classificazione | `text/copenhagen-attachment-a-payment.txt` lines 39-54 |

Controllo atteso:

- D1 e D2 non devono essere fusi.
- D3 e D4 non devono essere considerati duplicati equivalenti senza gestire versione/formato.
- D10 deve essere classificato come documento sensibile per task payment completo.

## T2 - Eventi timeline

Obiettivo: testare estrazione di eventi puntuali, finestre, fase gara/contratto e data quality.

| ID | Livello | Evento atteso | Tipo timeline | Data/periodo atteso | Fonte |
| --- | --- | --- | --- | --- | --- |
| E1 | L1 | Contract Notice finalised | Procurement | 2025-06-30 08:00 | `mpp/copenhagen-procurement-schedule-tasks.tsv` lines 2-5 |
| E2 | L1 | Invitation to Tenderers | Procurement | 2025-08-30 08:00 | `mpp/copenhagen-procurement-schedule-tasks.tsv` line 8 |
| E3 | L1 | Submission first tender | Procurement | 2026-02-09 17:00 | `mpp/copenhagen-procurement-schedule-tasks.tsv` line 10 |
| E4 | L1 | First negotiation meetings | Procurement | 2026-03-19 08:00 - 2026-03-26 17:00 | `mpp/copenhagen-procurement-schedule-tasks.tsv` lines 11-13 |
| E5 | L1 | Release basis for revised tender | Procurement / versioning | 2026-04-13 08:00 | `mpp/copenhagen-procurement-schedule-tasks.tsv` line 17 |
| E6 | L1 | Opening of revised tenders | Procurement | 2026-05-15 17:00 | `mpp/copenhagen-procurement-schedule-tasks.tsv` line 19 |
| E7 | L1 | Notice to Tenderers | Procurement / award communication | 2026-08-28 17:00 | `mpp/copenhagen-procurement-schedule-tasks.tsv` line 28 |
| E8 | L1 | Standstill | Procurement | 2026-08-28 17:00 - 2026-09-07 17:00 | `mpp/copenhagen-procurement-schedule-tasks.tsv` line 29 |
| E9 | L1 | Contract signing | Procurement / contract start gateway | 2026-09-25 17:00 | `mpp/copenhagen-procurement-schedule-tasks.tsv` line 31 |
| E10 | L1 | Start Mobilisation | Contract | 2026-09-29 08:00 | `mpp/copenhagen-procurement-schedule-tasks.tsv` line 33 |

Controllo atteso:

- E4 è un evento composito: l’output deve dichiarare che nasce da tre meeting distinti.
- E8 è una finestra, non un milestone puntuale.
- E10 deve essere separato dalla timeline gara: è già timeline contratto.

## T3 - Tender deliverables

Obiettivo: verificare estrazione di deliverable, codice, contenuto richiesto, peso, limite pagine e condizioni.

| ID | Livello | Deliverable atteso | Codice | Peso | Limite | Fonte |
| --- | --- | --- | --- | --- | --- | --- |
| DL1 | L1 | Form of Tender fully completed | EP | Valutato dentro price criterion | Non indicato nel campione | ITT lines 602-617, 1781-1791 |
| DL2 | L1 | Schedule of Prices in PDF format | EP | Valutato dentro price criterion | Non indicato nel campione | ITT lines 609-617, 1794-1799 |
| DL3 | L1 | Reservations, if any | N | Non valutativo | Massimo 2 pagine | ITT lines 729-755, 1800-1804 |
| DL4 | L1 | Mobilisation | M | 10% | Massimo 105 pagine | ITT lines 1563-1582, 1816-1864 |
| DL5 | L1 | CVs and Organisation | CO | 25% | Massimo 135 pagine più massimo 20 CV da 3 pagine | ITT lines 1563-1582, 1875-1900 |
| DL6 | L1 | Re-investment, Investment Projects | Re-I | 5% | Massimo 95 pagine | ITT lines 1563-1582, 1992-2030 |
| DL7 | L1 | Re-signalling and Rolling Stock Replacement | 3xR | 5% | Massimo 95 pagine | ITT lines 1563-1582, 2042-2071 |
| DL8 | L1 | Execution | EX | 15% | Massimo 95 pagine | ITT lines 1563-1582, 2083-2190 |
| DL9 | L1 | Declaration on notification of processing of personal data | N | Non valutativo | Non indicato nel campione | ITT lines 612-614, 2295-2296 |
| DL10 | L1 | Appendix D - Comments to the tender documents | N | Non valutativo | Massimo 1 pagina per requirement indicato | ITT lines 621-623, 2308-2329 |

Controllo atteso:

- DL1 e DL2 non devono essere confusi con i pesi 40%/60% del modello di aggiudicazione.
- DL4-DL8 devono ereditare i pesi dai sub-criteri di qualità.
- DL10 è particolarmente utile per TRAM perché assomiglia al futuro modulo “query/commenti motivati”.
- `List of Subcontractors` resta fuori dal campione da 10 item, ma va recuperato nel benchmark completo.

## T4 - KPI e formule

Obiettivo: testare se l’AI conserva formule, variabili, soglie, scope, frequenza e collegamento bonus/malus senza semplificare troppo.

| ID | Livello | KPI/formula attesa | Famiglia | Dato chiave da preservare | Fonte |
| --- | --- | --- | --- | --- | --- |
| K1 | L1 | Service Availability | Operation | Calcolo separato per M1/M2 e M3/M4; variabili PD, AD, MD, UD, QE | Contract Specifications lines 572-665, 685-689 |
| K2 | L1 | Rush-Hour Service Availability | Operation | Formula RH SA; rush hour 07:00-09:00 e 15:00-18:00 | Contract Specifications lines 667-683 |
| K3 | L1 | Service Precision | Operation | Headway schedulato pari o superiore a 10 minuti; finestra da -30 a +150 secondi | Contract Specifications lines 828-879 |
| K4 | L1 | Service Precision bonus/penalty | Operation / payment link | Soglie 70% e 90%; bonus/malus mensile | Contract Specifications lines 875-903 |
| K5 | L1 | Travel Time | Operation | 90th percentile ISRT per journey type; soglie per M1, M2, M3, M4 | Contract Specifications lines 914-965 |
| K6 | L1 | Travel Time penalty | Operation / payment link | Penale dopo due mesi consecutivi sopra soglia, salvo cause fuori controllo accettate | Contract Specifications lines 966-973 |
| K7 | L1 | Customer Satisfaction | Customer experience | Survey trimestrali, corpo indipendente, categorie misurate, bonus/penalty | Contract Specifications lines 975-1045 |
| K8 | L1 | Short-Term Maintenance | Maintenance | Formula risolti entro tempo massimo / totale issue; target per priorità | Contract Specifications lines 1126-1208 |
| K9 | L1 | Long-Term Maintenance / ACA-KPI | Maintenance | Target 90%; formula work order approvati / pianificati; bonus/malus annuale | Contract Specifications lines 1335-1400 |
| K10 | L1 | Collaboration KPI | Governance | Questionario 1-5, valutazione periodica, review con O&M Provider | Contract Specifications lines 1402-1474 |

Controllo atteso:

- Le formule non devono essere riscritte in modo ambiguo.
- Ogni KPI deve indicare se ha un link economico certo, probabile o da verificare.
- Customer Satisfaction e Collaboration non devono essere scartati perché meno “tecnici”: sono KPI O&M rilevanti.

## T7 - Contraddizioni candidate e open issues

Obiettivo: verificare se l’AI sa proporre alert utili senza trasformarli in certezze.

| ID | Livello | Issue candidata | Tipo | Severità candidata | Azione attesa | Fonte |
| --- | --- | --- | --- | --- | --- | --- |
| C1 | L1 | Estensione rete: 43 km di track vs circa 40 km double track | Dato divergente / definizione metrica | Media | Non fondere i valori; chiedere definizione e fonte preferita | Griglia Copenhagen; analisi semantica; ITT lines 216-236 |
| C2 | L1 | Regulation (EU) `2026/2338` con data 14 dicembre 2016 | Possibile refuso normativo | Alta | Generare query draft o alert legale | ITT lines 150-152; analisi semantica con riferimento EUR-Lex |
| C3 | L1 | Liste Essential Tender Documents tender e contract da confrontare | Completezza documentale | Media | Eseguire diff tra liste e flaggare differenze | `copenhagen-tender-essential-documents.txt` lines 85-100; `copenhagen-contract-essential-documents.txt` lines 85-100 |
| C4 | L1 | Versioni ITT v3, v4, v5 e track changes non confrontate | Versioning / document currentness | Media | Richiedere confronto versioni prima di consolidare differenze | File package; griglia Copenhagen sezione versioning |
| C5 | L1/L2 boundary | Uso AI esterna da validare rispetto a clausola Artificial Intelligence e confidenzialità | Privacy / AI governance | Alta | Bloccare L2 e chiedere review umana prima di invio a provider esterno | Conditions lines 1742-1763, 3338-3353 |

Controllo atteso:

- C1 potrebbe non essere una contraddizione reale: può dipendere da “track” vs “double track”.
- C2 richiede verifica normativa, non correzione automatica.
- C5 è soprattutto un gate operativo TRAM, non una query immediata alla stazione appaltante.

## T8 - Query draft seed

Obiettivo: testare se il provider produce query professionali, citate, brevi e revisionabili.

### Q1 - Riferimento normativo

| Campo | Valore atteso |
| --- | --- |
| Livello | L1 |
| Oggetto | Chiarimento su riferimento a Regulation (EU) `2026/2338` |
| Fatti da citare | ITT v5, sezione iniziale sul quadro normativo; riferimento a `2026/2338` con data 14 dicembre 2016 |
| Richiesta | Confermare se il riferimento corretto sia Regulation (EU) `2016/2338` oppure altro atto |
| Tono | Professionale, neutro, non accusatorio |
| Approval | Obbligatoria |

Bozza seed:

```text
We note that the Instructions to Tender refer to Regulation (EU) 2026/2338 of 14 December 2016 amending Regulation (EC) No. 1370/2007. Could Metroselskabet please confirm whether this reference should instead be read as Regulation (EU) 2016/2338, or clarify the intended legal reference?
```

### Q2 - Estensione della rete

| Campo | Valore atteso |
| --- | --- |
| Livello | L1 |
| Oggetto | Chiarimento su estensione rete e metrica da usare |
| Fatti da citare | Fonti TRAM indicano valori formulati diversamente: `43 km track` e circa `40 km double track`; ITT descrive linee, tratte e 44 stazioni |
| Richiesta | Chiarire quale metrica deve essere usata per dimensionamento operativo, benchmarking e comparazione economica |
| Tono | Professionale, orientato alla corretta comparabilità |
| Approval | Obbligatoria |

Bozza seed:

```text
For the purpose of ensuring consistent sizing of the O&M scope, could Metroselskabet please clarify which network length metric should be used for tender analysis and pricing comparisons, and whether references to track length and double-track length are intended to describe different measurement bases?
```

## Output JSON atteso per il benchmark

Ogni provider deve restituire JSON valido e parsabile. Gli schemi definitivi saranno documentati nel prompt pack, ma per questo dataset i campi minimi sono:

| Task | Campi minimi |
| --- | --- |
| T1 | `sample_id`, `document_role`, `procurement_stage`, `version`, `is_current_candidate`, `privacy_level`, `source_refs`, `confidence`, `uncertainties` |
| T2 | `sample_id`, `event_name`, `timeline_type`, `date_start`, `date_end`, `timezone`, `is_window`, `condition`, `source_refs`, `confidence` |
| T3 | `sample_id`, `deliverable_code`, `deliverable_name`, `weight`, `page_limit`, `required_content`, `source_refs`, `confidence` |
| T4 | `sample_id`, `kpi_name`, `kpi_family`, `formula_or_method`, `variables`, `target_or_threshold`, `frequency`, `scope`, `bonus_malus_link`, `source_refs`, `confidence` |
| T7 | `sample_id`, `issue_title`, `issue_type`, `conflicting_values`, `why_it_may_be_an_issue`, `severity_candidate`, `recommended_action`, `source_refs`, `confidence` |
| T8 | `sample_id`, `query_subject`, `query_body`, `facts_cited`, `requested_clarification`, `tone`, `source_refs`, `human_approval_required` |

## Criteri di pass/fail sul dataset

Un provider supera il benchmark su questo dataset solo se:

- restituisce esattamente il numero di item richiesti per task;
- non inventa documenti, pesi, date, formule o fonti;
- conserva distinzione tra L0, L1 e L2 boundary;
- cita sempre `sample_id` e source refs;
- dichiara incertezza su C1, C3, C4 e C5;
- non propone invio esterno o consolidamento automatico per le query draft;
- non usa tono accusatorio nelle query;
- non trasforma i red flag in conclusioni legali.

## Debiti e passaggi rimandati

- Dataset Luas equivalente non ancora preparato.
- Payment mechanism completo non incluso perché L2 o quasi-L2.
- Analisi completa della clausola AI/privacy non inclusa: per ora è solo gate.
- Confronto track changes v3/v4/v5 non eseguito.
- Lista completa dei subcontractors non inclusa nel campione da 10 deliverable.
- Non sono state eseguite chiamate AI, quindi non esiste ancora score provider.

## Prossimo passo consigliato

Il prompt/schema pack v0.1 è stato preparato in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-free-ai-prompt-schema-pack-v0-1.md`.

L’envelope operativo T1 L0 v0.1 è stato preparato in:

- `/Users/Matteo/Documents/TRAM/docs/analysis/tram-copenhagen-m1-m4-t1-l0-envelope-v0-1.md`
- `/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-inputs/tram-cph-m1m4-t1-l0-input-envelope-v0-1.json`

Il template di run/output T1 L0 è stato preparato in:

- `/Users/Matteo/Documents/TRAM/docs/analysis/tram-copenhagen-m1-m4-t1-l0-run-template-v0-1.md`
- `/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-runs/tram-cph-m1m4-t1-l0-run-template-v0-1.json`

La prima valutazione baseline-aware è stata preparata in:

- `/Users/Matteo/Documents/TRAM/docs/analysis/tram-copenhagen-m1-m4-t1-l0-baseline-aware-evaluation-v0-1.md`
- `/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-baselines/tram-cph-m1m4-t1-l0-baseline-v0-1.json`
- `/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-evaluations/tram-cph-m1m4-t1-l0-eval-gemini-25-json-mode-v0-1.json`

Il prompt/schema T1 v0.2 è stato preparato in:

- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-free-ai-prompt-schema-pack-v0-2.md`

La valutazione Gemini T1 L0 v0.2 con baseline-aware pass è documentata in:

- `/Users/Matteo/Documents/TRAM/docs/analysis/tram-copenhagen-m1-m4-t1-l0-v0-2-gemini-provider-schema-evaluation.md`

La valutazione Mistral T1 L0 v0.2 è documentata in:

- `/Users/Matteo/Documents/TRAM/docs/analysis/tram-copenhagen-m1-m4-t1-l0-v0-2-mistral-provider-schema-evaluation.md`

Risultato sintetico Mistral:

- `mistral-medium-3.5`: baseline-aware pass;
- `mistral-small-2603`: baseline-aware fail semantico.

Le valutazioni Groq e Cerebras T1 L0 v0.2 sono documentate in:

- `/Users/Matteo/Documents/TRAM/docs/analysis/tram-copenhagen-m1-m4-t1-l0-v0-2-groq-provider-schema-evaluation.md`
- `/Users/Matteo/Documents/TRAM/docs/analysis/tram-copenhagen-m1-m4-t1-l0-v0-2-cerebras-provider-schema-evaluation.md`

Risultato sintetico:

- Groq: non promosso su T1 L0 v0.2 con envelope attuale;
- Cerebras: non promosso su `llama3.1-8b`; modello grande `qwen-3-235b` da ritentare per blocchi traffico/quota.

Prossimo passo: eseguire lo stesso schema su Cloudflare Workers AI e OpenRouter se credenziali e cap gratuiti sono disponibili.
