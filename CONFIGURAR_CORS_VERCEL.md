# 🔒 Configurar CORS para Vercel

## 📋 ¿Qué es CORS?

CORS (Cross-Origin Resource Sharing) controla qué dominios pueden hacer peticiones a tu API.

---

## ⚙️ Configuración Actual

Ya está configurado en `server/src/server.ts` para aceptar:
- ✅ `http://localhost:5173` (desarrollo local)
- ✅ Cualquier dominio `*.vercel.app`

---

## 🔧 Actualizar con tu URL de Vercel

### Paso 1: Obtener tu URL de Vercel

Después de desplegar el cliente en Vercel, tendrás una URL como:
```
https://cinetalk-client.vercel.app
```

### Paso 2: Actualizar CORS en el servidor

Editar `server/src/server.ts` línea ~28:

```typescript
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'https://TU-URL-AQUI.vercel.app',  // 👈 Cambiar esto
  /\.vercel\.app$/,
];
```

### Paso 3: Redeploy en Render

```bash
git add .
git commit -m "Actualizar CORS para Vercel"
git push
```

Render automáticamente hará redeploy.

---

## ✅ Verificar que Funciona

1. Abre la consola del navegador en tu app de Vercel (F12)
2. Intenta hacer login o cualquier petición
3. Si hay error de CORS, verás:
   ```
   Access to XMLHttpRequest at 'https://...' from origin 'https://...' 
   has been blocked by CORS policy
   ```

4. Si todo está bien, las peticiones funcionarán normalmente ✅

---

## 🔐 Configuración Recomendada para Producción

Si quieres máxima seguridad:

```typescript
const allowedOrigins = [
  // Solo en desarrollo
  ...(env.NODE_ENV === 'development' ? [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
  ] : []),
  
  // Producción
  'https://cinetalk-client.vercel.app',
  'https://tudominio.com', // Si tienes dominio personalizado
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin && env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin || '')) {
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
```

---

## 🆘 Solución de Problemas

### Error: "CORS policy: No 'Access-Control-Allow-Origin'"

**Causa:** El dominio del cliente no está en la lista permitida.

**Solución:**
1. Verifica la URL exacta de tu cliente en Vercel
2. Agrégala a `allowedOrigins`
3. Redeploy el servidor

### Error: "CORS policy: Credentials flag is 'true'"

**Causa:** Mismatch en configuración de credentials.

**Solución:**
- Asegúrate de que `credentials: true` esté en el servidor
- En el cliente (axios), también debe tener:
  ```typescript
  axios.defaults.withCredentials = true;
  ```

### El servidor rechaza todas las peticiones

**Causa:** Regex mal configurado o URL incorrecta.

**Solución:**
- Usa console.log para ver qué origin está llegando:
  ```typescript
  origin: (origin, callback) => {
    console.log('🔍 Origin recibido:', origin);
    // ...
  }
  ```
- Compara con tu configuración

---

## 📊 Logs de CORS

El servidor mostrará en consola:
```
⚠️ CORS bloqueó petición desde: https://sitio-no-autorizado.com
```

Esto te ayudará a debuggear problemas de CORS.

---

## ✨ Configuración Final Recomendada

```typescript
// Lista blanca de orígenes permitidos
const allowedOrigins = [
  // Desarrollo local
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  
  // Tu cliente en Vercel
  'https://cinetalk-client.vercel.app',
  
  // Preview deployments de Vercel (opcional)
  /^https:\/\/cinetalk-client.*\.vercel\.app$/,
  
  // Dominio personalizado (si tienes)
  'https://www.tudominio.com',
  'https://tudominio.com',
];

app.use(cors({
  origin: (origin, callback) => {
    // Permitir requests sin origin en desarrollo (Postman, curl)
    if (!origin && env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    // Verificar si está permitido
    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') return allowed === origin;
      if (allowed instanceof RegExp) return allowed.test(origin || '');
      return false;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`⚠️ CORS bloqueó: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400, // 24 horas de cache para preflight
}));
```

---

## 🎯 Checklist Final

- [ ] CORS configurado con tu URL de Vercel
- [ ] Servidor redeployado en Render
- [ ] Cliente puede hacer login
- [ ] Cliente puede obtener películas/series
- [ ] Cliente puede agregar favoritos
- [ ] No hay errores de CORS en consola
- [ ] Funciona en producción (Vercel)
- [ ] Funciona en desarrollo (localhost)

---

## 📚 Recursos

- [MDN - CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Express CORS middleware](https://expressjs.com/en/resources/middleware/cors.html)
- [Vercel Domains](https://vercel.com/docs/concepts/projects/domains)


