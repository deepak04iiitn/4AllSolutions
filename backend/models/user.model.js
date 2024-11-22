import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
        required : true,
    },
    profilePicture : {
        type : String,
        default : "https://www.pngall.com/wp-content/uploads/5/Profile.png",
    },
    role : {
        type : String,
        default : "Guest",
        enum : ["Guest", "Recruiter", "Job Seeker"]
    },
    isUserAdmin : {
        type : Boolean,
        default : false,
    },
    status : {
        type : String,
        default : "Inactive",
        enum : ["Active", "Inactive"]
    },
    lastVisit: {
        type: Date,
        default: Date.now
    },
} , {timestamps : true})

const User = mongoose.model('User' , userSchema);

export default User;