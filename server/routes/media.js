import express from 'express';
import { getMediaHighlights } from '../controllers/mediaController.js';

const router = express.Router();

router.get('/:federationId/media-highlights', getMediaHighlights);

export default router;