import { pool } from "../db";

export class WaterModel {
  static async getAll() {
    const [rows] = await pool.query("SELECT * FROM water_management ORDER BY created_at DESC");
    return rows;
  }

  static async create(data: { building_name: string, daily_consumption_liters: number, rainwater_harvested_liters: number, groundwater_used_liters: number, leak_detected: boolean, date: string }) {
    const { building_name, daily_consumption_liters, rainwater_harvested_liters, groundwater_used_liters, leak_detected, date } = data;
    const [result]: any = await pool.query(
      `INSERT INTO water_management 
       (building_name, daily_consumption_liters, rainwater_harvested_liters, groundwater_used_liters, leak_detected, date) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [building_name, daily_consumption_liters, rainwater_harvested_liters, groundwater_used_liters, leak_detected, date]
    );
    return result;
  }

  static async getSummary() {
    const [rows]: any = await pool.query(`
      SELECT 
        SUM(daily_consumption_liters) as total_consumption, 
        SUM(rainwater_harvested_liters) as total_rainwater,
        SUM(groundwater_used_liters) as total_groundwater
      FROM water_management
    `);
    return rows[0];
  }

  static async getLeaks() {
    const [rows] = await pool.query(`
      SELECT building_name, date, leak_detected 
      FROM water_management 
      WHERE leak_detected = true 
      ORDER BY date DESC
    `);
    return rows;
  }

  static async getTrends() {
    const [rows]: any = await pool.query(`
      SELECT DATE_FORMAT(date, '%Y-%m') as month, SUM(daily_consumption_liters) as consumption 
      FROM water_management 
      GROUP BY DATE_FORMAT(date, '%Y-%m') 
      ORDER BY month ASC
    `);
    return rows;
  }

  static async getBuildings() {
    const [rows]: any = await pool.query(`
      SELECT 
        building_name as name, 
        SUM(daily_consumption_liters) as water
      FROM water_management
      GROUP BY building_name
    `);
    return rows;
  }
}
