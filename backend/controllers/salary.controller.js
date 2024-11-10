import Salary from "../models/salary.model.js";
import { errorHandler } from "../utils/error.js";

export const createSalary = async(req, res, next) => {
    const { 
        education,
        yearsOfExperience,
        priorExperience,
        company,
        position,
        location,
        salary,
        relocationSigningBonus,
        stockBonus,
        bonus,
        ctc,
        benefits,
        otherDetails,
        userRef
    } = req.body;

    // Check required fields
    const requiredFields = [
        'education',
        'yearsOfExperience',
        'priorExperience',
        'company',
        'position',
        'location',
        'salary',
        'ctc',
        'benefits',
        'userRef'
    ];

    for (const field of requiredFields) {
        if (!req.body[field] || req.body[field] === '') {
            return next(errorHandler(400, `${field} is required!`));
        }
    }

    if(!userRef || userRef === '') {
        return next(errorHandler(401, 'Please sign in to continue!'));
    }

    const newSalary = new Salary({
        education,
        yearsOfExperience,
        priorExperience,
        company,
        position,
        location,
        salary,
        relocationSigningBonus,
        stockBonus,
        bonus,
        ctc,
        benefits,
        otherDetails,
        userRef
    });

    try {
        await newSalary.save();
        res.status(201).json(newSalary);
    } catch (error) {
        next(error);
    }
}

export const getsalary = async(req, res, next) => {
    try {
        const salaries = await Salary.find().sort({ createdAt: -1 });
        res.status(200).json(salaries);
    } catch (error) {
        next(error);
    }
}

export const likeSalary = async (req, res, next) => {
    try {
        const salaryRecord = await Salary.findById(req.params.salaryId);

        if (!salaryRecord) {
            return next(errorHandler(404, 'Salary record not found'));
        }

        if (!salaryRecord.likes) {
            salaryRecord.likes = [];
            salaryRecord.numberOfLikes = 0;
        }
        if (!salaryRecord.dislikes) {
            salaryRecord.dislikes = [];
            salaryRecord.numberOfDislikes = 0;
        }

        const userId = req.user.id;

        if (!salaryRecord.likes.includes(userId)) {
            salaryRecord.likes.push(userId);
            salaryRecord.numberOfLikes += 1;

            const dislikeIndex = salaryRecord.dislikes.indexOf(userId);
            if (dislikeIndex !== -1) {
                salaryRecord.dislikes.splice(dislikeIndex, 1);
                salaryRecord.numberOfDislikes -= 1;
            }

            await salaryRecord.save();
            res.status(200).json({ 
                message: 'Salary record liked successfully', 
                likes: salaryRecord.numberOfLikes, 
                dislikes: salaryRecord.numberOfDislikes 
            });
        } else {
            res.status(400).json({ message: 'You have already liked this salary record' });
        }
    } catch (error) {
        next(error);
    }
}

export const dislikeSalary = async (req, res, next) => {
    try {
        const salaryRecord = await Salary.findById(req.params.salaryId);

        if (!salaryRecord) {
            return next(errorHandler(404, 'Salary record not found'));
        }

        if (!salaryRecord.likes) {
            salaryRecord.likes = [];
            salaryRecord.numberOfLikes = 0;
        }
        if (!salaryRecord.dislikes) {
            salaryRecord.dislikes = [];
            salaryRecord.numberOfDislikes = 0;
        }

        const userId = req.user.id;

        if (!salaryRecord.dislikes.includes(userId)) {
            salaryRecord.dislikes.push(userId);
            salaryRecord.numberOfDislikes += 1;

            const likeIndex = salaryRecord.likes.indexOf(userId);
            if (likeIndex !== -1) {
                salaryRecord.likes.splice(likeIndex, 1);
                salaryRecord.numberOfLikes -= 1;
            }

            await salaryRecord.save();
            res.status(200).json({ 
                message: 'Salary record disliked successfully', 
                likes: salaryRecord.numberOfLikes, 
                dislikes: salaryRecord.numberOfDislikes 
            });
        } else {
            res.status(400).json({ message: 'You have already disliked this salary record' });
        }
    } catch (error) {
        next(error);
    }
}