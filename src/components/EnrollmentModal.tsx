'use client';


interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnroll: () => void;
}

export default function EnrollmentModal({ isOpen, onClose, onEnroll }: EnrollmentModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Chiudi modale"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-[#183a5a] mb-4">Informativa iscrizione</h2>
          
          <div className="text-left space-y-4 text-sm text-gray-700">
            <p>
              Al termine della lezione ti verrà proposto un quiz finale, al cui superamento ti verrà assegnata la <strong>Certificazione</strong> ed il punteggio in dashboard.
            </p>
            
            <p>
              In questa Academy troverai percorsi di certificazioni correlati alle tematiche affrontate in questa lezione. Questo ti permetterà non solo di approfondire specifiche tecniche ma anche di superare un percorso mirato di certificazioni su quei temi.
            </p>
            
            <p>
              In questo modo la tua professionalità come &quot;fundraiser&quot; non solo crescerà ma potrà esser spendibile su altri ambiti lavorativi.
            </p>
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={onEnroll}
          className="w-full bg-[#e11d48] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#be185d] transition-colors"
        >
          PROSEGUI
        </button>
      </div>
    </div>
  );
} 