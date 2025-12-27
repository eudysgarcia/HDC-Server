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

    // Ya no verificamos si existe una review previa, permitimos múltiples comentarios

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
    const userId = req.user?._id; // Puede ser undefined si no está autenticado
    
    console.log(`📖 Obteniendo reviews para película/anime ID: ${movieId}`);

    // Solo obtener reviews principales (sin parentReview)
    const reviews = await Review.find({ 
      movieId, 
      isApproved: true,
      parentReview: null 
    })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    // Función auxiliar para agregar metadata a una review
    const addMetadata = (review: any) => {
      const likesCount = review.likes.length;
      const dislikesCount = review.dislikes.length;
      let userAction: 'like' | 'dislike' | null = null;
      
      if (userId) {
        const hasLike = review.likes.some((id: any) => id.equals(userId));
        const hasDislike = review.dislikes.some((id: any) => id.equals(userId));
        
        if (hasLike) userAction = 'like';
        else if (hasDislike) userAction = 'dislike';
      }
      
      return {
        ...review.toObject(),
        likesCount,
        dislikesCount,
        userAction
      };
    };

    // Obtener respuestas para cada review con metadata
    const reviewsWithReplies = await Promise.all(
      reviews.map(async (review) => {
        const replies = await Review.find({ 
          parentReview: review._id,
          isApproved: true 
        })
          .populate('user', 'name avatar')
          .sort({ createdAt: 1 });

        // Agregar metadata a cada respuesta
        const repliesWithMetadata = replies.map(reply => addMetadata(reply));
        
        // Contar respuestas
        const repliesCount = replies.length;

        return {
          ...addMetadata(review),
          replies: repliesWithMetadata,
          repliesCount
        };
      })
    );

    console.log(`✅ Se encontraron ${reviews.length} reviews para película ${movieId}`);
    
    res.json(reviewsWithReplies);
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
    if (review.user.toString() !== req.user?._id.toString()) {
      res.status(403).json({ message: 'No autorizado para actualizar esta review' });
      return;
    }

    review.rating = req.body.rating || review.rating;
    review.comment = req.body.comment || review.comment;
    review.isEdited = true;

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
    if (review.user.toString() !== req.user?._id.toString() && req.user?.role !== 'admin') {
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

// @desc    Toggle like en una review (mutuamente excluyente con dislike)
// @route   POST /api/reviews/:id/like
// @access  Private
export const likeReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      res.status(404).json({ message: 'Review no encontrada' });
      return;
    }

    const userId = req.user!._id.toString();
    const userObjectId = req.user!._id;
    
    // Verificar si ya tiene like
    const hasLike = review.likes.some((id: any) => id.equals(userObjectId));
    
    if (hasLike) {
      // Si ya tiene like, quitarlo (toggle off)
      await review.removeLike(userId);
      res.json({ 
        message: 'Like removido', 
        likesCount: review.likes.length,
        dislikesCount: review.dislikes.length,
        userAction: null
      });
    } else {
      // Si no tiene like, agregarlo (y quita dislike si existe)
      await review.addLike(userId);
      res.json({ 
        message: 'Like agregado', 
        likesCount: review.likes.length,
        dislikesCount: review.dislikes.length,
        userAction: 'like'
      });
    }
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

    await review.removeLike(req.user!._id.toString());
    res.json({ message: 'Like removido', likesCount: review.likes.length });
  } catch (error) {
    console.error('Error en unlikeReview:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// @desc    Toggle dislike en una review (mutuamente excluyente con like)
// @route   POST /api/reviews/:id/dislike
// @access  Private
export const dislikeReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      res.status(404).json({ message: 'Review no encontrada' });
      return;
    }

    const userId = req.user!._id.toString();
    const userObjectId = req.user!._id;
    
    // Verificar si ya tiene dislike
    const hasDislike = review.dislikes.some((id: any) => id.equals(userObjectId));
    
    if (hasDislike) {
      // Si ya tiene dislike, quitarlo (toggle off)
      await review.removeDislike(userId);
      res.json({ 
        message: 'Dislike removido', 
        dislikesCount: review.dislikes.length,
        likesCount: review.likes.length,
        userAction: null
      });
    } else {
      // Si no tiene dislike, agregarlo (y quita like si existe)
      await review.addDislike(userId);
      res.json({ 
        message: 'Dislike agregado', 
        dislikesCount: review.dislikes.length,
        likesCount: review.likes.length,
        userAction: 'dislike'
      });
    }
  } catch (error) {
    console.error('Error en dislikeReview:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// @desc    Quitar dislike de una review
// @route   DELETE /api/reviews/:id/dislike
// @access  Private
export const undislikeReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      res.status(404).json({ message: 'Review no encontrada' });
      return;
    }

    await review.removeDislike(req.user!._id.toString());
    res.json({ message: 'Dislike removido', dislikesCount: review.dislikes.length });
  } catch (error) {
    console.error('Error en undislikeReview:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// @desc    Responder a una review
// @route   POST /api/reviews/:id/reply
// @access  Private
export const replyToReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const parentReview = await Review.findById(req.params.id);

    if (!parentReview) {
      res.status(404).json({ message: 'Review no encontrada' });
      return;
    }

    const { comment } = req.body;

    if (!comment) {
      res.status(400).json({ message: 'El comentario es requerido' });
      return;
    }

    // Crear respuesta
    const reply = await Review.create({
      user: req.user!._id,
      movieId: parentReview.movieId,
      movieTitle: parentReview.movieTitle,
      rating: 0, // Las respuestas no tienen rating
      comment,
      parentReview: parentReview._id
    });

    const populatedReply = await Review.findById(reply._id).populate('user', 'name avatar');

    res.status(201).json(populatedReply);
  } catch (error: any) {
    console.error('Error en replyToReview:', error);
    res.status(500).json({ 
      message: 'Error del servidor',
      error: error.message 
    });
  }
};

