import express from 'express';
import { translate, translateFields } from '../controllers/translation.controller';

const router = express.Router();

/**
 * @route   POST /api/translate
 * @desc    Traduce un texto
 * @access  Public
 */
router.post('/', translate);

/**
 * @route   POST /api/translate/fields
 * @desc    Traduce múltiples campos de un objeto
 * @access  Public
 */
router.post('/fields', translateFields);

export default router;

