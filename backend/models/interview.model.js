import mongoose from "mongoose";

const interviewExperienceSchema = new mongoose.Schema(
{
  fullName: {
    type: String,
    required: true,
    trim: true,
  },

  company: {
    type: String,
    required: true,
    trim: true,
  },

  position: {
    type: String,
    required: true,
    trim: true,
  },

  experience: {
    type: String,
    required: true,
  },

  yoe: {
    type: Number,
    required: true,
  },

  verdict: {
    type: String,
    required: true,
    enum: ['selected', 'rejected'],
  },

  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },

  likes: {
    type: Array,
    default: [],
  },

  numberOfLikes: {
    type: Number,
    default: 0,
  },

  dislikes: {
    type: Array,
    default: [],
  },
  
  numberOfDislikes: {
    type: Number,
    default: 0,
  },

  userRef: {
    type: String,
    required: true,
  },

},
  { timestamps: true }
);

const InterviewExperience = mongoose.model('InterviewExperience', interviewExperienceSchema);

export default InterviewExperience;