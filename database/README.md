# Database Files

This directory contains all database-related files for the Client Management System.

## Files Overview

### 📋 `mysql-schema.sql`
- **Purpose**: Complete MySQL database schema definition
- **Contains**: Table structures, indexes, views, and sample data
- **Usage**: Run this file to create your database structure
- **Command**: `mysql -u username -p < mysql-schema.sql`

### 🔍 `mysql-queries.sql`
- **Purpose**: Collection of useful SQL queries for data management
- **Contains**: CRUD operations, reports, maintenance queries
- **Usage**: Reference file for common database operations
- **Categories**: 
  - Client queries
  - Meeting queries  
  - Reporting queries
  - Maintenance queries

### 📖 `DATABASE_SETUP.md`
- **Purpose**: Complete setup guide and documentation
- **Contains**: Step-by-step setup instructions, common operations, integration tips
- **Usage**: Follow this guide to set up and maintain your database

## Quick Setup

1. Create database: `CREATE DATABASE client_management;`
2. Run schema: `mysql -u username -p client_management < mysql-schema.sql`
3. Verify setup: `mysql -u username -p -e "USE client_management; SHOW TABLES;"`

## Integration with Angular

Your Angular app will connect to this MySQL database through a backend API (Node.js/Express recommended). The services in your Angular app will make HTTP calls to your API endpoints instead of using local arrays.
