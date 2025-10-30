-- ====================================
-- CLIENT MANAGEMENT SYSTEM - MySQL Schema
-- ====================================
-- Created for Anna's Architectural Firm
-- This schema provides tables for managing clients and meetings

-- Create database
CREATE DATABASE IF NOT EXISTS client_management;
USE client_management;

-- ====================================
-- CLIENTS TABLE
-- ====================================
CREATE TABLE clients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    company VARCHAR(255),
    address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    project_type ENUM('Residential', 'Commercial', 'Mixed Use', 'Industrial') DEFAULT 'Residential',
    status ENUM('active', 'prospect', 'inactive', 'completed') DEFAULT 'prospect',
    notes TEXT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_contact TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes for performance
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_project_type (project_type),
    INDEX idx_company (company),
    INDEX idx_created_date (created_date)
);

-- ====================================
-- MEETINGS TABLE
-- ====================================
CREATE TABLE meetings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    client_id INT NOT NULL,
    client_name VARCHAR(255) NOT NULL, -- Denormalized for easier queries
    title VARCHAR(255) NOT NULL,
    description TEXT,
    meeting_date DATE NOT NULL,
    meeting_time TIME NOT NULL,
    duration INT DEFAULT 60 COMMENT 'Duration in minutes',
    location VARCHAR(255),
    meeting_type ENUM('consultation', 'project-review', 'presentation', 'site-visit', 'follow-up') DEFAULT 'consultation',
    status ENUM('scheduled', 'completed', 'cancelled', 'rescheduled') DEFAULT 'scheduled',
    notes TEXT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key constraint
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE ON UPDATE CASCADE,
    
    -- Indexes for performance
    INDEX idx_client_id (client_id),
    INDEX idx_meeting_date (meeting_date),
    INDEX idx_status (status),
    INDEX idx_meeting_type (meeting_type),
    INDEX idx_client_name (client_name),
    INDEX idx_datetime (meeting_date, meeting_time)
);

-- ====================================
-- USEFUL VIEWS
-- ====================================

-- Client Summary View
CREATE VIEW client_summary AS
SELECT 
    c.id,
    c.name,
    c.email,
    c.phone,
    c.company,
    c.city,
    c.state,
    c.project_type,
    c.status,
    c.created_date,
    c.last_contact,
    COUNT(m.id) as total_meetings,
    COUNT(CASE WHEN m.status = 'scheduled' AND m.meeting_date >= CURDATE() THEN 1 END) as upcoming_meetings,
    COUNT(CASE WHEN m.status = 'completed' THEN 1 END) as completed_meetings,
    MAX(m.meeting_date) as last_meeting_date
FROM clients c
LEFT JOIN meetings m ON c.id = m.client_id
GROUP BY c.id, c.name, c.email, c.phone, c.company, c.city, c.state, c.project_type, c.status, c.created_date, c.last_contact;

-- Upcoming Meetings View
CREATE VIEW upcoming_meetings AS
SELECT 
    m.id,
    m.title,
    m.meeting_date,
    m.meeting_time,
    m.duration,
    m.location,
    m.meeting_type,
    m.status,
    m.client_name,
    c.email as client_email,
    c.phone as client_phone,
    c.company as client_company,
    CONCAT(m.meeting_date, ' ', m.meeting_time) as meeting_datetime
FROM meetings m
JOIN clients c ON m.client_id = c.id
WHERE m.meeting_date >= CURDATE()
    AND m.status = 'scheduled'
ORDER BY m.meeting_date ASC, m.meeting_time ASC;

-- Today's Meetings View
CREATE VIEW todays_meetings AS
SELECT 
    m.id,
    m.title,
    m.meeting_time,
    m.duration,
    m.location,
    m.meeting_type,
    m.client_name,
    c.email as client_email,
    c.phone as client_phone
FROM meetings m
JOIN clients c ON m.client_id = c.id
WHERE m.meeting_date = CURDATE()
    AND m.status = 'scheduled'
ORDER BY m.meeting_time ASC;

-- ====================================
-- SAMPLE DATA INSERTION QUERIES
-- ====================================

-- Insert sample clients
INSERT INTO clients (name, email, phone, company, address, city, state, zip_code, project_type, status, notes) VALUES
('John Smith', 'john.smith@email.com', '+1-555-0101', 'Smith Enterprises', '123 Main St', 'Austin', 'TX', '78701', 'Residential', 'active', 'Looking for modern home design with sustainable features'),
('Sarah Johnson', 'sarah.j@johnsoncorp.com', '+1-555-0102', 'Johnson Corp', '456 Oak Ave', 'Austin', 'TX', '78702', 'Commercial', 'active', 'Office building renovation project - 50,000 sq ft'),
('Mike Davis', 'mike.davis@davisholdings.com', '+1-555-0103', 'Davis Holdings', '789 Pine St', 'Austin', 'TX', '78703', 'Mixed Use', 'prospect', 'Interested in mixed-use development downtown');

-- Insert sample meetings
INSERT INTO meetings (client_id, client_name, title, description, meeting_date, meeting_time, duration, location, meeting_type, status) VALUES
(1, 'John Smith', 'Initial Consultation', 'Discuss project requirements and timeline for residential design', '2024-11-05', '10:00:00', 60, 'Office - Conference Room A', 'consultation', 'scheduled'),
(2, 'Sarah Johnson', 'Project Review Meeting', 'Review initial commercial building designs and get client feedback', '2024-11-08', '14:00:00', 90, 'Client Site - Johnson Corp', 'project-review', 'scheduled'),
(3, 'Mike Davis', 'Follow-up Discussion', 'Follow up on mixed-use development proposal', '2024-11-15', '11:00:00', 45, 'Virtual Meeting', 'follow-up', 'scheduled');
