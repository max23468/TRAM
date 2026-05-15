# TRAM V1 - Benchmark compatto T3 deliverable v0.1

Data: 2026-05-13
Stato: completato
Ambito: Copenhagen M1-M4 O&M, Dublin Luas O&M, Milano lotti extraurbani O&M, Dublin MetroLink PPP

## Scopo

Questo benchmark verifica il prompt/schema pack T3 deliverable v0.1.

L’obiettivo non è far trovare all’AI la checklist completa partendo da documenti lunghi. L’obiettivo è verificare se, su deliverable già individuati da parser, tabelle e regole, l’AI sa normalizzare nome, tipo, area di submission, dominio O&M, dipendenze e incertezze senza alterare i requisiti deterministici.

## Perimetro dati

Il benchmark usa input L1 minimizzato:

- estratti brevi da istruzioni di gara, PQQ o disciplinari;
- righe puntuali di tabelle deliverable o submission requirements;
- source refs locali;
- valori deterministici già separati da parser/regole.

Non sono stati inviati:

- pacchetti completi;
- PDF completi;
- workbook completi;
- modelli economici completi;
- prezzi o valori finanziari;
- dati personali;
- clausole complete;
- query draft.

## Dataset compatto

Il dataset contiene 22 deliverable:

| Pacchetto | Deliverable | Focus |
| --- | ---: | --- |
| Copenhagen M1-M4 O&M | 5 | form, schedule of prices, dichiarazioni, commenti a documenti tender, subcontractors |
| Dublin Luas O&M | 7 | form, tenderer details, transition, operations, timetable/rosters, LRV maintenance, infrastructure maintenance |
| Milano lotti extraurbani O&M | 5 | documentazione amministrativa, offerta tecnica, offerta economica, PEF, offerta/PEF combinatoria |
| Dublin MetroLink PPP | 5 | qualification envelope, technical envelope, standing letters, reference projects, declarations |

Artefatti principali:

- input: `/Users/Matteo/Documents/TRAM/data/working/t3-deliverables-compact-v0-1/benchmark-inputs/tram-t3-deliverables-compact-input-envelope-v0-1-r1.json`;
- baseline: `/Users/Matteo/Documents/TRAM/data/working/t3-deliverables-compact-v0-1/benchmark-baselines/tram-t3-deliverables-compact-baseline-v0-1-r1.json`;
- summary: `/Users/Matteo/Documents/TRAM/data/working/t3-deliverables-compact-v0-1/benchmark-evaluations/tram-t3-deliverables-compact-summary-v0-1-r1.json`.

## Casi in review

Il dataset include 8 deliverable con review obbligatoria:

| Deliverable ID | Pacchetto | Motivo sintetico |
| --- | --- | --- |
| `CPH-T3-002` | Copenhagen | schedule of prices e contenuto economico |
| `CPH-T3-004` | Copenhagen | commenti a documenti tender, inclusi cost driver |
| `LUAS-T3-005` | Dublin Luas | maintenance plan tecnico e valutativo |
| `LUAS-T3-007` | Dublin Luas | infrastructure maintenance plan tecnico e valutativo |
| `MIL-T3-002` | Milano | offerta tecnica con modelli/allegati |
| `MIL-T3-003` | Milano | offerta economica |
| `MIL-T3-004` | Milano | PEF e modelli finanziari |
| `MIL-T3-005` | Milano | offerta/PEF combinatoria |

Decisione: questi casi non vanno consolidati automaticamente. Devono entrare in review queue con fonte, vincolo, eventuale dipendenza e stato di validazione.

## Provider testati

| Provider | Modello | Esito raw | Esito pipeline normalizzata |
| --- | --- | --- | --- |
| Gemini | `gemini-2.5-flash-lite` | Pass | Pass |
| Mistral | `mistral-medium-3.5` | Pass | Pass |

Entrambi i provider hanno rispettato il vincolo principale: nessun campo requisiti vietato è stato restituito.

## Esito Gemini

Run:

- `/Users/Matteo/Documents/TRAM/data/working/t3-deliverables-compact-v0-1/benchmark-runs/tram-t3-deliverables-compact-run-gemini-25-flash-lite-v0-1-r1.json`;
- `/Users/Matteo/Documents/TRAM/data/working/t3-deliverables-compact-v0-1/benchmark-runs/tram-t3-deliverables-compact-output-gemini-25-flash-lite-v0-1-r1.json`;
- `/Users/Matteo/Documents/TRAM/data/working/t3-deliverables-compact-v0-1/benchmark-evaluations/tram-t3-deliverables-compact-eval-gemini-25-flash-lite-v0-1-r1.json`.

