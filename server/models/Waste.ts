import { pool } from "../db";

export class WasteModel {
  static async getAll() {
    const [rows] = await pool.query("SELECT * FROM waste_management ORDER BY created_at DESC");
    return rows;
  }

  static async create(data: { user_id: number, month: string, year: number, plastic_kg: number, organic_kg: number, paper_kg: number, e_waste_kg: number, recycled_kg: number }) {
    const { user_id, month, year, plastic_kg, organic_kg, paper_kg, e_waste_kg, recycled_kg } = data;
    const [result]: any = await pool.query(
      "INSERT INTO waste_management (user_id, month, year, plastic_kg, organic_kg, paper_kg, e_waste_kg, recycled_kg) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [user_id, month, year, plastic_kg, organic_kg, paper_kg, e_waste_kg, recycled_kg]
    );
    return result;
  }
}
