import { Document, Types } from 'mongoose';

// Interfaz del documento Review en MongoDB
export interface IReview extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  movieId: number;
  movieTitle: string;
  rating: number;
  comment: string;
  likes: Types.ObjectId[];
  dislikes: Types.ObjectId[];
  parentReview?: Types.ObjectId;  // Para respuestas a comentarios
  isEdited: boolean;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Métodos del modelo
  addLike(userId: string): Promise<IReview>;
  removeLike(userId: string): Promise<IReview>;
  addDislike(userId: string): Promise<IReview>;
  removeDislike(userId: string): Promise<IReview>;
}

// Datos para crear una review
export interface CreateReviewData {
  movieId: number;
  movieTitle: string;
  rating: number;
  comment: string;
}

// Review poblada con datos del usuario
export interface PopulatedReview {
  _id: string;
  user: {
    _id: string;
    name: string;
    avatar: string;
  };
  movieId: number;
  movieTitle: string;
  rating: number;
  comment: string;
  likes: string[];
  dislikes: string[];
  likesCount: number;
  dislikesCount: number;
  parentReview?: string;
  replies?: PopulatedReview[];
  isEdited: boolean;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

