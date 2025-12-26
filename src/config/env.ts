import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno ANTES de cualquier otra cosa
dotenv.config({
  path: path.resolve(__dirname, '../../.env'),
});

// Validar variables críticas
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'TMDB_API_KEY', 'TMDB_ACCESS_TOKEN'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('❌ Faltan variables de entorno requeridas:', missingEnvVars.join(', '));
  process.exit(1);
}

// Exportar configuración tipada y centralizada
export const env = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI!,
  JWT_SECRET: process.env.JWT_SECRET!,
  TMDB_API_KEY: process.env.TMDB_API_KEY!,
  TMDB_ACCESS_TOKEN: process.env.TMDB_ACCESS_TOKEN!,
};

// Debug en desarrollo
if (env.NODE_ENV === 'development') {
  console.log('🔍 Variables de entorno cargadas:');
  console.log('TMDB_API_KEY:', env.TMDB_API_KEY ? '✅ Cargada' : '❌ NO cargada');
  console.log('TMDB_ACCESS_TOKEN:', env.TMDB_ACCESS_TOKEN ? '✅ Cargada' : '❌ NO cargada');
  console.log('MONGODB_URI:', env.MONGODB_URI ? '✅ Cargada' : '❌ NO cargada');
  console.log('JWT_SECRET:', env.JWT_SECRET ? '✅ Cargada' : '❌ NO cargada');
  console.log('');
}

