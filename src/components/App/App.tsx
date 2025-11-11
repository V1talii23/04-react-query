// import css from './App.module.css';
import toast, { Toaster } from 'react-hot-toast';
import { useState } from 'react';
import type { Movie } from '../../types/movie';
import { fetchMovie } from '../../services/movieService';

import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState(false);

  const closeModal = () => setSelectedMovie(null);

  const handleSearch = async (movie: string): Promise<void> => {
    try {
      setIsLoading(true);
      setIsError(false);
      setMovies([]);

      const response = await fetchMovie(movie);

      if (!response.length) {
        toast.error('No movies found for your request.');
        return;
      }

      setMovies(response);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelected = (movie: Movie) => setSelectedMovie(movie);

  return (
    <>
      <Toaster />
      <SearchBar onSearch={handleSearch} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={handleSelected} />
      )}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}
    </>
  );
}
