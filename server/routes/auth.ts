import { RequestHandler } from "express";
import { pool } from "../db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key_change_this";

export const handleRegister: RequestHandler = async (req, res) => {
  const { name, email, username, password } = req.body;

  if (!name || !email || !username || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result]: any = await pool.query(
      "INSERT INTO users (name, email, username, password) VALUES (?, ?, ?, ?)",
      [name, email, username, hashedPassword]
    );

    const token = jwt.sign({ id: result.insertId, username }, JWT_SECRET, { expiresIn: "24h" });
    res.status(201).json({ 
      message: "User registered successfully", 
      token, 
      user: { id: result.insertId, name, username, email, role: 'Student' } 
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: "Username or Email already exists" });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const handleLogin: RequestHandler = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  try {
    const [rows]: any = await pool.query("SELECT * FROM users WHERE username = ?", [username]);
    const user = rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "24h" });
    res.json({ 
      message: "Login successful", 
      token, 
      user: { id: user.id, name: user.name, username: user.username, email: user.email, role: user.role } 
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
