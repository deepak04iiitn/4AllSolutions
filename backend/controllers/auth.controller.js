import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';

export const signup = async (req , res , next) => {
    
    const { username , email , password } = req.body;

    if(!username || !email || !password || username === '' || email === '' || password === '')
    {
        next(errorHandler(400 , 'All fields are required!'));
    }

    const hashedPassword = bcryptjs.hashSync(password , 10);

    const newUser = new User({
        username,
        email,
        password : hashedPassword,
    });

    try {
        
        await newUser.save();

        res.json('Signup successfull!');

    } catch (error) {
        next(error);
    }

}


export const signin = async (req , res , next) => {

    const { email , password } = req.body;

    if(!email || !password || email === '' || password === '')
    {
        next(errorHandler(400 , 'All fields are required!'));
    }

    try {
        
        const validUser = await User.findOne({ email });

        if(!validUser)
        {
            return next(errorHandler(404 , 'Invalid credentials!'));
        }

        const validPassword = bcryptjs.compareSync(password , validUser.password);

        if(!validPassword)
        {
            return next(errorHandler(400 , 'Invalid credentials!'));
        }

        const token = jwt.sign(
            {id : validUser._id},
            process.env.JWT_SECRET
        );

        const { password : pass , ...rest } = validUser._doc;

        res.status(200).cookie('access_token' , token , {
            httpOnly : true
        }).json(rest);


    } catch (error) {
        next(error);
    }
}


export const google = async(req , res , next) => {

    // if the user exists , we will sign in the user
    // if the user does not exist we will create the new user
    // we are getting 3 infos from the frontend :- name , email , googlePhotoUrl
    // things we are sending from frontend , in backend we will get them in req.body

    const {name , email , googlePhotoUrl} = req.body;

    try {

        const user = await User.findOne({email});

        if(user)                                                   // user does exist , so just signing in
            {
                const token = jwt.sign(                            // token part is must to sign in after we successfully create the user
                    {
                        id : user._id,
                    },
                    process.env.JWT_SECRET
                );

                const { password , ...rest } = user._doc;

                res.status(200).cookie('access_token' , token , {
                    httpOnly : true
                }).json(rest);
            }
            else
            {
                // now if the user does not exist we have to create a new user
                // for creating a new user , we will require username , email , password
                // we can create username from the displayName we are getting from the google , email we are already getting
                // for the pssword , we will generate a random password , that user can change later
                // 36 means :- numbers from 0 to 9 and letters from a to z

                const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

                const hashedPassword = bcryptjs.hashSync(generatedPassword , 10);

                const newUser = new User({
                    username : name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),         // Deepak Yadav => deepakyadav5358
                    email,
                    password : hashedPassword,
                    profilePicture : googlePhotoUrl,
                });

                await newUser.save();

                const token = jwt.sign(
                    {
                        id : newUser._id,
                    },
                    process.env.JWT_SECRET
                );

                const { password , ...rest } = newUser._doc;

                res.status(200).cookie('access_token' , token , {
                    httpOnly : true
                }).json(rest);

            }

    } catch (error) {
        next(error);
    }
}