import express from 'express';
import { createReferral, dislikeReferral, getReferrals, likeReferral } from '../controllers/referral.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/createReferral', verifyToken, createReferral);
router.get('/getReferral', getReferrals);
router.put('/likeReferral/:refId' , verifyToken , likeReferral);                  
router.put('/dislikeReferral/:refId' , verifyToken , dislikeReferral);

export default router;