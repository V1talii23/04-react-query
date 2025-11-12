import axios from 'axios';
import type { Movie } from '../types/movie';
const API_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

export interface MovieHttpResponse {
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
}

const moviesInstance = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
  },
});

export const fetchMovie = async (
  movie: string,
  page: number
): Promise<MovieHttpResponse> => {
  const res = await moviesInstance.get<MovieHttpResponse>('/search/movie', {
    params: { query: movie, page },
  });

  return res.data;
};
