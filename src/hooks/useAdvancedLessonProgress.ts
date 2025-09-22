'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/config/supabase';
import type { User } from '@supabase/supabase-js';
import type { 
  LessonSession, 
  VideoWatchEvent, 
  VideoEventData
} from '@/types/database-improved';

interface AdvancedLessonProgressOptions {
  enableSessionTracking?: boolean;
  enableVideoEventTracking?: boolean;
  enableDetailedStats?: boolean;
  sessionTimeoutMinutes?: number;
}

export function useAdvancedLessonProgress(
  courseId: string, 
  options: AdvancedLessonProgressOptions = {}
) {
  const {
    enableSessionTracking = true,
    enableVideoEventTracking = true,
    enableDetailedStats = true,
    sessionTimeoutMinutes = 30
  } = options;

  const [user, setUser] = useState<User | null>(null);
  const [currentSession, setCurrentSession] = useState<LessonSession | null>(null);
  const [loading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Refs per tracking
  const sessionStartTime = useRef<Date | null>(null);
  // const _videoStartTimeRef = useRef<number | null>(null);
  const sessionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // =============================================================================
  // GESTIONE AUTENTICAZIONE
  // =============================================================================

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // =============================================================================
  // GESTIONE SESSIONI
  // =============================================================================

  const endLessonSession = useCallback(async (
    sessionId: string, 
    status: 'completed' | 'abandoned' = 'completed'
  ) => {
    if (!enableSessionTracking) return;

    try {
      const endTime = new Date();
      const timeSpent = sessionStartTime.current 
        ? Math.floor((endTime.getTime() - sessionStartTime.current.getTime()) / 1000)
        : 0;

      console.log('🏁 Terminando sessione:', { sessionId, status, timeSpent });

      const { error } = await supabase
        .from('lesson_sessions')
        .update({
          session_end: endTime.toISOString(),
          time_spent: timeSpent,
          status
        })
        .eq('id', sessionId);

      if (error) throw error;

      // Pulisci timeout
      if (sessionTimeoutRef.current) {
        clearTimeout(sessionTimeoutRef.current);
        sessionTimeoutRef.current = null;
      }

      setCurrentSession(null);
      sessionStartTime.current = null;

      console.log('✅ Sessione terminata');

    } catch (err) {
      console.error('❌ Errore nella terminazione sessione:', err);
    }
  }, [enableSessionTracking]);

  const getDeviceType = useCallback((): string => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/mobile|android|iphone|ipad|tablet/.test(userAgent)) {
      return 'mobile';
    } else if (/tablet|ipad/.test(userAgent)) {
      return 'tablet';
    } else {
      return 'desktop';
    }
  }, []);

  const startLessonSession = useCallback(async (lessonId: string) => {
    if (!user || !enableSessionTracking) return null;

    try {
      console.log('🚀 Avviando sessione lezione:', { lessonId, userId: user.id });

      // Chiudi sessione precedente se esiste
      if (currentSession) {
        await endLessonSession(currentSession.id, 'abandoned');
      }

      // Crea nuova sessione
      const { data, error } = await supabase
        .from('lesson_sessions')
        .insert({
          user_id: user.id,
          lesson_id: lessonId,
          course_id: courseId,
          status: 'active',
          device_type: getDeviceType(),
          user_agent: navigator.userAgent
        })
        .select()
        .single();

      if (error) throw error;

      setCurrentSession(data);
      sessionStartTime.current = new Date();
      
      // Imposta timeout per sessione abbandonata
      if (sessionTimeoutRef.current) {
        clearTimeout(sessionTimeoutRef.current);
      }
      
      sessionTimeoutRef.current = setTimeout(() => {
        if (currentSession) {
          endLessonSession(currentSession.id, 'abandoned');
        }
      }, sessionTimeoutMinutes * 60 * 1000);

      console.log('✅ Sessione avviata:', data.id);
      return data;

    } catch (err) {
      console.error('❌ Errore nell\'avvio sessione:', err);
      setError(err instanceof Error ? err.message : 'Errore nell\'avvio sessione');
      return null;
    }
  }, [user, courseId, currentSession, enableSessionTracking, sessionTimeoutMinutes, endLessonSession, getDeviceType]);

  // =============================================================================
  // TRACKING VIDEO EVENTS
  // =============================================================================

  const trackVideoEvent = useCallback(async (
    lessonId: string,
    eventData: VideoEventData
  ) => {
    if (!user || !enableVideoEventTracking) return;

    try {
      const event: VideoWatchEvent = {
        id: crypto.randomUUID(),
        user_id: user.id,
        lesson_id: lessonId,
        session_id: currentSession?.id || null,
        event_type: eventData.eventType,
        current_time: eventData.currentTime,
        duration: eventData.duration || null,
        progress_percentage: eventData.progressPercentage || null,
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        ip_address: null // Non disponibile nel browser
      };

      console.log('📹 Tracciando evento video:', eventData.eventType, eventData.currentTime);

      const { error } = await supabase
        .from('video_watch_events')
        .insert(event);

      if (error) throw error;

      // Aggiorna tempo video guardato nella sessione
      if (currentSession && eventData.eventType === 'time_update') {
        const videoTimeWatched = Math.max(
          eventData.currentTime,
          currentSession.video_time_watched || 0
        );

        await supabase
          .from('lesson_sessions')
          .update({ video_time_watched: videoTimeWatched })
          .eq('id', currentSession.id);
      }

    } catch (err) {
      console.error('❌ Errore nel tracking evento video:', err);
    }
  }, [user, currentSession, enableVideoEventTracking]);

  // =============================================================================
  // GESTIONE PROGRESSO LEZIONI
  // =============================================================================

  const markVideoWatched = useCallback(async (lessonId: string) => {
    if (!user) return;

    try {
      console.log('🎬 Marcando video come guardato:', { lessonId, userId: user.id });

      const now = new Date().toISOString();
      
      // Aggiorna progresso
      const { data: existingProgress, error: selectError } = await supabase
        .from('progress')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .eq('lesson_id', lessonId)
        .single();

      if (existingProgress && !selectError) {
        // Aggiorna record esistente
        const { error } = await supabase
          .from('progress')
          .update({
            video_watched: true,
            video_watched_at: now,
            last_accessed_at: now,
            updated_at: now
          })
          .eq('id', existingProgress.id);

        if (error) throw error;
      } else {
        // Crea nuovo record
        const { error } = await supabase
          .from('progress')
          .insert({
            user_id: user.id,
            course_id: courseId,
            lesson_id: lessonId,
            video_watched: true,
            video_watched_at: now,
            completed: false,
            quiz_completed: false,
            last_accessed_at: now
          });

        if (error) throw error;
      }

      // Traccia evento video completato
      await trackVideoEvent(lessonId, {
        eventType: 'ended',
        currentTime: 0,
        duration: null,
        progressPercentage: 100
      });

      console.log('✅ Video marcato come guardato');

    } catch (err) {
      console.error('❌ Errore nel marcare video come guardato:', err);
      setError(err instanceof Error ? err.message : 'Errore nel salvare il progresso');
    }
  }, [user, courseId, trackVideoEvent]);

  const markLessonCompleted = useCallback(async (lessonId: string) => {
    if (!user) return;

    try {
      console.log('📝 Completando lezione senza quiz:', { lessonId, userId: user.id });

      const now = new Date().toISOString();
      
      // Aggiorna progresso
      const { data: existingProgress, error: selectError } = await supabase
        .from('progress')
        .select('id, video_watched')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .eq('lesson_id', lessonId)
        .single();

      if (existingProgress && !selectError) {
        const { error } = await supabase
          .from('progress')
          .update({
            video_watched: true,
            video_watched_at: existingProgress.video_watched ? undefined : now,
            quiz_completed: false,
            quiz_completed_at: null,
            completed: true,
            completed_at: now,
            last_accessed_at: now,
            updated_at: now
          })
          .eq('id', existingProgress.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('progress')
          .insert({
            user_id: user.id,
            course_id: courseId,
            lesson_id: lessonId,
            video_watched: true,
            video_watched_at: now,
            quiz_completed: false,
            quiz_completed_at: null,
            completed: true,
            completed_at: now,
            last_accessed_at: now
          });

        if (error) throw error;
      }

      // Termina sessione come completata
      if (currentSession) {
        await endLessonSession(currentSession.id, 'completed');
      }

      console.log('✅ Lezione completata senza quiz');

    } catch (err) {
      console.error('❌ Errore nel completare la lezione:', err);
      setError(err instanceof Error ? err.message : 'Errore nel completare la lezione');
    }
  }, [user, courseId, currentSession, endLessonSession]);

  const markQuizCompleted = useCallback(async (
    lessonId: string, 
    quizId: string, 
    score: number, 
    passed: boolean,
    timeSpent?: number
  ) => {
    if (!user) return;

    try {
      console.log('🎯 Completando quiz:', { lessonId, quizId, score, passed });

      const now = new Date().toISOString();

      // Salva tentativo quiz
      const { error: attemptError } = await supabase
        .from('quiz_attempts')
        .insert({
          user_id: user.id,
          quiz_id: quizId,
          lesson_id: lessonId,
          answers: {}, // Gestito nel componente
          score: score,
          passed: passed,
          time_spent: timeSpent,
          started_at: sessionStartTime.current?.toISOString() || now,
          completed_at: now,
          session_id: currentSession?.id || null
        });

      if (attemptError) throw attemptError;

      // Aggiorna progresso lezione
      const { data: existingProgress, error: selectError } = await supabase
        .from('progress')
        .select('id, video_watched')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .eq('lesson_id', lessonId)
        .single();

      if (existingProgress && !selectError) {
        const { error: progressError } = await supabase
          .from('progress')
          .update({
            video_watched: true,
            video_watched_at: existingProgress.video_watched ? undefined : now,
            quiz_completed: passed,
            quiz_completed_at: passed ? now : null,
            completed: passed,
            completed_at: passed ? now : null,
            last_accessed_at: now,
            updated_at: now
          })
          .eq('id', existingProgress.id);

        if (progressError) throw progressError;
      } else {
        const { error: progressError } = await supabase
          .from('progress')
          .insert({
            user_id: user.id,
            course_id: courseId,
            lesson_id: lessonId,
            video_watched: true,
            video_watched_at: now,
            quiz_completed: passed,
            quiz_completed_at: passed ? now : null,
            completed: passed,
            completed_at: passed ? now : null,
            last_accessed_at: now
          });

        if (progressError) throw progressError;
      }

      // Termina sessione
      if (currentSession) {
        await endLessonSession(currentSession.id, 'completed');
      }

      console.log('✅ Quiz completato:', passed ? 'SUPERATO' : 'FALLITO');

    } catch (err) {
      console.error('❌ Errore nel completare il quiz:', err);
      setError(err instanceof Error ? err.message : 'Errore nel salvare il quiz');
    }
  }, [user, courseId, currentSession, endLessonSession]);

  // =============================================================================
  // UTILITY FUNCTIONS
  // =============================================================================

  const isLessonUnlocked = useCallback((lessonOrder: number, allLessons: { id: string; order: number }[]) => {
    if (lessonOrder === 1) return true;
    
    const previousLesson = allLessons.find(lesson => lesson.order === lessonOrder - 1);
    if (!previousLesson) return false;
    
    // Qui dovresti controllare il progresso dal database
    // Per ora ritorna true per semplicità
    return true;
  }, []);

  // =============================================================================
  // CLEANUP
  // =============================================================================

  useEffect(() => {
    return () => {
      if (sessionTimeoutRef.current) {
        clearTimeout(sessionTimeoutRef.current);
      }
    };
  }, []);

  return {
    // Stato
    user,
    currentSession,
    loading,
    error,
    
    // Funzioni sessione
    startLessonSession,
    endLessonSession,
    
    // Funzioni tracking
    trackVideoEvent,
    
    // Funzioni progresso
    markVideoWatched,
    markLessonCompleted,
    markQuizCompleted,
    
    // Utility
    isLessonUnlocked,
    getDeviceType,
    
    // Opzioni
    options: {
      enableSessionTracking,
      enableVideoEventTracking,
      enableDetailedStats,
      sessionTimeoutMinutes
    }
  };
}
