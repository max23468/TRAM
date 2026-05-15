# TRAM V1 - Resolver deterministico document family, version e currentness v0.1

Data: 2026-05-13
Stato: specifica operativa per benchmark e MVP
Ambito: document map, versioning, T1 L0, pacchetti gara O&M

## Scopo

Questo documento definisce il resolver deterministico che TRAM usa per trasformare metadati file, nomi documento e segnali strutturati in:

- `document_family`;
- `version`;
- `variant_type`;
- `currentness`.

La decisione nasce dal rerun Copenhagen T1 L0 v0.3: Gemini e Mistral sono utili per classificare natura e ruolo del documento, ma possono sbagliare lo stato corrente quando devono confrontare clean copy, track changes e versioni diverse.

## Decisione

In TRAM V1:

- l’AI propone `document_nature`, `document_role` e `uncertainties`;
- il resolver deterministico propone `document_family`, `version`, `variant_type` e `currentness`;
- la review queue gestisce conflitti, anomalie e casi non risolti;
- un valore `currentness` non diventa dato consolidato se arriva solo dall’AI.

Questa scelta riduce falsi positivi e rende auditabile una parte centrale della dashboard gara.

## Non obiettivi

Il resolver v0.1 non deve:

- leggere o interpretare il contenuto integrale dei documenti;
- decidere quale previsione contrattuale prevale tra documenti in conflitto;
- sostituire il confronto semantico tra versioni;
- stabilire impatti tecnici, economici o legali;
- gestire in modo completo tutte le naming convention internazionali possibili.

I casi non coperti devono finire in review queue, non essere forzati.

## Input

Il resolver lavora con segnali deterministici, in ordine di affidabilità.

| Segnale | Fonte | Livello minimo | Uso |
| --- | --- | --- | --- |
| `file_name_original` | ingestion | L0 | Titolo, ID documento, versione, variante |
| `relative_path` | ingestion | L0 | Fase pacchetto e famiglia cartella |
| `file_extension` | ingestion | L0 | Variante tecnica, non currentness |
| `folder_hint` | ingestion | L0 | Contesto pacchetto |
| `filename_title_hint` | ingestion/parser | L0 | Titolo normalizzato |
| `filename_version_hint` | ingestion/parser | L0 | Versione candidata |
| `document_nature_ai_suggestion` | AI | L0/L1 | Aiuta la family key, non decide currentness |
| `document_role_ai_suggestion` | AI | L0/L1 | Aiuta la family key e la variante semantica |
| `cover_page_document_id` | parser futuro | L1 | Rafforza ID documento |
| `cover_page_version` | parser futuro | L1 | Rafforza versione |
| `issue_date` | parser futuro | L1 | Tie-breaker quando versioni uguali |

Nel benchmark T1 L0 hybrid si usano solo i segnali L0 più i suggerimenti AI su natura e ruolo.

## Output

Il resolver produce un record per `DocumentVersion`.

| Campo | Tipo | Descrizione |
| --- | --- | --- |
| `document_family_key` | string | Chiave normalizzata della famiglia documentale |
| `document_series_key` | string/null | Chiave più ampia per appendici/allegati legati a uno stesso documento base |
| `document_id_external` | string/null | ID documento rilevato, se presente |
| `normalized_title` | string | Titolo ripulito da prefissi, estensione, versione e varianti |
| `version_label` | string/null | Versione esposta all’utente, per esempio `v5` o `2.0` |
| `version_sort_key` | number/null | Valore comparabile |
| `version_source` | enum | `filename_explicit`, `filename_contextual`, `cover_page`, `none`, `conflict` |
| `variant_type` | enum | `clean`, `track_changes`, `redline`, `commented`, `appendix`, `pricing_workbook`, `unknown` |
| `currentness_rule_candidate` | enum | `current_candidate`, `not_current_candidate`, `unknown`, `needs_review` |
| `currentness_reason` | text | Motivo sintetico e auditabile |
| `review_required` | boolean | Se serve review umana |
| `reason_codes` | array | Codici regola applicati |
| `source_refs` | array | Riferimenti L0 usati |

