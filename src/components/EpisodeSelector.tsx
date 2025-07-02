
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface TVDetails {
  number_of_seasons: number;
  seasons: Array<{
    season_number: number;
    episode_count: number;
    name: string;
  }>;
}

interface EpisodeSelectorProps {
  tvDetails: TVDetails;
  selectedSeason: number;
  selectedEpisode: number;
  onSeasonChange: (season: number) => void;
  onEpisodeChange: (episode: number) => void;
}

export const EpisodeSelector: React.FC<EpisodeSelectorProps> = ({
  tvDetails,
  selectedSeason,
  selectedEpisode,
  onSeasonChange,
  onEpisodeChange,
}) => {
  const currentSeason = tvDetails.seasons.find(s => s.season_number === selectedSeason);
  const episodeCount = currentSeason?.episode_count || 1;

  return (
    <div className="mb-6">
      <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
        <CardHeader>
          <CardTitle className="text-lg text-gray-800">Select Episode</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Season Selector */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Season</h4>
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
                    onEpisodeChange(1); // Reset to episode 1 when changing seasons
                  }}
                  className={selectedSeason === season.season_number 
                    ? "bg-gradient-to-r from-pink-400 to-purple-400 text-white" 
                    : "border-pink-200 text-gray-700 hover:bg-pink-50"
                  }
                >
                  Season {season.season_number}
                </Button>
              ))}
            </div>
          </div>

          {/* Episode Selector */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Episode</h4>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {Array.from({ length: episodeCount }, (_, i) => i + 1).map((episode) => (
                <Button
                  key={episode}
                  variant={selectedEpisode === episode ? "default" : "outline"}
                  size="sm"
                  onClick={() => onEpisodeChange(episode)}
                  className={selectedEpisode === episode 
                    ? "bg-gradient-to-r from-pink-400 to-purple-400 text-white" 
                    : "border-pink-200 text-gray-700 hover:bg-pink-50"
                  }
                >
                  {episode}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
