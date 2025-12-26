import { Request, Response } from 'express';
import User from '../models/User.model';
import { generateToken } from '../middleware/auth.middleware';
import { RegisterData, LoginData } from '../types/User.types';

// @desc    Registrar nuevo usuario
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password }: RegisterData = req.body;

    // Validar campos
    if (!name || !email || !password) {
      res.status(400).json({ message: 'Por favor complete todos los campos' });
      return;
    }

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: 'El usuario ya existe' });
      return;
    }

    // Crear usuario
    const user = await User.create({
      name,
      email,
      password
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Datos de usuario inválidos' });
    }
  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({ 
      message: 'Error del servidor', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

// @desc    Iniciar sesión
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: LoginData = req.body;

    // Validar campos
    if (!email || !password) {
      res.status(400).json({ message: 'Por favor complete todos los campos' });
      return;
    }

    // Buscar usuario y incluir password
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Email o contraseña incorrectos' });
    }
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      message: 'Error del servidor', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

// @desc    Obtener perfil del usuario actual
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id);
    
    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      role: user.role,
      favoriteMovies: user.favoriteMovies,
      watchlist: user.watchlist,
      watched: user.watched
    });
  } catch (error) {
    console.error('Error en getMe:', error);
    res.status(500).json({ 
      message: 'Error del servidor', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

