import { Request, Response } from 'express';
import * as tmdbService from '../services/tmdb.service';

// @desc    Obtener películas populares
// @route   GET /api/movies/popular
// @access  Public
export const getPopular = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const movies = await tmdbService.getPopularMovies(page);
    res.json(movies);
  } catch (error) {
    console.error('Error en getPopular:', error);
    res.status(500).json({ message: 'Error al obtener películas populares' });
  }
};

// @desc    Obtener películas en tendencia
// @route   GET /api/movies/trending
// @access  Public
export const getTrending = async (req: Request, res: Response): Promise<void> => {
  try {
    const timeWindow = (req.query.timeWindow as string) || 'week';
    const movies = await tmdbService.getTrendingMovies(timeWindow);
    res.json(movies);
  } catch (error) {
    console.error('Error en getTrending:', error);
    res.status(500).json({ message: 'Error al obtener películas en tendencia' });
  }
};

// @desc    Obtener películas mejor calificadas
// @route   GET /api/movies/top-rated
// @access  Public
export const getTopRated = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const movies = await tmdbService.getTopRatedMovies(page);
    res.json(movies);
  } catch (error) {
    console.error('Error en getTopRated:', error);
    res.status(500).json({ message: 'Error al obtener películas top rated' });
  }
};

// @desc    Obtener estrenos
// @route   GET /api/movies/upcoming
// @access  Public
export const getUpcoming = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const movies = await tmdbService.getUpcomingMovies(page);
    res.json(movies);
  } catch (error) {
    console.error('Error en getUpcoming:', error);
    res.status(500).json({ message: 'Error al obtener estrenos' });
  }
};

// @desc    Obtener películas en cartelera
// @route   GET /api/movies/now-playing
// @access  Public
export const getNowPlaying = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const movies = await tmdbService.getNowPlayingMovies(page);
    res.json(movies);
  } catch (error) {
    console.error('Error en getNowPlaying:', error);
    res.status(500).json({ message: 'Error al obtener películas en cartelera' });
  }
};

// @desc    Obtener detalles de una película
// @route   GET /api/movies/:id
// @access  Public
export const getMovieById = async (req: Request, res: Response): Promise<void> => {
  try {
    const movieId = parseInt(req.params.id);
    
    if (isNaN(movieId)) {
      res.status(400).json({ message: 'ID de película inválido' });
      return;
    }
    
    const movie = await tmdbService.getMovieDetails(movieId);
    res.json(movie);
  } catch (error) {
    console.error('Error en getMovieById:', error);
    res.status(500).json({ message: 'Error al obtener detalles de película' });
  }
};

// @desc    Buscar películas
// @route   GET /api/movies/search
// @access  Public
export const searchMovies = async (req: Request, res: Response): Promise<void> => {
  try {
    const query = req.query.q as string;
    const page = parseInt(req.query.page as string) || 1;
    
    if (!query) {
      res.status(400).json({ message: 'Se requiere un término de búsqueda' });
      return;
    }

    const movies = await tmdbService.searchMovies(query, page);
    res.json(movies);
  } catch (error) {
    console.error('Error en searchMovies:', error);
    res.status(500).json({ message: 'Error al buscar películas' });
  }
};

// @desc    Obtener géneros
// @route   GET /api/movies/genres
// @access  Public
export const getGenres = async (_req: Request, res: Response): Promise<void> => {
  try {
    const genres = await tmdbService.getGenres();
    res.json(genres);
  } catch (error) {
    console.error('Error en getGenres:', error);
    res.status(500).json({ message: 'Error al obtener géneros' });
  }
};

// @desc    Obtener películas por género
// @route   GET /api/movies/genre/:genreId
// @access  Public
export const getMoviesByGenre = async (req: Request, res: Response): Promise<void> => {
  try {
    const genreId = parseInt(req.params.genreId);
    const page = parseInt(req.query.page as string) || 1;
    
    if (isNaN(genreId)) {
      res.status(400).json({ message: 'ID de género inválido' });
      return;
    }
    
    const movies = await tmdbService.getMoviesByGenre(genreId, page);
    res.json(movies);
  } catch (error) {
    console.error('Error en getMoviesByGenre:', error);
    res.status(500).json({ message: 'Error al obtener películas por género' });
  }
};

