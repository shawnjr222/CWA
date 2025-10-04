import React from 'react';

// Individual Submission Component
function SubmissionItem({ submission, onSubmissionClick }) {
      return (
    <div 
      className="mobile:w-full desktop-split-2:w-full cursor-pointer"
      onClick={() => onSubmissionClick(submission)}
    >
      <div className="aspect-[4/3] mb-2 overflow-hidden rounded-[8px] bg-gray-100 transition-all duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] hover:scale-[0.97] hover:shadow-lg">
        <img 
          src={submission.image}
          alt={`${submission.title} by ${submission.artist}`}
          className="w-full h-full object-cover rounded-[8px]"
        />
      </div>
      <p className="text-gray-900 text-base leading-tight font-light pt-1">
        {submission.title} by {submission.artist}
      </p>
    </div>
  );
}

// Main Submissions Component
function Submissions({ onSubmissionClick }) {
  const [submissions, setSubmissions] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadSubmissions = async () => {
      const allSubmissions = [];
      
      // Hardcode the known folders - no discovery needed
      const folders = ['003', '002', '001'];
      
      for (const folder of folders) {
        try {
          // Load metadata
          const response = await fetch(`/submissions/${folder}/metadata.txt`);
          if (response.ok) {
            const text = await response.text();
            
            // Parse metadata
    const metadata = {};
            text.split('\n').forEach(line => {
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim();
                const value = line.substring(colonIndex + 1).trim();
        metadata[key] = value;
      }
    });

            // Add submission
            allSubmissions.push({
              id: parseInt(folder),
              title: metadata.title || 'Untitled',
              artist: metadata.artist || 'Unknown Artist',
              type: 'image',
              media: `/submissions/${folder}/artwork.jpg`,
              thumbnail: `/submissions/${folder}/artwork.jpg`,
              image: `/submissions/${folder}/artwork.jpg`,
              imageExists: true,
              metadata: metadata,
              folder: folder,
              additionalImages: [],
              hasAdditionalImages: false
            });
          }
  } catch (error) {
          // Skip this folder
        }
      }
      
      setSubmissions(allSubmissions);
        setLoading(false);
    };

    loadSubmissions();
  }, []);

  if (loading) {
    return (
      <div className="mobile:px-6 desktop-split-2:px-12 tablet:px-0 pl-[88px] pr-[88px]">
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-600">Loading submissions...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile:px-6 desktop-split-2:px-12 tablet:px-[88px] pl-[88px] pr-[88px]">
      <div className="mobile:flex mobile:flex-col mobile:space-y-6 desktop-split-2:flex desktop-split-2:flex-col desktop-split-2:space-y-8 tablet:grid tablet:grid-cols-3 tablet:gap-6 grid grid-cols-3 gap-6">
        {submissions.map((submission) => (
          <div 
            key={submission.id}
            className="mobile:w-full mobile:mr-0 mobile:mb-0 desktop-split-2:w-full desktop-split-2:mr-0 desktop-split-2:mb-0"
          >
            <SubmissionItem
              submission={submission}
              onSubmissionClick={onSubmissionClick}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Submissions;