import { Request, Response } from "express";
import { UserModel } from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../middleware/error";

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key_change_this";

export const register = catchAsync(async (req: Request, res: Response) => {
  const { name, email, username, password } = req.body;

  if (!name || !email || !username || !password) {
    throw new AppError("All fields are required", 400);
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await UserModel.create({
      name, email, username, passwordHash: hashedPassword
    });

    const token = jwt.sign({ id: result.insertId, username }, JWT_SECRET, { expiresIn: "24h" });
    res.status(201).json({ 
      message: "User registered successfully", 
      token, 
      user: { id: result.insertId, name, username, email, role: 'Student' } 
    });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new AppError("Username or Email already exists", 400);
    }
    throw error;
  }
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new AppError("Username and password are required", 400);
  }

  const user = await UserModel.findByUsername(username);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError("Invalid username or password", 401);
  }

  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "24h" });
  res.json({ 
    message: "Login successful", 
    token, 
    user: { id: user.id, name: user.name, username: user.username, email: user.email, role: user.role } 
  });
});
