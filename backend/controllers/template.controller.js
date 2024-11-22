import Template from "../models/template.model.js";
import { errorHandler } from "../utils/error.js";

export const uploadResume = async(req, res, next) => {

    const {company, position, yearsOfExperience, resume , userRef} = req.body;  

    // Updated validation logic
    if(!company || !position || typeof yearsOfExperience !== 'number' || !resume || 
       company === '' || position === '' || yearsOfExperience < 0) 
    {
        return next(errorHandler(400, 'All fields are required and years of experience must be 0 or greater!'));
    }

    if(!userRef || userRef === '') {
        return next(errorHandler(401, 'Please sign in to continue!'));
    }

    const newResume = new Template({
        company,
        position,
        yearsOfExperience,
        resume,  
        userRef
    });

    try {
        await newResume.save();
        res.status(200).json('Resume uploaded successfully!');
    } catch (error) {
        next(error);
    }
}



export const getResume = async(req, res, next) => {

    try {

        const resumeTemplates = await Template.find().sort({ createdAt : -1});

        res.status(200).json(resumeTemplates);

    } catch (error) {
        next(error);
    }

}



export const likeResume = async (req, res, next) => {

    try {
        
        const resumeTemp = await Template.findById(req.params.resId);

        if (!resumeTemp) {
            return next(errorHandler(404, 'Resume not found'));
        }

        const userId = req.user.id; 

        if (!resumeTemp.likes.includes(userId)) {
            resumeTemp.likes.push(userId);
            resumeTemp.numberOfLikes += 1;

            const dislikeIndex = resumeTemp.dislikes.indexOf(userId);

            if (dislikeIndex !== -1) {
                resumeTemp.dislikes.splice(dislikeIndex, 1);
                resumeTemp.numberOfDislikes -= 1;
            }

            await resumeTemp.save();
            res.status(200).json({ message: 'Resume liked successfully', likes: resumeTemp.numberOfLikes, dislikes: resumeTemp.numberOfDislikes });
        } else {
            res.status(400).json({ message: 'You have already liked this resume' });
        }

    } catch (error) {
        next(error);
    }
}

export const dislikeResume = async (req, res, next) => {

    try {
        const resumeTemp = await Template.findById(req.params.resId);

        if (!resumeTemp) {
            return next(errorHandler(404, 'Resume not found'));
        }

        const userId = req.user.id; 

        if (!resumeTemp.dislikes.includes(userId)) {
            resumeTemp.dislikes.push(userId);
            resumeTemp.numberOfDislikes += 1;

            const likeIndex = resumeTemp.likes.indexOf(userId);
            if (likeIndex !== -1) {
                resumeTemp.likes.splice(likeIndex, 1);
                resumeTemp.numberOfLikes -= 1;
            }

            await resumeTemp.save();
            res.status(200).json({ message: 'Resume disliked successfully', likes: resumeTemp.numberOfLikes, dislikes: resumeTemp.numberOfDislikes });
        } else {
            res.status(400).json({ message: 'You have already disliked this resume' });
        }

    } catch (error) {
        next(error);
    }
}


export const deleteRes = async(req, res, next) => {
    try {
        
        if (!req.user.isUserAdmin && req.user.id !== req.params.resId) {
            return next(errorHandler(403, 'You are not allowed to delete this resume!'));
        }
  
        
        const resToDelete = await Template.findById(req.params.resId);
        if (resToDelete.isUserAdmin) {
            return next(errorHandler(403, 'Admin account cannot be deleted!'));
        }
  
        await Template.findByIdAndDelete(req.params.resId);
        res.status(200).json('Resume has been deleted!');
    } catch (error) {
        next(error);
    }
  }