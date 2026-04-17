import mysql from "mysql2/promise";
import "dotenv/config";

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "aekeshwaran8",
  database: process.env.DB_NAME || "climate_dashboard",
};

export const pool = mysql.createPool(dbConfig);

export async function initializeDatabase() {
  try {
    // Connect without database first to create it if it doesn't exist
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    await connection.end();

    console.log(`Database "${dbConfig.database}" ensured.`);

    // Now use the pool to create tables
    const tableQueries = [
      `CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS buildings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS energy_usage (
        id INT AUTO_INCREMENT PRIMARY KEY,
        building_name VARCHAR(255),
        electricity_kwh FLOAT,
        solar_kwh FLOAT,
        savings_percentage FLOAT,
        month VARCHAR(50),
        year INT,
        user_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )`,
      `CREATE TABLE IF NOT EXISTS water_management (
        id INT AUTO_INCREMENT PRIMARY KEY,
        building_name VARCHAR(255),
        daily_consumption_liters FLOAT,
        rainwater_harvested_liters FLOAT,
        groundwater_used_liters FLOAT,
        leak_detected BOOLEAN,
        date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS carbon_emissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        building_name VARCHAR(255),
        source VARCHAR(255),
        emission_tons FLOAT,
        month VARCHAR(50),
        year INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS waste_management (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        month VARCHAR(50),
        year INT,
        plastic_kg FLOAT,
        organic_kg FLOAT,
        paper_kg FLOAT,
        e_waste_kg FLOAT,
        recycled_kg FLOAT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )`,
      `CREATE TABLE IF NOT EXISTS tree_plantation (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255),
        user_id INT,
        trees_planted INT,
        date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )`,
      `CREATE TABLE IF NOT EXISTS sustainability_programs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        participants INT DEFAULT 0,
        impact_score INT DEFAULT 0,
        type VARCHAR(100),
        status VARCHAR(50),
        user_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )`,
      `CREATE TABLE IF NOT EXISTS green_events (
         id INT AUTO_INCREMENT PRIMARY KEY,
         title VARCHAR(255),
         participants_count INT,
         user_id INT,
         date DATE,
         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
         FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )`,
      `CREATE TABLE IF NOT EXISTS research_projects (
         id INT AUTO_INCREMENT PRIMARY KEY,
         title VARCHAR(255),
         lead_faculty_id INT,
         type VARCHAR(100),
         sdg VARCHAR(100),
         funding FLOAT,
         status VARCHAR(50) DEFAULT 'active',
         year INT,
         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
         FOREIGN KEY (lead_faculty_id) REFERENCES users(id) ON DELETE CASCADE
      )`,
      `CREATE TABLE IF NOT EXISTS sustainability_scores (
         id INT AUTO_INCREMENT PRIMARY KEY,
         score FLOAT,
         energy_subscore FLOAT,
         carbon_subscore FLOAT,
         water_subscore FLOAT,
         waste_subscore FLOAT,
         period_month INT,
         period_year INT,
         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS sustainability_reports (
         id INT AUTO_INCREMENT PRIMARY KEY,
         report_name VARCHAR(255),
         data JSON,
         generated_by INT,
         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
         FOREIGN KEY (generated_by) REFERENCES users(id) ON DELETE CASCADE
      )`,
      `CREATE TABLE IF NOT EXISTS ai_insights (
         id INT AUTO_INCREMENT PRIMARY KEY,
         type VARCHAR(100),
         message TEXT NOT NULL,
         impact_level ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
         action_suggested TEXT,
         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`
    ];

    for (const query of tableQueries) {
      await pool.query(query);
    }

    // Explicit alters for safe upgrades
    try { await pool.query("ALTER TABLE research_projects ADD COLUMN type VARCHAR(100), ADD COLUMN sdg VARCHAR(100), ADD COLUMN funding FLOAT, ADD COLUMN status VARCHAR(50) DEFAULT 'active', ADD COLUMN year INT"); } catch (e) {}

    // Performance Optimization: Create Indexes for faster querying
    const indexQueries = [
      `CREATE INDEX idx_energy_usage_my ON energy_usage (month, year)`,
      `CREATE INDEX idx_energy_usage_building ON energy_usage (building_name)`,
      `CREATE INDEX idx_energy_usage_created ON energy_usage (created_at)`,
      `CREATE INDEX idx_carbon_emissions_my ON carbon_emissions (month, year)`,
      `CREATE INDEX idx_carbon_emissions_building ON carbon_emissions (building_name)`,
      `CREATE INDEX idx_water_management_date ON water_management (date)`,
      `CREATE INDEX idx_water_management_building ON water_management (building_name)`,
      `CREATE INDEX idx_waste_management_my ON waste_management (month, year)`,
      `CREATE INDEX idx_tree_plantation_date ON tree_plantation (date)`,
      `CREATE INDEX idx_research_projects_faculty ON research_projects (lead_faculty_id)`,
      `CREATE INDEX idx_research_projects_year ON research_projects (year)`,
      `CREATE INDEX idx_buildings_name ON buildings (name)`,
      `CREATE INDEX idx_sustainability_scores_period ON sustainability_scores (period_month, period_year)`
    ];

    for (const iquery of indexQueries) {
      try { await pool.query(iquery); } catch (e) { /* Ignore index already exists error */ }
    }

    console.log("MySQL Tables and Indexes initialized successfully.");
  } catch (error) {
    console.error("Error initializing MySQL database:", error);
    throw error;
  }
}
