import mongoose from 'mongoose';

const resumeCommentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    resId: {
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

const ResumeComment = mongoose.model('ResumeComment', resumeCommentSchema);

export default ResumeComment;