import { json } from "express";
import Comment from "../models/comment.model.js";
import { errorHandler } from "../utils/error.js";

export const createComment = async(req , res , next) => {

    try {
        
        const { content , jobId , userId } = req.body;

        if(userId !== req.user.id)             // req.user.id => if stored in the cookie
        {
            return next(errorHandler(403 , 'You are not allowed to create this comment!'));
        }

        const newComment = new Comment({
            content,
            userId,
            jobId,
        });

        await newComment.save();

        res.status(200).json(newComment);

    } catch (error) {
        next(error);
    }
}


export const getJobComments = async(req , res , next) => {

    try {
        
        const comments = await Comment.find({ jobId : req.params.jobId }).sort({
            createdAt : -1,                                                                  // we want to show the newest one first
        });

        res.status(200).json(comments);
        
    } catch (error) {
        next(error);
    }
}


export const likeComment = async(req , res , next) => {

    try {
        
        const comment = await Comment.findById(req.params.commentId);

        if(!comment)
        {
            return next(errorHandler(404 , 'Comment not found!'));
        }

        const userIndex = comment.likes.indexOf(req.user.id);              // in the array of likes , we want to check if we have any user with this userID 

        if(userIndex === -1)
        {
            comment.numberOfLikes += 1;
            comment.likes.push(req.user.id);                              // if not found pushing the user in the likes array
        }
        else
        {
            comment.numberOfLikes -= 1;
            comment.likes.splice(userIndex , 1);                          // if found removing the user
        }

        await comment.save();
        res.status(200).json(comment);

    } catch (error) {
        next(error);
    }
}


export const editComment = async(req , res , next) => {

    try {
        
        const comment = await Comment.findById(req.params.commentId);

        if(!comment)
        {
            return next(errorHandler(404 , 'Comment not found!'));
        }

        if(comment.userId !== req.user.id)
        {
            return next(errorHandler(404 , 'You are not allowed to edit this comment!'));
        }

        const editedComment = await Comment.findByIdAndUpdate(
            req.params.commentId,
            {
                content : req.body.content,
            },
            { new : true }
        );

        res.status(200).json(editedComment);

    } catch (error) {
        next(error);
    }
}


export const deleteComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);

        if (!comment) {
            return next(errorHandler(404, 'Comment not found'));
        }

        // Check if user is either the comment owner OR an admin
        if (comment.userId !== req.user.id && !req.user.isUserAdmin) {
            return next(
                errorHandler(403, 'You are not allowed to delete this comment')
            );
        }

        await Comment.findByIdAndDelete(req.params.commentId);

        res.status(200).json('Comment has been deleted!');

    } catch (error) {
        next(error);
    }
};

  export const getComments = async(req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 8;
        const sortDirection = req.query.sort === 'asc' ? 1 : -1;

        const comments = await Comment.find()
            .sort({ createdAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        const totalComments = await Comment.countDocuments();

        const now = new Date();
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );

        const lastMonthComments = await Comment.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });

        // Get total likes across all comments
        const commentStats = await Comment.aggregate([
            {
                $group: {
                    _id: null,
                    totalLikes: { $sum: "$numberOfLikes" },
                    avgLikesPerComment: { $avg: "$numberOfLikes" }
                }
            }
        ]);

        const stats = commentStats[0] || { totalLikes: 0, avgLikesPerComment: 0 };

        res.status(200).json({
            comments,
            totalComments,
            lastMonthComments,
            stats: {
                totalLikes: stats.totalLikes,
                averageLikes: Math.round(stats.avgLikesPerComment * 10) / 10
            }
        });
        
    } catch (error) {
        next(error);
    }
}

  