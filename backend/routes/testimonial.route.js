import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { createTestimonial, getTestimonials } from '../controllers/testimonial.controller.js';

const router = express.Router();

router.post('/createTestimonial' , verifyToken , createTestimonial);
router.get('/getTestimonials' , getTestimonials);

export default router;