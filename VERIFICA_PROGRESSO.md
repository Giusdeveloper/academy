# Guida alla Verifica del Progresso

## Problema
Alcuni utenti vedono tutti i corsi come completati anche se non hanno completato le lezioni.

## Possibili Cause

1. **Endpoint di test chiamato per errore**
   - L'endpoint `/api/startup-award/test-complete` completa automaticamente tutte le lezioni
   - Verifica i log del server per vedere se è stato chiamato

2. **Record di progresso creati automaticamente**
   - Non ci sono trigger nel database che creano progresso automaticamente
   - Il progresso viene creato solo quando l'utente completa effettivamente una lezione

3. **Bug nel calcolo del progresso**
   - La dashboard calcola il progresso contando i record con `completed: true`
   - Se ci sono record errati, il calcolo sarà sbagliato

## Come Verificare

### 1. Usa l'endpoint di verifica

```bash
# Verifica tutti i record completati
GET /api/admin/verify-progress

# Verifica per un utente specifico
GET /api/admin/verify-progress?userId=USER_ID

# Verifica per un corso specifico
GET /api/admin/verify-progress?courseId=COURSE_ID

# Verifica per email utente
GET /api/admin/verify-progress?userEmail=user@example.com
```

### 2. Analizza i risultati

L'endpoint restituisce:
- **totalRecords**: Numero totale di record completati trovati
- **byCourse**: Analisi per corso con:
  - Numero di lezioni totali
  - Numero di lezioni completate
  - Utenti coinvolti
  - Record sospetti (creati e completati nello stesso momento)
- **suspiciousPatterns**: Pattern sospetti trovati

### 3. Identifica i record sospetti

I record sospetti sono quelli dove:
- `created_at` e `completed_at` sono molto vicini nel tempo (< 2 secondi)
- Questo indica che potrebbero essere stati creati automaticamente

## Come Pulire i Dati Errati

### Opzione 1: Elimina record sospetti automaticamente

```bash
POST /api/admin/verify-progress
Content-Type: application/json

{
  "action": "delete_suspicious",
  "confirm": true
}
```

Questo elimina tutti i record dove `created_at` e `completed_at` sono molto vicini.

### Opzione 2: Elimina record specifici

```bash
POST /api/admin/verify-progress
Content-Type: application/json

{
  "action": "delete_by_ids",
  "recordIds": ["id1", "id2", "id3"],
  "confirm": true
}
```

### Opzione 3: Reset completo per utente e corso

```bash
POST /api/admin/verify-progress
Content-Type: application/json

{
  "action": "reset_user_course",
  "userId": "USER_ID",
  "courseId": "COURSE_ID",
  "confirm": true
}
```

Questo elimina TUTTI i record di progresso per quell'utente e quel corso.

## Verifica Manuale in Supabase

1. Vai alla tabella `progress` in Supabase
2. Filtra per `completed = true`
3. Ordina per `created_at`
4. Cerca pattern dove:
   - Molti record hanno lo stesso `created_at`
   - `created_at` e `completed_at` sono identici o molto vicini
   - Un utente ha tutte le lezioni completate nello stesso momento

## Prevenzione

1. **Proteggi l'endpoint di test**
   - Aggiungi autenticazione admin
   - Aggiungi un flag di ambiente per disabilitarlo in produzione
   - Aggiungi logging dettagliato

2. **Monitora le creazioni di progresso**
   - Aggiungi logging quando vengono creati record di progresso
   - Monitora pattern sospetti

3. **Validazione**
   - Verifica che un utente non possa completare una lezione senza averla visualizzata
   - Aggiungi controlli temporali (non si può completare una lezione in < 1 secondo)

## Note

- ⚠️ **ATTENZIONE**: L'eliminazione dei record è permanente
- ✅ Fai sempre un backup prima di eliminare dati
- 🔍 Verifica sempre prima di pulire
- 📊 Usa l'endpoint GET per analizzare prima di agire
