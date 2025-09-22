# 🗄️ DIAGRAMMA STRUTTURA DATABASE MIGLIORATA

## 📊 Schema Relazionale

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     USERS       │    │    COURSES      │    │    LESSONS      │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ id (PK)         │    │ id (PK)         │    │ id (PK)         │
│ name            │    │ title           │    │ title           │
│ email           │    │ description     │    │ content         │
│ role            │    │ price           │    │ order           │
│ created_at      │    │ author_id (FK)  │───▶│ course_id (FK)  │
│ updated_at      │    │ published       │    │ created_at      │
└─────────────────┘    │ created_at      │    │ updated_at      │
         │              │ updated_at      │    └─────────────────┘
         │              └─────────────────┘              │
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     ORDERS      │    │    PROGRESS     │    │   MATERIALS     │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ id (PK)         │    │ id (PK)         │    │ id (PK)         │
│ user_id (FK)    │───▶│ user_id (FK)    │    │ title           │
│ course_id (FK)  │───▶│ course_id (FK)  │    │ type            │
│ amount          │    │ lesson_id (FK)  │───▶│ url             │
│ status          │    │ completed       │    │ lesson_id (FK)  │
│ created_at      │    │ video_watched   │    │ created_at      │
└─────────────────┘    │ quiz_completed  │    │ updated_at      │
                       │ completed_at    │    └─────────────────┘
                       │ video_watched_at│              │
                       │ quiz_completed_at│             │
                       │ time_spent      │             │
                       │ last_accessed_at│             │
                       │ created_at      │             │
                       │ updated_at      │             │
                       └─────────────────┘             │
                                │                      │
                                │                      │
                                ▼                      ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │LESSON_SESSIONS  │    │     QUIZZES     │
                       ├─────────────────┤    ├─────────────────┤
                       │ id (PK)         │    │ id (PK)         │
                       │ user_id (FK)    │───▶│ lesson_id (FK)  │
                       │ lesson_id (FK)  │    │ title           │
                       │ course_id (FK)  │    │ questions (JSON)│
                       │ session_start   │    │ passing_score   │
                       │ session_end     │    │ max_attempts    │
                       │ time_spent      │    │ time_limit      │
                       │ video_time_watched│   │ created_at      │
                       │ status          │    │ updated_at      │
                       │ device_type     │    └─────────────────┘
                       │ created_at      │              │
                       │ updated_at      │              │
                       └─────────────────┘              │
                                │                       │
                                │                       │
                                ▼                       ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │VIDEO_WATCH_EVENTS│   │  QUIZ_ATTEMPTS  │
                       ├─────────────────┤    ├─────────────────┤
                       │ id (PK)         │    │ id (PK)         │
                       │ user_id (FK)    │───▶│ user_id (FK)    │
                       │ lesson_id (FK)  │    │ quiz_id (FK)    │
                       │ session_id (FK) │───▶│ lesson_id (FK)  │
                       │ event_type      │    │ answers (JSON)  │
                       │ current_time    │    │ score           │
                       │ duration        │    │ passed          │
                       │ progress_percent│    │ time_spent      │
                       │ timestamp       │    │ started_at      │
                       └─────────────────┘    │ completed_at    │
                                              │ session_id (FK) │
                                              │ created_at      │
                                              └─────────────────┘
                                                       │
                                                       │
                                                       ▼
                                              ┌─────────────────┐
                                              │USER_COURSE_STATS│
                                              ├─────────────────┤
                                              │ id (PK)         │
                                              │ user_id (FK)    │───▶
                                              │ course_id (FK)  │───▶
                                              │ total_time_spent│
                                              │ lessons_completed│
                                              │ quizzes_passed  │
                                              │ quizzes_failed  │
                                              │ avg_quiz_score  │
                                              │ first_access    │
                                              │ last_access     │
                                              │ completed_at    │
                                              │ created_at      │
                                              │ updated_at      │
                                              └─────────────────┘
```

## 🔗 Relazioni Principali

### **1. Gerarchia Contenuti**
```
USERS → COURSES → LESSONS → MATERIALS
     ↘         ↘        ↘
       ORDERS   PROGRESS  QUIZZES
```

### **2. Tracking Sessione**
```
USERS → LESSON_SESSIONS → VIDEO_WATCH_EVENTS
     ↘                 ↘
       PROGRESS          QUIZ_ATTEMPTS
```

### **3. Statistiche Aggregate**
```
USERS → USER_COURSE_STATS ← COURSES
     ↘                    ↗
       PROGRESS
```

## 📊 Viste Pre-calcolate

### **`user_lesson_progress`**
```sql
-- Combina progress + lessons + courses + quizzes
-- Fornisce vista completa del progresso utente
-- Include statistiche quiz e timestamp dettagliati
```

### **`course_completion_stats`**
```sql
-- Statistiche aggregate per corso
-- Tasso di completamento, utenti attivi
-- Metriche di engagement
```

## 🎯 Flusso Dati Principale

### **1. Inizio Sessione**
```
Utente accede lezione → Crea LESSON_SESSION → Traccia PROGRESS
```

### **2. Visione Video**
```
Video eventi → VIDEO_WATCH_EVENTS → Aggiorna LESSON_SESSION
```

### **3. Completamento Quiz**
```
Quiz completato → QUIZ_ATTEMPTS → Aggiorna PROGRESS → USER_COURSE_STATS
```

### **4. Fine Sessione**
```
Sessione terminata → LESSON_SESSION.status = 'completed'
```

## 🔍 Indici Critici

### **Performance Query**
```sql
-- Progresso utente
idx_progress_user_lesson (user_id, lesson_id)
idx_progress_course_completed (course_id, completed)

-- Sessioni
idx_lesson_sessions_user_lesson (user_id, lesson_id)
idx_lesson_sessions_status (status)

-- Eventi video
idx_video_events_user_lesson (user_id, lesson_id)
idx_video_events_timestamp (timestamp)

-- Statistiche
idx_user_course_stats_user (user_id)
idx_user_course_stats_course (course_id)
```

## 🚀 Benefici Architettura

### **Scalabilità**
- ✅ Separazione tracking dettagliato da progresso base
- ✅ Indici ottimizzati per query frequenti
- ✅ Viste pre-calcolate per dashboard

### **Analytics**
- ✅ Eventi video granulari per heatmap
- ✅ Sessioni per pattern di studio
- ✅ Statistiche aggregate per insights

### **Performance**
- ✅ RLS per sicurezza senza overhead
- ✅ Trigger automatici per consistency
- ✅ Indici compositi per query complesse

### **Manutenibilità**
- ✅ Schema modulare e estensibile
- ✅ Documentazione completa
- ✅ Tipi TypeScript sincronizzati
