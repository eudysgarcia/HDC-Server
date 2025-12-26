import express from 'express';
import {
  createReview,
  getMovieReviews,
  getMyReviews,
  updateReview,
  deleteReview,
  likeReview,
  unlikeReview
} from '../controllers/review.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

/**
 * @swagger
 * /api/reviews/movie/{movieId}:
 *   get:
 *     summary: Obtener reseñas de una película
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la película
 *         example: 550
 *     responses:
 *       200:
 *         description: Lista de reseñas de la película
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 */
router.get('/movie/:movieId', getMovieReviews);

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Crear una nueva reseña
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - movieId
 *               - movieTitle
 *               - rating
 *               - comment
 *             properties:
 *               movieId:
 *                 type: integer
 *                 example: 550
 *               movieTitle:
 *                 type: string
 *                 example: Fight Club
 *               rating:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 10
 *                 example: 9
 *               comment:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 1000
 *                 example: Excelente película que te hace reflexionar
 *     responses:
 *       201:
 *         description: Reseña creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 */
router.post('/', protect, createReview);

/**
 * @swagger
 * /api/reviews/my-reviews:
 *   get:
 *     summary: Obtener mis reseñas
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de reseñas del usuario actual
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       401:
 *         description: No autorizado
 */
router.get('/my-reviews', protect, getMyReviews);

/**
 * @swagger
 * /api/reviews/{id}:
 *   put:
 *     summary: Actualizar una reseña
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reseña
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 10
 *               comment:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 1000
 *     responses:
 *       200:
 *         description: Reseña actualizada
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permiso para actualizar esta reseña
 *       404:
 *         description: Reseña no encontrada
 *   delete:
 *     summary: Eliminar una reseña
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reseña
 *     responses:
 *       200:
 *         description: Reseña eliminada
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permiso para eliminar esta reseña
 *       404:
 *         description: Reseña no encontrada
 */
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

/**
 * @swagger
 * /api/reviews/{id}/like:
 *   post:
 *     summary: Dar like a una reseña
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reseña
 *     responses:
 *       200:
 *         description: Like agregado
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Reseña no encontrada
 *   delete:
 *     summary: Quitar like de una reseña
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reseña
 *     responses:
 *       200:
 *         description: Like removido
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Reseña no encontrada
 */
router.post('/:id/like', protect, likeReview);
router.delete('/:id/like', protect, unlikeReview);

export default router;

