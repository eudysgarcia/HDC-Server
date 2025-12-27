import mongoose, { Schema } from 'mongoose';
import { IReview } from '../types/Review.types';

const reviewSchema = new Schema<IReview>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  movieId: {
    type: Number,
    required: true
  },
  movieTitle: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'La calificación es requerida'],
    min: 0,
    max: 10
  },
  comment: {
    type: String,
    required: [true, 'El comentario es requerido'],
    minlength: 10,
    maxlength: 1000
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  dislikes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  parentReview: {
    type: Schema.Types.ObjectId,
    ref: 'Review',
    default: null
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  isApproved: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Índice para mejorar búsquedas (removido unique para permitir múltiples comentarios)
reviewSchema.index({ user: 1, movieId: 1 });
reviewSchema.index({ parentReview: 1 });

// Método para agregar like
reviewSchema.methods.addLike = function(userId: string): Promise<IReview> {
  const userObjectId = new mongoose.Types.ObjectId(userId);
  
  if (!this.likes.some((id: any) => id.equals(userObjectId))) {
    this.likes.push(userObjectId);
  }
  return this.save();
};

// Método para remover like
reviewSchema.methods.removeLike = function(userId: string): Promise<IReview> {
  const userObjectId = new mongoose.Types.ObjectId(userId);
  this.likes = this.likes.filter((id: any) => !id.equals(userObjectId));
  return this.save();
};

// Método para agregar dislike
reviewSchema.methods.addDislike = function(userId: string): Promise<IReview> {
  const userObjectId = new mongoose.Types.ObjectId(userId);
  
  // Remover el like si existe
  this.likes = this.likes.filter((id: any) => !id.equals(userObjectId));
  
  // Agregar dislike si no existe
  if (!this.dislikes.some((id: any) => id.equals(userObjectId))) {
    this.dislikes.push(userObjectId);
  }
  return this.save();
};

// Método para remover dislike
reviewSchema.methods.removeDislike = function(userId: string): Promise<IReview> {
  const userObjectId = new mongoose.Types.ObjectId(userId);
  this.dislikes = this.dislikes.filter((id: any) => !id.equals(userObjectId));
  return this.save();
};

const Review = mongoose.model<IReview>('Review', reviewSchema);

export default Review;

