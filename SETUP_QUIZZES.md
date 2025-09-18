# Setup Tabella Quizzes

## 🎯 Obiettivo
Creare la tabella `quizzes` in Supabase per abilitare i quiz nelle lezioni.

## 📋 Istruzioni

### 1. Accedi a Supabase Dashboard
- Vai su [https://supabase.com/dashboard](https://supabase.com/dashboard)
- Seleziona il tuo progetto

### 2. Apri SQL Editor
- Nel menu laterale, clicca su "SQL Editor"
- Clicca su "New query"

### 3. Esegui la Query SQL
Copia e incolla il contenuto del file `create_quizzes_simple.sql` nel editor, oppure usa questo SQL:

```sql
-- Tabella per i quiz delle lezioni
CREATE TABLE IF NOT EXISTS quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  questions JSONB NOT NULL, -- Array di domande con risposte
  passing_score INTEGER DEFAULT 70, -- Punteggio minimo per passare (percentuale)
  max_attempts INTEGER DEFAULT 3, -- Numero massimo di tentativi
  time_limit INTEGER, -- Limite di tempo in minuti (opzionale)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabella per i tentativi di quiz
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  answers JSONB NOT NULL, -- Risposte dell'utente
  score INTEGER NOT NULL, -- Punteggio ottenuto (percentuale)
  passed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indici per migliorare le performance
CREATE INDEX IF NOT EXISTS idx_quizzes_lesson_id ON quizzes(lesson_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_quiz ON quiz_attempts(user_id, quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_lesson ON quiz_attempts(user_id, lesson_id);

-- RLS Policies
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Policy per quiz
CREATE POLICY "Anyone can view quizzes" ON quizzes
  FOR SELECT USING (true);

-- Policy per tentativi quiz
CREATE POLICY "Users can view their own quiz attempts" ON quiz_attempts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own quiz attempts" ON quiz_attempts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Trigger per aggiornare updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_quizzes_updated_at
  BEFORE UPDATE ON quizzes
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();
```

### 4. Esegui la Query
- Clicca su "Run" per eseguire la query
- Verifica che non ci siano errori

### 5. Fix delle Policy (se necessario)
Se hai problemi con l'inserimento dei quiz, esegui questo SQL:

```sql
-- Copia il contenuto del file fix_quiz_policies.sql
```

### 6. Inserisci Dati di Test
Dopo aver creato la tabella, esegui questo script per inserire quiz di esempio:

```bash
node create_quizzes_table.js
```

**Oppure** inserisci manualmente un quiz usando il file `insert_test_quiz.sql`

## ✅ Verifica
Per verificare che tutto funzioni:

1. Vai su una lezione: `http://localhost:3000/courses/products/[id]/lesson/[lessonId]`
2. Guarda il video fino alla fine
3. Clicca su "Prossima Lezione"
4. Dovrebbe aprirsi il quiz in modalità popup

## 🐛 Troubleshooting

### Errore: "Could not find the table 'public.quizzes'"
- La tabella non è stata creata correttamente
- Ripeti i passaggi 1-4

### Errore: "No rows found"
- La tabella esiste ma non ci sono quiz per quella lezione
- Esegui lo script di inserimento dati di test

### Errore: "Permission denied"
- Verifica le RLS policies
- Assicurati che l'utente sia autenticato

## 📝 Struttura Dati Quiz

### Quiz
```json
{
  "id": "uuid",
  "lesson_id": "uuid",
  "title": "Titolo del Quiz",
  "description": "Descrizione opzionale",
  "questions": [
    {
      "id": "q1",
      "question": "Domanda?",
      "type": "multiple_choice",
      "options": ["Opzione 1", "Opzione 2", "Opzione 3", "Opzione 4"],
      "correct_answer": 0,
      "explanation": "Spiegazione della risposta"
    }
  ],
  "passing_score": 70,
  "max_attempts": 3,
  "time_limit": 10
}
```

### Tipi di Domande
- `multiple_choice`: Domanda a scelta multipla
- `true_false`: Domanda vero/falso

## 🎉 Risultato
Una volta completato il setup, avrai:
- ✅ Tabella `quizzes` creata
- ✅ Tabella `quiz_attempts` creata
- ✅ Quiz di esempio per la prima lezione
- ✅ Sistema di quiz funzionante
- ✅ Gestione errori migliorata
