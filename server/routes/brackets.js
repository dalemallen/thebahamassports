import express from 'express';
import { getBrackets } from '../controllers/brackets.js';

const router = express.Router();

router.get('/', getBrackets);

export default router;
