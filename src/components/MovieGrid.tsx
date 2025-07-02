
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Calendar, Play } from 'lucide-react';
import type { Movie } from '@/pages/Index';

interface MovieGridProps {
  movies: Movie[];
  onMovieSelect: (movie: Movie) => void;
}

export const MovieGrid: React.FC<MovieGridProps> = ({ movies, onMovieSelect }) => {
  const getImageUrl = (path: string) => {
    return path ? `https://image.tmdb.org/t/p/w500${path}` : '/placeholder.svg';
  };

  const getTitle = (movie: Movie) => {
    return movie.title || movie.name || 'Unknown Title';
  };

  const getYear = (movie: Movie) => {
    const date = movie.release_date || movie.first_air_date;
    return date ? new Date(date).getFullYear() : '';
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {movies.map((movie) => (
        <Card
          key={`${movie.media_type}-${movie.id}`}
          className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl bg-white/80 backdrop-blur-sm border-white/50 overflow-hidden"
          onClick={() => onMovieSelect(movie)}
        >
          <div className="relative">
            <img
              src={getImageUrl(movie.poster_path)}
              alt={getTitle(movie)}
              className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-white/90 rounded-full p-3">
                <Play className="h-6 w-6 text-purple-500" />
              </div>
            </div>
            <Badge 
              className="absolute top-2 right-2 bg-gradient-to-r from-pink-400 to-purple-400 text-white"
            >
              {movie.media_type === 'tv' ? 'TV' : 'Movie'}
            </Badge>
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
              {getTitle(movie)}
            </h3>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {getYear(movie)}
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-1 text-yellow-500" />
                {movie.vote_average.toFixed(1)}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
