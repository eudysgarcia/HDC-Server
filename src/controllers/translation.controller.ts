import { Request, Response } from 'express';
import { translateText, translateObject } from '../services/translation.service';

/**
 * Traduce un texto individual
 */
export const translate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { text, targetLang } = req.body;

    if (!text) {
      res.status(400).json({ message: 'Text is required' });
      return;
    }

    const translatedText = await translateText(text, targetLang || 'es');
    res.json({ translatedText });
  } catch (error) {
    console.error('Error in translation controller:', error);
    res.status(500).json({ message: 'Translation error', error });
  }
};

/**
 * Traduce múltiples campos de un objeto
 */
export const translateFields = async (req: Request, res: Response): Promise<void> => {
  try {
    const { object, fields, targetLang } = req.body;

    if (!object || !fields) {
      res.status(400).json({ message: 'Object and fields are required' });
      return;
    }

    const translatedObject = await translateObject(object, fields, targetLang || 'es');
    res.json(translatedObject);
  } catch (error) {
    console.error('Error in translation fields controller:', error);
    res.status(500).json({ message: 'Translation error', error });
  }
};

