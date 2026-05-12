# Nucleo Garbatella — Sito statico

## ⚠ Stato attuale

Il sito è in costruzione. Le sezioni con contenuti reali ancora da inserire sono marcate con placeholder fra parentesi quadre, es. `[email del nucleo]` o `[Nome Cognome]`.

**L'indicizzazione su Google è disattivata** tramite:
- `robots.txt` che blocca tutti i crawler
- `<meta name="robots" content="noindex, nofollow">` su ogni pagina HTML

Quando il sito è pronto, vedi sezione "Andare online" più sotto.

## Struttura

7 file HTML statici, ognuno una pagina autonoma:

| File              | Descrizione                                        |
|-------------------|----------------------------------------------------|
| `index.html`      | Home con hero, cards, sezione Instagram, CTA       |
| `manifesto.html`  | Il sorriso — manifesto di Gioventù Nazionale       |
| `chi-siamo.html`  | Chi siamo, coordinamento, dove ci trovi            |
| `blog.html`       | Voci dal lotto (placeholder articoli)              |
| `iscriviti.html`  | Form di tesseramento proprietario                  |
| `privacy.html`    | Informativa GDPR                                   |
| `cookie.html`     | Cookie policy                                      |

Ogni file ha CSS e JS inline. Il CSS è duplicato in tutti i file — quando modifichi qualcosa va replicato (oppure si passa ad Astro quando il sito cresce).

## Mettere sotto Git

Dalla cartella del progetto:

```bash
git init
git add .
git commit -m "Initial commit — 7 pagine statiche, sito in costruzione, noindex attivo"
```

Poi crea un repo su GitHub (o GitLab) e collega:

```bash
git remote add origin https://github.com/TUOUTENTE/gn-garbatella.git
git branch -M main
git push -u origin main
```

Da qui in avanti, ogni modifica che vuoi conservare → `git add . && git commit -m "descrizione modifica"` → `git push`.

## Deploy su Vercel

**Metodo consigliato — via GitHub**:
1. Vai su vercel.com/new
2. "Import Git Repository" → seleziona il repo
3. Framework Preset: **Other** (è solo HTML statico)
4. Deploy. Ad ogni push su `main` Vercel ricostruisce automaticamente.

**Metodo veloce — drag & drop**:
1. Vai su vercel.com/new
2. Trascina la cartella del progetto
3. Online in 30 secondi (ma non si aggiorna automaticamente)

## Andare online (quando il sito è pronto)

Quando hai inserito i contenuti reali e vuoi che Google indicizzi:

1. **Apri `robots.txt`** e sostituisci tutto con:
   ```
   User-agent: *
   Allow: /
   Sitemap: https://gngarbatella.it/sitemap.xml
   ```
2. **In ogni file `.html`** rimuovi la riga:
   ```html
   <meta name="robots" content="noindex, nofollow" />
   ```
   (cerca "noindex" e rimuovi sia la riga del meta sia il commento sotto)
3. Commit + push, Vercel ridepoya.
4. Su Google Search Console → richiedi indicizzazione manuale (velocizza i tempi).

## Endpoint API tesseramento

Il form in `iscriviti.html` fa POST a `/api/tesseramento`.

Quando l'endpoint sarà pronto (DB in costruzione):
1. Apri `iscriviti.html`
2. Nel `<script>` finale cerca il commento `=== ENDPOINT REALE — DA ATTIVARE ===`
3. Scommenta le 4 righe `fetch(...)` sotto
4. Rimuovi le 3 righe di "SIMULAZIONE"

Payload JSON ricevuto dal backend (chiavi):
`nome, cognome, data_nascita, genere, luogo_nascita, cittadinanza, codice_fiscale, email, telefono, via, civico, cap, comune, provincia, iscriz_gn (sempre "1"), iscriz_as ("0"/"1"), iscriz_au ("0"/"1"), as_scuola, as_anno, au_universita, au_anno, come_conosciuto, note, consenso_eta, consenso_dati, consenso_trasmissione, consenso_comunicazioni, _submitted_at, _nucleo`.

## Contenuti ancora da popolare

- Email del nucleo (placeholder `[email del nucleo]` in chi-siamo, privacy, cookie, iscriviti)
- Coordinamento: i 4 ruoli in `chi-siamo.html` sono placeholder
- Articoli del blog: 5 placeholder + 1 "in primo piano"
- Manifesto: data di adozione e firmatari da inserire
- Quota associativa in `iscriviti.html`
- Date "ultimo aggiornamento" in privacy.html e cookie.html
- `og-image.png` per anteprime social (commentato nel `<head>`)

## Integrazione Instagram

Sezione "Seguici" nella home con griglia placeholder. Per attivare feed reale:
- Servizio consigliato: **Behold** (behold.so) — gratis fino a 1.200 view/mese, non installa cookie
- @gngarbatella deve essere account Business (impostazione gratuita su Instagram)
- Istruzioni complete nel commento HTML sopra `.insta-section` in `index.html`
