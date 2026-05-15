# TRAM V1 - Strategia AI gratuita

Data: 2026-05-12
Ultimo aggiornamento: 2026-05-13
Stato: decisione di indirizzo da validare con benchmark tecnico e privacy
Ambito: MVP/V1 interno per primi tre utenti

## Scopo

Questo documento definisce come TRAM userà l’AI nella V1 rispettando un vincolo esplicito: la fase iniziale deve essere gratuita per TRAM, o comunque bloccata da limiti di spesa pari a zero o minimi e controllati.

La strategia AI V1 non deve essere confusa con una scelta definitiva di provider. TRAM deve nascere con un layer AI astratto, così da usare oggi provider gratuiti o free tier e domani servizi paid o enterprise senza riscrivere il prodotto.

## Decisioni approvate

- L’AI V1 deve essere gratuita per TRAM: nessun costo ricorrente e nessun fallback automatico verso piani a pagamento.
- L’AI non deve girare sul Mac dell’utente come soluzione applicativa. Il Mac può servire per sviluppo, ma non per inference di prodotto.
- L’AI può girare su cloud provider gratuiti, free tier, crediti o VPS gratuita.
- Se necessario, è accettabile che alcune analisi girino in batch e richiedano tempi lunghi.
- Gemini API entra nella shortlist V1.
- Per Gemini è accettabile collegare una carta o un billing account se serve per ottenere il corretto regime privacy, accesso o spend cap, purché il budget sia pari a zero o il più basso possibile e senza auto-upgrade incontrollato.
- I provider candidati per il benchmark iniziale sono Gemini, Mistral, Groq, Cloudflare Workers AI, Cerebras e OpenRouter.
- Una VPS gratuita, per esempio Oracle Always Free se disponibile, resta fallback per task sensibili o batch lenti, ma non deve essere l’unica ipotesi.

## Cosa significa “AI gratuita”

Per TRAM V1, AI gratuita significa:

- nessuna fattura AI generata durante l’MVP;
- nessun uso automatico oltre quota gratuita;
- nessun auto-reload o upgrade automatico;
- possibilità di usare free tier cloud;
- possibilità di usare carta o billing solo come prerequisito tecnico, con cap e controlli;
- tracciamento di ogni chiamata AI e del relativo consumo.

Non significa:

- solo modelli locali;
- qualità ridotta per principio;
- obbligo di evitare provider cloud;
- assenza di governance privacy;
- inviare pacchetti documentali completi ai provider.

## Principio operativo

TRAM non deve inviare a un modello AI l’intero pacchetto di gara.

La pipeline corretta è:

1. parsing, OCR, Excel e MPP con strumenti deterministici;
2. creazione di testo estratto, tabelle, chunks e riferimenti fonte;
3. selezione dei soli passaggi rilevanti per task;
4. chiamata AI con prompt specifico, schema atteso e budget;
5. salvataggio di fonte, provider, modello, prompt version, confidenza e stato;
6. review umana critical-first per output rischiosi.

## Provider candidati

