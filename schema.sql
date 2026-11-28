CREATE DATABASE IF NOT EXISTS portfolio_db;
USE portfolio_db;

CREATE TABLE IF NOT EXISTS inquiries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_name VARCHAR(120) NOT NULL,
    client_email VARCHAR(150) NOT NULL,
    client_phone VARCHAR(30),
    package_selected VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('New', 'Contacted', 'Completed') DEFAULT 'New',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    category ENUM('web', 'frontend', 'java') NOT NULL,
    badge VARCHAR(60) DEFAULT 'Featured',
    description TEXT NOT NULL,
    tech_stack VARCHAR(255) NOT NULL,
    live_url VARCHAR(255),
    repo_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO projects (title, category, badge, description, tech_stack, live_url, repo_url) VALUES
('AuraNet Digital', 'web', 'Live on Vercel', 'Modern corporate digital agency & AI solutions web platform with interactive service workflows and responsive dark UI.', 'HTML5,CSS3,JavaScript,Node.js', 'https://aura-net-digital-modern-web-solutio.vercel.app/', 'https://github.com/mohdsartaj786/-Aura-net-Digital-.git'),
('Travel Bharat', 'web', 'Tourism Platform', 'Cultural tourism and destination discovery web application featuring curated Indian travel circuits and interactive booking UI.', 'HTML5,CSS3,JavaScript,Express', '', 'https://github.com/mohdsartaj786/TravelBharat.git'),
('PIXORA', 'frontend', 'Creative Gallery', 'High-contrast visual showcase and creative media gallery engineered with responsive CSS Grid and smooth transitions.', 'HTML5,CSS Grid,JavaScript', '', 'https://github.com/mohdsartaj786/PIXORA.git'),
('ReWear', 'frontend', 'E-Commerce UI', 'Multi-page dark-mode peer-to-peer clothing exchange and sustainable fashion marketplace frontend built in pure Vanilla JS.', 'HTML5,CSS3,Vanilla JS', '', ''),
('FoodRush', 'frontend', 'Ordering Web App', 'Interactive food delivery web interface featuring dynamic menu filtering, live cart counter, and WhatsApp order checkout.', 'HTML5,CSS3,JavaScript', '', ''),
('Railway Reservation System', 'java', 'BCA Minor Project', 'Full-featured desktop ticket booking, PNR lookup, and train route management system built with Core Java, Swing, JDBC & MySQL.', 'Core Java,Java Swing,JDBC,MySQL', '', '');
