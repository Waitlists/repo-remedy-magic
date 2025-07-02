
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Star, Calendar, Clock, Globe } from 'lucide-react';
import { VideoPlayer } from '@/components/VideoPlayer';
import { EpisodeSelector } from '@/components/EpisodeSelector';
import type { Movie } from '@/pages/Index';

interface MediaDetailsProps {
  media: Movie;
  onBack: () => void;
}

interface TVDetails {
  number_of_seasons: number;
  seasons: Array<{
    season_number: number;
    episode_count: number;
    name: string;
  }>;
}

export const MediaDetails: React.FC<MediaDetailsProps> = ({ media, onBack }) => {
  const [showPlayer, setShowPlayer] = useState(false);
  const [tvDetails, setTvDetails] = useState<TVDetails | null>(null);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);

  const getImageUrl = (path: string) => {
    return path ? `https://image.tmdb.org/t/p/w1280${path}` : '/placeholder.svg';
  };

  const getTitle = () => {
    return media.title || media.name || 'Unknown Title';
  };

  const getYear = () => {
    const date = media.release_date || media.first_air_date;
    return date ? new Date(date).getFullYear() : '';
  };

  // Fetch TV show details if it's a TV show
  useEffect(() => {
    if (media.media_type === 'tv') {
      const fetchTVDetails = async () => {
        try {
          const API_KEY = "762f9abeaf5a0a96795dee0bb3989df9";
          const response = await fetch(`https://api.themoviedb.org/3/tv/${media.id}?api_key=${API_KEY}`);
          const data = await response.json();
          setTvDetails(data);
        } catch (error) {
          console.error('Failed to fetch TV details:', error);
        }
      };
      fetchTVDetails();
    }
  }, [media]);

  const handlePlay = () => {
    setShowPlayer(true);
  };

  if (showPlayer) {
    return (
      <VideoPlayer
        mediaId={media.id}
        mediaType={media.media_type || 'movie'}
        season={selectedSeason}
        episode={selectedEpisode}
        title={getTitle()}
        onBack={() => setShowPlayer(false)}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Button
        onClick={onBack}
        variant="ghost"
        className="mb-6 text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:text-purple-400 dark:hover:text-purple-300 dark:hover:bg-purple-950/20"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Search
      </Button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Poster */}
        <div className="lg:col-span-1">
          <Card className="overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-white/50 dark:border-gray-700/50">
            <img
              src={getImageUrl(media.poster_path)}
              alt={getTitle()}
              className="w-full h-auto object-cover"
            />
          </Card>
        </div>

        {/* Details */}
        <div className="lg:col-span-2">
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-white/50 dark:border-gray-700/50">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                    {getTitle()}
                  </CardTitle>
                  <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 mb-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {getYear()}
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 text-yellow-500" />
                      {media.vote_average.toFixed(1)}/10
                    </div>
                  </div>
                </div>
                <Badge className="bg-gradient-to-r from-pink-400 to-purple-400 text-white">
                  {media.media_type === 'tv' ? 'TV Show' : 'Movie'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                {media.overview || 'No description available.'}
              </p>

              {/* TV Show Episode Selector */}
              {media.media_type === 'tv' && tvDetails && (
                <EpisodeSelector
                  tvDetails={tvDetails}
                  selectedSeason={selectedSeason}
                  selectedEpisode={selectedEpisode}
                  onSeasonChange={setSelectedSeason}
                  onEpisodeChange={setSelectedEpisode}
                  mediaId={media.id}
                />
              )}

              <Button
                onClick={handlePlay}
                size="lg"
                className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white font-semibold py-3 px-8 rounded-full transition-all duration-200 transform hover:scale-105"
              >
                <Play className="h-5 w-5 mr-2" />
                {media.media_type === 'tv' ? `Watch S${selectedSeason} E${selectedEpisode}` : 'Watch Movie'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Backdrop */}
      {media.backdrop_path && (
        <div className="mt-8">
          <img
            src={getImageUrl(media.backdrop_path)}
            alt={`${getTitle()} backdrop`}
            className="w-full h-64 object-cover rounded-lg shadow-lg"
          />
        </div>
      )}
    </div>
  );
};
