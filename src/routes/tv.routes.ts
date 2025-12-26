import express from 'express';
import * as tvController from '../controllers/tv.controller';

const router = express.Router();

/**
 * @swagger
 * /api/tv/popular:
 *   get:
 *     summary: Obtener TV shows populares
 *     tags: [TV Shows]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página
 *     responses:
 *       200:
 *         description: Lista de TV shows populares
 */
router.get('/popular', tvController.getPopular);

/**
 * @swagger
 * /api/tv/trending:
 *   get:
 *     summary: Obtener TV shows en tendencia
 *     tags: [TV Shows]
 *     responses:
 *       200:
 *         description: Lista de TV shows en tendencia
 */
router.get('/trending', tvController.getTrending);

/**
 * @swagger
 * /api/tv/top-rated:
 *   get:
 *     summary: Obtener TV shows mejor calificados
 *     tags: [TV Shows]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página
 *     responses:
 *       200:
 *         description: Lista de TV shows mejor calificados
 */
router.get('/top-rated', tvController.getTopRated);

/**
 * @swagger
 * /api/tv/search:
 *   get:
 *     summary: Buscar TV shows
 *     tags: [TV Shows]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Query de búsqueda
 *     responses:
 *       200:
 *         description: Resultados de la búsqueda
 */
router.get('/search', tvController.search);

export default router;

