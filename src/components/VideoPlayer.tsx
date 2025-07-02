
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Maximize2 } from 'lucide-react';

interface VideoPlayerProps {
  mediaId: number;
  mediaType: 'movie' | 'tv';
  season?: number;
  episode?: number;
  title: string;
  onBack: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  mediaId,
  mediaType,
  season = 1,
  episode = 1,
  title,
  onBack,
}) => {
  const getVideoUrl = () => {
    if (mediaType === 'tv') {
      return `https://vidsrc.to/embed/tv/${mediaId}/${season}/${episode}`;
    } else {
      return `https://vidsrc.to/embed/movie/${mediaId}`;
    }
  };

  const handleFullscreen = () => {
    const iframe = document.querySelector('iframe');
    if (iframe) {
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Button
          onClick={onBack}
          variant="ghost"
          className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:text-purple-400 dark:hover:text-purple-300 dark:hover:bg-purple-950/20"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Details
        </Button>
        
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            {title}
            {mediaType === 'tv' && ` - S${season} E${episode}`}
          </h1>
        </div>

        <Button
          onClick={handleFullscreen}
          variant="outline"
          className="border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/20"
        >
          <Maximize2 className="h-4 w-4 mr-2" />
          Fullscreen
        </Button>
      </div>

      <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl">
        <div className="aspect-video">
          <iframe
            src={getVideoUrl()}
            className="w-full h-full"
            allowFullScreen
            frameBorder="0"
            title={`${title} Player`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            sandbox="allow-same-origin allow-scripts allow-forms allow-pointer-lock allow-orientation-lock allow-popups"
          />
        </div>
      </div>

      <div className="mt-6 text-center text-gray-600 dark:text-gray-400">
        <p className="text-sm">
          Powered by VidSrc • {mediaType === 'movie' ? 'Movie' : `Season ${season}, Episode ${episode}`}
        </p>
      </div>
    </div>
  );
};
