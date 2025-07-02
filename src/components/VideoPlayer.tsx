import React from 'react';More actions
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
    const baseUrl = 'https://player.videasy.net';
    const params = new URLSearchParams({
      color: 'fbc9ff',
      nextEpisode: 'true',
      episodeSelector: 'true',
      autoplayNextEpisode: 'true',
      blockAds: 'true',
      server: 'vidsrc' // Alternative server to avoid default
      server: 'vidsrc'
    });

    if (mediaType === 'tv') {
      return `${baseUrl}/tv/${mediaId}/${season}/${episode}?${params.toString()}`;
    } else {
      return `${baseUrl}/movie/${mediaId}?${params.toString()}`;
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
          className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
          className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:text-purple-400 dark:hover:text-purple-300 dark:hover:bg-purple-950/20"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Details
        </Button>

        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            {title}
            {mediaType === 'tv' && ` - S${season} E${episode}`}
          </h1>
@@ -69,7 +69,7 @@
        <Button
          onClick={handleFullscreen}
          variant="outline"
          className="border-purple-200 text-purple-600 hover:bg-purple-50"
          className="border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/20"
        >
          <Maximize2 className="h-4 w-4 mr-2" />
          Fullscreen
@@ -90,11 +90,11 @@
        </div>
      </div>

      <div className="mt-6 text-center text-gray-600">
      <div className="mt-6 text-center text-gray-600 dark:text-gray-400">
        <p className="text-sm">
          Powered by Videasy Player • {mediaType === 'movie' ? 'Movie' : `Season ${season}, Episode ${episode}`}
          Powered by Videasy Player (vidsrc) • {mediaType === 'movie' ? 'Movie' : `Season ${season}, Episode ${episode}`}
        </p>
      </div>
    </div>
  );
};
