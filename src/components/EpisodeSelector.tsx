
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Users, Star, Play } from 'lucide-react';

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
  onWatchEpisode: (season: number, episode: number) => void;
  mediaId: number;
}

export const EpisodeSelector: React.FC<EpisodeSelectorProps> = ({
  tvDetails,
  selectedSeason,
  selectedEpisode,
  onSeasonChange,
  onEpisodeChange,
  onWatchEpisode,
  mediaId,
}) => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [selectedEpisodeDetails, setSelectedEpisodeDetails] = useState<Episode | null>(null);

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

  const handleSeasonChange = (value: string) => {
    const seasonNumber = parseInt(value);
    onSeasonChange(seasonNumber);
    onEpisodeChange(1);
  };

  return (
    <div className="mb-6 space-y-4">
      {/* Season Selector Dropdown */}
      <Card className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 border-pink-200 dark:border-pink-800">
        <CardHeader>
          <CardTitle className="text-lg text-gray-800 dark:text-gray-200">Episodes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Season</h4>
            <Select value={selectedSeason.toString()} onValueChange={handleSeasonChange}>
              <SelectTrigger className="w-full bg-white dark:bg-gray-800 border-pink-200 dark:border-pink-800">
                <SelectValue placeholder="Select a season" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border-pink-200 dark:border-pink-800">
                {tvDetails.seasons
                  .filter(season => season.season_number > 0)
                  .map((season) => (
                    <SelectItem key={season.season_number} value={season.season_number.toString()}>
                      Season {season.season_number} ({season.episode_count} episodes)
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Episodes List */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Episodes</h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {episodes.map((episode) => (
                <div
                  key={episode.episode_number}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                    selectedEpisode === episode.episode_number
                      ? "bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-950/40 dark:to-purple-950/40 border-pink-300 dark:border-pink-700"
                      : "bg-white dark:bg-gray-800/50 border-pink-200 dark:border-pink-800 hover:bg-pink-50 dark:hover:bg-pink-950/20"
                  }`}
                  onClick={() => onEpisodeChange(episode.episode_number)}
                >
                  <div className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant="outline" 
                        className="border-pink-300 dark:border-pink-700 text-pink-600 dark:text-pink-400"
                      >
                        Ep {episode.episode_number}
                      </Badge>
                      <div>
                        <h5 className="font-medium text-gray-800 dark:text-gray-200">{episode.name}</h5>
                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {episode.air_date && (
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {episode.air_date}
                            </div>
                          )}
                          {episode.vote_average > 0 && (
                            <div className="flex items-center">
                              <Star className="h-3 w-3 mr-1 text-yellow-500" />
                              {episode.vote_average.toFixed(1)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onWatchEpisode(selectedSeason, episode.episode_number);
                    }}
                    size="sm"
                    className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white"
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Watch
                  </Button>
                </div>
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
