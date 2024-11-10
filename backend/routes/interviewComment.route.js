import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { createComment, deleteComment, editComment, getComments, likeComment } from '../controllers/interviewComment.controller.js';

const router = express.Router();

router.post('/create' , verifyToken , createComment);
router.get('/getComments/:expId' , getComments);
router.put('/likeComment/:commentId' , verifyToken , likeComment);                  // api to check whether a person has liked the post earlier or not , if not increase the like otherwise no
router.put('/editComment/:commentId' , verifyToken , editComment);
router.delete('/deleteComment/:commentId' , verifyToken , deleteComment);

export default router;