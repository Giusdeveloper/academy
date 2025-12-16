# 🧪 Guida Test Step-by-Step - Startup Award Tracking

## FASE 1: Verifica Migration SQL ✅

### Step 1.1: Verifica che la tabella esista
Esegui questa query nel Supabase SQL Editor:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'startup_award_progress';
```

**Risultato atteso**: Dovresti vedere una riga con `startup_award_progress`

### Step 1.2: Verifica che le funzioni esistano
Esegui questa query:

```sql
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN ('is_course_completed', 'get_startup_award_status');
```

**Risultato atteso**: Dovresti vedere 2 righe con i nomi delle funzioni

---

## FASE 2: Preparazione Test 🔧

### Step 2.1: Trova l'ID del corso finanziamento-aziendale
Esegui questa query:

```sql
SELECT id, slug, title 
FROM courses 
WHERE slug = 'finanziamento-aziendale';
```

**Cosa fare**: Annota l'`id` del corso (ti servirà dopo)

### Step 2.2: Verifica che ci siano lezioni nel corso
Sostituisci `[COURSE_ID]` con l'ID trovato prima:

```sql
SELECT COUNT(*) as total_lessons 
FROM lessons 
WHERE course_id = '[COURSE_ID]';
```

**Risultato atteso**: Un numero maggiore di 0

### Step 2.3: Prepara un account di test
- Assicurati di avere un account utente di test
- Annota l'email dell'account

---

## FASE 3: Test Iscrizione (Fase 1) 📝

### Step 3.1: Apri la console del browser
1. Apri il browser (Chrome/Firefox)
2. Apri gli strumenti sviluppatore (F12)
3. Vai alla tab "Console"

### Step 3.2: Pulisci sessionStorage
Nella console, esegui:

```javascript
sessionStorage.clear();
console.log('SessionStorage pulito');
```

### Step 3.3: Simula arrivo da startup-award
Nella console, esegui:

```javascript
sessionStorage.setItem('registerFrom', 'startup-award');
console.log('Flag startup-award impostato:', sessionStorage.getItem('registerFrom'));
```

**Risultato atteso**: `Flag startup-award impostato: startup-award`

### Step 3.4: Vai alla pagina startup-award
1. Vai a: `http://localhost:3000/startup-award` (o il tuo URL)
2. Verifica che la pagina carichi correttamente

### Step 3.5: Clicca "Inizia il percorso"
1. Clicca sul pulsante "Inizia il percorso"
2. Verifica che vieni reindirizzato a `/register?from=startup-award`
3. Controlla l'URL nella barra degli indirizzi

### Step 3.6: Registrati o accedi
- Se non hai un account: registrati con l'email di test
- Se hai già un account: accedi

### Step 3.7: Verifica redirect al corso
**Risultato atteso**: Dopo login/registrazione, vieni reindirizzato a `/courses/finanziamento-aziendale`

### Step 3.8: Iscriviti al corso
1. Nella pagina del corso, cerca il pulsante "Iscriviti" o simile
2. Clicca e conferma l'iscrizione nel modal

### Step 3.9: Verifica tracking in console
Nella console del browser, dovresti vedere:

```
✅ Iscrizione Fase 1 tracciata per [tua-email] al corso [course-id]
```

### Step 3.10: Verifica nel database
Esegui questa query (sostituisci con la tua email):

```sql
SELECT * FROM startup_award_progress 
WHERE user_email = 'tua-email@example.com';
```

**Risultato atteso**: 
- Una riga con `phase1_enrolled_at` popolato
- `current_phase = 1`
- `status = 'enrolled'`

---

## FASE 4: Test Completamento (Fase 1) 🎯

### Step 4.1: Accedi al corso
1. Vai a `/courses/finanziamento-aziendale`
2. Assicurati di essere loggato

### Step 4.2: Completa tutte le lezioni
1. Accedi a ogni lezione del corso
2. Marca ogni lezione come completata
3. Se ci sono quiz, completali

### Step 4.3: Verifica completamento in console
Nella console, dovresti vedere:

```
✅ Corso completato! Fase 1 completata. Pronto per Fase 2.
```

### Step 4.4: Verifica nel database
Esegui la stessa query di prima:

```sql
SELECT * FROM startup_award_progress 
WHERE user_email = 'tua-email@example.com';
```

**Risultato atteso**: 
- `phase1_completed_at` popolato con timestamp
- `current_phase = 2`
- `status = 'phase1_completed'`

---

## FASE 5: Test API 🚀

### Step 5.1: Test verifica stato
Apri nel browser (sostituisci con i tuoi valori):

```
http://localhost:3000/api/startup-award/test?action=status&user_email=tua-email@example.com&course_id=[COURSE_ID]
```

**Risultato atteso**: JSON con lo stato del percorso

### Step 5.2: Test traccia iscrizione
```
http://localhost:3000/api/startup-award/test?action=enroll&user_email=tua-email@example.com&course_id=[COURSE_ID]
```

**Risultato atteso**: JSON con `success: true` e dati aggiornati

---

## ✅ Checklist Finale

- [ ] Migration SQL eseguita
- [ ] Tabella `startup_award_progress` esiste
- [ ] Funzioni SQL create
- [ ] Iscrizione tracciata correttamente
- [ ] Record creato nel database con `phase1_enrolled_at`
- [ ] Completamento tracciato correttamente
- [ ] Record aggiornato con `phase1_completed_at` e `current_phase = 2`
- [ ] API di test funzionante

---

## 🐛 Se qualcosa non funziona

1. **Controlla la console del browser** per errori
2. **Verifica i log** nella tab "Network" degli strumenti sviluppatore
3. **Controlla il database** direttamente con le query SQL
4. **Verifica che l'utente sia autenticato** prima di iscriversi

