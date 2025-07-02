
import React, { useState } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { MovieGrid } from '@/components/MovieGrid';
import { MediaDetails } from '@/components/MediaDetails';

export interface Movie {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  genre_ids: number[];
  media_type?: 'movie' | 'tv';
}

const Index = () => {
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    const API_KEY = "762f9abeaf5a0a96795dee0bb3989df9";
    
    try {
      // Search both movies and TV shows
      const [movieResponse, tvResponse] = await Promise.all([
        fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`),
        fetch(`https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(query)}`)
      ]);

      const movieData = await movieResponse.json();
      const tvData = await tvResponse.json();

      const movies = movieData.results?.map((item: any) => ({ ...item, media_type: 'movie' })) || [];
      const tvShows = tvData.results?.map((item: any) => ({ ...item, media_type: 'tv' })) || [];

      const combinedResults = [...movies, ...tvShows].sort((a, b) => b.popularity - a.popularity);
      setSearchResults(combinedResults);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMediaSelect = (media: Movie) => {
    setSelectedMedia(media);
  };

  const handleBack = () => {
    setSelectedMedia(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100">
      <div className="container mx-auto px-4 py-8">
        {!selectedMedia ? (
          <>
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-300 to-purple-500 bg-clip-text text-transparent mb-4">
                LunaStream
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Discover and watch your favorite movies and TV shows
              </p>
              <SearchBar onSearch={handleSearch} isLoading={isLoading} />
            </div>

            {/* Results */}
            {searchResults.length > 0 && (
              <MovieGrid 
                movies={searchResults} 
                onMovieSelect={handleMediaSelect}
              />
            )}

            {searchResults.length === 0 && !isLoading && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🎬</div>
                <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                  Start your movie journey
                </h2>
                <p className="text-gray-500">
                  Search for any movie or TV show to get started
                </p>
              </div>
            )}
          </>
        ) : (
          <MediaDetails 
            media={selectedMedia} 
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
