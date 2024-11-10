import mongoose from "mongoose";

const templateSchema = new mongoose.Schema(
    {
        company : {
            type: String,
            required: true
        },

        position : {
            type: String,
            required: true
        },

        yearsOfExperience : {
            type: Number,
            required: true
        },

        resume : {
            type: String,
            required: true
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
    {
        timestamps: true,
    }
)

const Template = mongoose.model("Template", templateSchema);

export default Template;