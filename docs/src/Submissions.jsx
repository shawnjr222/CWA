import React from 'react';

// Individual Submission Component
function SubmissionItem({ submission, onSubmissionClick }) {
  const renderMedia = () => {
    if (submission.type === 'video') {
      return (
        <div className="relative w-full h-full transition-all duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] hover:scale-[0.97] hover:shadow-lg">
          {submission.thumbnail ? (
            <img 
              src={submission.thumbnail}
              alt={`${submission.title} by ${submission.artist}`}
              className="w-full h-full object-cover rounded-[8px]"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-[8px] flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          )}
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        </div>
      );
    } else if (submission.type === 'audio') {
      return (
        <div className="relative w-full h-full transition-all duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] hover:scale-[0.97] hover:shadow-lg">
          {submission.thumbnail ? (
            <img 
              src={submission.thumbnail}
              alt={`${submission.title} by ${submission.artist}`}
              className="w-full h-full object-cover rounded-[8px]"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-[8px] flex items-center justify-center">
              <div className="w-full px-4">
                {/* Full waveform visualization */}
                <div className="flex items-end justify-center space-x-0.5">
                  {[2, 4, 6, 8, 12, 16, 20, 18, 15, 12, 8, 6, 4, 2, 3, 5, 7, 9, 11, 14, 17, 19, 16, 13, 10, 7, 5, 3, 1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 15, 12, 9, 6, 4, 2, 1, 3, 5, 7, 9, 11, 13, 15, 17, 14, 11, 8, 6, 4, 2, 1].map((height, index) => (
                    <div 
                      key={index}
                      className="bg-gray-600 rounded-sm"
                      style={{ 
                        width: '2px', 
                        height: `${height * 2}px`,
                        animationDelay: `${index * 0.05}s`
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          {/* Play button overlay - same as video */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        </div>
      );
    } else {
      // Image type
      return (
        <img 
          src={submission.image}
          alt={`${submission.title} by ${submission.artist}`}
          className="w-full h-full object-cover rounded-[8px] transition-all duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] hover:scale-[0.97] hover:shadow-lg"
        />
      );
    }
  };

  return (
    <div 
      className="mobile:w-full desktop-split-2:w-full tablet:w-[calc(33.333%-20px)] cursor-pointer"
      onClick={() => onSubmissionClick(submission)}
    >
      {/* Media with smaller aspect ratio for 3x3 grid */}
      <div className="mobile:w-full mobile:mx-0 desktop-split-2:w-full desktop-split-2:mx-0 tablet:w-full tablet:mx-0 aspect-[4/3] mb-2 overflow-visible rounded-[8px] bg-transparent">
        {renderMedia()}
      </div>
      
      {/* Title by Artist text */}
      <p className="mobile:text-sm desktop-split-2:text-lg tablet:text-lg text-gray-900 text-base leading-tight font-light pt-1">
        {submission.title} by {submission.artist}
      </p>
    </div>
  );
}

// Function to discover submission folders dynamically
async function discoverSubmissionFolders() {
  const validFolders = [];
  
  // Check only the folders that actually exist in the submissions directory
  // Based on the actual folder structure: 001, 002
  const existingFolders = ['001', '002'];
  
  for (const folder of existingFolders) {
    const metadataPath = `/submissions/${folder}/metadata.txt`;
    const metadataExists = await validateMetadataExists(metadataPath);
    
    if (!metadataExists) {
      continue;
    }
    
    // Check if there's an artwork file with any supported extension
    const extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4', '.webm', '.mov', '.avi', '.mp3', '.wav', '.ogg', '.m4a'];
    let hasArtwork = false;
    let foundArtworkPath = null;
    
    for (const ext of extensions) {
      const artworkPath = `/submissions/${folder}/artwork${ext}`;
      const artworkExists = await validateFileExists(artworkPath);
      if (artworkExists) {
        hasArtwork = true;
        foundArtworkPath = artworkPath;
        break;
      }
    }
    
    if (hasArtwork && foundArtworkPath) {
      validFolders.push(folder);
    }
  }
  
  // Sort folders in descending order (most recent first)
  return validFolders.sort((a, b) => b.localeCompare(a));
}

// Function to load submissions from folder
async function loadSubmissions() {
  // Dynamically discover submission folders
  const submissionFolders = await discoverSubmissionFolders();

  const submissions = await Promise.all(
    submissionFolders.map(async (folder, index) => {
      // Check if metadata.txt exists
      const metadataPath = `/submissions/${folder}/metadata.txt`;
      const metadataExists = await validateMetadataExists(metadataPath);
      
      // Only include submission if metadata exists
      if (!metadataExists) {
        return null;
      }
      
      // Try to load metadata from file
      let metadata = null;
      try {
        metadata = await loadMetadataFromFile(folder);
      } catch (error) {
        console.warn(`Could not load metadata for ${folder}:`, error);
        return null; // Skip if metadata can't be loaded
      }
      
      // Determine media type and paths based on metadata
      const mediaType = metadata?.medium || 'image';
      let mediaPath, thumbnailPath, imageExists = false;
      
      // Look for artwork file with appropriate extension based on type
      let artworkPath = null;
      
      if (mediaType === 'video') {
        // For videos, look for video file first, then check for artwork.jpg separately
        const videoExtensions = ['.mp4', '.webm', '.mov', '.avi'];
        for (const ext of videoExtensions) {
          const testPath = `/submissions/${folder}/artwork${ext}`;
          if (await validateFileExists(testPath)) {
            artworkPath = testPath;
            break;
          }
        }
      } else if (mediaType === 'audio') {
        // For audio, look for audio file
        const audioExtensions = ['.mp3', '.wav', '.ogg', '.m4a'];
        for (const ext of audioExtensions) {
          const testPath = `/submissions/${folder}/artwork${ext}`;
          if (await validateFileExists(testPath)) {
            artworkPath = testPath;
            break;
          }
        }
      } else {
        // For images, look for image file
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        for (const ext of imageExtensions) {
          const testPath = `/submissions/${folder}/artwork${ext}`;
          if (await validateFileExists(testPath)) {
            artworkPath = testPath;
            break;
          }
        }
      }
      
      if (artworkPath) {
        mediaPath = artworkPath;
        imageExists = true;
        
        if (mediaType === 'video') {
          // For videos, look for artwork.jpg as thumbnail, not the video file
          const thumbnailImagePath = `/submissions/${folder}/artwork.jpg`;
          const thumbnailExists = await validateFileExists(thumbnailImagePath);
          
          if (thumbnailExists) {
            thumbnailPath = thumbnailImagePath;
          } else {
            // Fallback to generating thumbnail from video
            thumbnailPath = await generateVideoThumbnail(artworkPath);
          }
        } else if (mediaType === 'audio') {
          // For audio, look for artwork.jpg as thumbnail, not the audio file
          const thumbnailImagePath = `/submissions/${folder}/artwork.jpg`;
          const thumbnailExists = await validateFileExists(thumbnailImagePath);
          
          if (thumbnailExists) {
            thumbnailPath = thumbnailImagePath;
          } else {
            // Fallback to no thumbnail (will show waveform)
            thumbnailPath = null;
          }
        } else {
          // For images, use the image itself as thumbnail
          thumbnailPath = artworkPath;
        }
      } else {
        return null; // Skip if no artwork file found
      }
      
      return {
        id: parseInt(folder),
        title: metadata?.title || 'Untitled',
        artist: metadata?.artist || 'Unknown Artist',
        type: mediaType,
        media: mediaPath,
        thumbnail: thumbnailPath,
        image: thumbnailPath, // For backward compatibility
        imageExists: imageExists,
        metadata: metadata,
        folder: folder
      };
    })
  );

  // Filter out null submissions (missing files)
  return submissions.filter(submission => submission !== null);
}

// Parse metadata from actual metadata.txt files
async function loadMetadataFromFile(folderName) {
  try {
    // Fetch the actual metadata.txt file
    const response = await fetch(`/submissions/${folderName}/metadata.txt`);
    if (!response.ok) {
      throw new Error(`Failed to fetch metadata for ${folderName}`);
    }
    
    const content = await response.text();
    if (!content) return null;

    // Parse the metadata content
    const lines = content.split('\n');
    const metadata = {};
    
    lines.forEach(line => {
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim();
        const value = line.substring(colonIndex + 1).trim().replace(/^["']|["']$/g, ''); // Remove quotes
        metadata[key] = value;
      }
    });

    // Add email for copyright purposes (since it's not in the metadata files)
    metadata.email = `${metadata.artist?.toLowerCase().replace(/\s+/g, '')}@example.com`;

    return metadata;
  } catch (error) {
    console.error(`Error loading metadata for ${folderName}:`, error);
    return null;
  }
}

// Validate that image exists
async function validateImageExists(imagePath) {
  try {
    const response = await fetch(imagePath, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
}

// Validate that metadata file exists
async function validateMetadataExists(metadataPath) {
  try {
    const response = await fetch(metadataPath, { method: 'HEAD' });
    return response.ok && response.status === 200;
  } catch (error) {
    console.log(`Metadata validation failed for ${metadataPath}:`, error);
    return false;
  }
}

// Validate that any file exists
async function validateFileExists(filePath) {
  try {
    const response = await fetch(filePath, { method: 'HEAD' });
    return response.ok && response.status === 200;
  } catch (error) {
    console.log(`File validation failed for ${filePath}:`, error);
    return false;
  }
}

// Generate video thumbnail using canvas
async function generateVideoThumbnail(videoPath) {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    video.crossOrigin = 'anonymous';
    video.preload = 'metadata';
    video.muted = true; // Mute to avoid autoplay issues
    
    video.onloadedmetadata = () => {
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Seek to 2 seconds or 20% of duration, whichever is smaller
      const seekTime = Math.min(2, video.duration * 0.2);
      video.currentTime = seekTime;
    };
    
    video.onseeked = () => {
      // Draw video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to data URL
      const thumbnailDataUrl = canvas.toDataURL('image/jpeg', 0.9);
      resolve(thumbnailDataUrl);
      
      // Clean up
      video.remove();
    };
    
    video.onerror = () => {
      console.log('Video thumbnail generation failed for:', videoPath);
      resolve(null);
    };
    
    video.src = videoPath;
  });
}

// Main Submissions Component
function Submissions({ onSubmissionClick }) {
  const [submissions, setSubmissions] = React.useState([]);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const data = await loadSubmissions();
        setSubmissions(data);
      } catch (error) {
        console.error('Error loading submissions:', error);
      }
    };

    loadData();
  }, []);

  return (
    <div className="mobile:px-6 desktop-split-2:px-12 tablet:px-16 pl-[88px] pr-[88px]">
      <div className="mobile:flex mobile:flex-col mobile:space-y-6 desktop-split-2:flex desktop-split-2:flex-col desktop-split-2:space-y-8 tablet:flex tablet:flex-wrap flex flex-wrap">
        {submissions.map((submission, index) => (
          <div 
            key={submission.id}
            className="mobile:w-full mobile:mr-0 mobile:mb-0 desktop-split-2:w-full desktop-split-2:mr-0 desktop-split-2:mb-0 tablet:w-[calc(33.333%-20px)] tablet:mr-5 tablet:mb-5 w-[calc(33.333%-16px)] mr-6 mb-6"
            style={{ 
              width: window.innerWidth <= 1039 ? '100%' : window.innerWidth <= 1366 ? 'calc(33.333% - 20px)' : 'calc(33.333% - 16px)',
              marginRight: window.innerWidth <= 1039 ? '0' : window.innerWidth <= 1366 ? (index % 3 === 2 ? '0' : '20px') : (index % 3 === 2 ? '0' : '24px'),
              marginBottom: window.innerWidth <= 1039 ? '0' : window.innerWidth <= 1366 ? '20px' : '24px'
            }}
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
