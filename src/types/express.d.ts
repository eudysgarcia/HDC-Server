// Extensión de tipos para Express
import { IUser } from './User.types';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export {};

