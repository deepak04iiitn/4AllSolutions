import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { createSalary, dislikeSalary, getsalary, likeSalary } from '../controllers/salary.controller.js';

const router = express.Router();

router.post('/createSalary' , verifyToken , createSalary);
router.get('/getSalary' , getsalary);
router.put('/likeSalary/:salaryId' , verifyToken , likeSalary);                  // api to check whether a person has liked the post earlier or not , if not increase the like otherwise no
router.put('/dislikeSalary/:salaryId' , verifyToken , dislikeSalary);  

export default router;