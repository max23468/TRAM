# TRAM V1 - Riallineamento stato Slice MVP/V0

Data: 2026-05-13  
Stato: riallineamento operativo  
Ambito: Slice 0 e Slice 1 del MVP, letto come V0 operativa

## Scopo

Questo documento non sostituisce la roadmap MVP/V0 e non cambia l’ordine già deciso.

Serve a distinguere tre livelli che si sono sovrapposti durante il lavoro:

- roadmap V1, cioè la traiettoria completa della prima versione prodotto;
- MVP/V0, cioè la prima versione interna navigabile, verificabile e utile su fixture;
- slice, cioè pezzi verticali piccoli che rendono costruibile e verificabile la V0.

Nel piano corrente le slice operative appartengono alla **Fase 4 - Prototipo applicativo su fixture** della roadmap MVP/V0. Non sono nuove fasi prodotto e non cambiano l’ordine Fase 0, Fase 1, Fase 2, Fase 3, Fase 4 già definito.

Il documento parte da Slice 0 e Slice 1 perché sono il punto in cui è nato il disallineamento tra piano iniziale e prototipo già creato.

## Legenda

| Stato | Significato |
| --- | --- |
| Fatto | Esiste nel workspace ed è stato verificato almeno a livello coerente con la slice. |
| Parziale | Esiste come prototipo, documento o base tecnica, ma non soddisfa ancora tutti i criteri della slice. |
| Da fare | Non è ancora implementato, verificato o deciso. |

## Stato generale del workspace

| Area | Stato | Nota |
| --- | --- | --- |
| Repository Git | Da fare | `/Users/Matteo/Documents/TRAM` non è ancora una repo Git inizializzata. |
| Prototipo app | Parziale | Esiste una app Next.js navigabile su fixture, quindi il codice è già partito prima della chiusura formale delle slice. |
| Dati reali | Fatto | Le fixture dichiarano `contains_real_tender_data=false` e i test controllano che non puntino a path riservati. |
| Rotte UI | Parziale | Le rotte principali esistono sotto `/tenders`, ma alcune pagine sono ancora anteprime o viste specialistiche leggere. |
| Nomenclatura UI | Parziale | I documenti governanti sono stati riallineati su `Tender`, `Q&A`, `Criticità`, `Financials` e `Deliverables`; `gara` resta traduzione italiana o contesto descrittivo, non label primaria. |

## Fase 0

Stato: chiusa formalmente il 2026-05-13 come baseline MVP/V0.

La chiusura non significa che tutta la V0 sia costruita. Significa che perimetro, stack, dati, guardrail, roadmap, fixture e criteri di successo sono sufficienti per avanzare per slice senza riaprire ogni decisione di base.

## Slice 0 - Setup progetto

Obiettivo originario: preparare una base tecnica senza introdurre runtime non decisi o lock-in non documentato.

| Elemento | Stato | Evidenza / nota |
| --- | --- | --- |
| Next.js App Router | Fatto | Progetto presente con `src/app` e rotte App Router. |
| npm | Fatto | `package-lock.json` e script npm presenti. |
| TypeScript | Fatto | `tsconfig.json`, file `.ts/.tsx` e script `typecheck` presenti. |
| Dipendenze latest decise | Fatto | `package.json` usa versioni recenti di Next.js, React, TypeScript, Tailwind e Vitest. |
| Script `dev`, `build`, `lint`, `typecheck`, `test`, `verify` | Fatto | Presenti in `package.json`. |
| `.gitignore` per segreti, runtime, pacchetti riservati e output locali | Fatto | Include `.env`, chiavi, `.oci/`, `data/packages/`, working data, storage, report, export, `.DS_Store`. |
| `.env.example` | Fatto | Presente nel workspace. |
| Fixture JSON sintetiche | Fatto | `data/fixtures/manifest.json` e fixture principali presenti. |
| Validazione fixture | Fatto | Test Vitest su caricamento fixture, archetipi e path riservati. |
| Storage adapter locale/OCI | Fatto | Adapter filesystem e OCI fail-closed presenti con test dedicati. |
| Struttura route coerente con decisione “Tender” | Parziale | Il codice usa `/tenders`; alcuni documenti precedenti e naming tecnico possono ancora usare termini storici. |
| Runbook comandi app | Parziale | I comandi esistono in `package.json`; manca ancora un runbook breve di sviluppo frontend se lo vogliamo rendere governato. |
| Inizializzazione Git | Da fare | Non è requisito bloccante per prototipo locale, ma serve prima di trattare TRAM come repo applicativa. |
| Pulizia artefatti locali | Parziale | `.gitignore` copre gli artefatti, ma nel workspace esistono `.DS_Store`, `.next` e file generati locali. |

### Valutazione Slice 0

Slice 0 è sostanzialmente costruita, ma non la considererei ancora formalmente chiusa.

Motivo: la base tecnica esiste e i guardrail principali sono presenti, però prima della chiusura formale conviene fare un ultimo giro su:

- pulizia artefatti locali non necessari;
- allineamento minimo dei documenti che ancora parlano come se il codice non fosse iniziato;
- decisione se inizializzare Git adesso o dopo la prossima revisione UI.

