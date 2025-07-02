
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Star } from 'lucide-react';

interface TVDetails {
  number_of_seasons: number;
  seasons: Array<{
    season_number: number;
    episode_count: number;
    name: string;
  }>;
}

interface Episode {
  episode_number: number;
  name: string;
  overview: string;
  air_date: string;
  vote_average: number;
  crew: Array<{
    id: number;
    name: string;
    job: string;
  }>;
  guest_stars: Array<{
    id: number;
    name: string;
    character: string;
  }>;
}

interface EpisodeSelectorProps {
  tvDetails: TVDetails;
  selectedSeason: number;
  selectedEpisode: number;
  onSeasonChange: (season: number) => void;
  onEpisodeChange: (episode: number) => void;
  mediaId: number;
}

export const EpisodeSelector: React.FC<EpisodeSelectorProps> = ({
  tvDetails,
  selectedSeason,
  selectedEpisode,
  onSeasonChange,
  onEpisodeChange,
  mediaId,
}) => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [selectedEpisodeDetails, setSelectedEpisodeDetails] = useState<Episode | null>(null);

  const currentSeason = tvDetails.seasons.find(s => s.season_number === selectedSeason);
  const episodeCount = currentSeason?.episode_count || 1;

  // Fetch episode details for the selected season
  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const API_KEY = "762f9abeaf5a0a96795dee0bb3989df9";
        const response = await fetch(`https://api.themoviedb.org/3/tv/${mediaId}/season/${selectedSeason}?api_key=${API_KEY}`);
        const data = await response.json();
        setEpisodes(data.episodes || []);
      } catch (error) {
        console.error('Failed to fetch episodes:', error);
        setEpisodes([]);
      }
    };

    fetchEpisodes();
  }, [mediaId, selectedSeason]);

  // Update selected episode details when episode changes
  useEffect(() => {
    const episode = episodes.find(ep => ep.episode_number === selectedEpisode);
    setSelectedEpisodeDetails(episode || null);
  }, [episodes, selectedEpisode]);

  return (
    <div className="mb-6 space-y-4">
      <Card className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 border-pink-200 dark:border-pink-800">
        <CardHeader>
          <CardTitle className="text-lg text-gray-800 dark:text-gray-200">Select Episode</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Season Selector */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Season</h4>
            <div className="flex flex-wrap gap-2">
              {tvDetails.seasons
                .filter(season => season.season_number > 0)
                .map((season) => (
                <Button
                  key={season.season_number}
                  variant={selectedSeason === season.season_number ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    onSeasonChange(season.season_number);
                    onEpisodeChange(1);
                  }}
                  className={selectedSeason === season.season_number 
                    ? "bg-gradient-to-r from-pink-400 to-purple-400 text-white" 
                    : "border-pink-200 dark:border-pink-800 text-gray-700 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-pink-950/20"
                  }
                >
                  Season {season.season_number}
                </Button>
              ))}
            </div>
          </div>

          {/* Episode Selector */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Episode</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-40 overflow-y-auto">
              {episodes.map((episode) => (
                <Button
                  key={episode.episode_number}
                  variant={selectedEpisode === episode.episode_number ? "default" : "outline"}
                  size="sm"
                  onClick={() => onEpisodeChange(episode.episode_number)}
                  className={`h-auto p-2 flex flex-col items-start ${
                    selectedEpisode === episode.episode_number 
                      ? "bg-gradient-to-r from-pink-400 to-purple-400 text-white" 
                      : "border-pink-200 dark:border-pink-800 text-gray-700 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-pink-950/20"
                  }`}
                >
                  <span className="font-medium">Ep {episode.episode_number}</span>
                  <span className="text-xs truncate w-full text-left">{episode.name}</span>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Episode Details */}
      {selectedEpisodeDetails && (
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="md:col-span-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-pink-200 dark:border-pink-800">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl text-gray-800 dark:text-gray-200">
                    {selectedEpisodeDetails.name}
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-2">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {selectedEpisodeDetails.air_date}
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 text-yellow-500" />
                      {selectedEpisodeDetails.vote_average.toFixed(1)}
                    </div>
                  </div>
                </div>
                <Badge className="bg-gradient-to-r from-pink-400 to-purple-400 text-white">
                  Episode {selectedEpisodeDetails.episode_number}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {selectedEpisodeDetails.overview || 'No description available.'}
              </p>
            </CardContent>
          </Card>

          {/* Crew Information */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-pink-200 dark:border-pink-800">
            <CardHeader>
              <CardTitle className="text-lg text-gray-800 dark:text-gray-200 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Crew & Cast
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedEpisodeDetails.crew?.slice(0, 5).map((crewMember) => (
                <div key={crewMember.id} className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-200 text-sm">{crewMember.name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{crewMember.job}</p>
                  </div>
                </div>
              ))}
              
              {selectedEpisodeDetails.guest_stars?.slice(0, 3).map((guest) => (
                <div key={guest.id} className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-200 text-sm">{guest.name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{guest.character}</p>
                  </div>
                </div>
              ))}
              
              {(!selectedEpisodeDetails.crew?.length && !selectedEpisodeDetails.guest_stars?.length) && (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">No crew information available</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
