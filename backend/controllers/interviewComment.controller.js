import { json } from "express";
import { errorHandler } from "../utils/error.js";
import InterviewComment from "../models/interviewComment.model.js";

export const createComment = async(req , res , next) => {

    try {
        
        const { content , expId , userId } = req.body;

        if(userId !== req.user.id)             // req.user.id => if stored in the cookie
        {
            return next(errorHandler(403 , 'You are not allowed to create this comment!'));
        }

        const newComment = new InterviewComment({
            content,
            userId,
            expId,
        });

        await newComment.save();

        res.status(200).json(newComment);

    } catch (error) {
        next(error);
    }
}


export const getComments = async(req , res , next) => {

    try {
        
        const comments = await InterviewComment.find({ expId : req.params.expId }).sort({
            createdAt : -1,                                                                  // we want to show the newest one first
        });

        res.status(200).json(comments);
        
    } catch (error) {
        next(error);
    }
}


export const likeComment = async(req , res , next) => {

    try {
        
        const comment = await InterviewComment.findById(req.params.commentId);

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
        
        const comment = await InterviewComment.findById(req.params.commentId);

        if(!comment)
        {
            return next(errorHandler(404 , 'Comment not found!'));
        }

        if(comment.userId !== req.user.id)
        {
            return next(errorHandler(404 , 'You are not allowed to edit this comment!'));
        }

        const editedComment = await InterviewComment.findByIdAndUpdate(
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

      const comment = await InterviewComment.findById(req.params.commentId);

      if (!comment) 
      {
        return next(errorHandler(404, 'Comment not found'));
      }

      if (comment.userId !== req.user.id)                 // if user is not the owner of comment or he/she is not an admin
      {
        return next(
          errorHandler(403, 'You are not allowed to delete this comment')
        );
      }

      await InterviewComment.findByIdAndDelete(req.params.commentId);

      res.status(200).json('Comment has been deleted!');

    } catch (error) {
      next(error);
    }
  };



  