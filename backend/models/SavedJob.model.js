import mongoose from 'mongoose';

const SavedJobSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, required: true },  // Change to ObjectId
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: [{ type: String, required: true }],
  min_exp: { type: Number, required: true },
  full_jd: { type: String, required: true },
  apply_link: { type: String, required: true },
  time: { type: Date, default: Date.now }
});

const SavedJob = mongoose.model('SavedJob', SavedJobSchema);
export default SavedJob;