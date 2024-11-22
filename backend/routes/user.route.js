import express from 'express';
import {deleteUser, getUser, getUserInterviews, getUserReferrals, getUserResume, getusers, getUserSalary, signout, test, updateUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/test' , test);
router.get('/getusers', verifyToken, getusers);
router.put('/update/:userId', verifyToken, updateUser);
router.delete('/delete/:userId', verifyToken, deleteUser);
router.post('/signout', signout);
router.get('/interviews/:expId', verifyToken, getUserInterviews);
router.get('/referrals/:refId', verifyToken, getUserReferrals);
router.get('/salary/:salId', verifyToken, getUserSalary);
router.get('/resumeTemplates/:resId', verifyToken, getUserResume);
router.get('/:userId', verifyToken, getUser);

export default router;