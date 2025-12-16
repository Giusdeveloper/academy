# Guida al Test del Sistema Startup Award Tracking

## 📋 Prerequisiti

1. **Eseguire la migration SQL** nel database Supabase:
   - File: `supabase/migrations/20250101000001_create_startup_award_tracking.sql`
   - Eseguire lo script SQL nel Supabase SQL Editor

2. **Verificare che esistano**:
   - Un corso con slug `finanziamento-aziendale`
   - Lezioni associate al corso
   - Utenti di test

## 🧪 Test Manuale - Flusso Completo

### Test 1: Iscrizione al Corso (Fase 1)

1. **Pulire sessionStorage**:
   ```javascript
   sessionStorage.clear();
   ```

2. **Simulare arrivo da startup-award**:
   ```javascript
   sessionStorage.setItem('registerFrom', 'startup-award');
   ```

3. **Navigare alla pagina di registrazione**:
   - Vai a `/register?from=startup-award`
   - Registra un nuovo utente o accedi con un utente esistente

4. **Verificare redirect**:
   - Dopo la registrazione/login, dovresti essere reindirizzato a `/courses/finanziamento-aziendale`

5. **Iscriversi al corso**:
   - Clicca su "Iscriviti" o il pulsante di iscrizione
   - Conferma l'iscrizione nel modal

6. **Verificare tracking**:
   - Apri la console del browser
   - Dovresti vedere: `✅ Iscrizione Fase 1 tracciata per [email] al corso [course_id]`
   - Verifica nel database Supabase nella tabella `startup_award_progress`:
     ```sql
     SELECT * FROM startup_award_progress 
     WHERE user_email = 'tua-email@example.com';
     ```

### Test 1.5: Reset Progressi (per test multipli)

Se vuoi testare nuovamente il sistema dopo aver completato il corso, puoi resettare i progressi:

**Dalla console del browser:**
```javascript
fetch('/api/startup-award/test-reset', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    email: 'pistoia702@gmail.com',
    courseSlug: 'finanziamento-aziendale'
  })
})
.then(r => r.json())
.then(data => {
  console.log('✅ Risposta:', data);
  if (data.success) {
    console.log('✅ Progressi resettati! Ora puoi testare nuovamente.');
  } else {
    console.error('❌ Errore:', data.error);
  }
});
```

**Oppure usando curl:**
```bash
curl -X POST http://localhost:3000/api/startup-award/test-reset \
  -H "Content-Type: application/json" \
  -d '{"email": "pistoia702@gmail.com", "courseSlug": "finanziamento-aziendale"}'
```

