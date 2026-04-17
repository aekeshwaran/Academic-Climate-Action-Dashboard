-- ==========================================================
-- ACADEMIC CLIMATE ACTION DASHBOARD: DATABASE SCHEMA
-- Purpose: Institutional Sustainability & SDG-13 Monitoring
-- ==========================================================

CREATE DATABASE IF NOT EXISTS `climate_dashboard` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `climate_dashboard`;

-- 1. USERS & ACCESS CONTROL
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('Admin', 'Faculty', 'Student') DEFAULT 'Student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. ENERGY CONSUMPTION DATA
CREATE TABLE IF NOT EXISTS energy_usage (
  id INT AUTO_INCREMENT PRIMARY KEY,
  building_name VARCHAR(255) NOT NULL,
  electricity_kwh DECIMAL(12,2) DEFAULT 0,
  solar_kwh DECIMAL(12,2) DEFAULT 0,
  savings_percentage DECIMAL(5,2) DEFAULT 0,
  month VARCHAR(50) NOT NULL,
  year INT NOT NULL,
  user_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX (building_name),
  INDEX (month, year)
);

-- 3. WATER MANAGEMENT
CREATE TABLE IF NOT EXISTS water_management (
  id INT AUTO_INCREMENT PRIMARY KEY,
  building_name VARCHAR(255) NOT NULL,
  daily_consumption_liters DECIMAL(15,2) DEFAULT 0,
  rainwater_harvested_liters DECIMAL(15,2) DEFAULT 0,
  groundwater_used_liters DECIMAL(15,2) DEFAULT 0,
  leak_detected BOOLEAN DEFAULT FALSE,
  log_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (building_name),
  INDEX (log_date)
);

-- 4. WASTE MANAGEMENT
CREATE TABLE IF NOT EXISTS waste_management (
  id INT AUTO_INCREMENT PRIMARY KEY,
  month VARCHAR(50) NOT NULL,
  year INT NOT NULL,
  plastic_kg DECIMAL(10,2) DEFAULT 0,
  organic_kg DECIMAL(10,2) DEFAULT 0,
  paper_kg DECIMAL(10,2) DEFAULT 0,
  e_waste_kg DECIMAL(10,2) DEFAULT 0,
  recycled_kg DECIMAL(10,2) DEFAULT 0,
  user_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX (month, year)
);

-- 5. CARBON EMISSIONS
CREATE TABLE IF NOT EXISTS carbon_emissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  building_name VARCHAR(255) DEFAULT 'Campus Wide',
  source VARCHAR(255) NOT NULL,
  emission_tons DECIMAL(10,4) DEFAULT 0,
  month VARCHAR(50) NOT NULL,
  year INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (source),
  INDEX (month, year)
);

-- 6. SUSTAINABILITY ACTIVITIES
CREATE TABLE IF NOT EXISTS sustainability_activities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category ENUM('Tree Plantation', 'Workshop', 'Campaign', 'Seminar') NOT NULL,
  participants_count INT DEFAULT 0,
  metric_value INT DEFAULT 0,
  activity_date DATE NOT NULL,
  user_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX (category),
  INDEX (activity_date)
);