| Provider | Costo V1 | Privacy e dati | Punti forti | Rischi o punti da chiarire | Uso candidato |
| --- | --- | --- | --- | --- | --- |
| Gemini API / AI Studio | Free tier disponibile; eventuale billing/prepay solo se necessario con cap minimo | In EEA/CH/UK va chiarito il regime effettivo tra Free, Paid Services e billing; Google dichiara che nei Paid Services prompt e risposte non sono usati per migliorare i prodotti, ma restano retention e abuse monitoring | Qualità attesa alta, modelli forti, long context, structured output | Verificare setup corretto per utenti EEA e documenti confidenziali; evitare auto-spend | Candidato forte per estrazioni complesse, sintesi, contraddizioni candidate e bozze di chiarimento |
| Mistral AI Studio / API | Experiment plan gratuito con rate limit; Scale è pay-as-you-go con spending limit | API servita da data center EU di default; nel piano Experiment input/output possono essere usati per training salvo opt-out; Scale non usa input/output per training secondo documentazione Mistral | Provider europeo, JSON mode, function calling, modelli buoni, OCR interessante per futuro | Free tier pensato per evaluation/prototyping; verificare opt-out training, rate limit reali, accesso ai modelli e idoneità privacy prima di L1/L2 | Candidato forte per L0 e per L1 solo dopo opt-out/policy review; OCR da valutare separatamente |
| Groq | Free plan con limiti per organizzazione | Groq dichiara che di default non conserva customer data per inference; Zero Data Retention configurabile; se dati trattenuti, location USA | Molto veloce, modelli open/open-weight, API compatibile | Verificare ZDR, data location e limiti prima di documenti confidenziali | Classificazione rapida, estrazioni brevi, confronto con Gemini |
| Cloudflare Workers AI | Free allocation giornaliera; oltre quota le operazioni devono fallire, non passare a paid | Cloudflare dichiara che non usa Customer Content per training o miglioramento senza consenso esplicito | Buona postura privacy, modelli open-source, integrazione cloud leggera | T1 L0 v0.2 non passato sull’envelope completo; modelli robusti in timeout e modello 8B non sufficiente | Micro-task L0, classificazioni semplici, fallback tecnico |
| Cerebras | Free tier con rate limits dichiarati | Privacy policy positiva su non-retention input/output, ma vanno chiariti trasferimenti extra-UE, DPA e termini inference prima di documenti riservati | Modelli grandi e veloci, structured outputs strict, ottimo candidato tecnico | Free tier non è base prodotto; qualità O&M e governance L1/L2 da validare | Benchmark tecnico L0/L1; non default finché privacy e qualità non sono chiuse |
| OpenRouter | Piano free con modelli gratuiti e limiti giornalieri; pay-as-you-go separato | OpenRouter non dichiara training sui dati cliente, ma le richieste passano ai provider sottostanti; controlli ZDR e data policy disponibili per account o richiesta | Un’unica API per molti modelli, free router, utile per benchmark rapido e fallback sperimentale | Modelli free variabili, rate limit bassi, routing casuale se si usa `openrouter/free`, provider terzi da verificare, EU in-region solo su piani non free/enterprise | Solo L0 all’inizio; L1 solo con modello pinned, ZDR/data policy verificata e approvazione |
| VPS gratuita con modello self-hosted | Gratis se rientra nel free tier infrastrutturale | Massimo controllo, soprattutto se documenti restano sul server controllato | Utile per dati sensibili o fallback offline | Lento su CPU, modelli più piccoli, manutenzione maggiore | Batch, test privacy-first, task non urgenti |
| OpenAI API | Non gratuita in modo stabile per TRAM V1 | Buona opzione futura se accettiamo costo e condizioni | Qualità e structured output forti | Fuori vincolo economico MVP | Solo benchmark futuro o V2/V3 paid |

## Regole di sicurezza e costo

- Ogni Tender deve poter disattivare l’AI esterna.
- Ogni documento deve poter essere marcato come “non inviabile a provider AI”.
- Prima di usare AI esterna su un pacchetto, TRAM deve cercare con parser/regole eventuali clausole su AI, riservatezza, data processing e uso di fornitori esterni.
- Se una clausola AI o privacy è presente e non analizzata, lo spazio resta in stato “AI esterna da validare”.
- Se un provider supera quota gratuita o budget, il job va sospeso con stato esplicito, non convertito a pagamento.
- Le chiamate AI devono salvare provider, modello, endpoint, prompt version, input hash, output hash, token o unità consumo, costo stimato, quota residua se disponibile, e motivazione del task.
- I prompt devono contenere solo i chunks necessari, non interi pacchetti.
- Gli output critici non diventano verità di dashboard senza validazione umana.

## Routing AI V1 proposto

