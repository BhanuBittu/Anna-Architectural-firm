# Client Management System for Anna's Architectural Firm

A comprehensive Angular-based web application designed to help Anna's Architectural Firm manage clients, projects, and meeting schedules effectively.

## 🏗️ Project Overview

This Client Management System is developed by Henna Solutions to streamline Anna's architectural business operations. The application provides a modern, responsive interface for managing:

- **Client Information**: Complete client profiles with contact details, project types, and status tracking
- **Meeting Scheduling**: Advanced meeting management with calendar integration and client association
- **Project Tracking**: Project status monitoring and progress tracking
- **Dashboard Analytics**: Real-time insights and key performance indicators

## ✨ Features

### 🎯 Dashboard
- **Real-time Statistics**: Total clients, active projects, upcoming meetings
- **Quick Overview**: Recent clients and upcoming meetings at a glance
- **Visual Indicators**: Status badges and progress indicators
- **Quick Actions**: Fast access to common tasks

### 👥 Client Management
- **Complete Client Profiles**: Name, company, contact information, project type
- **Status Tracking**: Active, Prospect, Inactive client classification
- **Search & Filter**: Advanced filtering by status, project type, and search terms
- **CRUD Operations**: Add, edit, delete, and view client information
- **Responsive Cards**: Modern card-based layout with hover effects

### 📅 Meeting Management
- **Meeting Scheduling**: Schedule meetings with specific clients and project associations
- **Multiple Meeting Types**: Consultation, Project Review, Presentation, Site Visit, Follow-up
- **Status Management**: Scheduled, Completed, Cancelled, Rescheduled
- **Visual Calendar**: Date-based organization with clear visual indicators
- **Meeting Details**: Location, duration, description, and notes
- **Past Meeting Tracking**: Historical meeting records with completion status

### 🎨 Design Features
- **Professional UI**: Clean, modern interface suitable for architectural firm
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Intuitive Navigation**: Clear menu structure and breadcrumb navigation
- **Visual Feedback**: Loading states, success messages, and error handling
- **Accessibility**: WCAG compliant design with proper contrast and keyboard navigation

## 🛠️ Technology Stack

### Frontend Framework
- **Angular 17**: Latest version with standalone components
- **TypeScript**: Type-safe development with modern ES features
- **RxJS**: Reactive programming for data management
- **Angular Router**: Client-side routing with lazy loading

### Styling & UI
- **Custom CSS**: Modern CSS Grid and Flexbox layouts
- **CSS Variables**: Consistent theming and color management
- **Responsive Design**: Mobile-first approach with breakpoints
- **CSS Animations**: Smooth transitions and hover effects

### Data Management
- **Services Pattern**: Centralized data management with Angular services
- **BehaviorSubject**: Reactive data streams for real-time updates
- **Local Storage**: Client-side data persistence (can be extended to backend)
- **TypeScript Interfaces**: Strong typing for data models

## 📁 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── dashboard/
│   │   │   └── dashboard.component.ts
│   │   ├── client/
│   │   │   └── client-list.component.ts
│   │   └── meeting/
│   │       └── meeting-list.component.ts
│   ├── models/
│   │   ├── client.model.ts
│   │   └── meeting.model.ts
│   ├── services/
│   │   ├── client.service.ts
│   │   └── meeting.service.ts
│   ├── app.component.ts
│   ├── app.routes.ts
│   └── main.ts
├── assets/
├── styles.css
└── index.html
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Angular CLI (v17 or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd client-management-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   ng serve
   ```

4. **Open in browser**
   Navigate to `http://localhost:4200`

### Building for Production

```bash
ng build --prod
```

The build artifacts will be stored in the `dist/` directory.

## 💾 Database Schema

### Clients Table
- `id`: Unique identifier
- `name`: Client full name
- `email`: Contact email address
- `phone`: Phone number
- `company`: Company name
- `address`: Physical address
- `city`: City location
- `state`: State/Province
- `zipCode`: Postal code
- `projectType`: Residential, Commercial, Industrial, Mixed Use
- `status`: active, prospect, inactive
- `createdDate`: Registration date
- `lastContact`: Last interaction date
- `notes`: Additional information

### Meetings Table
- `id`: Unique identifier
- `clientId`: Reference to client
- `clientName`: Client name (denormalized)
- `title`: Meeting title
- `description`: Meeting details
- `date`: Meeting date
- `time`: Meeting time
- `duration`: Duration in minutes
- `location`: Meeting location
- `type`: consultation, project-review, presentation, site-visit, follow-up
- `status`: scheduled, completed, cancelled, rescheduled
- `notes`: Meeting notes
- `createdDate`: Creation timestamp

## 🔧 Configuration

### Environment Variables
Create environment files for different deployment stages:

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

### Angular Configuration
The `angular.json` file contains build and serve configurations for different environments.

## 📱 Responsive Breakpoints

- **Mobile**: < 480px
- **Tablet**: 480px - 768px
- **Desktop**: > 768px

The application uses CSS Grid and Flexbox for responsive layouts that adapt to different screen sizes.

## 🙏 Acknowledgments

- Anna's Architectural Firm for project requirements and feedback
- Angular team for the excellent framework
- Open source community for various libraries and tools used

---

**Built with ❤️ by Henna Solutions for Anna's Architectural Firm**
