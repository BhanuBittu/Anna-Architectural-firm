-- ====================================
-- CLIENT MANAGEMENT SYSTEM - SQL QUERIES
-- ====================================
-- Useful queries for managing clients and meetings data

-- ====================================
-- CLIENT QUERIES
-- ====================================

-- 1. View all clients in table format
SELECT 
    id,
    name,
    email, 
    phone,
    company,
    CONCAT(city, ', ', state) as location,
    project_type,
    status,
    DATE_FORMAT(created_date, '%Y-%m-%d') as created_date,
    DATE_FORMAT(last_contact, '%Y-%m-%d') as last_contact
FROM clients
ORDER BY created_date DESC;

-- 2. View active clients only
SELECT 
    id,
    name,
    company,
    email,
    phone,
    project_type,
    DATE_FORMAT(last_contact, '%Y-%m-%d %H:%i') as last_contact
FROM clients 
WHERE status = 'active'
ORDER BY last_contact DESC;

-- 3. Client summary with meeting counts
SELECT * FROM client_summary ORDER BY total_meetings DESC;

-- 4. Search clients by name or company
SELECT 
    id,
    name,
    company,
    email,
    project_type,
    status
FROM clients 
WHERE name LIKE '%search_term%' 
   OR company LIKE '%search_term%'
   OR email LIKE '%search_term%'
ORDER BY name;

-- 5. Insert new client
INSERT INTO clients (name, email, phone, company, address, city, state, zip_code, project_type, status, notes)
VALUES ('Client Name', 'email@example.com', '+1-555-0000', 'Company Name', '123 Address St', 'City', 'State', '12345', 'Residential', 'prospect', 'Notes about the client');

-- 6. Update client information
UPDATE clients 
SET 
    phone = '+1-555-9999',
    status = 'active',
    last_contact = CURRENT_TIMESTAMP,
    notes = 'Updated notes'
WHERE id = 1;

-- 7. Delete client (this will also delete all associated meetings due to CASCADE)
DELETE FROM clients WHERE id = 1;

-- ====================================
-- MEETING QUERIES
-- ====================================

-- 8. View all meetings in table format
SELECT 
    m.id,
    m.title,
    m.client_name,
    DATE_FORMAT(m.meeting_date, '%Y-%m-%d') as meeting_date,
    TIME_FORMAT(m.meeting_time, '%H:%i') as meeting_time,
    CONCAT(m.duration, ' min') as duration,
    m.location,
    m.meeting_type,
    m.status,
    DATE_FORMAT(m.created_date, '%Y-%m-%d') as scheduled_on
FROM meetings m
ORDER BY m.meeting_date DESC, m.meeting_time DESC;

-- 9. View upcoming meetings only
SELECT * FROM upcoming_meetings;

-- 10. View today's meetings
SELECT * FROM todays_meetings;

-- 11. View meetings by client
SELECT 
    m.id,
    m.title,
    DATE_FORMAT(m.meeting_date, '%Y-%m-%d') as meeting_date,
    TIME_FORMAT(m.meeting_time, '%H:%i') as meeting_time,
    m.duration,
    m.location,
    m.meeting_type,
    m.status
FROM meetings m
WHERE m.client_id = 1  -- Replace with actual client ID
ORDER BY m.meeting_date DESC;

-- 12. View meetings by date range
SELECT 
    m.id,
    m.title,
    m.client_name,
    DATE_FORMAT(m.meeting_date, '%Y-%m-%d') as meeting_date,
    TIME_FORMAT(m.meeting_time, '%H:%i') as meeting_time,
    m.location,
    m.meeting_type,
    m.status
FROM meetings m
WHERE m.meeting_date BETWEEN '2024-11-01' AND '2024-11-30'
ORDER BY m.meeting_date, m.meeting_time;

-- 13. Insert new meeting
INSERT INTO meetings (client_id, client_name, title, description, meeting_date, meeting_time, duration, location, meeting_type, status)
VALUES (1, 'John Smith', 'Project Planning Meeting', 'Discuss project timeline and requirements', '2024-11-20', '10:00:00', 60, 'Office Conference Room', 'consultation', 'scheduled');

