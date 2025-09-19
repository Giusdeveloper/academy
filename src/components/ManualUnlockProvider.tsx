'use client';

import { useState, createContext, useContext, ReactNode } from 'react';
import { useLessonProgress } from '@/hooks/useLessonProgress';

interface ManualUnlockContextType {
  unlockedLessons: Set<number>;
  unlockLesson: (lessonOrder: number) => void;
  isLessonUnlocked: (lessonOrder: number) => boolean;
}

const ManualUnlockContext = createContext<ManualUnlockContextType | undefined>(undefined);

export function useManualUnlock() {
  const context = useContext(ManualUnlockContext);
  if (!context) {
    throw new Error('useManualUnlock must be used within a ManualUnlockProvider');
  }
  return context;
}

interface ManualUnlockProviderProps {
  children: ReactNode;
  courseId: string;
}

export default function ManualUnlockProvider({ children, courseId }: ManualUnlockProviderProps) {
  const [unlockedLessons, setUnlockedLessons] = useState<Set<number>>(new Set([1])); // Prima lezione sempre sbloccata
  const { isLessonUnlocked: progressUnlocked } = useLessonProgress(courseId);

  const unlockLesson = (lessonOrder: number) => {
    setUnlockedLessons(prev => new Set([...prev, lessonOrder]));
  };

  const isLessonUnlocked = (lessonOrder: number) => {
    // Prima lezione sempre sbloccata
    if (lessonOrder === 1) return true;
    
    // Controlla se è sbloccata manualmente
    if (unlockedLessons.has(lessonOrder)) return true;
    
    // Controlla se è sbloccata dal progresso
    return progressUnlocked(lessonOrder);
  };

  return (
    <ManualUnlockContext.Provider value={{
      unlockedLessons,
      unlockLesson,
      isLessonUnlocked
    }}>
      {children}
    </ManualUnlockContext.Provider>
  );
}