| Task | Default V1 | Provider candidato | Gate umano |
| --- | --- | --- | --- |
| T1 document map/versioning | AI controllata + resolver deterministico | Gemini, Mistral; Cloudflare/Groq solo micro L0 | Ambigui e documenti critici |
| T2 timeline gara/contratto | Parser date/MPP + regole + AI leggera | Gemini, Mistral | Sì su date divergenti e milestone critiche |
| T3 deliverable di gara | Parser/tabelle + regole + AI leggera | Gemini, Mistral | Sì su checklist finale e deliverable sensibili |
| T4 requisiti O&M e KPI non finanziari | Parser/regole + AI controllata | Gemini, Mistral solo L1 minimizzato | Sì su mandatory, formule e compliance |
| T5 financials/pricing/payment | Parser Excel/PDF locale + AI su chunk ammessi + review | Gemini/Mistral candidati su L0/L1 minimizzato e approvato; L2 effettivo bloccato | Obbligatorio su output critici |
| T6 cost driver O&M | Regole + review + AI limitata | Gemini/Mistral solo se fonti L1 approvate | Obbligatorio |
| T7 contraddizioni candidate | Regole/confronti + AI spiegazione | Dipende dal livello fonte | Obbligatorio |
| T8 chiarimenti/Q&A | Template + review umana; AI opzionale | Nessun provider esterno default V1 | Approvazione umana obbligatoria |
| Dashboard summary | AI opzionale su dati validati o L0/L1 approvati | Gemini, Mistral, Cloudflare micro | Sì prima di uso interno consolidato |

## Benchmark iniziale

Il benchmark AI V1 va eseguito sui quattro pacchetti con task standardizzati:

1. `T1` document map e versioning;
2. `T2` timeline gara/contratto;
3. `T3` deliverable di gara;
4. `T4` requisiti O&M e KPI non finanziari;
5. `T5` financials, pricing e payment mechanism;
6. `T6` cost driver O&M;
7. `T7` contraddizioni candidate;
8. `T8` chiarimenti/Q&A.

Per ogni provider misureremo:

- accuratezza;
- qualità delle fonti;
- capacità di restituire JSON strutturato;
- falsi positivi;
- omissioni;
- velocità;
- limiti quota;
- rischio privacy;
- effort di integrazione;
- utilità reale per utenti esperti.

Il protocollo operativo del benchmark è documentato in:

- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-free-ai-benchmark-protocol.md`

La tassonomia T1-T8 è documentata in:

- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-tx-task-taxonomy-t1-t8.md`

Il primo dataset Copenhagen L0/L1 per il benchmark è documentato in:

- `/Users/Matteo/Documents/TRAM/docs/analysis/tram-copenhagen-m1-m4-free-ai-benchmark-dataset.md`

Il prompt/schema pack v0.1 è documentato in:

- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-free-ai-prompt-schema-pack-v0-1.md`

Il prompt/schema pack v0.2 è documentato in:

- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-free-ai-prompt-schema-pack-v0-2.md`

Il prompt/schema pack v0.3 con gate, privacy, classi documentali e minimizzazione è documentato in:

- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-free-ai-prompt-schema-pack-v0-3.md`

Il prompt/schema pack T2 timeline v0.1 è documentato in:

- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-free-ai-prompt-schema-pack-t2-timeline-v0-1.md`

Il prompt/schema pack T3 deliverable v0.1 è documentato in:

- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-free-ai-prompt-schema-pack-t3-deliverables-v0-1.md`

I prompt/schema pack T4-T8 v0.1 sono documentati in:

- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-free-ai-prompt-schema-pack-t4-requirements-kpi-v0-1.md`
- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-free-ai-prompt-schema-pack-t5-financials-payment-v0-1.md`
- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-free-ai-prompt-schema-pack-t6-cost-drivers-v0-1.md`
- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-free-ai-prompt-schema-pack-t7-contradictions-v0-1.md`
- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-free-ai-prompt-schema-pack-t8-query-draft-v0-1.md`

Prime evidenze T1 L0 v0.2:

- Gemini `gemini-2.5-flash-lite`: baseline-aware pass;
- Mistral `mistral-medium-3.5`: baseline-aware pass;
- Mistral `mistral-small-2603`: baseline-aware fail semantico.
- Groq `llama-4-scout`: baseline-aware fail; `gpt-oss-120b` bloccato da TPM/schema.
- Cerebras `llama3.1-8b`: schema strict pass, baseline-aware fail; `qwen-3-235b` da ritentare per traffico/quota.
- OpenRouter free models: test parziale non promosso per rate limit upstream o mancata aderenza allo schema.
- Cloudflare Workers AI: API e JSON Mode funzionano, ma T1 L0 v0.2 non è passato; il modello 8B fallisce la baseline semantica e i modelli più robusti provati vanno in timeout.

