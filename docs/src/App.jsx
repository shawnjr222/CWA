import Submissions from './Submissions';
import { useState, useEffect } from 'react';

function Header() {
  return (
    <div className="mobile:w-full desktop-split-2:w-full tablet:w-[500px] w-[429px]">
      <p className="mobile:text-sm desktop-split-2:text-lg tablet:text-xl mobile:mb-2 desktop-split-2:mb-6 tablet:mb-8 mb-4 text-gray-900 text-base leading-tight font-light">
        Coping with Art
      </p>
      
      <div className="mobile:mb-2 desktop-split-2:mb-6 tablet:mb-8 mb-4">
        <p className="mobile:mb-2 desktop-split-2:mb-6 tablet:mb-8 mb-4 text-gray-900 text-base leading-tight font-light">
          –
        </p>
      </div>
      
      <div className="mobile:mb-2 desktop-split-2:mb-6 tablet:mb-8 mb-4">
        <p className="mobile:mb-2 mobile:text-sm desktop-split-2:text-base tablet:text-lg tablet:mb-8 mb-4 text-gray-900 text-base leading-tight font-light">
          This gallery is a space for art made as a form of self-regulation. For creations born in solitude, when we needed something to hold us together. It is a space to honor what was made not to produce, but to survive.
        </p>
      </div>
      
      <div className="mobile:mb-2 desktop-split-2:mb-6 tablet:mb-8 mb-4">
        <p className="mobile:mb-2 desktop-split-2:mb-6 tablet:mb-8 mb-4 text-gray-900 text-base leading-tight font-light">
          –
        </p>
      </div>
      
      <a 
        href="https://docs.google.com/forms/d/e/1FAIpQLSc9X6MrclQflyqp6KKIOCXFyXNzbqfmoF5_CBOWAhOJaR7gpQ/viewform?usp=sharing&ouid=109988493284976014984" 
        target="_blank"
        rel="noopener noreferrer"
        className="mobile:text-sm desktop-split-2:text-lg tablet:text-xl inline-block text-base leading-tight font-light hover:underline transition-all duration-300"
        style={{ color: '#1250C4' }}
      >
        Submit
      </a>
    </div>
  );
}

