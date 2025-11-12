import toast, { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import type { Movie } from '../../types/movie';
import { fetchMovie } from '../../services/movieService';
import ReactPaginate from 'react-paginate';
import css from './App.module.css';

import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

export default function App() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSelected = (movie: Movie) => setSelectedMovie(movie);
  const closeModal = () => setSelectedMovie(null);
  const handleSearch = async (movie: string): Promise<void> => {
    setQuery(movie);
    setPage(1);
  };

  const { data, isError, isLoading, isSuccess } = useQuery({
    queryKey: ['movies', query, page],
    queryFn: () => fetchMovie(query, page),
    enabled: query !== '',
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (isSuccess && data?.results.length === 0) {
      toast.error('No movies found for your request.');
    }
  }, [isSuccess, data]);

  return (
    <>
      <Toaster />
      <SearchBar onSubmit={handleSearch} />
      {isSuccess && data.total_pages > 1 && (
        <ReactPaginate
          pageCount={data?.total_pages || 1}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {isSuccess && data.results.length > 0 && (
        <MovieGrid movies={data.results} onSelect={handleSelected} />
      )}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}
    </>
  );
}
