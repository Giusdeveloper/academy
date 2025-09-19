'use client';

import { useState } from 'react';

interface UnlockButtonProps {
  currentLessonId: string;
  lessons: Array<{ id: string; order: number; title: string }>;
  onUnlock: (lessonOrder: number) => void;
}

export default function UnlockButton({ currentLessonId, lessons, onUnlock }: UnlockButtonProps) {
  const currentLesson = lessons.find(l => l.id === currentLessonId);
  
  const handleUnlock = () => {
    if (currentLesson) {
      const nextLessonOrder = currentLesson.order + 1;
      onUnlock(nextLessonOrder);
      console.log(`🔓 Sbloccata lezione ${nextLessonOrder}`);
    }
  };

  if (!currentLesson) return null;

  return (
    <button
      onClick={handleUnlock}
      className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
    >
      🔓 Sblocca Prossima Lezione
    </button>
  );
}