Evidenze T1 L0 v0.3:

- l’envelope con gate e minimizzazione funziona come struttura, ma aumenta la necessità di istruzioni e validazione;
- Gemini `gemini-2.5-flash-lite` ha rispettato JSON, privacy e gate, ma ha invertito `currentness` sulle coppie clean copy/track changes e v3/v2;
- Mistral `mistral-medium-3.5` ha restituito output quasi completo, ma ha mostrato un errore ricorrente su currentness D3 e un limite operativo `429 service_tier_capacity_exceeded` sul tier gratuito;
- nessun provider va promosso come fonte autonoma per `currentness`;
- TRAM deve risolvere `document_family`, `version` e `currentness` con regole deterministiche, usando l’AI per natura/ruolo e commenti sui casi ambigui.

Evidenze T1 L0 v0.3 hybrid:

- Gemini `gemini-2.5-flash-lite`: AI classification pass e deterministic resolver pass;
- Mistral `mistral-medium-3.5`: AI classification pass e deterministic resolver pass;
- il gateway locale compila privacy/gate/audit, quindi questi campi non dipendono dall’aderenza testuale del modello;
- il resolver corretto riconosce anche ID documento seguiti da underscore, per esempio `CM-X-OMRT3-TD-0020_Instruction`;
- la modalità hybrid è la direzione consigliata per T1 L0 nel MVP;
- la stessa modalità passa anche su un campione Luas di 19 item con revisioni `Rev n`, redline, codice project-level `TII400`, pricing, financial model, data room, schedules e technical annex.

Evidenze micro-routing v0.4:

- Cloudflare Workers AI `@cf/meta/llama-3.1-8b-instruct`: pass su 5/5 item L0 minimizzati;
- Groq `llama-3.3-70b-versatile`: pass su 5/5 item L0 minimizzati;
- OpenRouter passa solo con `google/gemma-4-26b-a4b-it:free`, mentre altri modelli free testati sono stati rate-limited upstream;
- Cerebras non è promosso: `qwen-3-235b-a22b-instruct-2507` bloccato da capacity e `llama3.1-8b` incompleto.

Evidenze T1 L0 stage-aware v0.4:

- Gemini `gemini-2.5-flash-lite`: raw output completo 21/21, stage pass, review sensibile pass e nessun campo vietato;
- Gemini raw non è perfettamente canonico sugli enum, quindi serve normalizzatore deterministico post-AI;
- Gemini + normalizzatore post-AI passa 21/21 sul benchmark compatto dei quattro pacchetti;
- Mistral `mistral-medium-3.5` non valutabile nel run v0.4 per `429 service_tier_capacity_exceeded`, quindi resta candidato ma non fallback affidabile se il tier gratuito è saturo.

Evidenze T2 timeline v0.1:

- dataset compatto da 19 eventi sui quattro pacchetti, con input L1 minimizzato;
- Gemini `gemini-2.5-flash-lite`: output completo, nessun campo temporale vietato, pass pipeline normalizzata;
- Mistral `mistral-medium-3.5`: output completo, raw pass e pipeline pass;
- date, orari, durate, timezone, conflitti e stato review restano responsabilità di parser/regole;
- l’AI è utile per normalizzare eventi e rendere leggibili le incertezze, non per scegliere la data corretta.

Evidenze T3 deliverable v0.1:

- dataset compatto da 22 deliverable sui quattro pacchetti, con input L1 minimizzato;
- Gemini `gemini-2.5-flash-lite`: output completo 22/22, nessun campo requisiti vietato, raw pass e pipeline pass;
- Mistral `mistral-medium-3.5`: output completo 22/22, nessun campo requisiti vietato, raw pass e pipeline pass;
- codici, obbligatorietà, limiti pagina, formati, pesi, deadline e valori economici restano responsabilità di parser/regole/review;
- l’AI è utile per normalizzare nome, tipo, area di submission, dominio O&M, dipendenze e incertezze, non per consolidare la checklist di gara come verità.

Raccomandazione provvisoria:

