import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CineTalk API',
      version: '1.0.0',
      description: 'API completa para el sistema de información de películas CineTalk',
      contact: {
        name: 'CineTalk',
        email: 'contact@cinetalk.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Servidor de desarrollo',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingresa tu token JWT en el formato: Bearer {token}',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            name: { type: 'string', example: 'Juan Pérez' },
            email: { type: 'string', example: 'juan@example.com' },
            avatar: { type: 'string', example: 'https://via.placeholder.com/150' },
            role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
          },
        },
        Movie: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 550 },
            title: { type: 'string', example: 'Fight Club' },
            overview: { type: 'string', example: 'Un oficinista insomne...' },
            poster_path: { type: 'string', example: 'https://image.tmdb.org/...' },
            backdrop_path: { type: 'string', example: 'https://image.tmdb.org/...' },
            release_date: { type: 'string', example: '1999-10-15' },
            vote_average: { type: 'number', example: 8.4 },
            vote_count: { type: 'number', example: 26280 },
          },
        },
        Review: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            user: {
              type: 'object',
              properties: {
                _id: { type: 'string' },
                name: { type: 'string' },
                avatar: { type: 'string' },
              },
            },
            movieId: { type: 'number', example: 550 },
            movieTitle: { type: 'string', example: 'Fight Club' },
            rating: { type: 'number', minimum: 0, maximum: 10, example: 9 },
            comment: { type: 'string', example: 'Excelente película!' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Error message' },
          },
        },
      },
    },
    tags: [
      {
        name: 'Authentication',
        description: 'Endpoints de autenticación de usuarios',
      },
      {
        name: 'Movies',
        description: 'Endpoints para obtener información de películas',
      },
      {
        name: 'Users',
        description: 'Endpoints para gestión de usuarios',
      },
      {
        name: 'Reviews',
        description: 'Endpoints para reseñas de películas',
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Archivos que contienen anotaciones de Swagger
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;

