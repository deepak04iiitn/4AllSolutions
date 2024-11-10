import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import commentRoutes from './routes/comment.route.js';
import savedJobsRoutes from './routes/savedJobs.route.js';
import pollRoutes from './routes/poll.route.js';
import interviewsRoutes from './routes/interview.route.js';
import referralRoutes from './routes/referral.route.js';
import salaryRoutes from './routes/salary.route.js';
import templateRoutes from './routes/template.route.js';
import interviewCommentRoutes from './routes/interviewComment.route.js';
import referralCommentRoutes from './routes/referralComment.route.js';
import salaryCommentRoutes from './routes/salaryComment.route.js';
import resumeCommentRoutes from './routes/resumeComment.route.js';
import testimonialRoutes from './routes/testimonial.route.js';


import cookieParser from 'cookie-parser';
import cors from 'cors'
import path from 'path'

dotenv.config();

mongoose.connect(process.env.MONGO)
.then(() => {
    console.log('MongoDB is connected!');
}).catch((err) => {
    console.log(err);
})

const __dirname = path.resolve();

const app = express();

app.use(cors());

app.use(express.json());

app.use(cookieParser());

app.listen(3000 , () => {
    console.log('Server is running on port 3000!');
})

app.use('/backend/user' , userRoutes);
app.use('/backend/auth' , authRoutes);
app.use('/backend/comment' , commentRoutes);
app.use('/backend/saved-jobs', savedJobsRoutes);
app.use('/backend/polls', pollRoutes);
app.use('/backend/interviews', interviewsRoutes);
app.use('/backend/referrals', referralRoutes);
app.use('/backend/salary', salaryRoutes);
app.use('/backend/resumeTemplates', templateRoutes);
app.use('/backend/interviewComments', interviewCommentRoutes);
app.use('/backend/referralComments', referralCommentRoutes);
app.use('/backend/salaryComments', salaryCommentRoutes);
app.use('/backend/resumeComments', resumeCommentRoutes);
app.use('/backend/testimonials' , testimonialRoutes);


const JobSchema = new mongoose.Schema({
    job_title: String,
    min_exp: String,
    company: String,
    location: Array,
    jd: String,
    date: String,
    apply_link : String,
    category : String
  });
  const Naukri = mongoose.model('Naukri', JobSchema, 'naukri');

  const PremiumSchema = new mongoose.Schema({
    prem_email: String,
  });
  const Premium = mongoose.model('Premium', PremiumSchema, 'premium');
  
  
  app.get('/backend/naukri', async (req, res) => {

    try {
      const data = await Naukri.find();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch data: ' + err.message });
    }

  });


  app.get('/backend/premium', async (req, res) => {

    try {
      const data = await Premium.find();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch data: ' + err.message });
    }

  });

  
  app.get('/backend/naukri/:url/:id', async (req, res) => {

    const { id } = req.params;
  
    try {
      const data = await Naukri.find();
      const job = data.find(d => d._id.toString() === id); 
  
      if (job) {
        res.json(job);
      } else {
        res.status(404).json({ message: 'Job not found' });
      }
    } catch (error) {
      console.error("Error fetching job data:", error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


  app.use(express.static(path.join(__dirname, '/frontend/dist'))); 

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
  });


// middleware
app.use((err , req , res , next) => {
    
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error!';

    res.status(statusCode).json({
        success : false,
        statusCode,
        message
    })
})