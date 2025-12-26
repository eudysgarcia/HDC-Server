import { Document, Types } from 'mongoose';

// Interfaz del documento Review en MongoDB
export interface IReview extends Document {
  _id: string;
  user: Types.ObjectId;
  movieId: number;
  movieTitle: string;
  rating: number;
  comment: string;
  likes: Types.ObjectId[];
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Métodos del modelo
  addLike(userId: string): Promise<IReview>;
  removeLike(userId: string): Promise<IReview>;
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
  likesCount: number;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