Metriche:

| Metrica | Esito |
| --- | --- |
| `format_pass` | true |
| `items_returned` | 22/22 |
| `enum_pass` | true |
| `no_forbidden_requirement_fields_pass` | true |
| `review_gate_pass` | true |
| `ai_classification_pass` | true |
| `pipeline_normalized_pass` | true |
| `mismatches` | 0 |

## Esito Mistral

Run:

- `/Users/Matteo/Documents/TRAM/data/working/t3-deliverables-compact-v0-1/benchmark-runs/tram-t3-deliverables-compact-run-mistral-medium-3-5-v0-1-r1.json`;
- `/Users/Matteo/Documents/TRAM/data/working/t3-deliverables-compact-v0-1/benchmark-runs/tram-t3-deliverables-compact-output-mistral-medium-3-5-v0-1-r1.json`;
- `/Users/Matteo/Documents/TRAM/data/working/t3-deliverables-compact-v0-1/benchmark-evaluations/tram-t3-deliverables-compact-eval-mistral-medium-3-5-v0-1-r1.json`.

Metriche:

| Metrica | Esito |
| --- | --- |
| `format_pass` | true |
| `items_returned` | 22/22 |
| `enum_pass` | true |
| `no_forbidden_requirement_fields_pass` | true |
| `review_gate_pass` | true |
| `ai_classification_pass` | true |
| `pipeline_normalized_pass` | true |
| `mismatches` | 0 |

Mistral ha prodotto classificazioni allineate alla baseline e ha completato T3 senza il blocco di capacity osservato su T1 v0.4.

## Decisione T3

T3 deliverable v0.1 è promosso come pipeline hybrid MVP con questa responsabilità:

1. parser, tabelle e regole individuano deliverable, codici, obbligatorietà, page limit, formati, pesi, deadline e source refs;
2. AI normalizza nome, tipo, area di submission, dominio O&M, dipendenze e incertezze;
3. normalizzatore post-AI applica enum canonici e rimuove campi vietati;
4. review queue gestisce deliverable economici, valutativi, finanziari, combinatori o tecnicamente critici;
5. dashboard e checklist mostrano fonte, stato e review, non solo una lista piatta.

Per T3, l’AI non deve essere valutata sulla capacità di inventare deliverable mancanti. Deve essere valutata su:

- formato;
- completezza rispetto a candidati già estratti;
- assenza di campi requisiti vietati;
- classificazione semantica;
- rispetto del review gate;
- qualità di dipendenze e incertezze.

## Implicazioni prodotto

La checklist deliverable V1 dovrebbe distinguere almeno:

- area amministrativa;
- area tecnica;
- area economica/finanziaria;
- qualification/prequalification envelope;
- allegati e template;
- piani O&M;
- modelli o workbook;
- deliverable con review obbligatoria;
- dipendenze tra offerta economica, PEF e combinazioni di lotti.

La UI non deve nascondere i deliverable economici solo perché non vengono inviati a provider esterni. Devono essere indicizzati localmente, marcati come sensibili e portati in review.

## Debiti

- Estendere T3 a un dataset più ampio per coprire tutti i pacchetti e tutte le appendici.
- Definire parser dedicati per tabelle deliverable e submission requirements.
- Collegare T3 ai criteri di valutazione, senza anticipare il confronto con l’offerta che resta V2.
- Decidere come rappresentare dipendenze tra deliverable economici, PEF, allegati e lotti.
- Integrare i campi T3 nel data model `TenderDeliverable`.

## Prossimo passo consigliato

I prompt/schema pack T4-T8 v0.1 e i relativi benchmark compatti sono stati preparati ed eseguiti selettivamente. La specifica dei normalizzatori deterministici T4-T8 è documentata in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-ai-normalizer-spec-t4-t8-v0-1.md`; config e fixture sono rispettivamente in `/Users/Matteo/Documents/TRAM/data/config/tram-v1-normalizer-config-t4-t8-v0-1.json` e `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-ai-normalizer-fixture-test-spec-t4-t8-v0-1.md`.

La sede runtime dei normalizzatori è definita nell’ADR `/Users/Matteo/Documents/TRAM/docs/decisions/tram-adr-001-normalizer-runtime-placement-v0-1.md`, lasciando T5 su parser locale e review.

Le viste dashboard MVP collegate ai task T1-T8 sono definite in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-dashboard-views-t1-t8-v0-1.md`.

Il registro `indicator_key` P0/P1 è definito in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-indicator-key-registry-p0-p1-v0-1.md`; il passo successivo è usare T3 per fixture dashboard/review.
