# TRAM V1 - Checklist sviluppo e verifica MVP v0.1

Data: 2026-05-13  
Stato: checklist operativa per MVP/V0 con prototipo avviato  
Ambito: ordine di implementazione, controlli documentali, fixture, permessi, stati dashboard, AI gate e smoke UI

## Scopo

Questo documento definisce la checklist operativa per costruire e verificare il MVP/V0 per slice.

Serve a chiarire:

- in che ordine implementare il MVP/V0 largo;
- quali prerequisiti devono essere chiusi prima di considerare pronta una slice;
- quali verifiche minime devono esistere;
- quali test devono coprire fixture, permessi, review, dashboard state e AI gate;
- quali criteri impediscono di dichiarare pronto uno slice.

## Fonti governanti

La checklist deriva da:

- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-product-brief.md`
- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-mvp-roadmap-and-success-criteria-v0-1.md`
- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-mvp-functional-wireframes-v0-1.md`
- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-mvp-application-fixtures-v0-1.md`
- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-mvp-data-contract-v0-1.md`
- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-mvp-architecture.md`
- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-tender-data-policy-v0-1.md`
- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-ingestion-to-dashboard-workflow-v0-1.md`

## Decisione

L’implementazione deve procedere per slice verticali su fixture, non per grandi blocchi astratti.

Le slice elencate qui sono unità operative della **Fase 4 - Prototipo applicativo su fixture**. Le fasi della roadmap restano il livello superiore; le slice servono solo a rendere costruibile e verificabile il prototipo applicativo.

Ordine consigliato aggiornato dopo la decisione “dashboard direzionale first”:

1. setup progetto e guardrail;
2. fixture e data contract direzionali;
3. audit widget dashboard e integrazione selettiva del mock;
4. overview direzionale gara;
5. shell UI e route;
6. dashboard aggregata;
7. document map T1;
8. review queue e pannello fonte;
9. timeline T2 e deliverable T3;
10. viste T4-T8;
11. audit e data policy;
12. ingestion/parsing locale controllato;
13. smoke end-to-end su mini pacchetto sintetico.

## Prerequisiti prima delle slice applicative

Non dichiarare pronta una slice applicativa finché i prerequisiti pertinenti non sono chiusi o esplicitamente accettati:

| Prerequisito | Stato richiesto |
| --- | --- |
| Framework app | Next.js App Router scelto |
| Package manager | npm scelto |
| Storage documentale MVP | OCI Object Storage Always Free come target condiviso; filesystem locale solo per sviluppo/fixture; fallback filesystem/block volume su VPS |
| Fixture format | JSON fixture pack come source of truth; validatore TypeScript/Zod quando nasce l’app; seed DB futuro derivato |
| Segreti | policy minima per `.env`, chiavi e file esclusi |
| Git | se inizializzato, `.gitignore` deve seguire `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-gitignore-and-secrets-policy-v0-1.md` |
| Runbook OCI | runbook minimo definito in `/Users/Matteo/Documents/TRAM/docs/runbooks/tram-v1-oci-mvp-runtime-and-storage-runbook-v0-1.md` |
| Data contract | questo contract o versione successiva accettata |
| UI scope | MVP/V0 largo confermato |
| Documenti reali | nessun uso in fixture o repo |

Se uno di questi punti resta aperto, la slice deve restare marcata come parziale o prototipale.

## Slice 0 - Setup progetto

### Obiettivo

Preparare una base tecnica senza introdurre runtime non decisi o lock-in non documentato.

### Checklist implementazione

- usare Next.js App Router;
- usare npm;
- creare progetto app TypeScript;
- configurare lint/typecheck/test secondo stack;
- creare struttura route coerente con wireframe;
- creare cartella fixture non riservate;
- configurare `.gitignore` per segreti, documenti reali, output OCR e working data;
- aggiungere script di verifica documentale se utile;
- documentare comando dev, build e test.

### Verifiche

- `git status --short`, se Git esiste;
- comando lint;
- comando typecheck;
- comando test base;
- controllo che fixture non puntino a `data/packages/`;
- controllo che `.env`, chiavi e documenti reali non siano tracciabili.

