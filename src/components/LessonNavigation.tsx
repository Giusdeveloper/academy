'use client';

import { useLessonProgress } from '@/hooks/useLessonProgress';
import { useManualUnlock } from './ManualUnlockProvider';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Lesson {
  id: string;
  title: string;
  order: number;
}

interface LessonNavigationProps {
  lessons: Lesson[];
  currentLessonId: string;
  courseId: string;
  baseUrl: string;
  onUnlockNext?: () => void;
}

export default function LessonNavigation({ 
  lessons, 
  currentLessonId, 
  courseId, 
  baseUrl,
  onUnlockNext
}: LessonNavigationProps) {
  const { getLessonStatus, isLessonUnlocked: progressIsLessonUnlocked, refetch } = useLessonProgress(courseId);
  const { isLessonUnlocked: manualIsLessonUnlocked, unlockLesson } = useManualUnlock();
  const [, setForceUpdate] = useState(0);
  
  // Listener per l'evento di sblocco lezione
  useEffect(() => {
    const handleLessonUnlocked = () => {
      refetch(); // Ricarica il progresso
      setForceUpdate(prev => prev + 1); // Forza il re-render
    };

    window.addEventListener('lessonUnlocked', handleLessonUnlocked);
    
    return () => {
      window.removeEventListener('lessonUnlocked', handleLessonUnlocked);
    };
  }, [refetch]);
  
  // Funzione combinata che usa sia la logica di progresso che quella manuale
  const isLessonUnlocked = (lessonOrder: number) => {
    // Prima controlla se è sbloccata manualmente
    if (manualIsLessonUnlocked(lessonOrder)) return true;
    
    // Poi controlla se è sbloccata dal progresso
    return progressIsLessonUnlocked(lessonOrder, lessons);
  };

  
  // Trova la lezione corrente
  const currentLesson = lessons.find(l => l.id === currentLessonId);
  const currentLessonStatus = currentLesson ? getLessonStatus(currentLesson.id) : 'locked';
  
  // Mostra il pulsante solo se:
  // 1. La lezione corrente è completata (quiz superato)
  // 2. La prossima lezione non è già sbloccata
  const shouldShowUnlockButton = currentLesson && 
    currentLessonStatus === 'completed' && 
    !isLessonUnlocked(currentLesson.order + 1);
  
  
  // Calcola il progresso - solo lezioni realmente completate (completed: true nel database)
  const completedLessons = lessons.filter(lesson => {
    const status = getLessonStatus(lesson.id);
    // Solo 'completed' significa che la lezione è stata completata (quiz superato)
    // 'unlocked' significa che è sbloccata ma non completata
    return status === 'completed';
  }).length;
  const totalLessons = lessons.length;
  const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  
  // Debug: log per verificare il calcolo del progresso
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log('📊 Progresso corso:', {
      completedLessons,
      totalLessons,
      progressPercentage,
      lessonsStatus: lessons.map(l => ({ id: l.id, title: l.title, status: getLessonStatus(l.id) }))
    });
  }

  return (
    <div className="lesson-sidebar p-6">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Contenuti del corso</h3>
        <p className="text-sm text-gray-600">{totalLessons} moduli disponibili</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progresso</span>
          <span className="text-sm text-gray-600">{completedLessons}/{totalLessons}</span>
        </div>
        <div className="course-progress-bar">
          <div 
            className="course-progress-fill"
            data-progress={progressPercentage}
          ></div>
        </div>
      </div>

      {/* Pulsante per sbloccare la prossima lezione - solo se necessario */}
      {shouldShowUnlockButton && (
        <button
          onClick={() => {
            if (currentLesson) {
              unlockLesson(currentLesson.order + 1);
            }
            if (onUnlockNext) {
              onUnlockNext();
            }
          }}
          className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors mb-4"
        >
          🔓 Sblocca Prossima Lezione
        </button>
      )}
      
      {/* Lista delle lezioni */}
      <div className="space-y-2">
        {lessons.map((lesson) => {
          const isUnlocked = isLessonUnlocked(lesson.order);
          const status = getLessonStatus(lesson.id);
          const isCurrent = lesson.id === currentLessonId;
          const isCompleted = status === 'completed';
          
          const getStatusIcon = () => {
            if (isCompleted) {
              return (
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              );
            } else if (isUnlocked) {
              return (
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-600 text-sm font-semibold">{lesson.order}</span>
                </div>
              );
            } else {
              return (
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 text-sm font-semibold">{lesson.order}</span>
                </div>
              );
            }
          };

          const lessonContent = (
            <div className={`lesson-item flex items-center gap-3 ${
              isCurrent 
                ? 'active' 
                : isCompleted 
                  ? 'completed' 
                  : !isUnlocked 
                    ? 'locked' 
                    : ''
            }`}>
              {getStatusIcon()}
              <div className="flex-1 min-w-0">
                <h4 className={`text-sm font-medium leading-tight truncate ${
                  isCurrent ? 'text-white' : isCompleted ? 'text-black' : isUnlocked ? 'text-black' : 'text-gray-500'
                }`}>
                  {lesson.title}
                </h4>
                {isUnlocked && !isCompleted && (
                  <p className="text-xs text-yellow-600 mt-1">Quiz richiesto</p>
                )}
              </div>
              {isCompleted && (
                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
              )}
              {!isUnlocked && (
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              )}
            </div>
          );

          if (isUnlocked) {
            return (
              <Link
                key={lesson.id}
                href={`${baseUrl}/lesson/${lesson.id}`}
                className="block"
              >
                {lessonContent}
              </Link>
            );
          } else {
            return (
              <div
                key={lesson.id}
                className="block cursor-not-allowed"
                title="Completa la lezione precedente per sbloccare"
              >
                {lessonContent}
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}
