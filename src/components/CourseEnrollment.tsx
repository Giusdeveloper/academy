'use client';

import { useState, useEffect } from 'react';
import EnrollmentModal from './EnrollmentModal';

interface CourseEnrollmentProps {
  children: React.ReactNode;
  courseId: string;
}

export default function CourseEnrollment({ children, courseId }: CourseEnrollmentProps) {
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Controlla se l'utente è già iscritto al corso
  useEffect(() => {
    const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
    setIsEnrolled(enrolledCourses.includes(courseId));
    
    // Se non è iscritto, mostra il modal
    if (!enrolledCourses.includes(courseId)) {
      setShowModal(true);
    }
  }, [courseId]);

  const handleEnroll = () => {
    // Salva l'iscrizione nel localStorage
    const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
    if (!enrolledCourses.includes(courseId)) {
      enrolledCourses.push(courseId);
      localStorage.setItem('enrolledCourses', JSON.stringify(enrolledCourses));
    }
    
    setIsEnrolled(true);
    setShowModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Se non è iscritto, mostra solo il modal
  if (!isEnrolled) {
    return (
      <EnrollmentModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onEnroll={handleEnroll}
      />
    );
  }

  // Se è iscritto, mostra il contenuto sbloccato
  return (
    <div className="h-screen bg-[#f6fafd]">
      {/* Contenuto principale */}
      <div className="h-full overflow-auto">
        {children}
      </div>
    </div>
  );
} 