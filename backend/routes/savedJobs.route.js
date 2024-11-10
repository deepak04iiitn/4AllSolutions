import express from 'express';
import { saveJob, getSavedJobs, deleteSavedJob } from '../controllers/savedJobs.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// Save a job
router.post('/:userId', verifyToken , saveJob);

// Get saved jobs for a user
router.get('/:userId', verifyToken , getSavedJobs);

// Delete a saved job
router.delete('/:userId/:jobId', verifyToken , deleteSavedJob);

export default router;
