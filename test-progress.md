# TEST PROGRESSIONE LEZIONI

## Test Case 1: Lezione senza quiz
1. **Preparazione**: Assicurarsi che una lezione non abbia quiz associato
2. **Test**: 
   - Guardare video fino alla fine (naturale o manuale)
   - Verificare che la lezione sia automaticamente completata
   - Verificare che la lezione successiva sia sbloccata
3. **Risultato atteso**: 
   - `video_watched: true`
   - `quiz_completed: false` 
   - `completed: true`
   - `completed_at: timestamp`

## Test Case 2: Lezione con quiz  
1. **Preparazione**: Assicurarsi che una lezione abbia quiz associato
2. **Test**:
   - Guardare video fino alla fine
   - Cliccare "Prossima Lezione"
   - Completare quiz con successo (score >= passing_score)
   - Verificare che la lezione sia completata
   - Verificare che la lezione successiva sia sbloccata
3. **Risultato atteso**:
   - `video_watched: true`
   - `quiz_completed: true`
   - `completed: true`
   - `completed_at: timestamp`

## Test Case 3: Progressione sequenziale
1. **Preparazione**: Cancellare tutti i record di progresso per un utente test
2. **Test**:
   - Completare lezione 1
   - Verificare che SOLO la lezione 2 sia sbloccata (non 3, 4, 5...)
   - Completare lezione 2
   - Verificare che SOLO la lezione 3 sia sbloccata
   - Continuare fino alla lezione 5
3. **Risultato atteso**: Sblocco sequenziale 1→2→3→4→5

## Test Case 4: Quiz fallito
1. **Preparazione**: Lezione con quiz
2. **Test**:
   - Completare video
   - Fallire il quiz (score < passing_score)
   - Verificare che la lezione NON sia completata
   - Verificare che la lezione successiva NON sia sbloccata
3. **Risultato atteso**:
   - `video_watched: true`
   - `quiz_completed: false`
   - `completed: false`
   - `completed_at: null`

## Test Case 5: Video HTML5 vs iframe
1. **Preparazione**: Testare con entrambi i tipi di video
2. **Test HTML5**:
   - Portare manualmente il cursore alla fine del video
   - Verificare che il tracking funzioni
3. **Test iframe**:
   - Lasciare che il video finisca naturalmente
   - Verificare che il tracking funzioni
4. **Risultato atteso**: Entrambi i tipi devono funzionare correttamente

## 🔧 RISOLUZIONE PROBLEMI DATABASE

### Problema: Errori 400 su `/progress`
**Causa**: Le colonne `video_watched`, `quiz_completed`, `completed_at` potrebbero non esistere nella tabella `progress`.

**Soluzione**: Esegui questo script SQL nel tuo database Supabase:

```sql
-- Aggiungi le colonne mancanti se non esistono
ALTER TABLE progress
ADD COLUMN IF NOT EXISTS quiz_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS video_watched BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;

-- Verifica che le colonne siano state aggiunte
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'progress'
ORDER BY ordinal_position;
```

**File di riferimento**: `fix_progress_table.sql`

## Comandi per testare:

### Reset progresso utente test:
```sql
DELETE FROM progress WHERE user_id = 'USER_ID_DI_TEST';
DELETE FROM quiz_attempts WHERE user_id = 'USER_ID_DI_TEST';
```

### Verificare stato progresso:
```sql
SELECT 
  l.title,
  l."order",
  p.video_watched,
  p.quiz_completed,
  p.completed,
  p.completed_at
FROM progress p
JOIN lessons l ON p.lesson_id = l.id
WHERE p.user_id = 'USER_ID_DI_TEST'
ORDER BY l."order";
```

### Verificare tentativi quiz:
```sql
SELECT 
  l.title,
  qa.score,
  qa.passed,
  qa.completed_at
FROM quiz_attempts qa
JOIN lessons l ON qa.lesson_id = l.id
WHERE qa.user_id = 'USER_ID_DI_TEST'
ORDER BY l."order", qa.completed_at;
```

## Log da monitorare nel browser:

### Log corretti (dopo aver risolto i problemi database):
- `🎬 Video terminato!`
- `📝 Nessun quiz trovato. Completamento automatico della lezione...`
- `✅ Lezione senza quiz completata automaticamente`
- `📊 Progresso aggiornato:`
- `🔓 isLessonUnlocked:`
- `🎬 markVideoWatched chiamato:`
- `✅ markVideoWatched completato con successo`
- `📝 markLessonCompleted chiamato:`
- `✅ Lezione senza quiz completata:`

### Log di errore (prima delle correzioni):
- `❌ Errore nel salvare il progresso`
- `⚠️ Errore con colonne extra, provo senza:`
- `Failed to load resource: the server responded with a status of 400`

## Checklist finale:
- [ ] Lezioni senza quiz si completano automaticamente
- [ ] Lezioni con quiz si completano solo dopo quiz superato
- [ ] Progressione sequenziale funziona (1→2→3→4...)
- [ ] Quiz falliti non sbloccano lezioni successive
- [ ] Video HTML5 e iframe funzionano entrambi
- [ ] Logging di debug è presente e funzionante
- [ ] Nessun errore di linting
- [ ] Database aggiornato correttamente
