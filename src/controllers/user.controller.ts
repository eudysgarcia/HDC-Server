import { Request, Response } from 'express';
import User from '../models/User.model';
import * as tmdbService from '../services/tmdb.service';

// @desc    Obtener perfil de usuario
// @route   GET /api/users/profile
// @access  Private
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id);
    
    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      favoriteMovies: user.favoriteMovies,
      watchlist: user.watchlist,
      watched: user.watched
    });
  } catch (error) {
    console.error('Error en getProfile:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// @desc    Actualizar perfil de usuario
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id);
    
    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    // Debug logging
    console.log('📝 Actualizando perfil de usuario:', req.user?._id);
    
    // Validar tamaño de avatar si viene en base64
    if (req.body.avatar && req.body.avatar.startsWith('data:image')) {
      const base64Length = req.body.avatar.length;
      const sizeInMB = (base64Length * 0.75) / (1024 * 1024); // Aproximado
      console.log(`📷 Tamaño de avatar (base64): ${sizeInMB.toFixed(2)} MB`);
      
      // 10MB es el límite del body-parser, pero es mejor validar un poco menos
      if (sizeInMB > 8) {
        res.status(400).json({ 
          message: `La imagen del avatar es muy grande (${sizeInMB.toFixed(2)} MB). Por favor usa una imagen más pequeña o comprímela.` 
        });
        return;
      }
    }

    user.name = req.body.name || user.name;
    user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
    user.avatar = req.body.avatar || user.avatar;

    if (req.body.email) {
      user.email = req.body.email;
    }

    const updatedUser = await user.save();

    console.log('✅ Perfil actualizado exitosamente');
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      bio: updatedUser.bio,
      favoriteMovies: updatedUser.favoriteMovies,
      watchlist: updatedUser.watchlist,
      createdAt: updatedUser.createdAt
    });
  } catch (error: any) {
    console.error('❌ Error en updateProfile:', error.message);
    res.status(500).json({ 
      message: 'Error al actualizar el perfil',
      error: error.message 
    });
  }
};

// @desc    Agregar película a favoritos
// @route   POST /api/users/favorites/:movieId
// @access  Private
export const addToFavorites = async (req: Request, res: Response): Promise<void> => {
  try {
    const movieId = parseInt(req.params.movieId);
    const user = await User.findById(req.user?._id);
    
    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    await user.addToFavorites(movieId);
    res.json({ message: 'Película agregada a favoritos', favoriteMovies: user.favoriteMovies });
  } catch (error) {
    console.error('Error en addToFavorites:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// @desc    Remover película de favoritos
// @route   DELETE /api/users/favorites/:movieId
// @access  Private
export const removeFromFavorites = async (req: Request, res: Response): Promise<void> => {
  try {
    const movieId = parseInt(req.params.movieId);
    const user = await User.findById(req.user?._id);
    
    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    await user.removeFromFavorites(movieId);
    res.json({ message: 'Película removida de favoritos', favoriteMovies: user.favoriteMovies });
  } catch (error) {
    console.error('Error en removeFromFavorites:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// @desc    Agregar película a watchlist
// @route   POST /api/users/watchlist/:movieId
// @access  Private
export const addToWatchlist = async (req: Request, res: Response): Promise<void> => {
  try {
    const movieId = parseInt(req.params.movieId);
    const user = await User.findById(req.user?._id);
    
    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    if (!user.watchlist.includes(movieId)) {
      user.watchlist.push(movieId);
      await user.save();
    }

    res.json({ message: 'Película agregada a watchlist', watchlist: user.watchlist });
  } catch (error) {
    console.error('Error en addToWatchlist:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// @desc    Remover película de watchlist
// @route   DELETE /api/users/watchlist/:movieId
// @access  Private
export const removeFromWatchlist = async (req: Request, res: Response): Promise<void> => {
  try {
    const movieId = parseInt(req.params.movieId);
    const user = await User.findById(req.user?._id);
    
    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    user.watchlist = user.watchlist.filter(id => id !== movieId);
    await user.save();

    res.json({ message: 'Película removida de watchlist', watchlist: user.watchlist });
  } catch (error) {
    console.error('Error en removeFromWatchlist:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// @desc    Obtener películas favoritas con detalles
// @route   GET /api/users/favorites
// @access  Private
export const getFavoriteMovies = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id);
    
    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    if (user.favoriteMovies.length === 0) {
      res.json([]);
      return;
    }

    const movies = await tmdbService.getMoviesByIds(user.favoriteMovies);
    res.json(movies);
  } catch (error) {
    console.error('Error en getFavoriteMovies:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// @desc    Obtener watchlist con detalles
// @route   GET /api/users/watchlist
// @access  Private
export const getWatchlist = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id);
    
    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    if (user.watchlist.length === 0) {
      res.json([]);
      return;
    }

    const movies = await tmdbService.getMoviesByIds(user.watchlist);
    res.json(movies);
  } catch (error) {
    console.error('Error en getWatchlist:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

