'use client';

interface LessonPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessonTitle: string;
  lessonContent: string;
  onEnroll: () => void;
}

export default function LessonPreviewModal({ isOpen, onClose, lessonTitle, lessonContent, onEnroll }: LessonPreviewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-[#183a5a] mb-2">{lessonTitle}</h2>
          <div className="text-gray-700 text-sm mb-4">
            {lessonContent.slice(0, 350)}{lessonContent.length > 350 ? '...' : ''}
          </div>
          <div className="bg-[#fef3f2] text-[#e11d48] rounded p-3 text-center font-medium mb-4">
            Iscriviti al corso per sbloccare tutti i materiali e la lezione completa!
          </div>
          <button
            onClick={onEnroll}
            className="w-full bg-[#e11d48] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#be185d] transition-colors"
          >
            Iscriviti al corso
          </button>
        </div>
      </div>
    </div>
  );
} 