import express from 'express';
import { createCourse, deleteCourse, getCourses, getSingleCourse, updateCourse } from '../controllers/course.controller.js';

const router = express.Router();

router.post('/create', createCourse)
router.put('/update/:id', updateCourse)
router.delete('/delete/:id', deleteCourse)
router.get('/courses', getCourses)
router.get('/:id', getSingleCourse)

export default router;