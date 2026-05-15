# TRAM V1 - Matrice routing AI per task e provider v0.1

Data: 2026-05-13
Stato: proposta operativa aggiornata con tassonomia T1-T8
Ambito: routing AI gratuito, L0/L1 minimizzato, task V1 e fallback provider

## Scopo

Questa matrice definisce quale provider AI usare per ciascun tipo di task TRAM V1, distinguendo tra:

- task semanticamente complessi;
- micro-task L0;
- task da svolgere con parser o regole deterministiche;
- task bloccati verso provider esterni;
- task human-in-the-loop.

La matrice non sceglie “un’unica AI per tutto”. TRAM deve usare il provider giusto per il task giusto, con gate privacy, costo e qualità.

## Regola di base

Per V1:

1. parser e regole deterministiche producono la prima evidenza;
2. l’AI lavora su input minimizzati;
3. l’AI propone classificazioni, incertezze e sintesi;
4. il resolver deterministico calcola famiglia, versione e stato corrente;
5. la review umana conferma dati critici, contraddizioni, chiarimenti/Q&A e contenuti economici.

## Stato provider

| Provider | Stato V1 | Uso ammesso ora | Blocco principale |
| --- | --- | --- | --- |
| Gemini `gemini-2.5-flash-lite` | Primario L0/T2/T3 hybrid | Classificazione documentale, timeline e deliverable minimizzati, task L0 complessi | L1/L2 solo dopo policy, clausole e budget gate |
| Mistral `mistral-medium-3.5` | Secondario L0/T2/T3 hybrid | Confronto qualità, fallback T1 L0, T2 timeline e T3 deliverable | Capacity free tier e privacy Experiment |
| Cloudflare Workers AI | Fallback micro-task L0 | Classificazione elementare su metadati minimizzati | Non usare su envelope completo o L1/L2 |
| Groq `llama-3.3-70b-versatile` | Fallback micro-task L0 | JSON semplice, classificazioni corte, check veloci | Rate/token limit free tier e privacy da chiudere per L1 |
| OpenRouter | Sperimentale L0 | Smoke test con modello pinned, preferibilmente ZDR | Free models instabili e provider effettivo variabile |
| Cerebras | Test tecnico | Ritentare modello grande quando disponibile | Capacity, privacy/DPA e qualità dominio non chiuse |
| VPS/self-hosted | Fallback privacy-first | Task sensibili o batch lenti dopo runbook | Risorse, qualità e costi reali |

## Routing per task V1

| Task | Route primaria | Fallback ammesso | AI esterna | Review |
| --- | --- | --- | --- | --- |
| T1 classificazione documentale L0 | Gemini o Mistral + resolver deterministico | Cloudflare/Groq su micro-task | Sì, solo input minimizzato | Ambigui e documenti critici |
| T1 micro-routing metadati | Cloudflare o Groq | OpenRouter pinned | Sì, L0 puro | Solo mismatch o bassa confidenza |
| Famiglia/versione/currentness | Resolver deterministico | AI solo per `uncertainties` | No come fonte unica | Sì se conflitto |
| T2 timeline gara/contratto | Parser date/MPP + regole | Gemini/Mistral per normalizzazione evento e incertezze | Solo L1 minimizzato approvato | Sì su date divergenti |
| T3 deliverable gara | Parser/regex/tabelle + Gemini/Mistral per normalizzazione | Mistral/Gemini alternativo | Solo input minimizzato e con gate | Sì su checklist finale e deliverable sensibili |
| T4 requisiti O&M e KPI non finanziari | Parser/regole + Gemini/Mistral per normalizzazione | Human-assisted | L1 solo con gate; L2 bloccato | Obbligatoria su mandatory, formule e compliance |
| T5 financials/pricing/payment | Parser Excel/PDF locale + Gemini/Mistral su chunk ammessi | VPS/self-hosted per L2 effettivo | Ammessa su L0/L1 minimizzati e approvati | Obbligatoria quando incide su dashboard, valori, formule o payment logic |
| T6 cost drivers | Regole + review umana + AI limitata | AI solo su requisiti L1 approvati | Limitata; L2 ereditato bloccato | Obbligatoria |
| T7 contraddizioni candidate | Regole + confronto valori | AI per spiegazione e incertezze | Dipende dalla classe fonte | Obbligatoria |
| T8 chiarimenti/Q&A | Human-first + template | AI solo se fonti non L2 e approvato | No default V1 | Obbligatoria prima dell’invio |

## Routing L0 operativo

| Scenario | Provider consigliato | Motivo |
| --- | --- | --- |
| Classificazione semantica su campione ampio | Gemini | Migliore stabilità sui benchmark TRAM |
| Secondo parere europeo | Mistral | Buona qualità, utile contro lock-in |
| Classificazione di 1-5 metadati file | Cloudflare | Pass v0.4, quota gratuita giornaliera, data usage favorevole |
| Classificazione veloce JSON | Groq | Pass v0.4 e latenza bassa nel test |
| Smoke test free model alternativo | OpenRouter pinned | Utile per confronto, non per default |
| Test modello grande quando disponibile | Cerebras | Solo benchmark tecnico |

## Routing T2 timeline v0.1

| Scenario | Route consigliata | Motivo |
| --- | --- | --- |
| Date, orari, durate, timezone | Parser e regole | Non sono verità AI; devono restare verificabili e riproducibili |
| Nome evento e categoria semantica | Gemini o Mistral | Entrambi completano il dataset T2; Mistral passa raw nel benchmark compatto |
| Contraddizioni tra fonti | Regole + review queue | L’AI può spiegare l’incertezza, ma non scegliere la data corretta |
| Quarter range e date relative | Regole + AI per incertezze | Da mostrare come precisione bassa o condizionata |
| Cloudflare/Groq/OpenRouter | Non default T2 | Abilitati solo per micro-task L0, non per L1 minimizzato |

