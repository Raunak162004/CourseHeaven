import express from 'express';
import { buyCourses, createCourse, deleteCourse, getCourses, getSingleCourse, updateCourse } from '../controllers/course.controller.js';
import { isLoggedIn } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create', createCourse)
router.put('/update/:id', updateCourse)
router.delete('/delete/:id', deleteCourse)
router.get('/courses', getCourses)
router.get('/:id', getSingleCourse)
router.post('/buy/:id', isLoggedIn, buyCourses)

export default router;