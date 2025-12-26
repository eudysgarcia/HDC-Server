import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import User from '../models/User.model';
import { IUser } from '../types/User.types';

interface JwtPayload {
  id: string;
}

// Proteger rutas - verificar JWT
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;

  // Verificar si el token existe en los headers
  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      // Obtener token del header
      token = req.headers.authorization.split(' ')[1];

      // Verificar token
      const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

      // Obtener usuario del token (sin la contraseña)
      req.user = await User.findById(decoded.id).select('-password') as IUser;

      if (!req.user) {
        res.status(401).json({ message: 'Usuario no encontrado' });
        return;
      }

      next();
    } catch (error) {
      console.error('Error en auth middleware:', error);
      res.status(401).json({ message: 'No autorizado, token inválido' });
      return;
    }
  } else {
    res.status(401).json({ message: 'No autorizado, no hay token' });
    return;
  }
};

// Verificar si es admin
export const admin = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Acceso denegado, se requiere rol de admin' });
  }
};

// Generar JWT Token
export const generateToken = (id: string): string => {
  return jwt.sign({ id }, env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