### Stop condition

Fermarsi se la scelta framework o storage cambia architettura rispetto ai documenti governanti.

## Slice 1 - Dashboard direzionale, fixture e data contract

### Obiettivo

Rendere l’overview gara una dashboard direzionale utile, prima di ampliare le viste specialistiche.

La dashboard deve separare:

- stato della gara, ricavato da documenti/metadati;
- stato interno dell’analisi TRAM, alimentato da workflow o input manuali minimi;
- stato dell’offerta, escluso dal MVP salvo futuri input espliciti V2.

Le idee già definite su pipeline, review, T1-T8 e audit restano valide, ma vengono dopo la prima superficie direzionale.

Nota di riallineamento del 2026-05-15: questa slice include anche l’audit widget e l’integrazione selettiva del mock canonico. Non è un preliminare esterno alla Fase 4: è parte del lavoro di prototipo applicativo su fixture.

### Checklist implementazione

- creare manifest fixture;
- usare `docs/design/tram-v1-dashboard-widget-audit-v0-1.md` come filtro per i widget overview;
- integrare dal mock solo grammatica visuale stabile: shell, sidebar, route strip, token, T-node e pannello fonte;
- definire blocchi overview approvati: identità gara, metriche headline, route strip, fonte aperta/inspector, prossime decisioni, priorità da validare e alert mirati;
- eliminare dall’overview preview ridondanti di tutte le viste T1-T8;
- spostare Q&A esteso, Financials detail, audit e viste specialistiche nelle route dedicate;
- fare un pass UX/visuale sull’overview reale dopo la riduzione dei widget;
- aggiungere stato interno manuale minimo: owner, area, stato tecnico/economico/amministrativo, prossima azione e note sintetiche;
- creare quattro gare archetipali;
- creare documenti fixture T1;
- creare source reference sintetiche;
- creare indicatori P0/P1;
- creare review item T1-T8;
- creare record specialistici T2-T8;
- creare audit event e AI gate;
- creare capability per owner/editor/reviewer/viewer;
- creare validatore fixture.

### Verifiche

- ogni `indicator_key` esiste nel registro;
- ogni `ReviewItem` ha risk, status, blocking e fonte o motivo tecnico;
- ogni source reference punta a documento fixture;
- nessun path contiene `data/packages/`;
- nessun valore economico reale;
- ogni stato dashboard è rappresentato;
- ogni stato valore è rappresentato;
- ogni route ha dati fixture minimi.
- nessun indicatore suggerisce percentuali di avanzamento offerta se l’offerta non è caricata.
- ogni widget overview ha fonte dati, stato e azione o motivo di consultazione;
- desktop e mobile non hanno overflow, clipping o testi incoerenti.

### Stop condition

Fermarsi se servono dati reali per far funzionare una vista MVP. In quel caso la vista va ridotta o la fixture va resa più espressiva.

## Slice 2 - Shell UI e route

### Obiettivo

Creare navigazione e layout comune, senza ancora completare tutte le logiche.

### Checklist implementazione

- top bar;
- sidebar desktop;
- navigazione mobile compatta;
- route `/tenders`;
- route gara con sidebar T1-T8;
- stati loading, empty, blocked, error;
- pannello fonte vuoto;
- layout responsive base.

### Verifiche

- tutte le route dei wireframe esistono;
- route non implementate mostrano stato controllato, non pagina rotta;
- mobile non ha overflow incoerenti;
- testi UI sono in italiano;
- nessuna landing marketing.

### Stop condition

Fermarsi se la shell impedisce tabelle dense o drawer fonte, perché sono pattern core del prodotto.

## Slice 3 - Dashboard aggregata

### Obiettivo

Mostrare le gare e il loro stato operativo.

### Checklist implementazione

- tabella gare;
- filtri per stato;
- ordinamento per scadenza;
- badge dashboard state;
- link a overview;
- link a review bloccanti;
- policy/AI status sintetico.

### Verifiche

