import express from 'express';
import { createExperience, deleteExp, dislikeExperience, getExperiences, likeExperience } from '../controllers/interview.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/createInterviewExp' , verifyToken , createExperience);
router.get('/getInterviewExp' , getExperiences);
router.put('/likeExperience/:expId' , verifyToken , likeExperience);                  // api to check whether a person has liked the post earlier or not , if not increase the like otherwise no
router.put('/dislikeExperience/:expId' , verifyToken , dislikeExperience);  
router.delete('/delete/:expId', verifyToken, deleteExp);

export default router;