## Routing T3 deliverable v0.1

| Scenario | Route consigliata | Motivo |
| --- | --- | --- |
| Individuazione deliverable e source refs | Parser, tabelle e regole | La checklist deve essere riproducibile e citabile |
| Codici, obbligatorietà, limiti pagina, formati, pesi e deadline | Parser e regole + review | Sono requisiti formali, non verità AI |
| Nome normalizzato, tipo, area e dominio O&M | Gemini o Mistral | Entrambi passano il benchmark T3 compatto 22/22 |
| Dipendenze e incertezze | Gemini o Mistral + normalizzatore | Utile per review e dashboard, senza consolidare valori critici |
| Deliverable economici, PEF, pricing workbook e combinatori | Parser locale + AI gate + review | Sono contenuti Tender analizzabili; bloccare provider esterni solo per L2 effettivo, clausole incompatibili o payload non minimizzato |
| Cloudflare/Groq/OpenRouter | Non default T3 | Ammessi solo per micro-classificazioni L0, non per estrazioni sostanziali |

## Routing T4-T8 impostato

| Task | Route consigliata | Regola chiave |
| --- | --- | --- |
| T4 requisiti O&M e KPI non finanziari | Parser/regole per clausole, formule, target e fonte; Gemini/Mistral per dominio, clustering e incertezze | L’AI non altera testo, formula, soglia o obbligatorietà |
| T5 financials/pricing/payment | Parser locale + AI su chunk ammessi + review | Provider esterni ammessi per L0/L1 minimizzati; L2 effettivo bloccato |
| T6 cost drivers | Regole su requisiti/deliverable/KPI + AI limitata su input ammessi | Nessun importo o stima inventata |
| T7 contraddizioni candidate | Confronti deterministici + AI per spiegazione se privacy consente | Produce candidate, non verità |
| T8 chiarimenti/Q&A | Template + review umana; AI opzionale solo se autorizzata | Nessun invio automatico |

Aggiornamento provider benchmark T4-T8 v0.1:

- T4 passa con Mistral `mistral-medium-3.5` come pipeline normalizzata;
- T6 passa con Mistral `mistral-medium-3.5` come pipeline normalizzata;
- T7 non è promosso: usare regole/review per severity e action;
- T8 passa con Mistral `mistral-small-2603` solo su subset L1/L0 e dopo normalizzatore human-first;
- Gemini non è stato valutabile nella tornata per quota free tier, quindi serve scheduler quota-aware.

## Regole anti-abuso

- Non inviare mai interi documenti o pacchetti.
- Non usare OpenRouter generico su contenuti TRAM: serve modello pinned.
- Non usare Cloudflare/Groq per compensare un prompt troppo lungo: ridurre prima l’envelope.
- Non usare AI per decidere `currentness` come verità applicativa.
- Non usare AI per decidere date, orari o durate T2 come verità applicativa.
- Non usare AI per decidere requisiti formali T3 come obbligatorietà, limiti pagina, formati, pesi, deadline o valori economici.
- Non usare AI per modificare testo, formule, target o soglie T4.
- Usare provider esterni per T5 financials/payment quando l’input è L0/L1, minimizzato, approvato dal Tender e compatibile con il provider.
- Non usare AI per inventare importi o stime T6.
- Non usare AI per trasformare una contraddizione candidata T7 in affermazione certa.
- Non usare AI o automazioni per inviare domande o chiarimenti T8 senza approvazione umana.
- Non inviare dati personali, chiarimenti sensibili, clausole AI/privacy o Financials L2 effettivi a provider esterni; Financials L0/L1 minimizzati sono ammessi.
- Non passare automaticamente a piani paid quando finisce la quota gratuita.

## Impatto prodotto

La UI futura dovrebbe mostrare stati semplici:

- “Analisi AI leggera disponibile”;
- “Analisi AI principale disponibile”;
- “Solo regole/parser”;
- “Richiede approvazione”;
- “Bloccato per privacy/costo/clausola”;
- “Quota gratuita esaurita”.

L’utente non deve scegliere il modello ogni volta. TRAM propone una route, spiega il motivo e permette override solo quando ha senso.

## Debiti

- Verificare policy privacy aggiornata di Groq prima di qualunque L1.
- Verificare ZDR OpenRouter e policy del provider effettivo per ogni modello pinned.
- Ritentare Cerebras modello grande in una finestra meno trafficata, senza promuoverlo automaticamente.
- Definire schema `AiRouteDecision` applicativo quando inizierà il codice.
- Collegare questa matrice al registro `AiCall` e alla matrice classi documentali.
- Trasformare il normalizzatore T3 in specifica `TenderDeliverableNormalizer`.
- Benchmark compatti T4, T5, T6, T7 e T8 preparati in `/Users/Matteo/Documents/TRAM/docs/analysis/tram-t4-t8-compact-benchmark-preparation.md`.
- Specifica normalizzatori T4-T8 v0.1 definita in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-ai-normalizer-spec-t4-t8-v0-1.md`.
- Config normalizzatori T4-T8 v0.1 definito in `/Users/Matteo/Documents/TRAM/data/config/tram-v1-normalizer-config-t4-t8-v0-1.json`.
- Specifica fixture test T4-T8 v0.1 definita in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-ai-normalizer-fixture-test-spec-t4-t8-v0-1.md`.

## Prossimo passo consigliato

Usare la specifica viste dashboard MVP, il registro `indicator_key` P0/P1 e la data policy per spazio per preparare fixture applicative. T5 deve includere casi AI ammessi e casi L2 effettivi da bloccare.
