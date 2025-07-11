import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

function userMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ errors: "No token provided" });
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.userId = decoded.id;

    next();
  } catch (error) {
        return res.status(401).json({ errors: "Invalid token or expired" });
  }
}

export default userMiddleware;
