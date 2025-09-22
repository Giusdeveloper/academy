'use client';

import { useLessonProgress } from '@/hooks/useLessonProgress';
import { useManualUnlock } from './ManualUnlockProvider';
import Link from 'next/link';

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
  const { getLessonStatus, isLessonUnlocked: progressIsLessonUnlocked } = useLessonProgress(courseId);
  const { isLessonUnlocked: manualIsLessonUnlocked, unlockLesson } = useManualUnlock();
  
  // Funzione combinata che usa sia la logica di progresso che quella manuale
  const isLessonUnlocked = (lessonOrder: number) => {
    // Prima controlla se è sbloccata manualmente
    if (manualIsLessonUnlocked(lessonOrder)) return true;
    
    // Poi controlla se è sbloccata dal progresso
    return progressIsLessonUnlocked(lessonOrder, lessons);
  };

  console.log('🔍 LessonNavigation renderizzato:', { lessons: lessons.length, currentLessonId, courseId });
  
  // Trova la lezione corrente
  const currentLesson = lessons.find(l => l.id === currentLessonId);
  const currentLessonStatus = currentLesson ? getLessonStatus(currentLesson.id) : 'locked';
  
  // Mostra il pulsante solo se:
  // 1. La lezione corrente è completata (quiz superato)
  // 2. La prossima lezione non è già sbloccata
  const shouldShowUnlockButton = currentLesson && 
    currentLessonStatus === 'completed' && 
    !isLessonUnlocked(currentLesson.order + 1);
  
  console.log('🔍 Debug sblocco:', {
    currentLesson: currentLesson?.title,
    currentLessonStatus,
    shouldShowUnlockButton,
    nextLessonUnlocked: currentLesson ? isLessonUnlocked(currentLesson.order + 1) : false
  });
  
  return (
    <div className="space-y-2">
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
      
      {lessons.map((lesson) => {
        const isUnlocked = isLessonUnlocked(lesson.order);
        const status = getLessonStatus(lesson.id);
        const isCurrent = lesson.id === currentLessonId;
        
        const getStatusIcon = () => {
          if (status === 'completed') {
            return (
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            );
          } else if (isUnlocked) {
            return (
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">{lesson.order}</span>
              </div>
            );
          } else {
            return (
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            );
          }
        };

        const getStatusText = () => {
          if (status === 'completed') return 'Completata';
          if (isUnlocked) return 'Disponibile';
          return 'Bloccata';
        };

        const lessonContent = (
          <div className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
            isCurrent 
              ? 'bg-purple-100 border-2 border-purple-300' 
              : isUnlocked 
                ? 'bg-white hover:bg-gray-50 border border-gray-200' 
                : 'bg-gray-50 border border-gray-200 opacity-60'
          }`}>
            {getStatusIcon()}
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${
                isCurrent ? 'text-purple-900' : isUnlocked ? 'text-gray-900' : 'text-gray-500'
              }`}>
                {lesson.title}
              </p>
              <p className={`text-xs ${
                isCurrent ? 'text-purple-600' : isUnlocked ? 'text-gray-500' : 'text-gray-400'
              }`}>
                {getStatusText()}
              </p>
            </div>
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
  );
}