## Slice 1 - Dashboard direzionale, fixture e data contract

Obiettivo originario: rendere l’overview gara una dashboard direzionale utile, prima di ampliare le viste specialistiche.

| Elemento | Stato | Evidenza / nota |
| --- | --- | --- |
| Dashboard gara su `/tenders/:tender_id/overview` | Parziale | Esiste ed è navigabile, ma è ancora un prototipo visivo/funzionale. |
| Dashboard aggregata `/tenders` | Parziale | Esiste una vista gare, ma non è ancora la dashboard gestionale completa della V0. |
| Quattro archetipi gara | Fatto | Le fixture coprono Copenhagen, Dublin Luas, Milano e MetroLink come archetipi sintetici. |
| Manifest fixture | Fatto | Manifest sintetico presente in `data/fixtures/manifest.json`. |
| Data contract MVP | Parziale | Documento e schema applicativo esistono, ma vanno riallineati a `Tender`, Q&A e stato reale del codice. |
| Documenti fixture T1 e source reference | Parziale | Presenti nelle fixture, ma non ancora verificati contro tutti i criteri del contract e del registro indicatori. |
| Indicatori P0/P1 | Parziale | Presenti come base fixture/UI, ma manca ancora una verifica completa `indicator_key` contro il registro governante. |
| Review item T1-T8 | Parziale | Esistono item e stati, ma la review queue applicativa non è ancora completa. |
| Record specialistici T2-T8 | Parziale | Le viste esistono e alcune fixture alimentano le sezioni, ma molte sono ancora anteprime. |
| Q&A come fonte gara integrativa | Parziale | Il registro Q&A è stato reso più compatto e navigabile; resta da completare la riconciliazione con documenti, allegati e fonti. |
| Stato interno analisi TRAM | Parziale | È presente come concetto e in parte come UI, ma non è ancora un workflow manuale strutturato. |
| Pannello fonte da headline | Da fare | È previsto nella roadmap, ma non è ancora implementato come esperienza completa. |
| Permessi owner/editor/reviewer/viewer | Parziale | I concetti sono documentati; enforcement UI/applicativo non ancora completo. |
| Audit e AI gate visibili | Parziale | Esistono vista e fixture, ma resta da completare il flusso verificabile. |
| Nessun avanzamento offerta inventato | Fatto | La dashboard non deve e non risulta dover stimare qualità o avanzamento dell’offerta non caricata. |

### Valutazione Slice 1

Slice 1 è iniziata e ha già una base navigabile, ma non è chiudibile come slice completa.

Il punto più importante non è aggiungere nuove viste: è rendere la dashboard una vera superficie direzionale, cioè capace di mostrare in modo immediato:

- caratteristiche base della gara;
- stato dei documenti e delle versioni;
- scadenze e deliverables rilevanti;
- criticità e blocker;
- Q&A ricevuti o mancanti che cambiano la lettura della documentazione;
- stato interno dell’analisi TRAM, solo quando alimentato da workflow o input manuali.

## Prototipo anticipato rispetto al piano

Alcuni pezzi appartengono formalmente a slice successive, ma sono già stati anticipati per rendere la demo navigabile:

| Pezzo anticipato | Slice naturale | Come trattarlo ora |
| --- | --- | --- |
| Shell e sidebar laterale | Slice 2 | Tenerla, ma rifinirla senza farle guidare la roadmap. |
| Rotte specialistiche T2-T8 | Slice 4 e successive | Tenerle come anteprime e completarle in ordine. |
| Registro Q&A compatto | Slice 8 / Q&A | Tenerlo perché risponde a un bisogno reale, ma completare dopo il cuore direzionale. |
| Avvisi dismissibili | UI trasversale | Tenerli come pattern per avvisi informativi, non per blocker. |
| Redirect legacy `/gare` verso `/tenders` | Compatibilità temporanea | la UI usa `Tender`. |

## Debiti da non perdere

| Debito | Impatto |
| --- | --- |
| Alcuni riferimenti storici possono ancora descrivere il passaggio pre-prototipo | Non bloccano Fase 0, ma vanno riletti quando si tocca il documento specifico. |
| Alcuni testi storici possono ancora usare terminologia descrittiva pre-Tender | Accettabile solo fuori da UI, route e contract attivi. |
| `currentness`, `T8`, `L1` e simili non devono comparire come label grezze in UI | Sono termini tecnici utili nei documenti, non necessariamente nel prodotto finale. |
| La demo con dati sintetici resta meno giudicabile di una demo sanificata realistica | Serve una seconda fixture più realistica, sempre senza dati riservati integrali. |
| Design system e personalità visiva TRAM sono ancora acerbi | Ora blocca la chiusura formale della Fase 1: servono mock visuali desktop/mobile e direzione visiva minima prima di nuove feature applicative. |

## Prossimo passo consigliato

Mettere in pausa nuove feature applicative e chiudere la Fase 1: mock visuali desktop/mobile delle viste principali, poi direzione visiva minima e brand light.