- quattro gare fixture visibili;
- stati `draft`, `partially_validated`, `validated_internal`, `stale_due_to_new_docs`, `open_critical_issues` coperti;
- riga con blocker apre review filtrata;
- gara in prequalifica non è trattata come ITT completo;
- Financials mostra fonte, stato AI e review; nasconde solo L2 effettivo non autorizzato.

### Stop condition

Non proseguire se la dashboard aggregata non distingue stato affidabile, stale e criticità aperte.

## Slice 4 - Overview gara

### Obiettivo

Mostrare la panoramica operativa della gara.

### Checklist implementazione

- header gara;
- alert band;
- headline P0;
- sezioni T1-T8;
- policy summary;
- recent review items;
- recent audit events;
- link a fonte o review da ogni headline.

### Verifiche

- ogni headline P0 ha fonte, review item o stato non disponibile;
- T5 può mostrare dettaglio economico del Tender nella vista Financials, mentre overview resta sintetica;
- T7 mostra candidate issue;
- T8 mostra thread di chiarimento con eventuali bozze da approvare;
- nuovo documento produce stato stale;
- blocker produce `open_critical_issues`.

### Stop condition

Non dichiarare pronta l’overview se un dato P0 appare senza stato o fonte.

## Slice 5 - Document map T1

### Obiettivo

Mostrare documenti, versioni, stato documento/versione e privacy.

### Checklist implementazione

- tabella documenti;
- filtri stato documento/versione, privacy, family e review;
- badge current/superseded/candidate/unknown;
- variant clean/track changes/redline/workbook;
- link fonte;
- review item su stato documento/versione ambiguo;
- blocco L2 per viewer.

### Verifiche

- clean copy e track changes sono distinguibili;
- lo stato documento/versione non appare come deciso da AI sola;
- documento L2 non è apribile da viewer;
- version conflict produce review;
- documento nuovo cambia stato dashboard.

### Stop condition

Non proseguire a T2/T3 se T1 non rappresenta stato documento/versione e versioning in modo affidabile.

## Slice 6 - Review queue e pannello fonte

### Obiettivo

Rendere operativo il modello critical-first.

### Checklist implementazione

- lista review item;
- filtri rischio, stato, famiglia, blocking;
- preset blocca dashboard, Financials/KPI, versioni/timeline, Q&A;
- dettaglio item;
- azioni conferma, correggi, contesta, da chiarire, superato, non applicabile;
- storico validation action;
- pannello fonte condiviso;
- aggiornamento dashboard state dopo azione.

### Verifiche

- reviewer può chiudere blocker;
- editor non può chiudere blocker;
- viewer non può validare;
- correzione critica richiede motivo;
- chiarimento non approvato resta bloccante quando incide sulla dashboard;
- fonte L2 mostra blocked reason se non autorizzata.

### Stop condition

Non completare altre viste specialistiche se la review queue non aggiorna stati e blocker.

## Slice 7 - Timeline T2 e deliverable T3

### Obiettivo

Rendere operative timeline e checklist.

### Checklist implementazione T2

- vista timeline;
- tabella eventi;
- date relative;
- conflitti MPP/PDF;
- source refs;
- link deliverable;
- review su milestone critica.

### Checklist implementazione T3

- checklist deliverable;
- filtri area/mandatory/sensitive/review;
- deadline collegata;
- deliverable economico con privacy level derivato dalla fonte;
- link timeline e fonte.

### Verifiche

- dashboard non mostra data unica se esiste conflitto aperto;
- data relativa resta `unclear` finché non validata;
- deliverable mandatory senza fonte genera review;
- deliverable economico resta sensibile;
- deadline T2 non validata blocca deliverable collegato.

### Stop condition

Non dichiarare T2/T3 pronti se AI può modificare date, obbligatorietà, formati o page limit senza review.

## Slice 8 - Viste T4-T8

### Obiettivo

Completare il MVP largo con viste specialistiche coerenti con guardrail.

### T4 requisiti/KPI

Verifiche:

- requisiti mandatory hanno stato;
- KPI con formula/target genera review;
- compliance cyber/data è L2 o review;
- KPI economico rimanda a T5.

### T5 Financials

Verifiche:

