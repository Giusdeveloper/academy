# 🔧 Configurazione Variabili d'Ambiente su Vercel

## ⚠️ IMPORTANTE: Variabili Obbligatorie

Per far funzionare l'applicazione su Vercel, devi configurare queste variabili d'ambiente **obbligatorie**:

### 1. NextAuth (CRITICO)

```env
NEXTAUTH_URL=https://tuo-progetto.vercel.app
NEXTAUTH_SECRET=genera-un-secret-forte
```

**Come generare NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

**⚠️ IMPORTANTE:** 
- `NEXTAUTH_URL` deve essere il dominio completo del tuo progetto Vercel (es: `https://academy-xyz.vercel.app`)
- Se usi un dominio personalizzato, usa quello invece del dominio `.vercel.app`
- `NEXTAUTH_SECRET` deve essere un valore casuale e sicuro (minimo 32 caratteri)

### 2. Supabase (CRITICO)

```env
NEXT_PUBLIC_SUPABASE_URL=https://tuo-progetto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tuo-anon-key
SUPABASE_SERVICE_ROLE_KEY=tuo-service-role-key
```

### 3. App URL (Consigliato)

```env
NEXT_PUBLIC_APP_URL=https://tuo-progetto.vercel.app
```

## 📝 Come Configurare su Vercel

1. Vai su [Vercel Dashboard](https://vercel.com/dashboard)
2. Seleziona il tuo progetto
3. Vai su **Settings** → **Environment Variables**
4. Aggiungi ogni variabile:
   - **Name**: Il nome della variabile (es: `NEXTAUTH_SECRET`)
   - **Value**: Il valore della variabile
   - **Environment**: Seleziona tutte le opzioni (Production, Preview, Development)
5. Clicca **Save**
6. **Redeploy** il progetto per applicare le modifiche

## 🔍 Verifica Configurazione

Dopo aver configurato le variabili, verifica che siano presenti:

1. Vai su **Settings** → **Environment Variables**
2. Controlla che tutte le variabili obbligatorie siano presenti
3. Assicurati che `NEXTAUTH_URL` corrisponda al dominio del tuo progetto

## 🚨 Risoluzione Errori Comuni

### Errore 500 su `/api/auth/session`

**Causa:** `NEXTAUTH_SECRET` o `NEXTAUTH_URL` non configurati

**Soluzione:**
1. Verifica che `NEXTAUTH_SECRET` sia configurato su Vercel
2. Verifica che `NEXTAUTH_URL` corrisponda esattamente al dominio Vercel (con `https://`)
3. Rigenera un nuovo deploy dopo aver aggiunto le variabili

### Errore "Configuration"

**Causa:** `NEXTAUTH_URL` non corrisponde al dominio corrente

**Soluzione:**
- Se il tuo dominio è `https://academy-xyz.vercel.app`, usa quello
- Se hai un dominio personalizzato, usa quello
- Assicurati che inizi con `https://` e non abbia trailing slash

## 📋 Checklist Completa

- [ ] `NEXTAUTH_URL` configurato con il dominio Vercel completo
- [ ] `NEXTAUTH_SECRET` generato e configurato
- [ ] `NEXT_PUBLIC_SUPABASE_URL` configurato
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` configurato
- [ ] `SUPABASE_SERVICE_ROLE_KEY` configurato
- [ ] `NEXT_PUBLIC_APP_URL` configurato (opzionale ma consigliato)
- [ ] Deploy rigenerato dopo aver aggiunto le variabili

## 🔗 Link Utili

- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [NextAuth.js Configuration](https://next-auth.js.org/configuration/options)