**Cosa fa il reset:**
- Elimina tutti i record di progresso delle lezioni per l'utente e il corso
- Resetta `phase1_completed_at` a `null` nella tabella `startup_award_progress`
- Imposta `current_phase` a `1` e `status` a `'enrolled'`
- Mantiene `phase1_enrolled_at` (l'utente rimane iscritto)

### Test 2: Completamento Corso (Fase 1) - Simulazione

**Opzione A: Simulazione rapida (consigliata per test)**

1. **Trova l'user_id dell'utente** (se non lo conosci):
   
   Esegui questa query nel Supabase SQL Editor:
   ```sql
   SELECT id, email FROM auth.users WHERE email = 'pistoia702@gmail.com';
   ```
   
   Copia l'`id` (UUID) che vedi nel risultato.

2. **Usa l'endpoint di test per simulare il completamento**:
   ```bash
   POST http://localhost:3000/api/startup-award/test-complete
   Content-Type: application/json
   
   {
     "email": "pistoia702@gmail.com",
     "courseSlug": "finanziamento-aziendale"
   }
   ```

   Oppure usando curl:
   ```bash
   curl -X POST http://localhost:3000/api/startup-award/test-complete \
     -H "Content-Type: application/json" \
     -d '{"email": "pistoia702@gmail.com", "courseSlug": "finanziamento-aziendale"}'
   ```

   Oppure dalla console del browser (con email):
   ```javascript
   fetch('/api/startup-award/test-complete', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ 
       email: 'pistoia702@gmail.com',
       courseSlug: 'finanziamento-aziendale'
     })
   })
   .then(r => r.json())
   .then(console.log);
   ```
   
   **Se l'email non funziona**, usa direttamente l'user_id:
   ```javascript
   fetch('/api/startup-award/test-complete', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ 
       email: 'pistoia702@gmail.com',
       userId: '05bf8584-25bb-44e3-a8ac-e0cc5813a47e', // Sostituisci con il tuo user_id
       courseSlug: 'finanziamento-aziendale'
     })
   })
   .then(r => r.json())
   .then(console.log);
   ```

2. **Verifica la risposta**:
   - Dovresti ricevere una risposta con `success: true` e `phase1Completed: true`
   - Controlla la console del server per i log

3. **Verifica nel database**:
   ```sql
   SELECT * FROM startup_award_progress 
   WHERE user_email = 'pistoia702@gmail.com';
   ```
   - Dovresti vedere `phase1_completed_at` popolato
   - `current_phase` dovrebbe essere `2`
   - `status` dovrebbe essere `'phase1_completed'`

**Opzione B: Completamento manuale (per test realistici)**

1. **Completare tutte le lezioni del corso**:
   - Accedi al corso `finanziamento-aziendale`
   - Completa tutte le lezioni (marca come completate)

2. **Verificare completamento automatico**:
   - La verifica avviene automaticamente quando tutte le lezioni sono completate
   - Controlla la console: `✅ Corso completato! Fase 1 completata. Pronto per Fase 2.`
   - Verifica nel database:
     ```sql
     SELECT * FROM startup_award_progress 
     WHERE user_email = 'tua-email@example.com';
     ```
   - Dovresti vedere `phase1_completed_at` popolato e `current_phase = 2`

### Test 3: API di Test

Usa l'endpoint di test per verificare manualmente:

#### Verificare lo stato:
```bash
GET /api/startup-award/test?action=status&user_email=test@example.com&course_id=[COURSE_ID]
```

#### Tracciare iscrizione di test:
```bash
GET /api/startup-award/test?action=enroll&user_email=test@example.com&course_id=[COURSE_ID]
```

#### Verificare completamento:
```bash
GET /api/startup-award/test?action=check_completion&user_email=test@example.com&course_id=[COURSE_ID]
```

## 🔍 Verifica Database

### Query utili:

```sql
-- Verifica tutti i record di tracking
SELECT * FROM startup_award_progress;

-- Verifica lo stato di un utente specifico
SELECT * FROM startup_award_progress 
WHERE user_email = 'tua-email@example.com';

-- Verifica utenti che hanno completato la Fase 1
SELECT * FROM startup_award_progress 
WHERE phase1_completed_at IS NOT NULL;

-- Verifica il completamento corso usando la funzione
SELECT is_course_completed('[COURSE_ID]', '[USER_ID]');

-- Verifica lo stato completo usando la funzione
SELECT * FROM get_startup_award_status('tua-email@example.com', '[COURSE_ID]');
```

## 🐛 Troubleshooting

### Problema: "Errore nel tracciare iscrizione"
- **Causa**: La tabella `startup_award_progress` non esiste
- **Soluzione**: Esegui la migration SQL

### Problema: "User ID non disponibile"
- **Causa**: L'utente non è autenticato
- **Soluzione**: Assicurati di essere loggato

### Problema: "Errore nel verificare completamento corso"
- **Causa**: La funzione SQL `is_course_completed` non esiste o ha errori
- **Soluzione**: Verifica che la migration sia stata eseguita correttamente

### Problema: Il completamento non viene tracciato
- **Causa**: Le lezioni non sono tutte completate o il corso non è `finanziamento-aziendale`
- **Soluzione**: Verifica che tutte le lezioni abbiano `completed = true` nella tabella `progress`

## ✅ Checklist Test

- [ ] Migration SQL eseguita con successo
- [ ] Tabella `startup_award_progress` creata
- [ ] Funzioni SQL create (`is_course_completed`, `get_startup_award_status`)
- [ ] Iscrizione tracciata quando si arriva da startup-award
- [ ] Record creato in `startup_award_progress` con `phase1_enrolled_at`
- [ ] Completamento tracciato quando tutte le lezioni sono completate
- [ ] Record aggiornato con `phase1_completed_at` e `current_phase = 2`
- [ ] API di test funzionante
- [ ] Componente `StartupAwardStatus` mostra lo stato corretto

## 📝 Note

- Il tracking funziona solo per il corso con slug `finanziamento-aziendale`
- L'utente deve arrivare da `/startup-award` per essere tracciato
- Il completamento viene verificato automaticamente quando tutte le lezioni sono completate
- Lo stato viene aggiornato in tempo reale nel database

