'use client';

interface VideoPlayerProps {
  videoUrl: string | null;
  title: string;
  className?: string;
  onVideoEnd?: () => void;
  videoType?: 'iframe' | 'html5';
  html5Url?: string | null;
}

export default function VideoPlayer({ videoUrl, title, className = '', onVideoEnd, videoType = 'iframe', html5Url }: VideoPlayerProps) {

  if (!videoUrl) {
    return (
      <div className={`aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center rounded-xl ${className}`}>
        <div className="text-center text-white">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
          <p className="text-lg font-medium">Video in arrivo</p>
        </div>
      </div>
    );
  }

  // Funzione per convertire URL YouTube in embed
  const getYouTubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    return url;
  };

  // Funzione per convertire URL Vimeo in embed
  const getVimeoEmbedUrl = (url: string) => {
    const regExp = /vimeo\.com\/(\d+)/;
    const match = url.match(regExp);
    
    if (match) {
      return `https://player.vimeo.com/video/${match[1]}`;
    }
    return url;
  };

  // Funzione per convertire URL Google Drive in embed
  const getGoogleDriveEmbedUrl = (url: string) => {
    // Estrae l'ID del file da Google Drive
    const regExp = /\/file\/d\/([a-zA-Z0-9-_]+)/;
    const match = url.match(regExp);
    
    if (match) {
      return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
    return url;
  };

  // Determina il tipo di video e l'URL embed
  const getEmbedUrl = () => {
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      return getYouTubeEmbedUrl(videoUrl);
    } else if (videoUrl.includes('vimeo.com')) {
      return getVimeoEmbedUrl(videoUrl);
    } else if (videoUrl.includes('drive.google.com')) {
      return getGoogleDriveEmbedUrl(videoUrl);
    }
    return videoUrl; // URL diretto
  };

  // Determina se usare video HTML5 o iframe
  const useHTML5 = videoType === 'html5' && html5Url;
  
  // Debug: mostra il tipo di video (commentato per ridurre i log)
  // console.log('🎥 VideoPlayer Debug:', {
  //   videoType,
  //   html5Url,
  //   useHTML5,
  //   videoUrl
  // });
  
  // Debug: controlla la logica (commentato per ridurre i log)
  // console.log('🔍 Debug useHTML5 logic:', {
  //   'videoType === "html5"': videoType === 'html5',
  //   'html5Url exists': !!html5Url,
  //   'useHTML5 result': useHTML5
  // });
  
  const embedUrl = getEmbedUrl();
  const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
  const isVimeo = videoUrl.includes('vimeo.com');
  const isGoogleDrive = videoUrl.includes('drive.google.com');


  return (
    <div className={`aspect-video bg-black rounded-xl overflow-hidden ${className}`}>
      {useHTML5 ? (
        // Video HTML5 con eventi completi
        (() => {
          console.log('🎬 Rendering video HTML5:', html5Url);
          return (
        <video
          className="w-full h-full"
          controls
          preload="metadata"
          onEnded={onVideoEnd}
          onTimeUpdate={(e) => {
            const video = e.target as HTMLVideoElement;
            // Se l'utente ha portato il cursore alla fine (entro 1 secondo dalla fine)
            if (video.currentTime >= video.duration - 1 && video.duration > 0) {
              if (onVideoEnd) {
                onVideoEnd();
              }
            }
          }}
        >
          <source src={html5Url} type="video/mp4" />
          <source src={html5Url} type="video/webm" />
          <source src={html5Url} type="video/ogg" />
          Il tuo browser non supporta la riproduzione video.
        </video>
          );
        })()
      ) : isYouTube || isVimeo || isGoogleDrive ? (
        // Video iframe (YouTube, Vimeo, Google Drive)
        <div className="relative w-full h-full">
          <iframe
            src={embedUrl}
            title={title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        // Video HTML5 fallback (URL diretto)
        <video
          className="w-full h-full"
          controls
          preload="metadata"
          onEnded={onVideoEnd}
          onTimeUpdate={(e) => {
            const video = e.target as HTMLVideoElement;
            // Se l'utente ha portato il cursore alla fine (entro 1 secondo dalla fine)
            if (video.currentTime >= video.duration - 1 && video.duration > 0) {
              if (onVideoEnd) {
                onVideoEnd();
              }
            }
          }}
        >
          <source src={videoUrl} type="video/mp4" />
          <source src={videoUrl} type="video/webm" />
          <source src={videoUrl} type="video/ogg" />
          Il tuo browser non supporta la riproduzione video.
        </video>
      )}
    </div>
  );
}
