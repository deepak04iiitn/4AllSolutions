import mongoose from 'mongoose';

const referralCommentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    refId: {
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

const ReferralComment = mongoose.model('ReferralComment', referralCommentSchema);

export default ReferralComment;