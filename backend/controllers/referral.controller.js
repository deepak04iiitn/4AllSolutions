import Referral from "../models/referral.model.js";
import { errorHandler } from "../utils/error.js";

export const createReferral = async(req, res, next) => {

    const { fullName, company, positions, contact, linkedin, userRef } = req.body;

    if (!fullName || !company || !contact ||
        fullName === '' || company === '' || contact === '') {
        return next(errorHandler(400, 'Name, company, and contact are required!'));
    }

    if (!positions || positions.length === 0 || !positions.some(p => p.position)) {
        return next(errorHandler(400, 'At least one position is required!'));
    }

    if(!userRef || userRef === '') {
        return next(errorHandler(401, 'Please sign in to continue!'));
    }

    // Filter out empty positions
    const validPositions = positions.filter(p => p.position.trim() !== '');

    const newReferral = new Referral({
        fullName,
        company,
        positions: validPositions,
        contact,
        linkedin,
        userRef
    });

    try {
        await newReferral.save();
        res.status(201).json(newReferral);
    } catch (error) {
        next(error);
    }
}


export const getReferrals = async(req, res, next) => {
    try {
        const referrals = await Referral.find()
            .sort({ createdAt: -1 });
        res.status(200).json(referrals);
    } catch (error) {
        next(error);
    }
}


export const likeReferral = async (req, res, next) => {

    try {
        
        const referral = await Referral.findById(req.params.refId);

        if (!referral) {
            return next(errorHandler(404, 'Referral not found'));
        }

        const userId = req.user.id; 

        if (!referral.likes.includes(userId)) {
            referral.likes.push(userId);
            referral.numberOfLikes += 1;

            const dislikeIndex = referral.dislikes.indexOf(userId);
            if (dislikeIndex !== -1) {
                referral.dislikes.splice(dislikeIndex, 1);
                referral.numberOfDislikes -= 1;
            }

            await referral.save();
            res.status(200).json({ message: 'Referral liked successfully', likes: referral.numberOfLikes, dislikes: referral.numberOfDislikes });
        } else {
            res.status(400).json({ message: 'You have already liked this referral' });
        }

    } catch (error) {
        next(error);
    }
}

export const dislikeReferral = async (req, res, next) => {

    try {
        const referral = await Referral.findById(req.params.refId);

        if (!referral) {
            return next(errorHandler(404, 'Referral not found'));
        }

        const userId = req.user.id; 

        if (!referral.dislikes.includes(userId)) {
            referral.dislikes.push(userId);
            referral.numberOfDislikes += 1;

            const likeIndex = referral.likes.indexOf(userId);
            if (likeIndex !== -1) {
                referral.likes.splice(likeIndex, 1);
                referral.numberOfLikes -= 1;
            }

            await referral.save();
            res.status(200).json({ message: 'Referral disliked successfully', likes: referral.numberOfLikes, dislikes: referral.numberOfDislikes });
        } else {
            res.status(400).json({ message: 'You have already disliked this referral' });
        }

    } catch (error) {
        next(error);
    }
}


export const deleteRef = async(req, res, next) => {
    try {
        
        if (!req.user.isUserAdmin && req.user.id !== req.params.refId) {
            return next(errorHandler(403, 'You are not allowed to delete this referral!'));
        }
  
        
        const refToDelete = await Referral.findById(req.params.refId);
        if (refToDelete.isUserAdmin) {
            return next(errorHandler(403, 'Admin account cannot be deleted!'));
        }
  
        await Referral.findByIdAndDelete(req.params.refId);
        res.status(200).json('Referral has been deleted!');
    } catch (error) {
        next(error);
    }
  }