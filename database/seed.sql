-- Seed Data for Academic Climate Action Dashboard
USE `climate_dashboard`;

-- 1. Admin User (Password: admin123, hashed)
INSERT INTO users (name, email, username, password, role) VALUES 
('System Admin', 'admin@university.edu', 'admin', '$2b$10$wOaA3P7K2JvT2W.Y.5X.9O.uLzU9XF1W2V3U4T5S6R7Q8P9O0N1M2', 'admin');

-- 2. Buildings
INSERT INTO buildings (name, type) VALUES 
('Main Academic Block', 'Academic'),
('Science Research Lab', 'Laboratory'),
('Student Hostel A', 'Hostel'),
('Library & Admin', 'Office'),
('Campus Canteen', 'Service');

-- 3. Energy Usage (Last 3 Months)
INSERT INTO energy_usage (building_name, electricity_kwh, solar_kwh, savings_percentage, month, year, user_id) VALUES 
('Main Academic Block', 5000, 1200, 24, 'January', 2024, 1),
('Science Research Lab', 8500, 500, 5.8, 'January', 2024, 1),
('Student Hostel A', 3000, 1500, 50, 'January', 2024, 1),
('Main Academic Block', 4800, 1100, 22.9, 'February', 2024, 1),
('Science Research Lab', 8200, 600, 7.3, 'February', 2024, 1);

-- 4. Carbon Emissions
INSERT INTO carbon_emissions (building_name, source, emission_tons, month, year) VALUES 
('Campus Wide', 'Electricity', 12.5, 'January', 2024),
('Campus Wide', 'Transport', 4.2, 'January', 2024),
('Campus Wide', 'Diesel Generator', 2.1, 'January', 2024),
('Main Academic Block', 'Electricity', 3.8, 'February', 2024),
('Student Hostel A', 'Electricity', 2.4, 'February', 2024);

-- 5. Water Management
INSERT INTO water_management (building_name, daily_consumption_liters, rainwater_harvested_liters, groundwater_used_liters, leak_detected, date) VALUES 
('Main Academic Block', 12000, 2000, 10000, FALSE, '2024-01-15'),
('Student Hostel A', 25000, 5000, 20000, FALSE, '2024-01-15'),
('Campus Garden', 5000, 3000, 2000, TRUE, '2024-02-10');

-- 6. Waste Management
INSERT INTO waste_management (user_id, month, year, plastic_kg, organic_kg, paper_kg, e_waste_kg, recycled_kg) VALUES 
(1, 'January', 2024, 250, 600, 150, 40, 650),
(1, 'February', 2024, 220, 580, 180, 20, 700);

-- 7. Sustainability Programs
INSERT INTO sustainability_programs (title, description, participants, impact_score, type, status, user_id) VALUES 
('Zero Waste Campaign', 'Awareness drive for students regarding waste segregation.', 450, 85, 'Campaign', 'Completed', 1),
('Solar Panel Workshop', 'Technical session on maintaining campus solar grids.', 120, 70, 'Workshop', 'Active', 1);

-- 8. Tree Plantation
INSERT INTO tree_plantation (title, user_id, trees_planted, date) VALUES 
('Foundation Day Greenery', 1, 200, '2024-01-20'),
('Spring Plantation Drive', 1, 150, '2024-03-05');

-- 9. Initial Scores
INSERT INTO sustainability_scores (score, energy_subscore, carbon_subscore, water_subscore, waste_subscore, period_month, period_year) VALUES 
(78.5, 82, 70, 85, 77, 1, 2024),
(81.2, 84, 72, 88, 81, 2, 2024);
