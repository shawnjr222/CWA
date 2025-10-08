import { useEffect } from 'react';

function Modal({ isOpen, onClose, submission }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !submission) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl max-h-[72vh] lg:max-h-[90vh] w-full mx-4 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all duration-200"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Scrollable Content */}
        <div className="modal-scrollbar overflow-y-auto max-h-[72vh] lg:max-h-[90vh]">
          <div className="flex flex-col lg:flex-row">
            {/* Image Section */}
            <div className="lg:w-1/2">
              <img
                src={submission.image}
                alt={`${submission.title} by ${submission.artist}`}
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Details Section */}
            <div className="lg:w-1/2 p-8 flex flex-col justify-center">
              <div className="space-y-6">
                {/* Title and Artist */}
                <div>
                  <h2 className="text-2xl font-mono font-bold text-gray-900 mb-2">
                    {submission.title}
                  </h2>
                  <p className="text-lg font-mono text-gray-600">
                    by {submission.artist} © {new Date().getFullYear()} all rights reserved
                  </p>
                </div>

                {/* Metadata */}
                {submission.metadata && (
                  <div className="space-y-4">
                    {submission.metadata.medium && (
                      <div>
                        <span className="font-mono text-sm text-gray-500 uppercase tracking-wide">Medium</span>
                        <p className="font-mono text-gray-900">{submission.metadata.medium}</p>
                      </div>
                    )}
                    
                    {submission.metadata.dimensions && (
                      <div>
                        <span className="font-mono text-sm text-gray-500 uppercase tracking-wide">Dimensions</span>
                        <p className="font-mono text-gray-900">{submission.metadata.dimensions}</p>
                      </div>
                    )}

                    {submission.metadata.date_submitted && (
                      <div>
                        <span className="font-mono text-sm text-gray-500 uppercase tracking-wide">Date Submitted</span>
                        <p className="font-mono text-gray-900">{submission.metadata.date_submitted}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Description/Artist Statement */}
                {submission.metadata?.description && (
                  <div>
                    <span className="font-mono text-sm text-gray-500 uppercase tracking-wide">Artist Statement</span>
                    <p className="font-mono text-gray-900 mt-1 leading-relaxed">
                      {submission.metadata.description}
                    </p>
                   
                  </div>
                )}

                 {/* Copyright */}
                 {submission.metadata?.copyright && (
                 <div>
                  <span className="font-mono text-sm text-gray-500 uppercase tracking-wide">Copyright</span>
                 <p className="font-mono text-gray-900 mt-1 leading-relaxed">
                    {submission.metadata.copyright}
                    </p>
                    </div>
                       )}

                {/* Website Link */}
                {submission.metadata?.website && (
                  <div>
                    <a
                      href={submission.metadata.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
                    >
                      Learn more
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