- Gemini `gemini-2.5-flash-lite` come candidato principale T1 L0;
- Mistral `mistral-medium-3.5` come candidato secondario forte e candidato T2;
- Cloudflare Workers AI solo per micro-task L0 o fallback tecnico;
- Groq solo per micro-task L0 o fallback tecnico;
- OpenRouter solo per smoke L0 con modello pinned;
- Cerebras non promosso, salvo ritest tecnico futuro.
- Per T1 L0 v0.4, usare Gemini con normalizzatore post-AI e resolver deterministico; ritentare Mistral quando disponibile.
- Per T2 timeline v0.1, usare parser/regole come fonte primaria e Gemini o Mistral solo per normalizzazione evento e incertezze.
- Per T3 deliverable v0.1, usare parser/regole come fonte primaria e Gemini o Mistral solo per normalizzazione semantica, dipendenze e incertezze.
- Per T4 requisiti O&M e KPI non finanziari, usare parser/regole come fonte primaria e Gemini o Mistral solo per dominio O&M, clustering, impatto candidato e incertezze.
- Per T5 financials/pricing/payment, usare parser locale, AI su chunk ammessi e review; provider esterni sono ammessi per L0/L1 minimizzati e approvati, non per L2 effettivo.
- Per T6 cost driver, usare regole e review come base, con AI limitata solo su input L1 approvati e senza importi inventati.
- Per T7 contraddizioni candidate, usare confronti deterministici come trigger e AI solo per spiegazione prudente se il livello privacy lo consente.
- Per T8 chiarimenti/Q&A, usare template e approvazione umana obbligatoria; AI esterna non è default V1.

Documento decisionale:

- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-free-ai-provider-recommendation-v0-1.md`

Report:

- `/Users/Matteo/Documents/TRAM/docs/analysis/tram-copenhagen-m1-m4-t1-l0-v0-2-gemini-provider-schema-evaluation.md`
- `/Users/Matteo/Documents/TRAM/docs/analysis/tram-copenhagen-m1-m4-t1-l0-v0-2-mistral-provider-schema-evaluation.md`
- `/Users/Matteo/Documents/TRAM/docs/analysis/tram-copenhagen-m1-m4-t1-l0-v0-2-groq-provider-schema-evaluation.md`
- `/Users/Matteo/Documents/TRAM/docs/analysis/tram-copenhagen-m1-m4-t1-l0-v0-2-cerebras-provider-schema-evaluation.md`
- `/Users/Matteo/Documents/TRAM/docs/analysis/tram-copenhagen-m1-m4-t1-l0-v0-2-cloudflare-provider-schema-evaluation.md`
- `/Users/Matteo/Documents/TRAM/docs/analysis/tram-copenhagen-m1-m4-t1-l0-v0-3-gemini-mistral-rerun-evaluation.md`
- `/Users/Matteo/Documents/TRAM/docs/analysis/tram-copenhagen-m1-m4-t1-l0-v0-3-hybrid-resolver-evaluation.md`
- `/Users/Matteo/Documents/TRAM/docs/analysis/tram-dublin-luas-om-t1-l0-v0-3-hybrid-resolver-evaluation.md`
- `/Users/Matteo/Documents/TRAM/docs/analysis/tram-ai-routing-micro-benchmark-v0-4-evaluation.md`
- `/Users/Matteo/Documents/TRAM/docs/analysis/tram-t1-l0-v0-4-stage-aware-compact-benchmark-evaluation.md`
- `/Users/Matteo/Documents/TRAM/docs/analysis/tram-t2-timeline-compact-benchmark-evaluation.md`
- `/Users/Matteo/Documents/TRAM/docs/analysis/tram-t3-deliverables-compact-benchmark-evaluation.md`
- `/Users/Matteo/Documents/TRAM/docs/analysis/tram-v1-free-ai-provider-readiness-status-2026-05-13.md`

## Fonti verificate

- Gemini API Terms: https://ai.google.dev/gemini-api/terms
- Gemini API pricing: https://ai.google.dev/gemini-api/docs/pricing
- Gemini API billing: https://ai.google.dev/gemini-api/docs/billing
- Gemini API abuse monitoring: https://ai.google.dev/gemini-api/docs/usage-policies
- Cloudflare Workers AI pricing: https://developers.cloudflare.com/workers-ai/platform/pricing/
- Cloudflare Workers AI data usage: https://developers.cloudflare.com/workers-ai/platform/data-usage/
- Cloudflare Workers AI privacy: https://developers.cloudflare.com/workers-ai/platform/privacy/
- Cloudflare Workers AI JSON Mode: https://developers.cloudflare.com/workers-ai/features/json-mode/
- Groq rate limits: https://console.groq.com/docs/rate-limits
- Groq data policy: https://console.groq.com/docs/your-data
- Cerebras rate limits: https://inference-docs.cerebras.ai/support/rate-limits
- Cerebras pricing: https://www.cerebras.ai/pricing
- Cerebras structured outputs: https://inference-docs.cerebras.ai/capabilities/structured-outputs
- Cerebras privacy policy: https://www.cerebras.ai/privacy-policy
- Mistral rate limits and usage tiers: https://docs.mistral.ai/admin/user-management-finops/tier
- Mistral API keys and Experiment/Scale note: https://docs.mistral.ai/admin/security-access/api-keys
- Mistral API chat completions and response format: https://docs.mistral.ai/api/
- Mistral known limitations: https://docs.mistral.ai/resources/known-limitations
- Mistral data training policy: https://help.mistral.ai/en/articles/347617-do-you-use-my-user-data-to-train-your-artificial-intelligence-models
- Mistral usage limits: https://docs.mistral.ai/admin/user-management-finops/usage-limits
- Mistral Experiment plan help center: https://help.mistral.ai/en/articles/455206-how-can-i-try-the-api-for-free-with-the-experiment-plan
- OpenRouter pricing: https://openrouter.ai/pricing
- OpenRouter free models router: https://openrouter.ai/docs/guides/routing/routers/free-models-router
- OpenRouter provider logging: https://openrouter.ai/docs/guides/privacy/provider-logging
- OpenRouter ZDR: https://openrouter.ai/docs/guides/features/zdr

## Decisioni ancora aperte

1. Verificare sul progetto Gemini reale se free tier, billing, prepay e spend cap consentono zero o quasi zero costo senza perdere il regime privacy desiderato.
2. Verificare su Mistral Experiment l’opt-out training, i modelli disponibili e i rate limit effettivi del workspace.
3. Collegare Cloudflare e Groq alla futura route micro-task L0, evitando ulteriori run T1 complete sull’envelope Copenhagen.
4. Verificare se OpenRouter può essere usato con modello pinned, ZDR per-request e disabilitazione provider training anche sui modelli free.
5. Verificare la documentazione privacy di Cerebras prima di inviare documenti riservati.
6. Raffinare la matrice classi documentali x provider x privacy level su altri pacchetti oltre Copenhagen e Luas.
7. Estendere la policy di redazione o minimizzazione dei chunks a tutte le classi `dc_*`.
8. Trasformare il registro chiamate AI e i gate privacy/costo in schema tecnico durante lo sviluppo.
9. Estendere T1 hybrid al full-package L0 Luas e Copenhagen quando serve misurare copertura totale, dopo aver consolidato il campione.
10. Trasformare il normalizzatore T2 v0.1 in specifica `TimelineEventNormalizer`.
11. Definire una regola calendar-aware per conflitti tipo “almeno trenta giorni prima” rispetto a una data assoluta.
12. Trasformare il normalizzatore T3 v0.1 in specifica `TenderDeliverableNormalizer`.
13. Definire parser dedicati per tabelle deliverable, submission requirements, PQQ envelope e modelli economici senza inviare workbook completi a provider esterni.
14. Usare specifica, config e fixture normalizzatori T4-T8 v0.1 come base della futura implementazione.
15. Aggiungere scheduler quota-aware per Gemini e gestione capacity/retry per Mistral quando inizierà il codice.

## Prossimo passo consigliato

Usare la specifica viste dashboard MVP, il registro `indicator_key` P0/P1 e la data policy per spazio per preparare fixture applicative. T5 deve avere casi Financials analizzati dall’AI e casi bloccati solo per L2 effettivo o policy incompatibile.
