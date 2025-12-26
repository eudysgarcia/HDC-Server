import express from 'express';
import {
  getProfile,
  updateProfile,
  addToFavorites,
  removeFromFavorites,
  addToWatchlist,
  removeFromWatchlist,
  getFavoriteMovies,
  getWatchlist
} from '../controllers/user.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// Todas las rutas son protegidas
router.use(protect);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Obtener perfil del usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: No autorizado
 *   put:
 *     summary: Actualizar perfil del usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               bio:
 *                 type: string
 *               avatar:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfil actualizado
 *       401:
 *         description: No autorizado
 */
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

/**
 * @swagger
 * /api/users/favorites:
 *   get:
 *     summary: Obtener películas favoritas del usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de películas favoritas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 *       401:
 *         description: No autorizado
 */
router.get('/favorites', getFavoriteMovies);

/**
 * @swagger
 * /api/users/favorites/{movieId}:
 *   post:
 *     summary: Agregar película a favoritos
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la película (TMDB)
 *     responses:
 *       200:
 *         description: Película agregada a favoritos
 *       401:
 *         description: No autorizado
 *   delete:
 *     summary: Remover película de favoritos
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la película (TMDB)
 *     responses:
 *       200:
 *         description: Película removida de favoritos
 *       401:
 *         description: No autorizado
 */
router.post('/favorites/:movieId', addToFavorites);
router.delete('/favorites/:movieId', removeFromFavorites);

/**
 * @swagger
 * /api/users/watchlist:
 *   get:
 *     summary: Obtener watchlist del usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de películas en watchlist
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 *       401:
 *         description: No autorizado
 */
router.get('/watchlist', getWatchlist);

/**
 * @swagger
 * /api/users/watchlist/{movieId}:
 *   post:
 *     summary: Agregar película a watchlist
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la película (TMDB)
 *     responses:
 *       200:
 *         description: Película agregada a watchlist
 *       401:
 *         description: No autorizado
 *   delete:
 *     summary: Remover película de watchlist
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la película (TMDB)
 *     responses:
 *       200:
 *         description: Película removida de watchlist
 *       401:
 *         description: No autorizado
 */
router.post('/watchlist/:movieId', addToWatchlist);
router.delete('/watchlist/:movieId', removeFromWatchlist);

export default router;

