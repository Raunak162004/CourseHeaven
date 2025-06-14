import User from '../models/user.model.js';
import {z} from 'zod';
import bcrypt from 'bcryptjs';

export const signup = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    // Validate input using zod
    const userSchema = z.object({
        firstName: z.string().min(1, "First name is required"),
        lastName: z.string().min(1, "Last name is required"),
        email: z.string().email("Invalid email format"),
        password: z.string().min(6, "Password must be at least 6 characters long")
    });

    const validateData = userSchema.safeParse(req.body);
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
        const existingUser = await User.findOne({email})
        if(existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        //hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        req.body.password = hashedPassword;

        const newUser = await User.create(req.body);

        if(!newUser) {
            return res.status(500).json({
                success: false,
                message: "User creation failed"
            });
        }

        return res.status(201).json({
            success: true,
            message: "User created successfully",
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
