# 🔍 Verifica e Correzione Redirect URL Email

## ⚠️ Problema Identificato

Il link di conferma email potrebbe non funzionare se:
1. Il redirect URL nel codice non corrisponde a quello configurato in Supabase
2. Le Redirect URLs in Supabase non includono il dominio corretto
3. Il dominio varia tra sviluppo e produzione

## ✅ Soluzione Implementata

Il codice è stato aggiornato per usare `NEXT_PUBLIC_APP_URL` come URL principale per i redirect email, con fallback a `window.location.origin` per lo sviluppo locale.

## 🔧 Configurazione Richiesta

### 1. Variabile d'Ambiente su Vercel

Assicurati di avere configurato su Vercel:

```env
NEXT_PUBLIC_APP_URL=https://learning.imment.it
```

**Come verificare:**
1. Vai su [Vercel Dashboard](https://vercel.com/dashboard)
2. Seleziona il tuo progetto
3. Vai su **Settings** → **Environment Variables**
4. Cerca `NEXT_PUBLIC_APP_URL`
5. Verifica che il valore sia `https://learning.imment.it` (senza trailing slash)

### 2. Configurazione Supabase Redirect URLs

**IMPORTANTE:** Le Redirect URLs in Supabase devono corrispondere esattamente all'URL usato nel codice.

**Come verificare e configurare:**

1. Vai su [Supabase Dashboard](https://app.supabase.com)
2. Seleziona il tuo progetto
3. Vai su **Authentication** → **URL Configuration**
4. Verifica che **Site URL** sia:
   ```
   https://learning.imment.it
   ```

5. Verifica che **Redirect URLs** includa **TUTTI** questi URL:
   ```
   https://learning.imment.it/verify-email
   https://learning.imment.it/**
   http://localhost:3000/verify-email
   http://localhost:3000/**
   ```

   **⚠️ IMPORTANTE:**
   - Ogni URL deve essere su una riga separata
   - Non devono esserci spazi extra
   - Deve includere sia produzione (`https://learning.imment.it`) che sviluppo (`http://localhost:3000`)
   - Il pattern `/**` permette tutti i percorsi sotto quel dominio

6. Clicca **Save**

### 3. Verifica Template Email

1. Vai su **Authentication** → **Email Templates**
2. Seleziona **Confirm signup**
3. Verifica che il template contenga un link simile a:
   ```
   {{ .ConfirmationURL }}
   ```
   
   Oppure se usi HTML:
   ```html
   <a href="{{ .ConfirmationURL }}">Conferma Email</a>
   ```

4. **IMPORTANTE:** Non modificare manualmente l'URL nel template - Supabase lo genera automaticamente usando il `emailRedirectTo` passato dal codice e le Redirect URLs configurate.

## 🧪 Test della Configurazione

### Test 1: Verifica Redirect URL nel Codice

1. Apri la console del browser su `https://learning.imment.it/register`
2. Apri la console JavaScript (F12)
3. Registra un nuovo utente
4. Controlla i log nella console - dovresti vedere:
   ```
   🔐 Tentativo di registrazione con: { email: "...", name: "...", lastName: "..." }
   ```

5. Controlla l'email ricevuta
6. **Ispeziona il link di conferma** nell'email:
   - Dovrebbe iniziare con `https://learning.imment.it/verify-email?`
   - Non dovrebbe contenere `localhost` o altri domini

### Test 2: Verifica Link Email

1. Apri l'email di conferma ricevuta
2. **NON cliccare ancora sul link**
3. Passa il mouse sul link (o tasto destro → "Copia indirizzo link")
4. Verifica che l'URL sia simile a:
   ```
   https://learning.imment.it/verify-email?token=...&type=signup
   ```
   oppure
   ```
   https://bvqrovzrvmdhuehonfcq.supabase.co/auth/v1/verify?token=...&type=signup&redirect_to=https://learning.imment.it/verify-email
   ```

5. Se l'URL contiene `localhost` o un dominio diverso da `learning.imment.it`, c'è un problema di configurazione

### Test 3: Test Click sul Link

1. Clicca sul link nell'email
2. Dovresti essere reindirizzato a `https://learning.imment.it/verify-email`
3. Dovresti vedere un messaggio di successo
4. Dopo 3 secondi, dovresti essere reindirizzato a `/dashboard`

## 🚨 Troubleshooting

### Problema: Link contiene `localhost` in produzione

**Causa:** `NEXT_PUBLIC_APP_URL` non è configurato su Vercel o è sbagliato.

**Soluzione:**
1. Verifica che `NEXT_PUBLIC_APP_URL=https://learning.imment.it` sia configurato su Vercel
2. Fai un nuovo deploy dopo aver aggiunto/modificato la variabile
3. Testa di nuovo la registrazione

### Problema: Errore "Redirect URL not allowed"

**Causa:** L'URL nel link email non è nelle Redirect URLs di Supabase.

**Soluzione:**
1. Vai su Supabase → **Authentication** → **URL Configuration**
2. Aggiungi l'URL esatto che vedi nell'email (es: `https://learning.imment.it/verify-email`)
3. Salva
4. Prova di nuovo

### Problema: Link funziona ma reindirizza a pagina vuota

**Causa:** La pagina `/verify-email` potrebbe non gestire correttamente i parametri.

**Soluzione:**
1. Controlla i log della console del browser quando clicchi sul link
2. Verifica che la pagina `/verify-email` gestisca sia `?token=...&type=...` che `#access_token=...&refresh_token=...`
3. Il codice attuale dovrebbe gestire entrambi i formati

### Problema: Email non arriva

**Causa:** Problema con la configurazione SMTP/Resend.

**Soluzione:**
1. Vedi `INTEGRAZIONE_RESEND_SUPABASE.md` per verificare l'integrazione Resend
2. Controlla i log di Supabase → **Logs** → **Auth Logs**
3. Controlla i log di Resend → [Dashboard](https://resend.com/emails)

## 📝 Checklist Finale

- [ ] `NEXT_PUBLIC_APP_URL=https://learning.imment.it` configurato su Vercel
- [ ] Deploy fatto dopo aver configurato la variabile
- [ ] Site URL in Supabase: `https://learning.imment.it`
- [ ] Redirect URLs in Supabase includono:
  - [ ] `https://learning.imment.it/verify-email`
  - [ ] `https://learning.imment.it/**`
  - [ ] `http://localhost:3000/verify-email` (per sviluppo)
  - [ ] `http://localhost:3000/**` (per sviluppo)
- [ ] Template email "Confirm signup" contiene `{{ .ConfirmationURL }}`
- [ ] Test registrazione completato
- [ ] Link email contiene `https://learning.imment.it/verify-email`
- [ ] Click sul link funziona correttamente
- [ ] Reindirizzamento a `/dashboard` funziona

## 🔗 Link Utili

- [Supabase URL Configuration](https://app.supabase.com/project/_/auth/url-configuration)
- [Supabase Email Templates](https://app.supabase.com/project/_/auth/templates)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