-- 14. Update meeting
UPDATE meetings 
SET 
    meeting_date = '2024-11-21',
    meeting_time = '11:00:00',
    location = 'Client Office',
    status = 'rescheduled'
WHERE id = 1;

-- 15. Mark meeting as completed
UPDATE meetings 
SET 
    status = 'completed',
    notes = 'Meeting completed successfully. Next steps discussed.'
WHERE id = 1;

-- 16. Cancel meeting
UPDATE meetings 
SET 
    status = 'cancelled',
    notes = 'Meeting cancelled due to client request.'
WHERE id = 1;

-- 17. Delete meeting
DELETE FROM meetings WHERE id = 1;

-- ====================================
-- REPORTING QUERIES
-- ====================================

-- 18. Monthly meeting report
SELECT 
    DATE_FORMAT(meeting_date, '%Y-%m') as month,
    COUNT(*) as total_meetings,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_meetings,
    COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_meetings,
    COUNT(CASE WHEN status = 'scheduled' THEN 1 END) as scheduled_meetings
FROM meetings
GROUP BY DATE_FORMAT(meeting_date, '%Y-%m')
ORDER BY month DESC;

-- 19. Client activity report
SELECT 
    c.name,
    c.company,
    c.status,
    COUNT(m.id) as total_meetings,
    MAX(m.meeting_date) as last_meeting,
    COUNT(CASE WHEN m.meeting_date >= CURDATE() AND m.status = 'scheduled' THEN 1 END) as upcoming_meetings
FROM clients c
LEFT JOIN meetings m ON c.id = m.client_id
GROUP BY c.id, c.name, c.company, c.status
ORDER BY total_meetings DESC;

-- 20. Meeting type distribution
SELECT 
    meeting_type,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM meetings), 2) as percentage
FROM meetings
GROUP BY meeting_type
ORDER BY count DESC;

-- 21. Weekly schedule view
SELECT 
    DAYNAME(meeting_date) as day_of_week,
    DATE_FORMAT(meeting_date, '%Y-%m-%d') as date,
    TIME_FORMAT(meeting_time, '%H:%i') as time,
    title,
    client_name,
    duration,
    location,
    meeting_type
FROM meetings
WHERE meeting_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)
    AND status = 'scheduled'
ORDER BY meeting_date, meeting_time;

-- ====================================
-- MAINTENANCE QUERIES
-- ====================================

-- 22. Update client's last contact when meeting is completed
UPDATE clients c
SET last_contact = (
    SELECT MAX(meeting_date) 
    FROM meetings m 
    WHERE m.client_id = c.id AND m.status = 'completed'
)
WHERE EXISTS (
    SELECT 1 FROM meetings m 
    WHERE m.client_id = c.id AND m.status = 'completed'
);

-- 23. Clean up old cancelled meetings (older than 6 months)
DELETE FROM meetings 
WHERE status = 'cancelled' 
AND meeting_date < DATE_SUB(CURDATE(), INTERVAL 6 MONTH);

-- 24. Find clients with no recent activity
SELECT 
    id,
    name,
    email,
    company,
    status,
    DATE_FORMAT(last_contact, '%Y-%m-%d') as last_contact
FROM clients
WHERE last_contact < DATE_SUB(CURDATE(), INTERVAL 90 DAY)
   OR last_contact IS NULL
ORDER BY last_contact ASC;

-- 25. Database statistics
SELECT 
    'Total Clients' as metric,
    COUNT(*) as value
FROM clients
UNION ALL
SELECT 
    'Active Clients' as metric,
    COUNT(*) as value
FROM clients WHERE status = 'active'
UNION ALL
SELECT 
    'Total Meetings' as metric,
    COUNT(*) as value
FROM meetings
UNION ALL
SELECT 
    'Upcoming Meetings' as metric,
    COUNT(*) as value
FROM meetings WHERE meeting_date >= CURDATE() AND status = 'scheduled';
