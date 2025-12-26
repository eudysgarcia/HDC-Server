# 📚 Guía de Swagger - CineTalk API

## 🚀 Acceso a la Documentación

Una vez que el servidor esté corriendo, puedes acceder a la documentación interactiva de Swagger en:

**URL Principal:** `http://localhost:5000/api-docs`

**JSON de Swagger:** `http://localhost:5000/api-docs.json`

## 🎯 Características de Swagger UI

### 1. **Explorar Endpoints**
- Todos los endpoints están organizados por tags (Authentication, Movies, Users, Reviews)
- Haz clic en cualquier endpoint para ver detalles completos

### 2. **Probar Endpoints Directamente**
- Haz clic en "Try it out"
- Completa los parámetros requeridos
- Haz clic en "Execute"
- Ver la respuesta en tiempo real

### 3. **Autenticación**
Para endpoints protegidos:
1. Primero, haz login o registro usando `/api/auth/login` o `/api/auth/register`
2. Copia el `token` de la respuesta
3. Haz clic en el botón "Authorize" (🔒) en la parte superior
4. Ingresa: `Bearer {tu_token}`
5. Haz clic en "Authorize"
6. Ahora puedes probar endpoints protegidos

## 📖 Secciones de la API

### 🔐 Authentication
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener perfil actual (requiere auth)

### 🎬 Movies
- `GET /api/movies/popular` - Películas populares
- `GET /api/movies/trending` - En tendencia
- `GET /api/movies/top-rated` - Mejor calificadas
- `GET /api/movies/upcoming` - Próximos estrenos
- `GET /api/movies/now-playing` - En cartelera
- `GET /api/movies/search` - Buscar películas
- `GET /api/movies/genres` - Lista de géneros
- `GET /api/movies/genre/{genreId}` - Películas por género
- `GET /api/movies/{id}` - Detalle de película

### 👤 Users (requieren autenticación)
- `GET /api/users/profile` - Obtener perfil
- `PUT /api/users/profile` - Actualizar perfil
- `GET /api/users/favorites` - Obtener favoritos
- `POST /api/users/favorites/{movieId}` - Agregar a favoritos
- `DELETE /api/users/favorites/{movieId}` - Remover de favoritos
- `GET /api/users/watchlist` - Obtener watchlist
- `POST /api/users/watchlist/{movieId}` - Agregar a watchlist
- `DELETE /api/users/watchlist/{movieId}` - Remover de watchlist

### 💬 Reviews
- `GET /api/reviews/movie/{movieId}` - Reseñas de una película (público)
- `POST /api/reviews` - Crear reseña (requiere auth)
- `GET /api/reviews/my-reviews` - Mis reseñas (requiere auth)
- `PUT /api/reviews/{id}` - Actualizar reseña (requiere auth)
- `DELETE /api/reviews/{id}` - Eliminar reseña (requiere auth)
- `POST /api/reviews/{id}/like` - Dar like (requiere auth)
- `DELETE /api/reviews/{id}/like` - Quitar like (requiere auth)

## 💡 Consejos de Uso

### Flujo de Trabajo Típico:

1. **Registro/Login**
   ```
   POST /api/auth/register
   {
     "name": "Juan Pérez",
     "email": "juan@example.com",
     "password": "password123"
   }
   ```

2. **Autorizar con el Token**
   - Copia el token de la respuesta
   - Haz clic en "Authorize"
   - Ingresa: `Bearer {token}`

3. **Explorar Películas**
   ```
   GET /api/movies/popular
   GET /api/movies/search?q=avatar
   GET /api/movies/550  (Fight Club)
   ```

4. **Agregar a Favoritos**
   ```
   POST /api/users/favorites/550
   ```

5. **Crear Reseña**
   ```
   POST /api/reviews
   {
     "movieId": 550,
     "movieTitle": "Fight Club",
     "rating": 9,
     "comment": "Excelente película que te hace pensar"
   }
   ```

## 🔧 Personalización

El archivo de configuración de Swagger está en:
`server/src/config/swagger.ts`

Las anotaciones de cada ruta están en:
- `server/src/routes/auth.routes.ts`
- `server/src/routes/movie.routes.ts`
- `server/src/routes/user.routes.ts`
- `server/src/routes/review.routes.ts`

## 📝 Formato de Anotaciones

Ejemplo de cómo agregar documentación a un nuevo endpoint:

```typescript
/**
 * @swagger
 * /api/your/endpoint:
 *   get:
 *     summary: Descripción breve
 *     tags: [TagName]
 *     parameters:
 *       - in: query
 *         name: paramName
 *         schema:
 *           type: string
 *         description: Descripción del parámetro
 *     responses:
 *       200:
 *         description: Respuesta exitosa
 *       400:
 *         description: Error de validación
 */
router.get('/endpoint', controller);
```

## 🌐 Exportar Documentación

Puedes exportar la especificación de OpenAPI en formato JSON:

```bash
curl http://localhost:5000/api-docs.json > swagger.json
```

## 🎉 ¡Listo!

Ahora puedes explorar y probar toda la API de CineTalk de forma interactiva.

¡Disfruta de Swagger! 📚🚀

