import express from 'express';
import { buyCourses, createCourse, deleteCourse, getCourses, getSingleCourse, updateCourse } from '../controllers/course.controller.js';
import userMiddleware from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/adminMiddleware.js';

const router = express.Router();

router.post('/create',isAdmin, createCourse)
router.put('/update/:id', isAdmin, updateCourse)
router.delete('/delete/:id', isAdmin, deleteCourse)
router.get('/courses', getCourses)
router.get('/:id', getSingleCourse)
router.post('/buy/:courseId', userMiddleware, buyCourses)

export default router;