// Overlay Component
function Overlay({ isOpen, onClose, submission }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isDesktopSplit2, setIsDesktopSplit2] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      
      setIsMobile(width <= 768);
      setIsDesktopSplit2(width >= 574 && width <= 1039);
      setIsTablet(width >= 1040 && width <= 1366);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const getModalClasses = () => {
    // Use different heights for mobile vs desktop
    const mobileHeight = "h-[75vh]";
    const desktopHeight = "h-[95vh]";
    const animationClasses = isOpen ? 'translate-y-0' : 'translate-y-full';
    
    if (isMobile || isDesktopSplit2) {
      return `fixed bottom-0 w-full left-0 right-0 ${mobileHeight} bg-white rounded-t-2xl shadow-2xl transition-transform duration-[600ms] ease-in-out overflow-hidden ${animationClasses}`;
    } else {
      return `fixed bottom-0 w-3/4 left-1/2 transform -translate-x-1/2 ${desktopHeight} bg-white rounded-t-2xl shadow-2xl transition-transform duration-[600ms] ease-in-out overflow-hidden ${animationClasses}`;
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-50 bg-white/75 transition-opacity duration-[600ms] ease-in-out pointer-events-none ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0'}`}
      onClick={onClose}
    >
      {/* Modal */}
      <div 
        className={getModalClasses()}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal content with flexbox layout */}
        <div className="h-full flex flex-col">
                 {/* Scrollable content */}
                 <div 
                   className="flex-1 overflow-y-auto relative pt-8 modal-scrollbar"
                   style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                 >
            {/* Close button - now inside scrollable content */}
            <button
              onClick={onClose}
              className="absolute mobile:top-6 mobile:right-6 desktop-split-2:top-8 top-[48px] right-[48px] w-7 h-7 flex items-center justify-center z-10"
            >
              <svg className="w-7 h-7" fill="none" stroke="black" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
                   {/* Media Display */}
                   {submission?.media && (
                     <div className="mobile:mx-6 mobile:mt-12 desktop-split-2:mx-12 desktop-split-2:mt-16 mx-12 mt-16 tablet:mx-16 tablet:mt-20 mx-[140px] mt-[140px] aspect-[4/3] overflow-hidden rounded-2xl">
                       {submission.type === 'video' ? (
                         <video 
                           src={submission.media}
                           controls
                           autoPlay
                           muted
                           loop
                           className="w-full h-full object-contain"
                           poster={submission.thumbnail}
                         >
                           Your browser does not support the video tag.
                         </video>
                       ) : submission.type === 'audio' ? (
                         <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                           <div className="w-full px-8">
                             <audio 
                               src={submission.media}
                               controls
                               autoPlay
                               loop
                               preload="metadata"
                               className="w-full h-16"
                               style={{
                                 background: 'transparent',
                                 outline: 'none',
                                 display: 'block'
                               }}
                             >
                               Your browser does not support the audio element.
                             </audio>
                           </div>
                         </div>
                       ) : submission.type === 'writing' ? (
                         <div className="w-full h-full bg-white p-8 overflow-y-auto">
                           <div className="prose prose-lg max-w-none">
                             <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
                               {submission.metadata?.writing || 'No writing content available.'}
                             </pre>
                           </div>
                         </div>
                       ) : (
                         <img 
                           src={submission.image} 
                           alt={submission?.title || 'Artwork'}
                           className="w-full h-full object-cover"
                         />
                       )}
                     </div>
                   )}
            
                   {/* Additional Images - Only show if there are additional images */}
                   {submission?.folder && submission.hasAdditionalImages && (
                     <div className="mobile:mx-6 mobile:mt-6 desktop-split-2:mx-12 desktop-split-2:mt-8 mx-12 mt-8 tablet:mx-16 tablet:mt-10 mx-[140px] mt-8">
                       <div className="space-y-8">
                         {submission.additionalImages.map((imagePath, index) => (
                           <div key={index} className="aspect-[4/3] overflow-hidden rounded-2xl">
                             <img 
                               src={imagePath} 
                               alt={`${submission?.title || 'Artwork'} - Image ${index + 1}`}
                               className="w-full h-full object-cover"
                             />
                           </div>
                         ))}
                       </div>
                     </div>
                   )}
            
                   {/* Modal content */}
                   <div className="mobile:mx-6 mobile:px-0 mobile:pt-4 mobile:pb-6 desktop-split-2:mx-12 desktop-split-2:px-0 desktop-split-2:pt-6 desktop-split-2:pb-8 mx-12 px-0 pt-6 pb-8 tablet:mx-16 tablet:px-0 tablet:pt-8 tablet:pb-10 mx-[140px] px-0 pt-8 pb-8">
                     <h2 className="mobile:text-lg mobile:mb-2 desktop-split-2:text-xl desktop-split-2:mb-3 text-xl mb-3 tablet:text-2xl tablet:mb-4 text-2xl font-light text-gray-900 mb-1">
                       {submission?.title || 'Untitled'}
                     </h2>
                     <p className="mobile:text-base mobile:mb-3 desktop-split-2:text-lg desktop-split-2:mb-4 text-lg mb-4 tablet:text-xl tablet:mb-6 text-lg font-light text-gray-600 mb-4">
                       by {submission?.artist || 'Unknown Artist'}
                     </p>
                     
                     {/* Artist Statement (Description) */}
                     {submission?.metadata?.description && (
                       <div className="mobile:mb-0 desktop-split-2:mb-2 mb-2 tablet:mb-4 mb-6">
                         <p className="mobile:text-sm desktop-split-2:text-base text-base tablet:text-lg text-base font-light text-gray-700 leading-relaxed">
                           {submission.metadata.description}
                         </p>
                       </div>
                     )}

                     {submission?.metadata?.copyright && (
                       <p className="text-sm text-gray-500 mb-4">{submission.metadata.copyright}</p>
                     )}

                     
                     
                     {/* Desktop Learn More Button - inside content */}
                     {submission?.metadata?.learn && (
                       <div className="mobile:hidden desktop-split-2:hidden">
                         <a
                           href={submission.metadata.learn.startsWith('http') ? submission.metadata.learn : `https://${submission.metadata.learn}`}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="inline-block px-6 py-3 text-white font-light text-base rounded-full transition-all duration-300 hover:opacity-90"
                           style={{ backgroundColor: '#1250C4' }}
                         >
                           Learn more
                         </a>
                       </div>
                     )}
                   </div>
          </div>
          
                 {/* Sticky Learn More Button - Mobile and Desktop Split 2 */}
                 {submission?.metadata?.learn && (
                   <div className="mobile:block desktop-split-2:block hidden">
                     <div className="mobile:mx-6 mobile:mb-6 mobile:mt-4 desktop-split-2:mx-12 desktop-split-2:mb-8 desktop-split-2:mt-6">
                       <a
                         href={submission.metadata.learn.startsWith('http') ? submission.metadata.learn : `https://${submission.metadata.learn}`}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="w-full mobile:text-sm mobile:px-4 mobile:py-3 desktop-split-2:text-base desktop-split-2:px-6 desktop-split-2:py-4 inline-block text-center text-white font-light rounded-full transition-all duration-300 hover:opacity-90"
                         style={{ backgroundColor: '#1250C4' }}
                       >
                         Learn more
                       </a>
                     </div>
                   </div>
                 )}
          
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleSubmissionClick = (submission) => {
    setSelectedSubmission(submission);
    setIsOverlayOpen(true);
  };

  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
    // Delay clearing the submission state until after animation completes
    setTimeout(() => {
      setSelectedSubmission(null);
    }, 600); // Match the 600ms animation duration
  };

  // ESC key support
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isOverlayOpen) {
        handleCloseOverlay();
      }
    };

    if (isOverlayOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOverlayOpen]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOverlayOpen) {
      // Prevent scrolling on the body and html
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      
      // Enhanced mobile scroll prevention
      if (isMobile) {
        // Store current scroll position for mobile
        const scrollY = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
        document.body.style.height = '100%';
        // Prevent iOS bounce scrolling
        document.body.style.webkitOverflowScrolling = 'touch';
      } else {
        // For desktop, use simpler approach
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
      }
    } else {
      // Restore scrolling when modal is closed
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.top = 'unset';
      document.body.style.width = 'unset';
      document.body.style.height = 'unset';
      document.body.style.webkitOverflowScrolling = 'unset';
      
      // Restore scroll position on mobile
      if (isMobile) {
        const scrollY = document.body.style.top;
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.top = 'unset';
      document.body.style.width = 'unset';
      document.body.style.height = 'unset';
      document.body.style.webkitOverflowScrolling = 'unset';
    };
  }, [isOverlayOpen, isMobile]);

  return (
    <div className="min-h-screen bg-white">
      <div className="mobile:px-6 mobile:pt-16 desktop-split-2:px-12 desktop-split-2:pt-20 tablet:px-[88px] tablet:pt-24 pl-[88px] pt-[44px]">
        <Header />
      </div>
      
      <div className="mobile:pt-16 mobile:pb-6 desktop-split-2:pt-20 desktop-split-2:pb-12 tablet:pt-24 tablet:pb-16 pt-[88px] pb-[88px]">
        <Submissions onSubmissionClick={handleSubmissionClick} />
      </div>

      <Overlay 
        isOpen={isOverlayOpen} 
        onClose={handleCloseOverlay}
        submission={selectedSubmission}
      />
    </div>
  );
}