# Setup Area Admin

Questa guida spiega come configurare l'area admin per la prima volta.

## 📋 Prerequisiti

1. Avere accesso al database Supabase
2. Conoscere l'email dell'utente che vuoi rendere admin
3. Avere eseguito tutte le migration del database

## 🚀 Passi per configurare l'area admin

### Passo 1: Eseguire le migration

Le migration necessarie sono:
- `20250117000001_add_user_role.sql` - Aggiunge il campo `role` alla tabella `users`
- `20250117000002_set_admin_user.sql` - Aggiunge funzioni helper (opzionale)

**Come eseguire:**
1. Vai su Supabase Dashboard → SQL Editor
2. Copia e incolla il contenuto di ogni migration
3. Esegui ogni script

Oppure, se usi Supabase CLI:
```bash
supabase db push
```

### Passo 2: Impostare un utente come admin

Hai diverse opzioni:

#### Opzione A: Tramite SQL Editor (Consigliato)

1. Apri il file `scripts/set-admin-user.sql`
2. Modifica l'email nella riga `UPDATE` con quella dell'utente che vuoi rendere admin
3. Copia e incolla lo script nel SQL Editor di Supabase
4. Esegui lo script

**Esempio:**
```sql
UPDATE public.users 
SET role = 'admin', updated_at = NOW()
WHERE email = 'info@imment.it';
```

#### Opzione B: Tramite funzione helper

Se hai eseguito la migration `20250117000002_set_admin_user.sql`, puoi usare la funzione:

```sql
SELECT public.set_user_role('info@imment.it', 'admin');
```

#### Opzione C: Tramite Supabase Dashboard

1. Vai su Supabase Dashboard → Table Editor → `users`
2. Trova l'utente che vuoi rendere admin
3. Modifica il campo `role` da `user` a `admin`
4. Salva

### Passo 3: Verificare che funzioni

1. Accedi all'applicazione con l'utente che hai reso admin
2. Vai su `/admin`
3. Dovresti vedere la dashboard admin

Se non funziona:
- Verifica che il campo `role` sia effettivamente `'admin'` nel database
- Controlla la console del browser per eventuali errori
- Verifica che la sessione sia attiva (prova a fare logout e login di nuovo)

## 🔍 Verificare utenti admin

Per vedere tutti gli utenti admin:

```sql
SELECT id, email, name, role, created_at
FROM public.users
WHERE role = 'admin';
```

## 🔄 Rimuovere ruolo admin

Per rimuovere il ruolo admin da un utente:

```sql
UPDATE public.users 
SET role = 'user', updated_at = NOW()
WHERE email = 'info@imment.it';
```

Oppure usando la funzione:

```sql
SELECT public.set_user_role('info@imment.it', 'user');
```

## 📝 Note importanti

- **Sicurezza**: Assicurati di non esporre lo script SQL in produzione
- **Backup**: Prima di modificare ruoli, fai un backup del database
- **Test**: Testa sempre l'accesso admin dopo aver modificato i ruoli
- **Multi-admin**: Puoi avere più utenti admin contemporaneamente

## 🆘 Troubleshooting

### L'utente non può accedere all'area admin

1. Verifica che `role = 'admin'` nel database
2. Controlla che la migration sia stata eseguita correttamente
3. Verifica che la sessione sia valida (logout/login)
4. Controlla i log della console per errori

### Errore "role does not exist"

- La migration non è stata eseguita
- Esegui manualmente: `ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user' NOT NULL;`

### Il middleware reindirizza sempre al login

- Verifica che `NEXTAUTH_SECRET` sia configurato nelle variabili d'ambiente
- Controlla che la sessione NextAuth sia valida

## 📞 Supporto

Se hai problemi, controlla:
- I log di Supabase
- La console del browser
- I log di Vercel (se in produzione)

