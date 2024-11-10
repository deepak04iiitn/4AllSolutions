import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { createPoll, deletePoll, getMyPolls, getPublicPolls, votePoll } from '../controllers/poll.controller.js';

const router = express.Router();

router.post('/', verifyToken, createPoll);
router.get('/', getPublicPolls);
router.get('/my', verifyToken, getMyPolls);
router.delete('/:id', verifyToken, deletePoll);
router.post('/:id/vote', verifyToken, votePoll);

export default router;
