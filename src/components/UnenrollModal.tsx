'use client';

interface UnenrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  courseTitle: string;
}

export default function UnenrollModal({ isOpen, onClose, onConfirm, courseTitle }: UnenrollModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-[#e11d48] mb-4">Conferma disiscrizione</h2>
          <p className="text-gray-700 mb-4">Sei sicuro di voler disiscriverti dal corso <span className="font-semibold">{courseTitle}</span>?<br/>Perderai l’accesso ai moduli e ai materiali.</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
          >
            Annulla
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 rounded-lg bg-[#e11d48] text-white font-semibold hover:bg-[#be185d] transition"
          >
            Disiscriviti
          </button>
        </div>
      </div>
    </div>
  );
} 