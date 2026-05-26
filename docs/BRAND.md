# TRAM - Brand

Questo documento governa direzione visiva, tono e principi UI.

## Posizionamento

TRAM è uno strumento tecnico-professionale per leggere gare complesse con metodo, non un assistente generalista. Deve comunicare controllo, precisione, tracciabilità e capacità critica.

TRAM deve sembrare una sala controllo leggera per Tender complessi: documenti, linee temporali, nodi, stati e fonti. Non deve sembrare un editor d’offerta, un DMS generalista o un chatbot.

La metafora utile è TPL operativo: linee, interscambi, tratte, stato servizio, segnali, deviazioni, priorità. Deve restare funzionale, non illustrativa.

## Tono

- Diretto;
- sobrio;
- operativo;
- sintetico;
- orientato a fonti, stato e rischio.

La UI deve evitare copy promozionale o spiegazioni ovvie. Il testo deve aiutare l’utente a decidere cosa guardare e cosa validare.

## Direzione Visiva

La direzione è applicativa e dashboard-first:

- layout densi ma ordinati;
- gerarchie chiare;
- tabelle, timeline e indicatori;
- palette professionale non monotematica;
- stati visivi per rischio, validazione e fonte;
- icone riconoscibili quando aiutano l’azione.

La maturità visiva deve essere “enterprise leggera”: sobria, moderna, leggibile, con densità informativa alta e spaziature misurate. Evitare landing-style hero, card decorative, gradienti dominanti e palette monotematiche.

### Architettura UI MVP

Il mock non è più solo riferimento estetico: definisce la grammatica di arrivo del MVP. Le superfici pubblicate devono usare una sola architettura:

- frame applicativo unico con rail laterale scuro e workspace chiaro;
- topbar compatta con stato corrente e azioni;
- titoli operativi brevi, senza gergo di sviluppo;
- pannelli con bordo, raggio 8 px o inferiore e gerarchia di superficie coerente;
- route strip e nodi come mappa funzionale, non decorazione;
- pannello fonte come punto di controllo sempre riconoscibile;
- badge coerenti per stato, rischio, fonte e controllo;
- nessuna pagina parallela con stile autonomo se appartiene al MVP.

Home, lista gare, quadro gara, sezioni specialistiche, coda controlli, registro e Copenhagen devono sembrare parti dello stesso prodotto. Una nuova vista deve prima riusare shell, primitive, tono e nomenclatura comuni; se serve una variante, va motivata dal workflow e non dalla comodità del singolo componente.

### Token E Palette

La palette deve sostenere stati e gerarchia, non decorazione:

- neutri chiari/scuri per superfici e testo;
- accento primario per navigazione e focus;
- verde per validato;
- giallo/ambra per attenzione;
- rosso per critico/bloccante;
- blu/ciano per informazione/fonte;
- viola solo se necessario e mai dominante;
- colori economici/financials distinti ma sobri.

I token devono essere semantici: `surface`, `text`, `muted`, `border`, `focus`, `success`, `warning`, `danger`, `info`, `review`, `stale`, `blocked`.

### Tipografia E Densità

- Gerarchie chiare, senza hero-scale dentro dashboard.
- Testi compatti ma leggibili.
- Numeri, stati e deadline facili da scansionare.
- Tabelle e liste con altezze stabili.
- Nessun testo deve uscire da pulsanti, badge, celle o pannelli.
- Letter spacing normale, senza effetti decorativi.

### Componenti

Componenti ricorrenti:

- route strip come linea TPL;
- T-node o nodo di stato per collegare fonte, review e rischio;
- sidebar come rail di navigazione;
- source inspector come punto di interscambio;
- timeline come linea con fermate/eventi;
- badge stato coerenti;
- tabelle dense con righe espandibili;
- drawer o panel per fonte e audit;
- filtri, tabs e segmented controls per viste dense;
- icone per azioni ripetute.

## Richiami TPL

I richiami al trasporto pubblico possono emergere in modo funzionale: linee, percorsi, nodi, stati, mappe concettuali, non illustrazioni decorative.

Pattern ammessi:

- linea orizzontale o verticale per timeline e procurement flow;
- nodo per documento, fonte, review o criticità;
- interscambio per collegare documento, requisito, scadenza e Q&A;
- stato servizio per validato, stale, bloccato, critico;
- mappa concettuale leggera solo se aiuta a capire relazioni documentali;
- micro-interazioni discrete per apertura fonte, espansione riga e cambio stato.

Pattern da evitare:

- mappe geografiche finte;
- treni/tram illustrativi decorativi;
- icone narrative non operative;
- sfondi atmosferici;
- grafici non collegati a decisioni;
- animazioni che distraggono da fonte e review.

## Wording UI

Il copy deve essere asciutto e decisionale:

- preferire `Da validare`, `Fonte mancante`, `Documento superato`, `Nuovo addendum`, `Criticità aperta`;
- evitare frasi promozionali o descrittive dell’app;
- evitare “AI ha trovato” come autorità;
- usare “proposto”, “da verificare”, “confermato”, “contestato”;
- indicare il motivo dei blocchi;
- mantenere Q&A come flusso controllato e umano.

La UI rivolta all’utente non deve mostrare termini di cantiere interno come `P0`, `P1`, `T1`, `T2`, `L0`, `Fase 7`, `pilot`, `evidence-first`, `stabilizzare`, `blocker`, `fixture` o `Demo MVP`. Questi codici possono restare nel modello, nei test e nella documentazione tecnica, ma il prodotto deve tradurli in parole operative: `fonti prioritarie`, `documenti pubblici`, `controlli aperti`, `scadenze`, `consegne`, `economia`, `costi`, `gara da controllare`.

## Accessibilità

- Contrasto adeguato per stati e testo.
- Stato non comunicato solo dal colore.
- Focus visibile.
- Target cliccabili sufficienti.
- Tabelle leggibili da tastiera quando possibile.
- Tooltip per icone non ovvie.
- Stati raw tecnici nascosti o tradotti.

## Artefatti

Il mock HTML in `docs/assets/mvp-ui-mock.html` resta un artefatto di design e non una fonte governante. Le decisioni assorbite da quel mock vanno riportate in questo documento o in `docs/UX_REVIEW_WORKFLOW.md`.

Il mock canonico può ispirare shell, route strip, T-node, pannello fonte, densità e tono. Non va portato integralmente: ogni widget deve superare il criterio di utilità operativa definito in `UX_REVIEW_WORKFLOW.md`.
