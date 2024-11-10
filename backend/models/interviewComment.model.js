import mongoose from 'mongoose';

const interviewCommentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    expId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    likes: {
      type: Array,
      default: [],
    },
    numberOfLikes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const InterviewComment = mongoose.model('InterviewComment', interviewCommentSchema);

export default InterviewComment;