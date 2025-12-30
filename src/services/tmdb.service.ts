import axios, { AxiosInstance } from 'axios';
import { env } from '../config/env';
import {
  Movie,
  MovieDetails,
  MovieResults,
  GenreList
} from '../types/Movie.types';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';

// Mapeo de códigos de idioma de i18n a TMDB
const languageMap: { [key: string]: string } = {
  'es': 'es-ES',
  'en': 'en-US',
  'pt': 'pt-BR'
};

// Función helper para obtener el código de idioma de TMDB
export const getTMDBLanguage = (lang?: string): string => {
  if (!lang) return 'en-US';
  return languageMap[lang] || languageMap[lang.split('-')[0]] || 'en-US';
};

// Cliente axios configurado con Bearer Token (recomendado para TMDB API v4)
const tmdbClient: AxiosInstance = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: {
    'Authorization': `Bearer ${env.TMDB_ACCESS_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

// Helper para formatear películas
const formatMovie = (movie: any): Movie => {
  return {
    ...movie,
    poster_path: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null,
    backdrop_path: movie.backdrop_path ? `${IMAGE_BASE_URL}${movie.backdrop_path}` : null,
  };
};

// Obtener películas populares
export const getPopularMovies = async (page: number = 1, language?: string): Promise<MovieResults> => {
  try {
    const response = await tmdbClient.get<MovieResults>('/movie/popular', { 
      params: { 
        page,
        language: getTMDBLanguage(language)
      } 
    });
    return {
      ...response.data,
      results: response.data.results.map(formatMovie)
    };
  } catch (error) {
    console.error('Error al obtener películas populares:', error);
    throw error;
  }
};

// Obtener películas en tendencia
export const getTrendingMovies = async (timeWindow: string = 'week', language?: string): Promise<MovieResults> => {
  try {
    const response = await tmdbClient.get<MovieResults>(`/trending/movie/${timeWindow}`, {
      params: {
        language: getTMDBLanguage(language)
      }
    });
    return {
      ...response.data,
      results: response.data.results.map(formatMovie)
    };
  } catch (error) {
    console.error('Error al obtener películas en tendencia:', error);
    throw error;
  }
};

// Obtener películas mejor calificadas
export const getTopRatedMovies = async (page: number = 1, language?: string): Promise<MovieResults> => {
  try {
    const response = await tmdbClient.get<MovieResults>('/movie/top_rated', { 
      params: { 
        page,
        language: getTMDBLanguage(language)
      } 
    });
    return {
      ...response.data,
      results: response.data.results.map(formatMovie)
    };
  } catch (error) {
    console.error('Error al obtener películas top rated:', error);
    throw error;
  }
};

// Obtener estrenos
export const getUpcomingMovies = async (page: number = 1, language?: string): Promise<MovieResults> => {
  try {
    const response = await tmdbClient.get<MovieResults>('/movie/upcoming', { 
      params: { 
        page,
        language: getTMDBLanguage(language)
      } 
    });
    return {
      ...response.data,
      results: response.data.results.map(formatMovie)
    };
  } catch (error) {
    console.error('Error al obtener estrenos:', error);
    throw error;
  }
};

// Obtener películas en cartelera
export const getNowPlayingMovies = async (page: number = 1, language?: string): Promise<MovieResults> => {
  try {
    const response = await tmdbClient.get<MovieResults>('/movie/now_playing', { 
      params: { 
        page,
        language: getTMDBLanguage(language)
      } 
    });
    return {
      ...response.data,
      results: response.data.results.map(formatMovie)
    };
  } catch (error) {
    console.error('Error al obtener películas en cartelera:', error);
    throw error;
  }
};

// Obtener detalles de una película
export const getMovieDetails = async (movieId: number, language?: string): Promise<MovieDetails> => {
  try {
    const response = await tmdbClient.get<MovieDetails>(`/movie/${movieId}`, {
      params: {
        append_to_response: 'credits,videos,images,similar,recommendations',
        language: getTMDBLanguage(language)
      }
    });
    return formatMovie(response.data) as MovieDetails;
  } catch (error) {
    console.error('Error al obtener detalles de película:', error);
    throw error;
  }
};

// Buscar películas
export const searchMovies = async (query: string, page: number = 1, language?: string): Promise<MovieResults> => {
  try {
    const response = await tmdbClient.get<MovieResults>('/search/movie', {
      params: { 
        query, 
        page,
        language: getTMDBLanguage(language)
      }
    });
    return {
      ...response.data,
      results: response.data.results.map(formatMovie)
    };
  } catch (error) {
    console.error('Error al buscar películas:', error);
    throw error;
  }
};

// Obtener películas por género
export const getMoviesByGenre = async (genreId: number, page: number = 1, language?: string): Promise<MovieResults> => {
  try {
    const response = await tmdbClient.get<MovieResults>('/discover/movie', {
      params: {
        with_genres: genreId,
        page,
        language: getTMDBLanguage(language)
      }
    });
    return {
      ...response.data,
      results: response.data.results.map(formatMovie)
    };
  } catch (error) {
    console.error('Error al obtener películas por género:', error);
    throw error;
  }
};

// Obtener géneros
export const getGenres = async (language?: string): Promise<GenreList> => {
  try {
    const response = await tmdbClient.get<GenreList>('/genre/movie/list', {
      params: {
        language: getTMDBLanguage(language)
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener géneros:', error);
    throw error;
  }
};

// Obtener múltiples películas por IDs
export const getMoviesByIds = async (movieIds: number[], language?: string): Promise<MovieDetails[]> => {
  try {
    const promises = movieIds.map(id => getMovieDetails(id, language));
    const movies = await Promise.all(promises);
    return movies;
  } catch (error) {
    console.error('Error al obtener películas por IDs:', error);
    throw error;
  }
};

// ========== TV SHOWS ==========

// Obtener TV Shows populares
export const getPopularTVShows = async (page: number = 1, language?: string): Promise<MovieResults> => {
  try {
    const response = await tmdbClient.get('/tv/popular', { 
      params: { 
        page,
        language: getTMDBLanguage(language)
      } 
    });
    return {
      ...response.data,
      results: response.data.results.map((show: any) => ({
        ...show,
        title: show.name,
        release_date: show.first_air_date,
        poster_path: show.poster_path ? `${IMAGE_BASE_URL}${show.poster_path}` : null,
        backdrop_path: show.backdrop_path ? `${IMAGE_BASE_URL}${show.backdrop_path}` : null,
      }))
    };
  } catch (error) {
    console.error('Error al obtener TV shows populares:', error);
    throw error;
  }
};

// Obtener TV Shows trending
export const getTrendingTVShows = async (language?: string): Promise<MovieResults> => {
  try {
    const response = await tmdbClient.get('/trending/tv/week', {
      params: {
        language: getTMDBLanguage(language)
      }
    });
    return {
      ...response.data,
      results: response.data.results.map((show: any) => ({
        ...show,
        title: show.name,
        release_date: show.first_air_date,
        poster_path: show.poster_path ? `${IMAGE_BASE_URL}${show.poster_path}` : null,
        backdrop_path: show.backdrop_path ? `${IMAGE_BASE_URL}${show.backdrop_path}` : null,
      }))
    };
  } catch (error) {
    console.error('Error al obtener TV shows trending:', error);
    throw error;
  }
};

// Obtener TV Shows mejor calificados
export const getTopRatedTVShows = async (page: number = 1, language?: string): Promise<MovieResults> => {
  try {
    const response = await tmdbClient.get('/tv/top_rated', { 
      params: { 
        page,
        language: getTMDBLanguage(language)
      } 
    });
    return {
      ...response.data,
      results: response.data.results.map((show: any) => ({
        ...show,
        title: show.name,
        release_date: show.first_air_date,
        poster_path: show.poster_path ? `${IMAGE_BASE_URL}${show.poster_path}` : null,
        backdrop_path: show.backdrop_path ? `${IMAGE_BASE_URL}${show.backdrop_path}` : null,
      }))
    };
  } catch (error) {
    console.error('Error al obtener TV shows mejor calificados:', error);
    throw error;
  }
};

// Buscar TV Shows
export const searchTVShows = async (query: string, language?: string): Promise<MovieResults> => {
  try {
    const response = await tmdbClient.get('/search/tv', { 
      params: { 
        query,
        language: getTMDBLanguage(language)
      } 
    });
    return {
      ...response.data,
      results: response.data.results.map((show: any) => ({
        ...show,
        title: show.name,
        release_date: show.first_air_date,
        poster_path: show.poster_path ? `${IMAGE_BASE_URL}${show.poster_path}` : null,
        backdrop_path: show.backdrop_path ? `${IMAGE_BASE_URL}${show.backdrop_path}` : null,
      }))
    };
  } catch (error) {
    console.error('Error al buscar TV shows:', error);
    throw error;
  }
};

export default {
  getPopularMovies,
  getTrendingMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getNowPlayingMovies,
  getMovieDetails,
  searchMovies,
  getMoviesByGenre,
  getGenres,
  getMoviesByIds,
  // TV Shows
  getPopularTVShows,
  getTrendingTVShows,
  getTopRatedTVShows,
  searchTVShows,
};

