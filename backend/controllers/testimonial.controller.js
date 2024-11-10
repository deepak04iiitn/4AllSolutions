import Testimonial from "../models/testimonial.model.js";
import { errorHandler } from "../utils/error.js";


export const createTestimonial = async(req , res ,  next) => {

    const {name , role , organization , testimonial , rating , userRef} = req.body;

    if(!name || !role || !organization || !testimonial || !rating || name === '' || role === '' ||organization === '' || testimonial === '' || rating === '')
    {
        return next(errorHandler(400, 'All fields are required!'));
    }

    if(!userRef || userRef === '') {
        return next(errorHandler(401, 'Please sign in to continue!'));
    }

    const newTestimonial = new Testimonial({
        name,
        role,
        organization,
        testimonial,
        rating,
        userRef,
    });

    try {

        await newTestimonial.save();

        res.status(201).json(newTestimonial);

    } catch (error) {
        next(error);
    }

}


export const getTestimonials = async(req , res , next) => {

    try {

        const testimonial = await Testimonial.find().sort({createdAt : -1});

        res.status(200).json(testimonial);

    } catch (error) {
        next(error);
    }

}