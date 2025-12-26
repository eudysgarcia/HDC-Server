# 🚀 Guía de Despliegue en Vercel

## Configuración para Vercel

Tu proyecto ya está configurado para desplegarse en Vercel. Sigue estos pasos:

## 📋 Pasos para Desplegar

### 1. Instala Vercel CLI (opcional)
```bash
npm install -g vercel
```

### 2. Despliega desde la CLI
Desde la carpeta `server/`:
```bash
cd server
vercel
```

### 3. O despliega desde GitHub
1. Ve a [vercel.com](https://vercel.com)
2. Conecta tu repositorio de GitHub
3. Configura el proyecto:
   - **Root Directory**: `server`
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: `dist`

## ⚙️ Variables de Entorno

**IMPORTANTE**: Debes configurar estas variables de entorno en Vercel:

1. Ve a tu proyecto en Vercel Dashboard
2. Settings → Environment Variables
3. Agrega las siguientes variables:

```
MONGODB_URI=tu_connection_string_de_mongodb
JWT_SECRET=tu_secreto_jwt
TMDB_API_KEY=tu_api_key_de_tmdb
TMDB_ACCESS_TOKEN=tu_access_token_de_tmdb
NODE_ENV=production
```

## 📁 Archivos Creados

- ✅ `vercel.json` - Configuración de Vercel
- ✅ `.vercelignore` - Archivos ignorados en el despliegue
- ✅ Script `vercel-build` en package.json
- ✅ Modificado `server.ts` para funcionar en serverless

## 🔍 Verificar Despliegue

Una vez desplegado, tu API estará disponible en:
```
https://tu-proyecto.vercel.app
```

Endpoints disponibles:
- `GET /` - Información de la API
- `GET /api-docs` - Documentación Swagger
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `GET /api/movies` - Películas
- `GET /api/tv` - Series TV
- `GET /api/users` - Usuarios
- `GET /api/reviews` - Reseñas

## ⚠️ Notas Importantes

1. **MongoDB**: Asegúrate de usar MongoDB Atlas (cloud) ya que Vercel es serverless
2. **Variables de Entorno**: No olvides configurar TODAS las variables en Vercel Dashboard
3. **CORS**: Actualiza la configuración de CORS si es necesario para tu frontend
4. **Límites de Vercel Free**: 
   - Serverless Function Execution: 10 segundos máximo
   - Deployment Size: 250 MB

## 🆘 Solución de Problemas

### Error: "Missing environment variables"
- Verifica que hayas configurado todas las variables en Vercel Dashboard

### Error: "Cannot connect to MongoDB"
- Asegúrate de que tu MongoDB URI sea de MongoDB Atlas
- Verifica que las IPs de Vercel estén permitidas en MongoDB (usa 0.0.0.0/0 para permitir todas)

### Error: "Build failed"
- Ejecuta `npm run build` localmente para verificar que compile correctamente
- Revisa los logs de build en Vercel Dashboard

## 📝 Comandos Útiles

```bash
# Desarrollo local
npm run dev

# Build local
npm run build

# Iniciar producción local
npm start

# Desplegar a Vercel
vercel

# Desplegar a producción
vercel --prod
```

## 🎉 ¡Listo!

Tu API de CineTalk está lista para desplegarse en Vercel. ¡Buena suerte! 🍿