Nel `task_output` T1 v0.3 verso benchmark, `currentness_rule_candidate` viene mappato sul campo pubblico `currentness` usando gli enum già esistenti:

- `current_candidate`;
- `not_current_candidate`;
- `unknown`.

Quando il resolver interno produce `needs_review`, il benchmark esporta `currentness = unknown` e `review_required = true`.

## Pipeline

### 1. Normalizzazione tecnica

Per ogni file:

1. conservare sempre `file_name_original`;
2. rimuovere estensione solo in una copia normalizzata;
3. convertire separatori `_`, `-`, multipli spazi e parentesi in token coerenti;
4. normalizzare maiuscole/minuscole per il matching;
5. conservare gli acronimi e gli ID esterni in forma originale quando utili.

Regola: la normalizzazione non deve distruggere l’evidenza originale.

### 2. Estrazione ID documento

Rilevare pattern forti come:

- codici tipo `CM-X-OMRT3-TD-0020`;
- codici con prefissi/suffissi alfanumerici separati da trattini;
- futuri codici equivalenti di altri pacchetti.

Regola tecnica: non usare solo `\b` come confine regex, perché `_` è considerato carattere di parola e può far perdere codici seguiti da underscore. Usare invece confini negativi su lettere e numeri, per esempio `(?<![A-Z0-9])... (?![A-Z0-9])`, così `CM-X-OMRT3-TD-0020_Instruction` viene riconosciuto correttamente.

Output:

- `document_id_external`;
- `document_id_confidence`;
- `document_id_source`.

Se l’ID è assente, usare solo titolo normalizzato e contesto cartella per la family key.

### 3. Estrazione variante

Rilevare varianti nel filename:

| Pattern | `variant_type` | Effetto |
| --- | --- | --- |
| `with track changes`, `track changes` | `track_changes` | Non è clean copy |
| `redline`, `red lined`, `compare` | `redline` | Non è clean copy |
| `commented`, `comments` | `commented` | Richiede review se documento chiave |
| `attachment`, `appendix`, `annex` | `appendix` | Può essere famiglia distinta o figlia |
| `schedule of prices`, `price`, `pricing workbook` | `pricing_workbook` | Non dedurre contenuti economici |

Se non ci sono segnali di variante, usare `clean`.

### 4. Estrazione versione

Il resolver distingue versione esplicita da numerazione strutturale.

Regole v0.1:

- `v5`, `v 5`, `version 5`, `rev 5` sono versioni esplicite;
- `Rev 1_Redline`, `Rev 5_RedLine` e varianti con underscore dopo il numero devono essere riconosciute come versione esplicita;
- `2.0` può essere versione se compare vicino al titolo o dopo `_` in documenti contrattuali;
- numeri iniziali come `01.`, `02.`, `4.` sono prefissi di ordinamento, non versioni;
- numeri di allegato italiani come `All 02.1`, `All 12.5` e simili sono prefissi di allegato, non versioni;
- numeri di questionario/prequalifica come `1.15.2` o `2.6.5` sono numbering strutturale, non versioni;
- riferimenti a `Lotto 1`, `Lotti 1+2` o combinazioni simili rappresentano lotti, non versioni;
- `v1` o `_v1` resta invece versione esplicita quando appare come suffix di titolo, per esempio in workbook di envelope;
- numeri come `3.0` prima del titolo possono essere sezione o indice, quindi non prevalgono su un successivo `v2`;
- se esistono due candidati, preferire il candidato con marker esplicito `v`, `version`, `rev`;
- se non esiste marker esplicito e c’è un solo decimale coerente nel titolo, usarlo come versione contestuale.
- per i redline Luas, `Rev n` va rimosso anche dalla title/family key, non solo letto come versione.

Esempi Copenhagen:

| Filename | Versione |
| --- | --- |
| `Instructions to Tender v5.pdf` | `v5` |
| `Procurement Schedule v3.mpp` | `v3` |
| `... 3.0 ... Procurement Schedule v2.pdf` | `v2`, non `3.0` |
| `Conditions of Contract.pdf` con `_2.0` | `2.0` |
| `Contract Specifications_Attachment A Payment.pdf` con `_2.0` | `2.0` |

