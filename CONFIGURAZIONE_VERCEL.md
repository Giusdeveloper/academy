# 🚀 Guida Completa: Configurazione Variabili Vercel

## 📋 Variabili OBBLIGATORIE (Senza queste l'app non funziona)

### 1. NextAuth - CRITICO ⚠️

```env
NEXTAUTH_URL=https://tuo-progetto.vercel.app
NEXTAUTH_SECRET=<genera-con-comando-sotto>
```

**🔑 Come generare NEXTAUTH_SECRET:**
```bash
# Su Windows PowerShell:
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Oppure online: https://generate-secret.vercel.app/32
```

**⚠️ IMPORTANTE:**
- `NEXTAUTH_URL` deve essere **esattamente** il dominio del tuo progetto Vercel
- Esempio: Se il tuo progetto è `academy-abc123.vercel.app`, usa `https://academy-abc123.vercel.app`
- Se hai un dominio personalizzato, usa quello invece
- Deve iniziare con `https://` e NON avere trailing slash (`/`)

### 2. Supabase - CRITICO ⚠️

```env
NEXT_PUBLIC_SUPABASE_URL=https://tuo-progetto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Dove trovarle:**
1. Vai su [Supabase Dashboard](https://app.supabase.com)
2. Seleziona il tuo progetto
3. **Settings** → **API**
4. Copia:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Segreta!)

### 3. App URL (Consigliato)

```env
NEXT_PUBLIC_APP_URL=https://tuo-progetto.vercel.app
```

## 📝 Istruzioni Passo-Passo per Vercel

### Passo 1: Trova il dominio del tuo progetto

1. Vai su [Vercel Dashboard](https://vercel.com/dashboard)
2. Clicca sul tuo progetto
3. Nella pagina principale vedrai il dominio (es: `academy-xyz.vercel.app`)
4. **Copia questo dominio** - ti servirà per `NEXTAUTH_URL` e `NEXT_PUBLIC_APP_URL`

### Passo 2: Genera NEXTAUTH_SECRET

Apri PowerShell o Terminale e esegui:
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

Oppure usa questo sito: https://generate-secret.vercel.app/32

**Copia il risultato** - questo sarà il valore di `NEXTAUTH_SECRET`

### Passo 3: Configura le variabili su Vercel

1. Nel tuo progetto Vercel, vai su **Settings** (in alto)
2. Clicca su **Environment Variables** (menu laterale)
3. Per ogni variabile, clicca **Add New**:

#### Variabile 1: NEXTAUTH_URL
- **Key**: `NEXTAUTH_URL`
- **Value**: `https://tuo-progetto.vercel.app` (usa il dominio del Passo 1)
- **Environment**: ✅ Production ✅ Preview ✅ Development
- Clicca **Save**

#### Variabile 2: NEXTAUTH_SECRET
- **Key**: `NEXTAUTH_SECRET`
- **Value**: `<il-secret-generato-nel-passo-2>`
- **Environment**: ✅ Production ✅ Preview ✅ Development
- Clicca **Save**

#### Variabile 3: NEXT_PUBLIC_SUPABASE_URL
- **Key**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: `<la-tua-url-supabase>` (da Supabase Dashboard → Settings → API)
- **Environment**: ✅ Production ✅ Preview ✅ Development
- Clicca **Save**

#### Variabile 4: NEXT_PUBLIC_SUPABASE_ANON_KEY
- **Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: `<la-tua-anon-key>` (da Supabase Dashboard → Settings → API → anon public)
- **Environment**: ✅ Production ✅ Preview ✅ Development
- Clicca **Save**

#### Variabile 5: SUPABASE_SERVICE_ROLE_KEY
- **Key**: `SUPABASE_SERVICE_ROLE_KEY`
- **Value**: `<la-tua-service-role-key>` (da Supabase Dashboard → Settings → API → service_role)
- **Environment**: ✅ Production ✅ Preview ✅ Development
- ⚠️ **ATTENZIONE**: Questa è una chiave segreta! Non condividerla mai
- Clicca **Save**

#### Variabile 6: NEXT_PUBLIC_APP_URL (Opzionale ma consigliato)
- **Key**: `NEXT_PUBLIC_APP_URL`
- **Value**: `https://tuo-progetto.vercel.app` (stesso valore di NEXTAUTH_URL)
- **Environment**: ✅ Production ✅ Preview ✅ Development
- Clicca **Save**

### Passo 4: Rigenera il Deploy

**IMPORTANTE:** Dopo aver aggiunto le variabili, devi rigenerare il deploy:

1. Vai su **Deployments** (menu laterale)
2. Clicca sui **3 puntini** (...) dell'ultimo deploy
3. Seleziona **Redeploy**
4. Conferma il redeploy

Oppure:
- Fai un nuovo commit e push (Vercel farà il deploy automaticamente)

## ✅ Checklist Finale

Prima di verificare che tutto funzioni, assicurati di avere:

- [ ] `NEXTAUTH_URL` configurato con il dominio corretto (con `https://`)
- [ ] `NEXTAUTH_SECRET` generato e configurato (almeno 32 caratteri)
- [ ] `NEXT_PUBLIC_SUPABASE_URL` configurato
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` configurato
- [ ] `SUPABASE_SERVICE_ROLE_KEY` configurato
- [ ] `NEXT_PUBLIC_APP_URL` configurato (opzionale)
- [ ] Deploy rigenerato dopo aver aggiunto le variabili

## 🔍 Verifica che Funzioni

Dopo il redeploy:

1. Apri il tuo sito su Vercel
2. Apri la Console del Browser (F12 → Console)
3. Non dovresti vedere più l'errore `500` su `/api/auth/session`
4. Prova ad accedere con le tue credenziali

## 🚨 Se Vedi Ancora Errori

### Errore 500 su `/api/auth/session`

**Possibili cause:**
1. `NEXTAUTH_SECRET` non configurato → Verifica su Vercel Settings → Environment Variables
2. `NEXTAUTH_URL` non corrisponde al dominio → Deve essere esattamente il dominio Vercel
3. Deploy non rigenerato → Fai un redeploy dopo aver aggiunto le variabili

**Soluzione:**
1. Vai su Vercel → Il tuo progetto → Settings → Environment Variables
2. Verifica che tutte le variabili siano presenti
3. Controlla che `NEXTAUTH_URL` sia esattamente `https://tuo-progetto.vercel.app`
4. Vai su Deployments → Redeploy l'ultimo deploy

### Errore "Configuration"

**Causa:** `NEXTAUTH_URL` non corrisponde al dominio corrente

**Soluzione:**
- Se il tuo dominio Vercel è `academy-xyz.vercel.app`, usa `https://academy-xyz.vercel.app`
- Se hai un dominio personalizzato `academy.imment.it`, usa `https://academy.imment.it`
- Assicurati che inizi con `https://` e non finisca con `/`

## 📞 Supporto

Se hai ancora problemi:
1. Controlla i **Log di Vercel**: Dashboard → Il tuo progetto → Deployments → Clicca sul deploy → Logs
2. Controlla la **Console del Browser**: F12 → Console per vedere errori client-side
3. Verifica che tutte le variabili siano configurate correttamente

## 🔗 Link Utili

- [Vercel Environment Variables Docs](https://vercel.com/docs/concepts/projects/environment-variables)
- [NextAuth.js Configuration](https://next-auth.js.org/configuration/options)
- [Supabase Dashboard](https://app.supabase.com)
