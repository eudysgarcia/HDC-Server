# 🚀 Guía de Despliegue en Render

## Configuración para Render

Tu proyecto ya está configurado para desplegarse en Render. Sigue estos pasos:

## 📋 Pasos para Desplegar

### 1. Crea una cuenta en Render
- Ve a [render.com](https://render.com)
- Crea una cuenta o inicia sesión

### 2. Crea un Nuevo Web Service
1. Click en **"New +"** → **"Web Service"**
2. Conecta tu repositorio de GitHub/GitLab
3. Selecciona el repositorio del **server**

### 3. Configuración del Proyecto

**IMPORTANTE**: Usa exactamente esta configuración:

```
Name:              cinetalk-api (o el nombre que prefieras)
Region:            US East (Ohio) o la región más cercana
Branch:            main (o tu rama principal)
Root Directory:    (vacío - déjalo en blanco)
Runtime:           Node
Build Command:     npm install && npm run build
Start Command:     node dist/server.js
```

## ⚙️ Variables de Entorno

**MUY IMPORTANTE**: Debes configurar estas variables de entorno en Render:

1. En tu servicio de Render, ve a **Environment** en el menú lateral
2. Agrega las siguientes variables:

```
MONGODB_URI=mongodb+srv://tu_usuario:tu_password@cluster.mongodb.net/cinetalk
JWT_SECRET=tu_secreto_jwt_super_seguro_minimo_32_caracteres
TMDB_API_KEY=tu_tmdb_api_key
TMDB_ACCESS_TOKEN=tu_tmdb_access_token
NODE_ENV=production
PORT=10000
```

### Obtener las Credenciales

#### MongoDB Atlas (MONGODB_URI)
1. Ve a [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Crea un cluster gratuito
3. En "Database Access" crea un usuario con contraseña
4. En "Network Access" agrega `0.0.0.0/0` (permitir todas las IPs)
5. Click en "Connect" → "Connect your application"
6. Copia el connection string y reemplaza `<password>` con tu contraseña

#### TMDB API (TMDB_API_KEY y TMDB_ACCESS_TOKEN)
1. Ve a [themoviedb.org](https://www.themoviedb.org)
2. Crea una cuenta
3. Ve a Settings → API
4. Solicita una API Key (gratis)
5. Copia el "API Key" y el "API Read Access Token"

#### JWT Secret
- Genera una cadena aleatoria segura de al menos 32 caracteres
- Puedes usar: `openssl rand -base64 32` en terminal
- O usa el generador de Render clickeando "Generate"

## 🎯 Plan Gratuito de Render

El plan gratuito incluye:
- ✅ 750 horas por mes
- ✅ HTTPS automático
- ✅ Despliegue automático desde Git
- ⚠️ Se "duerme" después de 15 minutos de inactividad
- ⚠️ Tarda ~50 segundos en despertar

## 🔍 Verificar Despliegue

Una vez desplegado, tu API estará disponible en:
```
https://tu-proyecto.onrender.com
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

## 📝 Comandos Útiles (Local)

```bash
# Desarrollo local
npm run dev

# Build local (probar compilación)
npm run build

# Iniciar producción local
npm start

# Verificar tipos sin compilar
npm run type-check
```

## ⚠️ Solución de Problemas

### Error: "Build failed"
- Asegúrate que el Build Command sea: `npm install && npm run build`
- Verifica que todas las dependencias estén en `package.json`
- Ejecuta `npm run build` localmente para verificar errores

### Error: "Missing environment variables"
- Verifica que hayas configurado TODAS las variables en Environment
- No copies y pegues con comillas extras

### Error: "Cannot connect to MongoDB"
- Verifica que tu MongoDB URI sea correcto
- Asegúrate de que MongoDB Atlas permita conexiones desde cualquier IP (0.0.0.0/0)
- Verifica que el usuario y contraseña sean correctos

### Error: "Application failed to respond"
- Verifica que el Start Command sea: `node dist/server.js`
- Revisa los logs en Render Dashboard

### La API tarda mucho en responder
- Es normal en el plan gratuito, la primera request después de 15 min tarda ~50 segundos
- Considera usar un servicio de "keep-alive" o actualizar a plan de pago

## 🎉 ¡Listo!

Tu API de CineTalk está lista para desplegarse en Render. 

**Próximos pasos:**
1. Haz commit y push de estos cambios
2. Configura el servicio en Render con los valores exactos de arriba
3. Agrega las variables de entorno
4. Click en "Manual Deploy" o espera el auto-deploy
5. ¡Disfruta tu API en la nube! 🍿

## 📞 Soporte

Si tienes problemas:
- Revisa los logs en Render Dashboard
- Verifica la sección de "Events" para ver el historial de deploys
- Consulta la [documentación de Render](https://render.com/docs)


