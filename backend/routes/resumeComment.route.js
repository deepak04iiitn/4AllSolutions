import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { createComment, deleteComment, editComment, getComments, likeComment } from '../controllers/resumeComment.controller.js';

const router = express.Router();

router.post('/create' , verifyToken , createComment);
router.get('/getComments/:resId' , getComments);
router.put('/likeComment/:commentId' , verifyToken , likeComment);                  
router.put('/editComment/:commentId' , verifyToken , editComment);
router.delete('/deleteComment/:commentId' , verifyToken , deleteComment);

export default router;