Esempi Luas:

| Filename | Versione |
| --- | --- |
| `Invitation to Negotiate Rev 8.pdf` | `Rev 8` |
| `Invitation to Negotiate Rev 8_Redline.pdf` | `Rev 8` |
| `Contract Rev 4 Redline.pdf` | `Rev 4` |
| `Final Pricing Document Instructions_Rev 5_RedLine.pdf` | `Rev 5` |

### 5. Costruzione `document_family_key`

La family key serve a capire quali versioni competono tra loro.

Costruzione v0.1:

1. partire da `document_id_external`, se presente;
2. aggiungere `document_nature` e `document_role` se disponibili;
3. aggiungere titolo normalizzato ripulito da versione, estensione, prefissi numerici e varianti;
4. rimuovere token di variante come `with track changes`;
5. mantenere token distintivi come `attachment a payment`, `definitions and abbreviations`, `schedule of prices`.

Regola importante: documenti con lo stesso ID esterno non sono necessariamente la stessa famiglia. Allegati e appendici con ruolo diverso possono essere famiglie distinte anche se derivano dallo stesso documento base.

Regola Luas: `TII400` è un codice di progetto/contratto troppo ampio e non basta a formare la family key. Quando l’ID è project-level, la family key deve includere anche natura, ruolo base e titolo normalizzato.

Regola redline: se `document_role = track_changes_version`, il ruolo base va ricavato dal titolo/natura. Per esempio:

- `Invitation to Negotiate ... Redline` torna a `instructions_to_tender`;
- `Volume 2 - Contract ... Redline` torna a `conditions_of_contract`;
- `Schedules ... Redline` torna a `contract_specifications`;
- `Pricing Document Instructions ... RedLine` torna a `schedule_of_prices`.

Nel matching Luas, verificare prima `schedule` e poi `contract`: molti schedule filename contengono anche la parola `Contract`, ma la famiglia corretta è `contract_specifications`, non `conditions_of_contract`.

Regole emerse da Milano e MetroLink:

- nei package prequalifica, `01.`, `02.`, `03.` davanti a PQP/PQQ parts sono prefissi d’ordine e vanno rimossi dalla family key;
- il simbolo `+` nei titoli va trattato come separatore lessicale, non come token distintivo di family;
- `.p7m` segnala un wrapper di firma digitale: non basta da solo a decidere currentness e richiede review se compete con una copia non firmata;
- `.zip` può contenere dataset strutturati, per esempio GTFS: in L0 va classificato come metadato/archivio senza aprire il payload.

Esempi:

| Sample | Family key |
| --- | --- |
| D1 | `CM-X-OMRT3-TD-0020|tender_instructions|instructions_to_tender` |
| D2 | `CM-X-OMRT3-TD-0020|tender_instructions|instructions_to_tender` |
| D3 | `CM-X-OMRT3-TD-0020|procurement_schedule|procurement_schedule` |
| D4 | `CM-X-OMRT3-TD-0020|procurement_schedule|procurement_schedule` |
| D7 | `CM-X-OMRT3-TD-0011|contract_conditions|conditions_of_contract` |
| D8 | `CM-X-OMRT3-TD-0011|contract_definitions|definitions_and_abbreviations` |
| D9 | `CM-X-OMRT3-TD-0010|contract_specification|contract_specifications` |
| D10 | `CM-X-OMRT3-TD-0010|payment_terms|payment_attachment` |

### 6. Risoluzione currentness

Il resolver opera per gruppi di `document_family_key`.

Regole v0.1:

1. Se il gruppo ha una sola versione, `currentness = unknown`, salvo segnali espliciti di superamento.
2. Se nel gruppo ci sono clean copy e track changes della stessa versione, clean copy è `current_candidate`, track changes è `not_current_candidate`.
3. Se nel gruppo ci sono versioni numeriche diverse, la versione più alta è `current_candidate`, le precedenti sono `not_current_candidate`.
4. Se una versione più alta è solo track changes e una versione più bassa è clean copy, segnare `needs_review`.
5. Se versioni e issue date confliggono, segnare `needs_review`.
6. Se l’unico motivo per scegliere deriva dall’estensione file, non decidere currentness: MPP, PDF, DOCX o XLSX non sono di per sé più o meno correnti.
7. Se un addendum o clarification modifica un documento, il resolver non cambia automaticamente currentness del documento base: crea un relationship candidate verso review.

