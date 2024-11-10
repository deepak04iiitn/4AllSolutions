import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
    {
        name : {
            type : String,
            required : true
        },

        role : {
            type : String,
            required : true
        },

        organization : {
            type : String,
            required : true
        },

        testimonial : {
            type : String,
            required : true
        },

        rating : {
            type : Number,
            min : 1,
            max : 5,
            required : true
        },

        profileImage : {
            type : String,
            default : "https://www.pngall.com/wp-content/uploads/5/Profile.png",
        },

        userRef: {
            type: String,
            required: true,
        },
    },
    {
        timestamps : true
    }
)

const Testimonial = mongoose.model("Testimonial", testimonialSchema);
export default Testimonial;