# TRAM V1 - Data policy per Tender v0.1

Data: 2026-05-13  
Stato: decisione operativa iniziale  
Ambito: policy dati per singolo Tender, AI esterna, privacy level, clausole pacchetto e costi free-first

## Scopo

Ogni Tender deve avere una data policy esplicita.

La policy decide cosa TRAM può fare con documenti, estratti, AI esterna, parser locali, review umana e futuri worker self-hosted. Serve a evitare che una decisione valida per un pacchetto diventi automaticamente valida per tutti.

## Regola base

Default V1:

- L0 può usare provider esterni gratuiti ammessi;
- L1 può usare provider esterni solo dopo gate e approvazione;
- L2 resta locale/review, senza provider esterni;
- nessun fallback paid automatico;
- nessun pacchetto completo inviato a un LLM;
- ogni output AI resta proposta, non verità.

La matrice classi documentali/provider è in:

- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-ai-document-class-provider-matrix-v0-1.md`

La policy di minimizzazione è in:

- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-ai-chunk-minimization-redaction-policy-v0-1.md`

## Campi minimi della policy Tender

| Campo | Valori iniziali | Note |
| --- | --- | --- |
| `tender_policy_status` | draft, approved, suspended | se draft, L1 resta bloccato |
| `default_external_ai_level` | none, L0_only, L1_with_approval | default consigliato: L0_only |
| `l2_handling` | local_only, self_hosted_if_available, human_only | V1 default: local_only/human_only |
| `clause_scan_status` | not_started, no_restriction_found, restriction_found, unclear | prima di L1 |
| `provider_policy_status` | verified, stale, unknown | per provider e modello |
| `free_budget_policy` | zero_budget, capped_budget, suspended | default zero/capped |
| `retention_profile` | short, project_lifecycle, manual_delete | da definire meglio prima del codice |
| `sensitive_access_policy` | owner_only, owner_reviewer, custom | governa L2 |
| `clarification_export_policy` | owner_only, reviewer_delegated, disabled | V1 default owner_only |

## Profili policy

### `policy_l0_external_only`

Uso:

- classificazione documentale;
- metadati;
- natura/ruolo documento;
- micro-task L0.

Blocca:

- estratti sostanziali L1;
- chiarimenti/Q&A;
- dati personali;
- clausole critiche.

È il profilo default consigliato per un nuovo Tender.

### `policy_l1_external_approved`

Uso:

- estratti minimizzati;
- T2/T3 normalizzazione;
- T4/T6 su contenuti non sensibili;
- solo provider ammessi e quota disponibile.

Richiede:

- clause scan completato;
- approvazione owner;
- provider policy verificata;
- log `AiGateDecision`.

### `policy_local_only_sensitive`

Uso:

- dati interni/offerta;
- payment mechanism non minimizzato o vietato da clausola;
- penali non minimizzate o collegate a dati interni/offerta;
- KPI economici;
- dati personali;
- cyber/security;
- chiarimenti/Q&A sensibili.

Provider esterni:

- bloccati in V1 default.

### `policy_self_hosted_future`

Uso futuro:

- task L1/L2 su VPS o modello self-hosted;
- batch lenti;
- pacchetti con restrizioni verso provider esterni.

Stato:

- non attivo finché non esistono runbook, costi, log, retention e test qualità.

## Decisione iniziale sui quattro pacchetti benchmark

Questa è una classificazione iniziale prudente basata su struttura pacchetto, documenti già caricati e benchmark esistenti. Non sostituisce clause scan completo.

| Spazio | Tipo | Policy iniziale | Note operative |
| --- | --- | --- | --- |
| `copenhagen-m1-m4-om` | ITT O&M metro | `policy_l0_external_only`, L1 solo con approvazione | contiene payment attachment, DPA, conditions, track changes e MPP; financials e clausole privacy restano locali/review |
| `dublin-luas-om` | ITN O&M light rail | `policy_l0_external_only`, L1 solo con approvazione | contiene contract, schedules, data room, financial model e timetables; financial model e data room agreement richiedono cautela |
| `milano-lotti-extraurbani-om` | ITT bus extraurbano multi-lotto | `policy_l0_external_only`, L1 solo con approvazione | contiene PEF/offerta economica, criteri, lotti e GTFS; financials e PEF restano locali/review |
| `dublin-metrolink-ppp` | prequalifica/PQP PPP | `policy_l0_external_only`, L1 solo con approvazione | prequalifica con standing, referenze e qualification envelope; attenzione a dati societari, finanziari e capability evidence |

## Gate per passare da L0 a L1

Un Tender può abilitare L1 esterno solo se:

1. un owner approva la policy;
2. le clausole su AI, confidentiality, data processing, subprocessor e vendor esterni sono state cercate;
3. non sono emerse restrizioni incompatibili;
4. il provider è ammesso nella matrice aggiornata;
5. il chunk è minimizzato;
6. il task è tra quelli ammessi;
7. quota gratuita e budget sono disponibili;
8. l’output rientra in review se critico.

Se uno di questi punti è incerto, il job si sospende.

## Mapping task-policy

| Task | Policy default |
| --- | --- |
| T1 document map | L0 esterno ammesso; version/currentness deterministico |
| T2 timeline | L1 minimizzato ammesso solo con approvazione; date restano parser/regole |
| T3 deliverable | L1 minimizzato ammesso solo con approvazione; requisiti formali restano parser/regole |
| T4 requisiti/KPI | L1 controllato solo se non finanziario/sensibile; KPI economici scalano a L2 |
| T5 financials/payment | AI ammessa su L0/L1 minimizzato e approvato; L2 effettivo locale/self-hosted o bloccato |
| T6 cost driver | L1 controllato solo senza importi o formule sensibili |
| T7 contraddizioni | rules/review-first; AI esterna non default |
| T8 chiarimenti/Q&A | human-first; L2 bloccato; subset L1/L0 solo se approvato; nessun invio automatico |

## Effetti sulla UI

La UI deve mostrare per ogni Tender:

- policy attiva;
- ultimo clause scan;
- provider ammessi;
- task bloccati;
- quota gratuita;
- contenuti L2 non inviabili;
- azione richiesta all’utente.

Esempi di stato:

- “AI esterna ammessa solo su L0”;
- “L1 da approvare”;
- “Financials: AI ammessa su L0/L1; L2 effettivo bloccato o self-hosted”;
- “Quota Gemini esaurita, job sospeso”;
- “Clausole dati/AI non ancora verificate”.

## Debiti

- Definire retention concreta per file originali, OCR, estratti e output AI.
- Definire procedura di clause scan locale prima di L1.
- Verificare periodicamente policy provider e condizioni free tier.
- Decidere se il primo gruppo utenti può usare `policy_l1_external_approved` per tutti o solo per pacchetti selezionati.
- Definire log accessi L2.

## Prossimo passo consigliato

Applicare questa data policy al workflow ingestion-dashboard: il sistema deve sapere quando procedere, sospendere, chiedere review o impedire AI esterna.
