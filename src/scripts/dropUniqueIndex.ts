import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const dropUniqueIndex = async () => {
  try {
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('✅ Conectado a MongoDB');

    const db = mongoose.connection.db;
    const collection = db?.collection('reviews');

    if (!collection) {
      console.error('❌ No se pudo acceder a la colección reviews');
      return;
    }

    // Listar índices actuales
    console.log('\n📋 Índices actuales:');
    const indexes = await collection.indexes();
    console.log(JSON.stringify(indexes, null, 2));

    // Intentar eliminar el índice problemático
    try {
      await collection.dropIndex('user_1_movieId_1');
      console.log('\n✅ Índice "user_1_movieId_1" eliminado exitosamente');
    } catch (error: any) {
      if (error.codeName === 'IndexNotFound') {
        console.log('\n⚠️ El índice "user_1_movieId_1" no existe (ya fue eliminado o nunca existió)');
      } else {
        console.error('\n❌ Error al eliminar índice:', error.message);
      }
    }

    // Listar índices después de la eliminación
    console.log('\n📋 Índices después de la limpieza:');
    const newIndexes = await collection.indexes();
    console.log(JSON.stringify(newIndexes, null, 2));

    console.log('\n✅ Proceso completado');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

dropUniqueIndex();

