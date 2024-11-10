import mongoose from 'mongoose';

const salaryCommentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    salId: {
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

const SalaryComment = mongoose.model('SalaryComment', salaryCommentSchema);

export default SalaryComment;