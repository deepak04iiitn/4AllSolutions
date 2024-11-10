import SavedJob from '../models/SavedJob.model.js';
import mongoose from 'mongoose';

// Save a job for a user
export const saveJob = async (req, res) => {
    const { userId } = req.params;
    const { jobId, title, company, location, min_exp, full_jd, apply_link, time } = req.body;
  
    try {
      // Convert userId and jobId to ObjectId
      const userObjectId = new mongoose.Types.ObjectId(userId);
      const jobObjectId = new mongoose.Types.ObjectId(jobId);
  
      // Check if the job is already saved by this user
      const existingJob = await SavedJob.findOne({ userId: userObjectId, jobId: jobObjectId });
      if (existingJob) {
        return res.status(400).json({ message: 'Job is already saved' });
      }
  
      // Save the new job
      const savedJob = new SavedJob({
        userId: userObjectId,
        jobId: jobObjectId,
        title,
        company,
        location,
        min_exp,
        full_jd,
        apply_link,
        time: new Date(time) // Ensure time is a Date object
      });
  
      await savedJob.save();
  
      res.status(201).json(savedJob);
    } catch (err) {
      console.error('Error saving job:', err);
      res.status(500).json({ message: 'Failed to save the job', error: err.message });
    }
  };
  

// Get all saved jobs for a user
export const getSavedJobs = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const savedJobs = await SavedJob.find({ userId })
        .sort({ time: -1 }) // Sort by time in descending order (newest first)
        .exec();
      
      res.json(savedJobs);
    } catch (err) {
      console.error('Error fetching saved jobs:', err);
      res.status(500).json({ message: 'Failed to fetch saved jobs', error: err.message });
    }
  };

// Delete a saved job for a user
export const deleteSavedJob = async (req, res) => {
  const { userId, jobId } = req.params;

  try {
    const deletedJob = await SavedJob.findOneAndDelete({ userId, _id: jobId });

    if (!deletedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json({ message: 'Job removed successfully' });
  } catch (err) {
    console.error('Error removing job:', err);
    res.status(500).json({ message: 'Failed to remove job', error: err.message });
  }
};