import mongoose from "mongoose";

const positionSchema = new mongoose.Schema({
  position: {
    type: String,
    required: true,
    trim: true,
  },
  jobid: {
    type: String,
    required: false,
    trim: true,
  }
});

const referralSchema = new mongoose.Schema(
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

    positions: [positionSchema],

    contact: {
      type: String,
      required: true,
    },

    linkedin: {
      type: String,
      required: false,
      default: 'Not Provided',
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

const Referral = mongoose.model('Referral', referralSchema);

export default Referral;