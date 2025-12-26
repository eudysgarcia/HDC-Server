import { Request, Response } from 'express';
import tmdbService from '../services/tmdb.service';

// Obtener TV Shows populares
export const getPopular = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const tvShows = await tmdbService.getPopularTVShows(page);
    res.json(tvShows);
  } catch (error) {
    console.error('Error en getPopular (TV):', error);
    res.status(500).json({ message: 'Error al obtener TV shows populares' });
  }
};

// Obtener TV Shows trending
export const getTrending = async (req: Request, res: Response): Promise<void> => {
  try {
    const tvShows = await tmdbService.getTrendingTVShows();
    res.json(tvShows);
  } catch (error) {
    console.error('Error en getTrending (TV):', error);
    res.status(500).json({ message: 'Error al obtener TV shows trending' });
  }
};

// Obtener TV Shows mejor calificados
export const getTopRated = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const tvShows = await tmdbService.getTopRatedTVShows(page);
    res.json(tvShows);
  } catch (error) {
    console.error('Error en getTopRated (TV):', error);
    res.status(500).json({ message: 'Error al obtener TV shows mejor calificados' });
  }
};

// Buscar TV Shows
export const search = async (req: Request, res: Response): Promise<void> => {
  try {
    const query = req.query.q as string;
    if (!query) {
      res.status(400).json({ message: 'Query es requerido' });
      return;
    }
    const tvShows = await tmdbService.searchTVShows(query);
    res.json(tvShows);
  } catch (error) {
    console.error('Error en search (TV):', error);
    res.status(500).json({ message: 'Error al buscar TV shows' });
  }
};

