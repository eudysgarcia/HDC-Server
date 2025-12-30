const translate = require('@vitalets/google-translate-api');

/**
 * Traduce texto usando Google Translate (gratuito)
 * @param text - Texto a traducir
 * @param targetLang - Idioma objetivo (es, en, pt)
 * @returns Texto traducido
 */
export const translateText = async (text: string, targetLang: string): Promise<string> => {
  // Si no hay texto o el idioma es inglés, retornar el original
  if (!text || targetLang === 'en' || targetLang === 'en-US') {
    return text;
  }

  try {
    // Mapear códigos de idioma
    const langMap: { [key: string]: string } = {
      'es': 'es',
      'es-ES': 'es',
      'pt': 'pt',
      'pt-BR': 'pt',
      'en': 'en',
      'en-US': 'en'
    };

    const targetLanguage = langMap[targetLang] || 'es';

    // Traducir el texto
    const result = await translate(text, { to: targetLanguage });
    return result.text;
  } catch (error) {
    console.error('Error al traducir:', error);
    // Si falla la traducción, retornar el texto original
    return text;
  }
};

/**
 * Traduce un objeto con múltiples campos
 * @param obj - Objeto con campos a traducir
 * @param fields - Array de nombres de campos a traducir
 * @param targetLang - Idioma objetivo
 * @returns Objeto con campos traducidos
 */
export const translateObject = async (
  obj: any,
  fields: string[],
  targetLang: string
): Promise<any> => {
  if (!obj || targetLang === 'en' || targetLang === 'en-US') {
    return obj;
  }

  const translatedObj = { ...obj };

  for (const field of fields) {
    if (translatedObj[field] && typeof translatedObj[field] === 'string') {
      translatedObj[field] = await translateText(translatedObj[field], targetLang);
    }
  }

  return translatedObj;
};

export default {
  translateText,
  translateObject
};

