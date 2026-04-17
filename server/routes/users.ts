import { RequestHandler } from "express";
import { pool } from "../db";

export const handleGetUsers: RequestHandler = async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT id, name, email, role, created_at FROM users");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const handlePostUser: RequestHandler = async (req, res) => {
  const { name, email, role } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  try {
    await pool.query(
      "INSERT INTO users (name, email, role) VALUES (?, ?, ?)",
      [name, email, role || 'user']
    );
    res.status(201).json({ message: "User created successfully" });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: "Email already exists" });
    }
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
