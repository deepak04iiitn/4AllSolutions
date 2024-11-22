import { errorHandler } from "../utils/error.js"
import bcryptjs from 'bcryptjs'
import User from "../models/user.model.js";
import InterviewExperience from "../models/interview.model.js";
import Referral from "../models/referral.model.js";
import Salary from "../models/salary.model.js";
import Template from "../models/template.model.js";


const updateUserActivityStatus = async (userId) => {
  try {
      const user = await User.findById(userId);
      if (!user) return null;

      const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
      const status = user.lastVisit > twoDaysAgo ? 'Active' : 'Inactive';

      // Update lastVisit and status
      return await User.findByIdAndUpdate(
          userId,
          {
              $set: {
                  lastVisit: new Date(),
                  status: status
              }
          },
          { new: true }
      );
  } catch (error) {
      console.error("Error updating user status:", error);
      return null;
  }
};

export const test = (req , res) => {
    res.json({message : 'API is working'})
}


export const updateUser = async(req, res, next) => {
  try {
      // Update user's activity status
      await updateUserActivityStatus(req.user.id);

      // Allow admins to update any user's role
      if (req.user.isUserAdmin && Object.keys(req.body).length === 1 && req.body.role) {
          const updatedUser = await User.findByIdAndUpdate(
              req.params.userId,
              { $set: { role: req.body.role } },
              { new: true }
          );
          const { password, ...rest } = updatedUser._doc;
          return res.status(200).json(rest);
      }

      // Rest of your existing validation logic remains the same
      if (req.user.id !== req.params.userId) {
          return next(errorHandler(403, 'You are not allowed to update this user!'));
      }

      // Existing validation logic...
      if (req.body.password) {
          if (req.body.password.length < 6) {
              return next(errorHandler(400, 'Password must be at least 6 characters!'));
          }
          req.body.password = bcryptjs.hashSync(req.body.password, 10);
      }

      if (req.body.username) {
          if (req.body.username.length < 7 || req.body.username > 20) {
              return next(errorHandler(400, 'Username must be between 7 and 20 characters!'));
          }
          if (req.body.username.includes(' ')) {
              return next(errorHandler(400, 'Username cannot contain spaces!'));
          }
          if (req.body.username !== req.body.username.toLowerCase()) {
              return next(errorHandler(400, 'Username must be lowercase!'));
          }
          if (req.body.username.match(/^[a-zA-Z0-9]+$/)) {
              return next(errorHandler(400, 'Username can only contain letters and numbers!'));
          }
      }

      if (req.body.role && !['Guest', 'Recruiter', 'Job Seeker'].includes(req.body.role)) {
          return next(errorHandler(400, 'Invalid role specified!'));
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.params.userId,
        {
            $set: {
                username: req.body.username,
                email: req.body.email,
                profilePicture: req.body.profilePicture,
                password: req.body.password,
                role: req.body.role,
                lastVisit: new Date(), // Update lastVisit
            }
        },
        { new: true }
    );
    
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
    
} catch (error) {
    next(error);
}
}


export const deleteUser = async(req, res, next) => {
  try {
      // Allow admin to delete any user, but regular users can only delete their own account
      if (!req.user.isUserAdmin && req.user.id !== req.params.userId) {
          return next(errorHandler(403, 'You are not allowed to delete this account!'));
      }

      // Prevent admin from deleting their own account
      const userToDelete = await User.findById(req.params.userId);
      if (userToDelete.isUserAdmin) {
          return next(errorHandler(403, 'Admin account cannot be deleted!'));
      }

      await User.findByIdAndDelete(req.params.userId);
      res.status(200).json('User has been deleted!');
  } catch (error) {
      next(error);
  }
}


export const signout = async(req , res , next) => {

    try {
        res.clearCookie('access_token').status(200).json('User has been signed out!');
    } catch (error) {
        next(error);
    }
    
}



export const getUser = async(req, res, next) => {
  try {
      let user = await User.findById(req.params.userId);

      if(!user) {
          return next(errorHandler(404, 'User not found!'));
      }

      // If the user is viewing their own profile, update their activity status
      if (req.user && req.user.id === req.params.userId) {
          user = await updateUserActivityStatus(req.user.id);
      }

      const { password, ...rest } = user._doc;
      res.status(200).json(rest);

  } catch (error) {
      next(error);
  }
}

export const getUserInterviews = async (req, res, next) => {
  if (req.user.id === req.params.expId) {
      try {
          // Update user's activity status
          await updateUserActivityStatus(req.user.id);
          
          const interviews = await InterviewExperience.find({ userRef: req.params.expId });
          res.status(200).json(interviews);
      } catch (error) {
          next(error);
      }
  } else {
      return next(errorHandler(401, 'You can only view your own interview experiences!'));
  }
}

export const getUserReferrals = async (req, res, next) => {
  if (req.user.id === req.params.refId) {
      try {
          // Update user's activity status
          await updateUserActivityStatus(req.user.id);
          
          const referrals = await Referral.find({ userRef: req.params.refId });
          res.status(200).json(referrals);
      } catch (error) {
          next(error);
      }
  } else {
      return next(errorHandler(401, 'You can only view your own referrals!'));
  }
}

export const getUserSalary = async (req, res, next) => {
  if (req.user.id === req.params.salId) {
      try {
          // Update user's activity status
          await updateUserActivityStatus(req.user.id);
          
          const salary = await Salary.find({ userRef: req.params.salId });
          res.status(200).json(salary);
      } catch (error) {
          next(error);
      }
  } else {
      return next(errorHandler(401, 'You can only view your own salary structure!'));
  }
}

export const getUserResume = async (req, res, next) => {
  if (req.user.id === req.params.resId) {
      try {
          // Update user's activity status
          await updateUserActivityStatus(req.user.id);
          
          const resume = await Template.find({ userRef: req.params.resId });
          res.status(200).json(resume);
      } catch (error) {
          next(error);
      }
  } else {
      return next(errorHandler(401, 'You can only view your own resume template!'));
  }
}

export const getusers = async(req, res, next) => {
  if(!req.user.isUserAdmin) {
      return next(errorHandler(403, 'You are not allowed to see all users!'));
  }

  try {
      // Update admin's activity status
      await updateUserActivityStatus(req.user.id);

      const startIndex = parseInt(req.query.startIndex) || 0;
      const limit = parseInt(req.query.limit) || 9;
      const sortDirection = req.query.sort === 'asc' ? 1 : -1;

      const users = await User.find()
          .sort({ createdAt: sortDirection })
          .skip(startIndex)
          .limit(limit);

      const usersWithoutPassword = users.map((user) => {
          const { password, ...rest } = user._doc;
          return rest;
      });

      const totalUsers = await User.countDocuments();

      const now = new Date();
      const oneMonthAgo = new Date(
          now.getFullYear(),
          now.getMonth()-1,
          now.getDate()
      );

      const lastMonthUsers = await User.countDocuments({
          createdAt: { $gte: oneMonthAgo },
      });

      res.status(200).json({
          users: usersWithoutPassword,
          totalUsers,
          lastMonthUsers,
      });
  } catch (error) {
      next(error);
  }
}