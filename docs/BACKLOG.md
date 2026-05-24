# TRAM - Backlog

Il backlog raccoglie debiti, idee e decisioni non ancora promosse nella roadmap.

Una voce nel backlog non è scope approvato.

## Debiti MVP

- Eseguire il pilot reale Fase 7 con tre utenti interni e raccogliere feedback classificato `P0`/`P1`/`P2` senza dati riservati.
- Rafforzare robustezza T1/T2/T3 dopo il pilot: falsi positivi, falsi negativi, blocchi manuali e source coverage.
- Migliorare timeline, document map e review queue dove il dry-run UX ha segnalato ambiguità o gerarchia insufficiente.
- Riallineare ogni route pilot reale/rappresentativa al modello TRAM prima di usarla come evidenza prodotto.
- Ripetere smoke browser desktop/mobile quando cambiano superfici UI o flussi di review.

## Decisioni Sospese

- Creare `CHANGELOG.md` con la prima release applicativa dopo la policy SemVer.
- Target e runbook deploy futuri.
- Hosting condiviso prima della V1: VPS, OCI, Vercel/Supabase o altro stack.
- Policy definitiva per dati `L1`/`L2` e provider esterni su Tender reali.
- Ruoli applicativi completi e workflow approvativo oltre i permessi minimi.
- Formato export controllato per Q&A, review, report o Excel.
- ADR dedicate per storage e AI provider policy.

## Idee Tecniche

- Trasformare policy AI, gate e normalizzatori in test e fixture quando il gateway sarà implementato.
- Definire metriche di qualità per T4-T8: source coverage, unsupported claim rate, false positive, false negative e review burden.
- Valutare una guida operativa sintetica per il pilot interno, separata dai documenti governanti se serve un artefatto temporaneo.
- Valutare un check dedicato ai link Markdown quando la documentazione cresce oltre il set governante attuale.

## Pattern Specifici Da Preservare

- Basename Markdown univoci: non creare `README.md`, `ROADMAP.md`, `INDEX.md` o nomi simili duplicati in cartelle diverse.
- `docs/DECISIONS.md` è registro decisionale e indice ADR; non creare `docs/decisions/README.md`.
- Modello evidence-first e review-first: dati critici senza fonte o review non diventano verità.
- AI free-first, provider-agnostic e human-in-the-loop; nessun fallback automatico a pagamento.
- Pacchetti gara, OCR, estratti, export e working data restano fuori da Git.
- GitHub non implica deploy, release, hosting, provider AI o upload documentale.

## Regole

- Quando una voce diventa prioritaria, promuoverla in `docs/ROADMAP.md`.
- Quando una voce diventa decisione stabile, registrarla in `docs/DECISIONS.md` o in un ADR sotto `docs/decisions/`.
- Non usare il backlog come storico dei lavori completati.
