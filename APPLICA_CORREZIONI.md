# Come Applicare le Correzioni delle Lezioni

## Situazione Attuale

Abbiamo completato le correzioni del contenuto delle lezioni per risolvere i problemi di formattazione HTML. I file di correzione sono pronti e devono essere applicati al database Supabase.

## Passaggi per Applicare le Correzioni

### 1. Verifica lo Stato Attuale

Prima di applicare le correzioni, verifica lo stato attuale del database:

1. Apri la **Console SQL** di Supabase
2. Esegui il contenuto del file `verify_lesson_fixes.sql`
3. Controlla se ci sono ancora lezioni con riferimenti malformati

### 2. Applica le Correzioni

Se ci sono ancora lezioni con problemi, applica le correzioni:

#### Opzione A: File Completo (Raccomandato)
1. Apri la **Console SQL** di Supabase
2. Copia e incolla il contenuto del file `lessons_content_fixed_complete.sql`
3. Esegui lo script

#### Opzione B: File Separati
Se preferisci applicare le correzioni in parti:
1. Esegui `lessons_fixes_part1.sql` (lezioni 1-5)
2. Esegui `lessons_fixes_part2.sql` (lezioni 6-10)  
3. Esegui `lessons_fixes_part3.sql` (lezioni 11-13)

### 3. Verifica le Correzioni

Dopo aver applicato le correzioni:
1. Esegui nuovamente `verify_lesson_fixes.sql`
2. Controlla che tutte le lezioni mostrino "✅ Corretto"
3. Testa il frontend per assicurarti che le lezioni si visualizzino correttamente

## Problemi Risolti

Le correzioni risolvono:

- ❌ **Riferimenti malformati**: `:contentReference[oaicite:2]{index=2}` → Rimosso
- ❌ **Caratteri speciali**: `l'evoluzione` → `l''evoluzione` (SQL)
- ❌ **Virgolette**: `"WOW"` → `&quot;WOW&quot;` (HTML)
- ❌ **Simboli HTML**: `M&A` → `M&amp;A` (HTML)

## Test Frontend

Dopo aver applicato le correzioni, testa:

1. **Homepage**: Verifica che i corsi si carichino correttamente
2. **Pagina Corso**: Controlla che le lezioni siano elencate
3. **Pagina Lezione**: Verifica che il contenuto HTML si visualizzi senza errori
4. **Navigazione**: Testa la navigazione tra le lezioni

## File Coinvolti

- `lessons_content_fixed_complete.sql` - Correzioni complete
- `lessons_fixes_part1.sql` - Correzioni lezioni 1-5
- `lessons_fixes_part2.sql` - Correzioni lezioni 6-10
- `lessons_fixes_part3.sql` - Correzioni lezioni 11-13
- `verify_lesson_fixes.sql` - Script di verifica

## Note Importanti

- ⚠️ **Backup**: Fai sempre un backup del database prima di applicare le correzioni
- 🧪 **Test**: Testa in un ambiente di sviluppo prima della produzione
- ✅ **Verifica**: Controlla che tutte le lezioni siano visualizzate correttamente
