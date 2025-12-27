import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../types/User.types';

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'El nombre es requerido'],
    minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: 6,
    select: false
  },
  avatar: {
    type: String,
    default: 'https://via.placeholder.com/150'
  },
  bio: {
    type: String,
    default: ''
  },
  favoriteMovies: [{
    type: Number,
    default: []
  }],
  watchlist: [{
    type: Number,
    default: []
  }],
  watched: [{
    movieId: Number,
    watchedAt: {
      type: Date,
      default: Date.now
    }
  }],
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true
});

// Encriptar contraseña antes de guardar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Método para comparar contraseñas
userSchema.methods.matchPassword = async function(enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Método para agregar a favoritos
userSchema.methods.addToFavorites = function(movieId: number): Promise<IUser> {
  if (!this.favoriteMovies.includes(movieId)) {
    this.favoriteMovies.push(movieId);
  }
  return this.save();
};

// Método para remover de favoritos
userSchema.methods.removeFromFavorites = function(movieId: number): Promise<IUser> {
  this.favoriteMovies = this.favoriteMovies.filter((id: number) => id !== movieId);
  return this.save();
};

const User = mongoose.model<IUser>('User', userSchema);

export default User;

