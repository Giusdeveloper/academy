# Migration: Admin Logs

## 📋 Istruzioni per eseguire la migration

### Metodo 1: SQL Editor di Supabase (Consigliato)

1. Vai su [Supabase Dashboard](https://supabase.com/dashboard)
2. Seleziona il tuo progetto
3. Vai su **SQL Editor** (menu laterale)
4. Clicca su **New Query**
5. Copia e incolla il contenuto del file `supabase/migrations/20250118000001_create_admin_logs.sql`
6. Clicca su **Run** (o premi `Ctrl+Enter`)

### Metodo 2: Via Supabase CLI (se installato)

```bash
supabase db push
```

Oppure:

```bash
supabase migration up
```

## ✅ Verifica dell'esecuzione

Dopo aver eseguito la migration, verifica che sia stata creata correttamente:

1. Vai su **Table Editor** nel dashboard Supabase
2. Cerca la tabella `admin_logs` nella lista
3. Verifica che contenga le colonne:
   - `id` (UUID)
   - `admin_id` (UUID)
   - `admin_email` (TEXT)
   - `admin_name` (TEXT)
   - `action_type` (admin_action_type)
   - `entity_type` (admin_entity_type)
   - `entity_id` (UUID)
   - `description` (TEXT)
   - `details` (JSONB)
   - `ip_address` (INET)
   - `user_agent` (TEXT)
   - `created_at` (TIMESTAMP)

## 📝 Contenuto della Migration

La migration crea:
- ✅ Enum `admin_action_type` con tutti i tipi di azione
- ✅ Enum `admin_entity_type` con tutti i tipi di entità
- ✅ Tabella `admin_logs` con tutti i campi necessari
- ✅ Indici per ottimizzare le query
- ✅ Funzione `cleanup_old_admin_logs()` per pulire log vecchi

## 🔍 Test

Dopo l'esecuzione, puoi testare il sistema:
1. Accedi all'area admin (`/admin`)
2. Crea/modifica/elimina una risorsa o evento
3. Vai su `/admin/logs` per vedere i log registrati

