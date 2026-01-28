# 🔧 Fix: Errore 500 durante Registrazione

## ⚠️ Problema

Errore durante la registrazione:
```
❌ Errore 500 durante registrazione - Possibile problema SMTP: 
AuthApiError: Database error saving new user
```

**Causa:** Il trigger `handle_new_user()` che sincronizza gli utenti da `auth.users` a `public.users` sta fallendo.

## ✅ Soluzione: Applicare la Migration di Fix

### Passo 1: Vai su Supabase Dashboard

1. Apri [Supabase Dashboard](https://app.supabase.com)
2. Seleziona il tuo progetto
3. Vai su **SQL Editor** (menu laterale)

### Passo 2: Esegui la Migration di Fix

1. Clicca su **"New query"**
2. Copia e incolla il contenuto del file:
   ```
   supabase/migrations/20250127000001_fix_handle_new_user_trigger.sql
   ```
3. Clicca su **"Run"** (o premi `Ctrl+Enter`)

### Passo 3: Verifica che Funzioni

1. Dopo aver eseguito la migration, prova a registrarti di nuovo
2. L'errore 500 dovrebbe essere risolto
3. L'utente dovrebbe essere creato correttamente

## 🔍 Cosa Fa la Migration

1. **Verifica che tutti i campi esistano** nella tabella `public.users`:
   - `last_name`
   - `email_verified`
   - `role`

2. **Migliora la funzione `handle_new_user()`**:
   - Aggiunge gestione degli errori con `BEGIN/EXCEPTION`
   - Logga gli errori senza bloccare la creazione dell'utente
   - Gestisce meglio i valori NULL

3. **Ricrea il trigger** per assicurarsi che sia configurato correttamente

## 🚨 Se l'Errore Persiste

### Verifica i Log di Supabase

1. Vai su **Logs** → **Postgres Logs** nel dashboard Supabase
2. Cerca errori relativi a `handle_new_user`
3. Controlla se ci sono errori di permessi o struttura tabella

### Verifica la Struttura della Tabella

Esegui questa query nel SQL Editor:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'users'
ORDER BY ordinal_position;
```

Verifica che ci siano questi campi:
- `id` (UUID)
- `email` (TEXT)
- `name` (TEXT, nullable)
- `last_name` (TEXT, nullable)
- `role` (user_role enum)
- `email_verified` (TIMESTAMP WITH TIME ZONE, nullable)
- `created_at` (TIMESTAMP WITH TIME ZONE)
- `updated_at` (TIMESTAMP WITH TIME ZONE)

### Verifica che il Trigger Esista

Esegui questa query:

```sql
SELECT tgname, tgtype, tgenabled
FROM pg_trigger
WHERE tgname = 'on_auth_user_created';
```

Dovresti vedere il trigger `on_auth_user_created` nella lista.

## 📝 Note

- La migration è **idempotente**: può essere eseguita più volte senza problemi
- Se ci sono errori, vengono loggati ma **non bloccano** la creazione dell'utente in `auth.users`
- Dopo la fix, gli utenti dovrebbero essere creati correttamente sia in `auth.users` che in `public.users`

## 🔗 Link Utili

- [Supabase SQL Editor](https://app.supabase.com/project/_/sql)
- [Supabase Logs](https://app.supabase.com/project/_/logs)
- `CONFIGURAZIONE_EMAIL_SUPABASE.md` - Per configurare le email di conferma