- viewer vede Financials salvo restrizioni di ruolo o L2 effettivo;
- valori economici non validati non sono in overview;
- parser issue è visibile;
- AI può analizzare Financials se policy, provider, quota e minimizzazione lo consentono;
- AI esterna risulta bloccata solo per L2 effettivo o clausole incompatibili.

### T6 cost driver

Verifiche:

- driver high/critical ha review;
- driver financial-linked rimanda a T5;
- nessun importo inventato;
- `amount_estimate` resta null.

### T7 criticità candidate

Verifiche:

- ogni issue è candidate finché non validata;
- fonti A/B sono apribili o mostrano blocco;
- severity non diventa verità senza review;
- thread di chiarimento nasce solo da item ammesso.

### T8 Q&A

Verifiche:

- nessun invio automatico;
- `blocked_sensitive` non esportabile;
- `approved_for_export` richiede owner o reviewer delegato;
- `answered` apre review quando modifica timeline, deliverable, requisiti o dashboard;
- source refs insufficienti impediscono approvazione.
- import Q&A Excel/PDF copre almeno colonne No., Subject, Document reference, Question, Answer, Clarification/Correction;
- registro Q&A parziale o con allegati mancanti non può chiudere analisi AI o stato documento/versione.

### Stop condition

Fermarsi se Financials, criticità candidate o Q&A sembrano più “conclusioni automatiche” che proposte review-first.

## Slice 9 - Audit e data policy

### Obiettivo

Rendere verificabile cosa ha fatto TRAM e perché.

### Checklist implementazione

- tab job;
- tab AI calls;
- tab policy;
- tab parser issues;
- tab azioni utente;
- `AiGateDecision`;
- `AiCallSummary`;
- `TenderPolicySummary`;
- stato quota;
- blocco L1/L2.

### Verifiche

- L1 pending owner è visibile;
- L2 blocked è visibile;
- quota esaurita sospende job;
- nessun fallback paid;
- provider policy stale blocca o avvisa;
- validation action compare in audit.

### Stop condition

Non attivare AI esterna in prototipo se audit e gate non sono visibili.

## Slice 10 - Ingestion/parsing locale controllato

### Obiettivo

Collegare la UI alla pipeline documentale locale senza rompere policy dati.

### Checklist implementazione

- inventario file;
- hash;
- estensione e mime type;
- page count se disponibile;
- parser status;
- source reference;
- parser issues;
- job state;
- output T1 iniziale.

### Verifiche

- nessun contenuto integrale nei log;
- file non leggibile diventa parser issue;
- OCR fallito diventa retry o review tecnica;
- MPP non parsabile diventa review tecnica;
- documenti reali restano fuori da Git;
- output parsing non usa AI esterna senza gate.

### Stop condition

Fermarsi se un parser richiede di committare documenti reali, output OCR riservati o path sensibili.

## Slice 11 - Smoke end-to-end

### Obiettivo

Verificare che il MVP largo funzioni come flusso utente, almeno su fixture e mini pacchetto sintetico.

### Smoke fixture

Passa se:

- `/tenders` carica quattro gare;
- overview di ogni gara apre;
- ogni route T1-T8 apre;
- review queue filtra item;
- conferma/correzione cambia stato;
- source drawer apre;
- L2 è bloccato per viewer;
- chiarimento non può essere inviato automaticamente;
- audit mostra almeno un job e un AI gate;
- dashboard state cambia su blocker e stale.

### Smoke mini pacchetto sintetico

Passa se:

- upload/inventario funziona;
- parsing base produce metadati;
- T1 produce document map minima;
- parser issue è tracciato;
- source reference sintetica o locale controllata è apribile;
- dashboard resta `draft` o `partially_validated`, non validata falsamente.

## Verifiche documentali continue

Da eseguire dopo modifiche docs:

```bash
find . -path './.venv' -prune -o -path './data/packages' -prune -o -name '*.md' -type f -print | awk -F/ '{print $NF}' | sort | uniq -d
```

```bash
rg -n "perche|piu|attivita|qualita|criticita|possibilita|responsabilita|modalita" docs data --glob '*.md' --glob '!data/packages/**'
```

Controlli manuali:

