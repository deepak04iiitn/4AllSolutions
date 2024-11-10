import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { dislikeResume, getResume, likeResume, uploadResume } from '../controllers/template.controller.js';

const router = express.Router();

router.post('/uploadResume' , verifyToken , uploadResume);
router.get('/getResume' , getResume);
router.put('/likeResume/:resId' , verifyToken , likeResume);                  
router.put('/dislikeResume/:resId' , verifyToken , dislikeResume);

export default router;