Per Copenhagen T1 L0:

- D1 `current_candidate`;
- D2 `not_current_candidate`;
- D3 `current_candidate`;
- D4 `not_current_candidate`;
- D5-D10 `unknown`, perché non c’è competizione L0 nella stessa family.

## Review queue

Il resolver crea o segnala `ReviewItem` quando:

- più file hanno stessa family e stessa versione clean;
- una versione più alta è solo track changes/redline;
- AI e regole divergono su `document_role` o `document_nature`;
- l’ID documento è uguale ma il ruolo è diverso e il titolo è ambiguo;
- la versione è dedotta solo da numeri contestuali;
- un documento critico è pricing, payment, KPI, penali o clausola AI/privacy;
- addendum o clarification potrebbero superare una previsione senza sostituire il file.

La review deve mostrare sempre:

- file coinvolti;
- family key;
- versione estratta;
- variante;
- regola applicata;
- source refs;
- output AI eventualmente divergente.

## Interazione con AI

L’AI non deve più ricevere il compito di decidere `currentness` come verità finale.

Nel benchmark T1 L0 hybrid:

- AI output ammesso: `document_nature`, `document_role`, `confidence`, `uncertainties`, `source_refs`;
- AI output ignorato o non richiesto: `version`, `currentness`;
- resolver output: `version`, `document_family_key`, `variant_type`, `currentness`;
- merge output: `task_output.items` completo per compatibilità v0.3.

Se l’AI segnala un’incertezza utile, TRAM la conserva in `currentness_ai_comment` o `uncertainties`, ma il campo `currentness` deriva dal resolver.

## Criteri di successo benchmark

Il rerun T1 L0 hybrid passa se:

- AI restituisce 10/10 item validi;
- AI classifica correttamente `document_nature` e `document_role`;
- resolver estrae correttamente 10/10 versioni attese;
- resolver risolve correttamente 4/4 currentness valutabili;
- D5-D10 restano `unknown` dove non c’è una famiglia concorrente nel dataset L0;
- ogni item conserva `source_refs`, `confidence`, `review_required` e `uncertainties`;
- nessun contenuto completo del documento viene inviato a provider esterni.

## Impatto data model

Questi campi vanno considerati nel data model applicativo:

| Campo | Entità candidata | Nota |
| --- | --- | --- |
| `document_family_key` | `Document` o tabella dedicata | Chiave logica auditabile |
| `document_series_key` | `Document` | Utile per allegati collegati |
| `document_id_external` | `DocumentVersion` e/o `Document` | Dipende dal pacchetto |
| `variant_type` | `DocumentVersion` | Clean, track changes, redline, appendix |
| `version_label` | `DocumentVersion` | Stringa utente |
| `version_sort_key` | `DocumentVersion` | Ordinamento |
| `currentness_rule_candidate` | `DocumentVersion` | Proposta rule-based |
| `currentness_review_status` | `ReviewItem` o `DocumentVersion` | Stato umano |
| `resolver_version` | `ExtractionRun` | Audit del set regole |

## Limiti noti

- Alcuni enti usano revisioni non numeriche, per esempio `A`, `B`, `Final`, `Issued`, `Tender Version`.
- Alcuni pacchetti sostituiscono documenti tramite addendum senza cambiare filename.
- Le date possono essere più importanti della versione se il naming è incoerente.
- Allegati e appendici possono condividere codice documento ma avere vita autonoma.
- I documenti Excel e MPP possono essere fonte primaria anche se non sono PDF.

Questi limiti non bloccano il resolver v0.1: definiscono i casi da mandare in review e i prossimi benchmark su Luas.

## Prossimo passo consigliato

Stato aggiornato: il resolver v0.1 è confluito nella baseline T1 document map. Usarlo ora per fixture applicative del primo slice UI, insieme al registro `indicator_key` e alla review queue.
