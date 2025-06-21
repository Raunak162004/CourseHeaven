import User from '../models/user.model.js';
import {z} from 'zod';
import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';
import Admin from '../models/admin.model.js';
dotenv.config();


export const signup = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    // Validate input using zod
    const adminSchema = z.object({
        firstName: z.string().min(1, "First name is required"),
        lastName: z.string().min(1, "Last name is required"),
        email: z.string().email("Invalid email format"),
        password: z.string().min(6, "Password must be at least 6 characters long")
    });

    const validateData = adminSchema.safeParse(req.body);
    if (!validateData.success) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: validateData.error.errors.map(err => err.message)
        });
    }

    if(!firstName || !lastName || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    try{
        const existingUser = await Admin.findOne({email})
        if(existingUser) {
            return res.status(400).json({
                success: false,
                message: "Admin already exists"
            });
        }

        //hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        req.body.password = hashedPassword;

        const newUser = await Admin.create(req.body);

        if(!newUser) {
            return res.status(500).json({
                success: false,
                message: "Admin creation failed"
            });
        }

        return res.status(201).json({
            success: true,
            message: "Admin created successfully",
        });
    }catch(e){
        console.error("Error creating user:", e);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: e.message
        });
    }
}

export const login = async (req,res) => {
    const {email, password} = req.body;
    if(!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required"
        });
    }

    try{
        const user = await Admin.findOne({email})
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid password"
            });
        }

        // Generate JWT token
        const token = JWT.sign({ id: user._id}, process.env.JWT_SECRET_ADMIN, {expiresIn: '1d'});

        const cookieOption = {
            secure: process.env.NODE_ENV === 'production', // true for https only
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            sameSite: 'strict' // protect us from CSRF attacks 
        }
        // Set token in cookies
        res.cookie("token", token, cookieOption);

        res.status(200).json({
            success: true,
            message: "Login successful",
            user, 
            token
        });
    }catch(err){
        console.error("Error logging in user:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message
        }); 
    }
}

export const logout = async (req,res) => {
    try{
        if(!req.cookies.token){
            return res.status(401).json({
                message: "Kindly login first"
            })
        }
        res.clearCookie("token");
        return res.status(200).json({
            success: true,
            message: "Logout successful"
        });
    }catch(err){
        console.error("Error logging out user:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message
        });
    }
}