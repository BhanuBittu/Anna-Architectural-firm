# MySQL Database Setup Guide for Client Management System

## Prerequisites
1. MySQL Server installed and running
2. MySQL Workbench or command-line access
3. Administrative privileges to create databases

## Setup Steps

### 1. Create the Database
```bash
# Connect to MySQL
mysql -u root -p

# Or use your MySQL credentials
mysql -u your_username -p
```

### 2. Execute the Schema
```sql
-- Run the entire mysql-schema.sql file
source /path/to/your/mysql-schema.sql;

-- Or copy and paste the contents from mysql-schema.sql
```

### 3. Verify Installation
```sql
-- Check if database was created
SHOW DATABASES;

-- Use the database
USE client_management;

-- Check tables
SHOW TABLES;

-- Verify table structure
DESCRIBE clients;
DESCRIBE meetings;
```

## Common Table Operations

### View All Data in Table Format

#### View All Clients
```sql
SELECT 
    id,
    name,
    email, 
    phone,
    company,
    CONCAT(city, ', ', state) as location,
    project_type,
    status,
    DATE_FORMAT(created_date, '%Y-%m-%d') as created_date
FROM clients
ORDER BY created_date DESC;
```

#### View All Meetings
```sql
SELECT 
    m.id,
    m.title,
    m.client_name,
    DATE_FORMAT(m.meeting_date, '%Y-%m-%d') as meeting_date,
    TIME_FORMAT(m.meeting_time, '%H:%i') as meeting_time,
    CONCAT(m.duration, ' min') as duration,
    m.location,
    m.meeting_type,
    m.status
FROM meetings m
ORDER BY m.meeting_date DESC, m.meeting_time DESC;
```

#### View Data Using Pre-built Views
```sql
-- Client summary with meeting counts
SELECT * FROM client_summary;

-- Upcoming meetings
SELECT * FROM upcoming_meetings;

-- Today's meetings
SELECT * FROM todays_meetings;
```

## Adding Data from Your Angular App

### Add a New Client
```sql
INSERT INTO clients (name, email, phone, company, address, city, state, zip_code, project_type, status, notes)
VALUES ('Jane Doe', 'jane.doe@example.com', '+1-555-1234', 'Doe Enterprises', '456 Main St', 'Austin', 'TX', '78701', 'Commercial', 'active', 'New commercial project');
```

### Add a New Meeting
```sql
INSERT INTO meetings (client_id, client_name, title, description, meeting_date, meeting_time, duration, location, meeting_type, status)
VALUES (1, 'Jane Doe', 'Initial Consultation', 'Discuss project requirements', '2024-12-01', '10:00:00', 60, 'Office Conference Room', 'consultation', 'scheduled');
```

## Useful Reports

### Monthly Meeting Summary
```sql
SELECT 
    DATE_FORMAT(meeting_date, '%Y-%m') as month,
    COUNT(*) as total_meetings,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
    COUNT(CASE WHEN status = 'scheduled' THEN 1 END) as scheduled
FROM meetings
GROUP BY DATE_FORMAT(meeting_date, '%Y-%m')
ORDER BY month DESC;
```

### Client Activity Report
```sql
SELECT 
    c.name,
    c.company,
    c.status,
    COUNT(m.id) as total_meetings,
    MAX(m.meeting_date) as last_meeting
FROM clients c
LEFT JOIN meetings m ON c.id = m.client_id
GROUP BY c.id, c.name, c.company, c.status
ORDER BY total_meetings DESC;
```

## Integration with Angular App

To connect your Angular app to MySQL, you'll need:

1. **Backend API** (Node.js/Express recommended)
   - Install: `npm install express mysql2 cors`
   - Create REST endpoints for CRUD operations

2. **Example Node.js Server Structure**:
   ```
   server/
   ├── app.js
   ├── routes/
   │   ├── clients.js
   │   └── meetings.js
   └── config/
       └── database.js
   ```

3. **Update Angular Services** to call HTTP endpoints instead of using local arrays

## Backup and Maintenance

### Create Backup
```sql
mysqldump -u username -p client_management > backup_client_management.sql
```

### Restore Backup
```sql
mysql -u username -p client_management < backup_client_management.sql
```

### Regular Maintenance
```sql
-- Clean up old cancelled meetings
DELETE FROM meetings 
WHERE status = 'cancelled' 
AND meeting_date < DATE_SUB(CURDATE(), INTERVAL 6 MONTH);

-- Update client last contact dates
UPDATE clients c
SET last_contact = (
    SELECT MAX(meeting_date) 
    FROM meetings m 
    WHERE m.client_id = c.id AND m.status = 'completed'
)
WHERE EXISTS (SELECT 1 FROM meetings m WHERE m.client_id = c.id AND m.status = 'completed');
```

## Quick Reference

- **All Clients**: `SELECT * FROM clients;`
- **All Meetings**: `SELECT * FROM meetings;`
- **Upcoming Meetings**: `SELECT * FROM upcoming_meetings;`
- **Client Summary**: `SELECT * FROM client_summary;`
- **Today's Schedule**: `SELECT * FROM todays_meetings;`
