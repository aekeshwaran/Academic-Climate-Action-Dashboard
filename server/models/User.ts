import { pool } from "../db";

export class UserModel {
  static async findByUsername(username: string) {
    const [rows]: any = await pool.query("SELECT * FROM users WHERE username = ?", [username]);
    return rows[0];
  }

  static async create(data: { name: string, email: string, username: string, passwordHash: string }) {
    const { name, email, username, passwordHash } = data;
    const [result]: any = await pool.query(
      "INSERT INTO users (name, email, username, password) VALUES (?, ?, ?, ?)",
      [name, email, username, passwordHash]
    );
    return result;
  }
}
