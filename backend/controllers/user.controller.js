import User from "../models/user.model.js";
import Course from "../models/course.model.js";
import Purchase from "../models/purchase.model.js";
import { z } from "zod";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// export const signup = async (req, res) => {
//     const { firstName, lastName, email, password } = req.body;

//     // Validate input using zod
//     const userSchema = z.object({
//         firstName: z.string().min(1, {message: "firstName riquires 3 characters"}),
//         lastName: z.string().min(1, {message: "Lastname must be 3 char long"}),
//         email: z.string().email("Invalid email format"),
//         password: z.string().min(6, {message: "Password must be at least 6 characters long"})
//     });

//     const validateData = userSchema.safeParse(req.body);
//     if (!validateData.success) {
//         return res.status(400).json({
//             success: false,
//             message: "Validation failed",
//             errors: validateData.error.errors.map(err => err.message)
//         });
//     }

//     if(!firstName || !lastName || !email || !password) {
//         return res.status(400).json({
//             success: false,
//             message: "All fields are required"
//         });
//     }

//     try{
//         const existingUser = await User.findOne({email})
//         if(existingUser) {
//             return res.status(400).json({
//                 success: false,
//                 message: "User already exists",
//             });
//         }

//         //hash the password
//         const hashedPassword = await bcrypt.hash(password, 10);
//         req.body.password = hashedPassword;

//         const newUser = await User.create(req.body);

//         if(!newUser) {
//             return res.status(500).json({
//                 success: false,
//                 message: "User creation failed"
//             });
//         }

//         return res.status(201).json({
//             success: true,
//             message: "User created successfully",
//         });
//     }catch(e){
//         console.error("Error creating user:", e);
//         return res.status(500).json({
//             success: false,
//             message: "Internal server error",
//             error: e.message
//         });
//     }
// }

export const signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const userSchema = z.object({
    firstName: z
      .string()
      .min(3, { message: "firstName must be atleast 3 char long" }),
    lastName: z
      .string()
      .min(3, { message: "lastName must be atleast 3 char long" }),
    email: z.string().email(),
    password: z
      .string()
      .min(6, { message: "password must be atleast 6 char long" }),
  });

  const validatedData = userSchema.safeParse(req.body);
  if (!validatedData.success) {
    return res
      .status(400)
      .json({ errors: validatedData.error.issues.map((err) => err.message) });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ errors: "User already exists" });
    }
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({ message: "Signup succeedded", newUser });
  } catch (error) {
    res.status(500).json({ errors: "Error in signup" });
    console.log("Error in signup", error);
  }
};

// export const login = async (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password) {
//     return res.status(400).json({
//       success: false,
//       message: "Email and password are required",
//     });
//   }

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid password",
//       });
//     }

//     // Generate JWT token
//     const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "1d",
//     });

//     const cookieOption = {
//       secure: process.env.NODE_ENV === "production", // true for https only
//       httpOnly: true,
//       maxAge: 24 * 60 * 60 * 1000, // 1 day
//       sameSite: "strict", // protect us from CSRF attacks
//     };
//     // Set token in cookies
//     res.cookie("token", token, cookieOption);

//     res.status(200).json({
//       success: true,
//       message: "Login successful",
//     });
//   } catch (err) {
//     console.error("Error logging in user:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: err.message,
//     });
//   }
// };

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(403).json({ errors: "Invalid credentials" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(403).json({ errors: "Invalid credentials" });
    }

    // jwt code
    const token = JWT.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    const cookieOptions = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
      httpOnly: true, //  can't be accsed via js directly
      secure: false, // true for https only
    };
    res.cookie("jwt", token, cookieOptions);
    res.status(201).json({ message: "Login successful", user, token });
  } catch (error) {
    res.status(500).json({ errors: "Error in login" });
    console.log("error in login", error);
  }
};

export const logout = async (req, res) => {
  try {
    if (!req.cookies.token) {
      return res.status(401).json({
        message: "Kindly login first",
      });
    }
    res.clearCookie("token");
    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (err) {
    console.error("Error logging out user:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

export const purchases = async (req, res) => {
  const userId = req.userId;

  try {
    const purchased = await Purchase.find({ userId });

    let purchasedCourseId = [];

    for (let i = 0; i < purchased.length; i++) {
      purchasedCourseId.push(purchased[i].courseId);
    }
    const courseData = await Course.find({
      _id: { $in: purchasedCourseId },
    });

    res.status(200).json({ purchased, courseData });
  } catch (error) {
    res.status(500).json({ errors: "Error in purchases" });
    console.log("Error in purchase", error);
  }
};
