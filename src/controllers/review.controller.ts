import { Request, Response } from 'express';
import Review from '../models/Review.model';
import { CreateReviewData } from '../types/Review.types';

// @desc    Crear nueva review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { movieId, movieTitle, rating, comment }: CreateReviewData = req.body;

    // Debug logging
    console.log('📝 Datos recibidos para crear review:', {
      movieId,
      movieTitle,
      rating,
      comment,
      user: req.user?._id,
    });

    // Validar usuario autenticado
    if (!req.user || !req.user._id) {
      res.status(401).json({ message: 'Usuario no autenticado' });
      return;
    }

    // Validar campos
    if (!movieId || !movieTitle || !rating || !comment) {
      console.log('❌ Campos faltantes:', {
        movieId: !!movieId,
        movieTitle: !!movieTitle,
        rating: !!rating,
        comment: !!comment,
      });
      res.status(400).json({ 
        message: 'Por favor complete todos los campos',
        missing: {
          movieId: !movieId,
          movieTitle: !movieTitle,
          rating: !rating,
          comment: !comment,
        }
      });
      return;
    }

    // Verificar si el usuario ya tiene una review para esta película
    const existingReview = await Review.findOne({
      user: req.user._id,
      movieId
    });

    if (existingReview) {
      res.status(400).json({ message: 'Ya has creado una review para esta película' });
      return;
    }

    // Crear review
    const review = await Review.create({
      user: req.user._id,
      movieId,
      movieTitle,
      rating,
      comment
    });

    const populatedReview = await Review.findById(review._id).populate('user', 'name avatar');

    console.log('✅ Review creada exitosamente:', populatedReview?._id);
    const userPopulated = populatedReview?.user as any;
    console.log('   Usuario:', userPopulated?.name);
    console.log('   Avatar:', userPopulated?.avatar ? '✓ Presente' : '✗ Ausente');
    
    res.status(201).json(populatedReview);
  } catch (error: any) {
    console.error('❌ Error en createReview:', error.message);
    console.error(error.stack);
    res.status(500).json({ 
      message: 'Error del servidor',
      error: error.message 
    });
  }
};

// @desc    Obtener reviews de una película
// @route   GET /api/reviews/movie/:movieId
// @access  Public
export const getMovieReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const movieId = parseInt(req.params.movieId);
    
    console.log(`📖 Obteniendo reviews para película/anime ID: ${movieId}`);

    const reviews = await Review.find({ movieId, isApproved: true })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    console.log(`✅ Se encontraron ${reviews.length} reviews para película ${movieId}`);
    
    // Debug: verificar avatares
    if (reviews.length > 0) {
      reviews.forEach((review, index) => {
        const userPopulated = review.user as any;
        console.log(`   Review ${index + 1}: Usuario ${userPopulated?.name}, Avatar: ${userPopulated?.avatar ? '✓' : '✗'}`);
      });
    }

    res.json(reviews);
  } catch (error) {
    console.error('❌ Error en getMovieReviews:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// @desc    Obtener reviews del usuario actual
// @route   GET /api/reviews/my-reviews
// @access  Private
export const getMyReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const reviews = await Review.find({ user: req.user?._id })
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error('Error en getMyReviews:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// @desc    Actualizar review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      res.status(404).json({ message: 'Review no encontrada' });
      return;
    }

    // Verificar que el usuario sea el propietario de la review
    if (review.user.toString() !== req.user?._id) {
      res.status(403).json({ message: 'No autorizado para actualizar esta review' });
      return;
    }

    review.rating = req.body.rating || review.rating;
    review.comment = req.body.comment || review.comment;

    const updatedReview = await review.save();
    const populatedReview = await Review.findById(updatedReview._id).populate('user', 'name avatar');

    res.json(populatedReview);
  } catch (error) {
    console.error('Error en updateReview:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// @desc    Eliminar review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      res.status(404).json({ message: 'Review no encontrada' });
      return;
    }

    // Verificar que el usuario sea el propietario de la review o admin
    if (review.user.toString() !== req.user?._id && req.user?.role !== 'admin') {
      res.status(403).json({ message: 'No autorizado para eliminar esta review' });
      return;
    }

    await review.deleteOne();
    res.json({ message: 'Review eliminada' });
  } catch (error) {
    console.error('Error en deleteReview:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// @desc    Dar like a una review
// @route   POST /api/reviews/:id/like
// @access  Private
export const likeReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      res.status(404).json({ message: 'Review no encontrada' });
      return;
    }

    await review.addLike(req.user!._id);
    res.json({ message: 'Like agregado', likesCount: review.likes.length });
  } catch (error) {
    console.error('Error en likeReview:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// @desc    Quitar like de una review
// @route   DELETE /api/reviews/:id/like
// @access  Private
export const unlikeReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      res.status(404).json({ message: 'Review no encontrada' });
      return;
    }

    await review.removeLike(req.user!._id);
    res.json({ message: 'Like removido', likesCount: review.likes.length });
  } catch (error) {
    console.error('Error en unlikeReview:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

