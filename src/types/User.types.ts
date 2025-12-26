import { Document, Types } from 'mongoose';

// Interfaz para la película vista
export interface WatchedMovie {
  movieId: number;
  watchedAt: Date;
}

// Interfaz para la película en la lista de favoritos
export interface FavoriteMovie {
  movieId: number;
  addedAt: Date;
}

// Interfaz del documento User en MongoDB
export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  avatar: string;
  bio: string;
  favoriteMovies: number[];
  watchlist: number[];
  watched: WatchedMovie[];
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  
  // Métodos del modelo
  matchPassword(enteredPassword: string): Promise<boolean>;
  addToFavorites(movieId: number): Promise<IUser>;
  removeFromFavorites(movieId: number): Promise<IUser>;
}

// Respuesta de autenticación
export interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  token: string;
}

// Datos para registro
export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

// Datos para login
export interface LoginData {
  email: string;
  password: string;
}

// Perfil de usuario (sin datos sensibles)
export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  role: string;
  favoriteMovies: number[];
  watchlist: number[];
  watched: WatchedMovie[];
}

