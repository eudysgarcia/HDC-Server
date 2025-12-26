import express from 'express';
import {
  getPopular,
  getTrending,
  getTopRated,
  getUpcoming,
  getNowPlaying,
  getMovieById,
  searchMovies,
  getGenres,
  getMoviesByGenre
} from '../controllers/movie.controller';

const router = express.Router();

/**
 * @swagger
 * /api/movies/search:
 *   get:
 *     summary: Buscar películas
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Término de búsqueda
 *         example: fight club
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *     responses:
 *       200:
 *         description: Resultados de búsqueda
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Movie'
 *                 total_pages:
 *                   type: integer
 *                 total_results:
 *                   type: integer
 */
router.get('/search', searchMovies);

/**
 * @swagger
 * /api/movies/popular:
 *   get:
 *     summary: Obtener películas populares
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: Lista de películas populares
 */
router.get('/popular', getPopular);

/**
 * @swagger
 * /api/movies/trending:
 *   get:
 *     summary: Obtener películas en tendencia
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: timeWindow
 *         schema:
 *           type: string
 *           enum: [day, week]
 *           default: week
 *     responses:
 *       200:
 *         description: Lista de películas en tendencia
 */
router.get('/trending', getTrending);

/**
 * @swagger
 * /api/movies/top-rated:
 *   get:
 *     summary: Obtener películas mejor calificadas
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: Lista de películas mejor calificadas
 */
router.get('/top-rated', getTopRated);

/**
 * @swagger
 * /api/movies/upcoming:
 *   get:
 *     summary: Obtener próximos estrenos
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: Lista de próximos estrenos
 */
router.get('/upcoming', getUpcoming);

/**
 * @swagger
 * /api/movies/now-playing:
 *   get:
 *     summary: Obtener películas en cartelera
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: Lista de películas en cartelera
 */
router.get('/now-playing', getNowPlaying);

/**
 * @swagger
 * /api/movies/genres:
 *   get:
 *     summary: Obtener lista de géneros
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: Lista de géneros de películas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 genres:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 */
router.get('/genres', getGenres);

/**
 * @swagger
 * /api/movies/genre/{genreId}:
 *   get:
 *     summary: Obtener películas por género
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: genreId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del género
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: Lista de películas del género especificado
 */
router.get('/genre/:genreId', getMoviesByGenre);

/**
 * @swagger
 * /api/movies/{id}:
 *   get:
 *     summary: Obtener detalles de una película
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la película (TMDB)
 *         example: 550
 *     responses:
 *       200:
 *         description: Detalles completos de la película
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       404:
 *         description: Película no encontrada
 */
router.get('/:id', getMovieById);

export default router;

