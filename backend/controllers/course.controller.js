import Course from "../models/course.model.js";
import { v2 as cloudinary } from "cloudinary";

export const createCourse = async (req, res) => {
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
      return res
        .status(400)
        .json({
          message: "Invalid image format. Only PNG and JPG are allowed",
        });
    }

    const uploadResult = await cloudinary.uploader.upload(image.tempFilePath)
    if(!uploadResult || uploadResult.error){
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
