// ⚠️ IMPORTANTE: Cargar configuración de entorno PRIMERO
import { env } from './config/env';

// Ahora sí, importar el resto después de cargar las variables de entorno
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import connectDB from './config/db';
import swaggerSpec from './config/swagger';

// Importar rutas
import authRoutes from './routes/auth.routes';
import movieRoutes from './routes/movie.routes';
import userRoutes from './routes/user.routes';
import reviewRoutes from './routes/review.routes';
import tvRoutes from './routes/tv.routes';
import translationRoutes from './routes/translation.routes';

const app = express();

// Conectar a la base de datos
connectDB();

// Configurar CORS para permitir el cliente de Vercel
const allowedOrigins = [
  'http://localhost:5173',          // Vite dev local
  'http://localhost:5174',          // Vite dev alternativo
  'http://localhost:3000',          // React dev
  'https://hdc-client.vercel.app',  // Tu dominio de Vercel (cambiar por el real)
  /\.vercel\.app$/,                 // Cualquier subdominio de vercel.app
];

app.use(cors({
  origin: (origin, callback) => {
    // Permitir requests sin origin (como Postman, curl, etc.)
    if (!origin) return callback(null, true);
    
    // Verificar si el origin está en la lista permitida o coincide con el patrón
    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') return allowed === origin;
      return allowed.test(origin);
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`⚠️ CORS bloqueó petición desde: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Aumentar límite de body para permitir imágenes en base64
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logger middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'CineTalk API Docs',
}));

// Swagger JSON
app.get('/api-docs.json', (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Rutas
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: '🎬 Bienvenido a Hablemos de Cine API',
    version: '1.0.0',
    stack: 'Node.js + Express + TypeScript + MongoDB',
    documentation: `📚 Documentación Swagger: http://localhost:${env.PORT}/api-docs`,
    endpoints: {
      auth: '/api/auth',
      movies: '/api/movies',
      tv: '/api/tv',
      users: '/api/users',
      reviews: '/api/reviews',
      translate: '/api/translate'
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/tv', tvRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/translate', translationRoutes);

// Manejo de errores 404
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Manejo de errores global
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  // Error de payload muy grande
  if (err.type === 'entity.too.large') {
    console.error('❌ PayloadTooLargeError: Request body muy grande');
    res.status(413).json({
      message: 'El archivo es muy grande. Por favor usa una imagen más pequeña (máximo 2MB).',
      error: 'PayloadTooLarge'
    });
    return;
  }

  console.error('❌ Error del servidor:', err.message);
  console.error(err.stack);
  
  res.status(err.status || 500).json({
    message: err.message || 'Error del servidor',
    error: env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Iniciar servidor solo en desarrollo (no en Vercel/Serverless)
if (env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
app.listen(env.PORT, () => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🚀 Servidor Hablemos de Cine corriendo en http://localhost:${env.PORT}`);
  console.log(`📚 Documentación Swagger: http://localhost:${env.PORT}/api-docs`);
  console.log(`📝 Swagger JSON: http://localhost:${env.PORT}/api-docs.json`);
  console.log(`🔧 Modo: ${env.NODE_ENV}`);
  console.log(`${'='.repeat(60)}\n`);
});
}

export default app;

