
import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    // Auto-search as user types (debounced)
    if (e.target.value.length > 2) {
      onSearch(e.target.value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-300 via-purple-300 to-pink-400 rounded-full blur opacity-30 group-hover:opacity-40 transition-opacity"></div>
        <div className="relative flex items-center bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-white/50 p-2">
          <div className="pl-4 pr-2">
            {isLoading ? (
              <Loader2 className="h-5 w-5 text-purple-400 animate-spin" />
            ) : (
              <Search className="h-5 w-5 text-purple-400" />
            )}
          </div>
          <Input
            type="text"
            placeholder="Search for movies or TV shows..."
            value={query}
            onChange={handleInputChange}
            className="flex-1 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-lg placeholder:text-gray-400"
          />
          <Button
            type="submit"
            className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white rounded-full px-6 transition-all duration-200"
            disabled={isLoading}
          >
            Search
          </Button>
        </div>
      </div>
    </form>
  );
};
