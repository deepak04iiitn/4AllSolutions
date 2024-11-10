import mongoose from 'mongoose';

const salarySchema = new mongoose.Schema({
    education: {
        type: String,
        required: true
    },
    yearsOfExperience: {
        type: String,
        required: true
    },
    priorExperience: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    salary: {
        type: String,
        required: true
    },
    relocationSigningBonus: {
        type: String,
        required: false // Changed to optional
    },
    stockBonus: {
        type: String,
        required: false
    },
    bonus: {
        type: String,
        required: false // Changed to optional
    },
    ctc: {
        type: String,
        required: true
    },
    benefits: {
        type: String,
        required: true
    },
    otherDetails: {
        type: String,
        required: false
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

}, {
    timestamps: true
});

const Salary = mongoose.model('Salary', salarySchema);

export default Salary;