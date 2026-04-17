import { pool } from "../db";

export class EnergyModel {
  static async getAll() {
    const [rows] = await pool.query("SELECT * FROM energy_usage ORDER BY created_at DESC");
    return rows;
  }

  static async create(data: { building_name: string, electricity_kwh: number, solar_kwh: number, savings_percentage: number, month: string, year: number, user_id: number }) {
    const { building_name, electricity_kwh, solar_kwh, savings_percentage, month, year, user_id } = data;
    const [result]: any = await pool.query(
      `INSERT INTO energy_usage 
       (building_name, electricity_kwh, solar_kwh, savings_percentage, month, year, user_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [building_name, electricity_kwh, solar_kwh, savings_percentage, month, year, user_id]
    );
    return result;
  }

  static async getSummary() {
    const [rows]: any = await pool.query(`
      SELECT 
        SUM(electricity_kwh) as total_electricity, 
        SUM(solar_kwh) as total_solar 
      FROM energy_usage
    `);
    return rows[0];
  }

  static async getBuildings() {
    const [rows]: any = await pool.query(`
      SELECT 
        building_name as name, 
        SUM(electricity_kwh) as electricity, 
        SUM(solar_kwh) as solar
      FROM energy_usage
      GROUP BY building_name
    `);
    return rows;
  }
}
