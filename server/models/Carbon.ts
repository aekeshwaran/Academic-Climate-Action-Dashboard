import { pool } from "../db";

export class CarbonModel {
  static async getAll() {
    const [rows] = await pool.query("SELECT * FROM carbon_emissions ORDER BY created_at DESC");
    return rows;
  }

  static async create(data: { source: string, emission_tons: number, month: string, year: number, building_name?: string }) {
    const { source, emission_tons, month, year, building_name } = data;
    const [result]: any = await pool.query(
      `INSERT INTO carbon_emissions (source, emission_tons, month, year, building_name) VALUES (?, ?, ?, ?, ?)`,
      [source, emission_tons, month, year, building_name || 'Campus']
    );
    return result;
  }

  static async getTotals() {
    const [rows]: any = await pool.query(`
      SELECT month, year, SUM(emission_tons) as total_emissions 
      FROM carbon_emissions 
      GROUP BY year, month 
      ORDER BY year DESC, month DESC
    `);
    return rows;
  }

  static async getTrends() {
    const [rows]: any = await pool.query(`
      SELECT month, year, source, SUM(emission_tons) as emission_tons 
      FROM carbon_emissions 
      GROUP BY year, month, source 
      ORDER BY year ASC, month ASC
    `);
    return rows;
  }
}
