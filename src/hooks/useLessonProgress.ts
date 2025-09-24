'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/config/supabase';
import type { User } from '@supabase/supabase-js';

interface Progress {
  id: string;
  user_id: string;
  course_id: string;
  lesson_id: string;
  completed: boolean;
  quiz_completed?: boolean;
  video_watched?: boolean;
  completed_at?: string | null;
  video_watched_at?: string | null;
  quiz_completed_at?: string | null;
  time_spent?: number;
  last_accessed_at?: string;
  created_at: string;
  updated_at: string;
}


export function useLessonProgress(courseId: string) {
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const fetchProgress = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId);

      if (error) throw error;
      setProgress(data || []);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore nel caricamento del progresso');
    } finally {
      setLoading(false);
    }
  }, [user, courseId]);

  // Gestisce l'autenticazione dell'utente
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Carica il progresso quando l'utente è disponibile
  useEffect(() => {
    if (user) {
      fetchProgress();
    } else {
      setProgress([]);
      setLoading(false);
    }
  }, [user, fetchProgress]);

  const getLessonStatus = (lessonId: string): 'locked' | 'unlocked' | 'completed' => {
    const lessonProgress = progress.find(p => p.lesson_id === lessonId);
    
    if (!lessonProgress) {
      return 'locked';
    }
    
    if (lessonProgress.completed) {
      return 'completed';
    }
    
    return 'unlocked';
  };

  const markVideoWatched = async (lessonId: string) => {
    if (!user) return;
    
    try {
      // Verifica che l'utente esista nel database
      const { data: userCheck, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single();
      
      if (userError || !userCheck) {
        throw new Error(`Utente ${user.id} non trovato nel database`);
      }
      
      // Usa upsert per gestire insert/update in una sola operazione
      const { error } = await supabase
        .from('progress')
        .upsert({
          user_id: user.id,
          course_id: courseId,
          lesson_id: lessonId,
          completed: false, // Manteniamo false per ora
          video_watched: true,
          video_watched_at: new Date().toISOString(),
          last_accessed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,course_id,lesson_id'
        })
        .select();

      if (error) {
        throw error;
      }

      await fetchProgress();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Errore nel salvare il progresso');
    }
  };

  const markLessonCompleted = async (lessonId: string) => {
    if (!user) return;
    
    try {
      // Usa UPSERT per evitare conflitti di unicità
      const { error } = await supabase
        .from('progress')
        .upsert({
          user_id: user.id,
          course_id: courseId,
          lesson_id: lessonId,
          completed: true,
          completed_at: new Date().toISOString(),
          last_accessed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,course_id,lesson_id'
        })
        .select();

      if (error) {
        throw error;
      }
      
      await fetchProgress();
      
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Errore nel completare la lezione');
    }
  };

  const markQuizCompleted = async (lessonId: string, quizId: string, score: number, passed: boolean) => {
    if (!user) {
      return;
    }
    
    try {
      // Verifica che l'utente esista nel database
      const { data: userCheck, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single();
      
      if (userError || !userCheck) {
        throw new Error(`Utente ${user.id} non trovato nel database`);
      }

      // Salva il tentativo del quiz
      const { error: attemptError } = await supabase
        .from('quiz_attempts')
        .insert({
          user_id: user.id,
          quiz_id: quizId,
          lesson_id: lessonId,
          answers: {}, // Le risposte sono gestite nel componente
          score: score,
          passed: passed
        });

      if (attemptError) {
        throw attemptError;
      }

      // Aggiorna il progresso della lezione usando upsert
      const { error: progressError } = await supabase
        .from('progress')
        .upsert({
          user_id: user.id,
          course_id: courseId,
          lesson_id: lessonId,
          completed: passed,
          quiz_completed: passed,
          completed_at: passed ? new Date().toISOString() : null,
          quiz_completed_at: passed ? new Date().toISOString() : null,
          last_accessed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,course_id,lesson_id'
        })
        .select();

      if (progressError) {
        throw progressError;
      }

      await fetchProgress();
    } catch (err: unknown) {
      // Se l'errore è 409 (conflitto) o 406, non bloccare l'utente
      if ((err as Record<string, unknown>)?.status === 409 || (err as Record<string, unknown>)?.code === '409' || 
          (err as Record<string, unknown>)?.status === 406 || (err as Record<string, unknown>)?.code === '406' ||
          (err instanceof Error && (err.message.includes('409') || err.message.includes('406') || err.message.includes('conflict')))) {
        await fetchProgress(); // Ricarica il progresso
      } else {
        setError(err instanceof Error ? err.message : 'Errore nel salvare il quiz');
      }
    }
  };

  const isLessonUnlocked = (lessonOrder: number, allLessons: { id: string; order: number }[]) => {
    // Se l'utente non è autenticato, blocca tutte le lezioni
    if (!user) {
      return false;
    }

    // Prima lezione sempre sbloccata per utenti autenticati
    if (lessonOrder === 1) {
      return true;
    }

    // Controlla se la lezione precedente è completata
    const previousLesson = allLessons.find(lesson => lesson.order === lessonOrder - 1);
    if (!previousLesson) {
      return false;
    }

    const previousProgress = progress.find(p => p.lesson_id === previousLesson.id);
    const isUnlocked = previousProgress?.completed === true;
    
    return isUnlocked;
  };

  return {
    progress,
    loading,
    error,
    user,
    getLessonStatus,
    markVideoWatched,
    markLessonCompleted,
    markQuizCompleted,
    isLessonUnlocked,
    refetch: fetchProgress
  };
}
