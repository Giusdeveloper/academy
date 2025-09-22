'use client';

interface VideoPlayerProps {
  videoUrl: string | null;
  title: string;
  className?: string;
  onVideoEnd?: () => void;
}

export default function VideoPlayer({ videoUrl, className = '', onVideoEnd }: VideoPlayerProps) {

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

  // Per video HTML5, usiamo direttamente l'URL del video


  return (
    <div className={`aspect-video bg-black rounded-xl overflow-hidden ${className}`}>
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
    </div>
  );
}
