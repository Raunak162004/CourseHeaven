import Course from "../models/course.model.js";
import Purchase from "../models/purchase.model.js";
import { v2 as cloudinary } from "cloudinary";

export const createCourse = async (req, res) => {

  const adminId = req.user.id
  if(!adminId){
    return res.status(400).json({
      message: "adminId not found"
    })
  }

  const { title, description, price } = req.body;
  try {
    if (!title || !description || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const { image } = req.files;
    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }

    const allowedFormat = ["image/png", "image/jpeg"];
    if (!allowedFormat.includes(image.mimetype)) {
      return res.status(400).json({
        message: "Invalid image format. Only PNG and JPG are allowed",
      });
    }

    const uploadResult = await cloudinary.uploader.upload(image.tempFilePath);
    if (!uploadResult || uploadResult.error) {
      return res.status(500).json({ message: "Image upload failed" });
    }

    console.log(uploadResult);

    const courseData = {
      title,
      description,
      price,
      image: {
        public_id: uploadResult.public_id,
        url: uploadResult.secure_url,
      },
      createrId: adminId
    };

    const course = await Course.create(courseData);

    if (!course) {
      return res.status(400).json({ message: "Course creation failed" });
    }

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course,
    });
  } catch (err) {
    console.error("Error creating course:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

export const updateCourse = async (req, res) => {

  const adminId = req.user.id;

  const { id } = req.params;

  try {
    const updatedCourse = await Course.findByIdAndUpdate(
      { _id: id, createrId: adminId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course: updatedCourse,
    });
  } catch (e) {
    console.error("Error updating course:", e);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: e.message,
    });
  }
};

export const deleteCourse = async (req, res) => {

  const adminId = req.user.id

  const id = req.params.id;
  try {
    const deletedCourse = await Course.findByIdAndDelete({ _id: id, createrId: adminId });
    if (!deletedCourse) {
      return res.status(404).json({ message: "Course not found or you must be admin to delete a course" });
    }
    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
      course: deletedCourse,
    });
  } catch (err) {
    console.error("Error deleting course:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    if (!courses || courses.length === 0) {
      return res.status(404).json({ message: "No courses found" });
    }
    res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      courses,
    });
  } catch (err) {
    console.error("Error fetching courses:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

export const getSingleCourse = async (req, res) => {
  const id = req.params.id;
  try {
    const course = await Course.findOne({ _id: id });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json({
      success: true,
      message: "Course fetched successfully",
      course,
    });
  } catch (err) {
    console.error("Error fetching course:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

export const buyCourses = async (req, res) => {
  const { userId } = req;
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ errors: "Course not found" });
    }
    const existingPurchase = await Purchase.findOne({ userId, courseId });
    if (existingPurchase) {
      return res
        .status(400)
        .json({ errors: "User has already purchased this course" });
    }

    // stripe payment code goes here!!
    // const amount = course.price;
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: amount,
    //   currency: "usd",
    //   payment_method_types: ["card"],
    // });

    res.status(201).json({
      message: "Course purchased successfully",
      course,
      // clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ errors: "Error in course buying" });
    console.log("error in course buying ", error);
  }
};
