# Convenzioni naming documentazione

Data: 2026-05-12
Stato: bozza viva

## Regola

Tutti i file Markdown devono avere nomi diversi anche se si trovano in cartelle diverse.

Nei testi in italiano usiamo accenti corretti e apostrofi corretti. La documentazione TRAM deve essere scritta in UTF-8 naturale, quindi useremo forme come `è`, `perché`, `più`, `attività`, `qualità`, `l’utente`, `dell’offerta`, evitando forme semplificate senza accento.

Questo significa che non useremo nomi generici duplicabili come:

- `README.md`;
- `notes.md`;
- `plan.md`;
- `roadmap.md`;
- `index.md`.

Al loro posto useremo nomi descrittivi e specifici, per esempio:

- `tram-data-packages-guide.md`;
- `tram-v1-product-brief.md`;
- `tram-agent-instructions.md`;
- `tram-v1-technical-architecture.md`;
- `tram-brand-positioning-notes.md`.

## Motivo

La regola serve a evitare ambiguità quando:

- i file vengono cercati rapidamente;
- vengono allegati o citati fuori dalla loro cartella;
- vengono letti da agenti o tool automatici;
- la documentazione cresce con più aree, roadmap e decisioni.

## Ambito della regola

La regola vale per la documentazione TRAM scritta da noi.

Sono esclusi:

- `.venv/` e dipendenze di terze parti;
- `data/packages/`, cioè pacchetti gara caricati dall’utente;
- output generati automaticamente, salvo quando decidiamo di promuoverli a documentazione stabile.

## Check operativo

Prima di aggiungere un nuovo `.md`, verificare che il nome base non esista già nella repo.

Comando utile:

```bash
find . -path './.venv' -prune -o -path './data/packages' -prune -o -name '*.md' -exec basename {} \; | sort | uniq -d
```