- nessun documento duplicato con nome generico;
- link ai documenti governanti aggiornati;
- debiti non chiusi annotati;
- nessun riferimento a dati reali o segreti.

## Verifiche fixture

Quando esisteranno file fixture, aggiungere controlli automatici per:

- `indicator_key` presente nel registro;
- stati ammessi;
- privacy level ammesso;
- route coverage;
- role coverage;
- no path `data/packages/`;
- no `.env`, chiavi o path SSH;
- no valori economici reali;
- no source reference senza documento fixture;
- no chiarimento `sent_to_authority` o `approved_for_export` senza approvazione.

## Verifiche permessi

Test minimi:

| Scenario | Atteso |
| --- | --- |
| viewer apre Financials L2 | dettaglio bloccato |
| editor prova a chiudere blocker | azione disabilitata |
| reviewer chiude blocker | stato aggiornato |
| owner approva L1 | gate passa se policy ok |
| quota esaurita | job sospeso |
| chiarimento L2 | export bloccato |
| reviewer non delegato approva chiarimento | azione bloccata |

## Verifiche dashboard state

Test minimi:

| Condizione | Stato atteso |
| --- | --- |
| nessuna estrazione sufficiente | `draft` |
| P0 parziali | `partially_validated` |
| P0 validati e nessun blocker | `validated_internal` |
| documento nuovo dopo review | `stale_due_to_new_docs` |
| blocker critico aperto | `open_critical_issues` |

Regola: `open_critical_issues` ha precedenza su `stale_due_to_new_docs`.

## Verifiche AI gate

Test minimi:

- T1 L0 ammesso se provider e quota disponibili;
- T2/T3 L1 richiede policy approvata;
- T5 ammesso verso provider esterni se L0/L1, minimizzato e approvato; L2 effettivo resta bloccato;
- T7 non usa AI come decisore autonomo;
- T8 richiede approvazione umana;
- quota esaurita sospende job;
- nessun fallback paid automatico;
- ogni AI call ha provider, modello, prompt version, input hash, output hash e costo stimato.

## Criteri di pronto per codice

Si può iniziare codice applicativo quando:

- il maintainer approva esplicitamente;
- framework Next.js App Router e package manager npm sono confermati;
- fixture format JSON è scelto;
- storage prototipo/MVP condiviso è deciso;
- segreti e documenti reali sono esclusi;
- data contract è accettato;
- questa checklist è accettata come gate operativo.

Nota di riallineamento del 2026-05-13: lo scaffold tecnico già creato resta una base anticipata approvata dal maintainer. Nuove feature applicative non devono però avanzare oltre finché la Fase 1 non è chiusa con mock visuali desktop/mobile e direzione visiva minima.

## Criteri di non pronto

Non iniziare codice se:

- serve ancora decidere il perimetro MVP largo;
- le fixture richiedono dati reali;
- non è chiaro come proteggere L2;
- non esiste modo di testare permessi;
- non esiste modo di calcolare dashboard state;
- AI gate non è rappresentato;
- Q&A può sembrare inviato o approvato automaticamente;
- Financials appare come valori liberi in overview senza fonte, stato AI o review.

## Debiti non chiusi

- Inizializzare Git quando la base applicativa verrà trattata come repo.
- Completare l’allineamento tra data contract documentale e tipi TypeScript già avviati.
- Rafforzare il validatore fixture TypeScript/Zod già avviato con controlli su registro `indicator_key`.
- Creare mock visuali desktop/mobile come chiusura Fase 1B.
- Definire direzione visiva minima Fase 1C: palette, tipografia, densità, componenti base e wordmark provvisorio.
- Rimandare brand system esteso, naming definitivo e logo completo a dopo il primo mock dashboard validato.
- Ampliare il runbook dev quando cresceranno worker, database e deploy.

## Prossimo passo consigliato

Chiudere la Fase 1: prima mock visuali desktop/mobile delle viste principali, poi direzione visiva minima e brand light. Solo dopo riprendere ordinatamente Slice 1 su overview gara, fixture direzionali, stato interno analisi TRAM, data contract tecnico e validatore automatico.
