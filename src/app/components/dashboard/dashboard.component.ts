import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { MeetingService } from '../../services/meeting.service';
import { Client } from '../../models/client.model';
import { Meeting } from '../../models/meeting.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard">
      <div class="dashboard-header">
        <h2>Dashboard Overview</h2>
        <p class="dashboard-subtitle">Welcome to Anna's Architectural Firm Client Management System</p>
      </div>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <h3>Total Clients</h3>
            <div class="stat-number">{{ totalClients }}</div>
            <div class="stat-label">All clients</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🟢</div>
          <div class="stat-content">
            <h3>Active Clients</h3>
            <div class="stat-number">{{ activeClients }}</div>
            <div class="stat-label">Currently active</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📅</div>
          <div class="stat-content">
            <h3>Upcoming Meetings</h3>
            <div class="stat-number">{{ upcomingMeetings.length }}</div>
            <div class="stat-label">Next 30 days</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🏗️</div>
          <div class="stat-content">
            <h3>Active Projects</h3>
            <div class="stat-number">{{ activeClients }}</div>
            <div class="stat-label">In progress</div>
          </div>
        </div>
      </div>

      <div class="dashboard-sections">
        <div class="section">
          <div class="section-header">
            <h3>📅 Upcoming Meetings</h3>
            <a routerLink="/meetings" class="view-all-link">View All</a>
          </div>
          
          <div class="meeting-list" *ngIf="upcomingMeetings.length > 0; else noMeetings">
            <div class="meeting-card" *ngFor="let meeting of upcomingMeetings.slice(0, 5)">
              <div class="meeting-date">
                <div class="date-day">{{ meeting.date | date:'dd' }}</div>
                <div class="date-month">{{ meeting.date | date:'MMM' }}</div>
              </div>
              <div class="meeting-info">
                <h4>{{ meeting.title }}</h4>
                <div class="meeting-details">
                  <div class="detail-item">
                    <span class="detail-icon">👤</span>
                    {{ meeting.clientName }}
                  </div>
                  <div class="detail-item">
                    <span class="detail-icon">🕒</span>
                    {{ meeting.time }} ({{ meeting.duration }}min)
                  </div>
                  <div class="detail-item">
                    <span class="detail-icon">📍</span>
                    {{ meeting.location }}
                  </div>
                </div>
              </div>
              <div class="meeting-type" [class]="'type-' + meeting.type">
                {{ meeting.type | titlecase }}
              </div>
            </div>
          </div>
          
          <ng-template #noMeetings>
            <div class="empty-state">
              <div class="empty-icon">📅</div>
              <p>No upcoming meetings scheduled</p>
              <a routerLink="/meetings" class="btn btn-primary">Schedule Meeting</a>
            </div>
          </ng-template>
        </div>

        <div class="section">
          <div class="section-header">
            <h3>👥 Recent Clients</h3>
            <a routerLink="/clients" class="view-all-link">View All</a>
          </div>
          
          <div class="client-list" *ngIf="recentClients.length > 0; else noClients">
            <div class="client-card" *ngFor="let client of recentClients.slice(0, 5)">
              <div class="client-avatar">
                {{ client.name.charAt(0).toUpperCase() }}
              </div>
              <div class="client-info">
                <h4>{{ client.name }}</h4>
                <div class="client-details">
                  <div class="detail-item">
                    <span class="detail-icon">🏢</span>
                    {{ client.company }}
                  </div>
                  <div class="detail-item">
                    <span class="detail-icon">🏗️</span>
                    {{ client.projectType }}
                  </div>
                  <div class="detail-item">
                    <span class="detail-icon">📞</span>
                    {{ client.phone }}
                  </div>
                </div>
              </div>
              <div class="client-status" [class]="'status-' + client.status">
                <span class="status-dot"></span>
                {{ client.status | titlecase }}
              </div>
            </div>
          </div>
          
          <ng-template #noClients>
            <div class="empty-state">
              <div class="empty-icon">👥</div>
              <p>No clients found</p>
              <a routerLink="/clients" class="btn btn-primary">Add Client</a>
            </div>
          </ng-template>
        </div>
      </div>

      <div class="quick-actions">
        <h3>Quick Actions</h3>
        <div class="action-buttons">
          <a routerLink="/clients" class="action-btn">
            <span class="action-icon">➕</span>
            <span class="action-text">Add New Client</span>
          </a>
          <a routerLink="/meetings" class="action-btn">
            <span class="action-icon">📅</span>
            <span class="action-text">Schedule Meeting</span>
          </a>
          <a routerLink="/clients" class="action-btn">
            <span class="action-icon">👥</span>
            <span class="action-text">View All Clients</span>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      max-width: 1200px;
      margin: 0 auto;
    }

    .dashboard-header {
      margin-bottom: 2rem;
      text-align: center;
    }

    .dashboard-header h2 {
      margin: 0 0 0.5rem 0;
      color: #2c3e50;
      font-size: 2rem;
      font-weight: 700;
    }

    .dashboard-subtitle {
      color: #666;
      font-size: 1.1rem;
      margin: 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2.5rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.1);
    }

    .stat-icon {
      font-size: 2.5rem;
      opacity: 0.8;
    }

    .stat-content h3 {
      margin: 0 0 0.25rem 0;
      color: #666;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 500;
    }

    .stat-number {
      font-size: 2.25rem;
      font-weight: 700;
      color: #2c3e50;
      line-height: 1;
      margin-bottom: 0.25rem;
    }

    .stat-label {
      font-size: 0.85rem;
      color: #888;
    }

    .dashboard-sections {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin-bottom: 2.5rem;
    }

    .section {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
      overflow: hidden;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem 1.5rem 1rem 1.5rem;
      border-bottom: 1px solid #f0f0f0;
    }

    .section-header h3 {
      margin: 0;
      color: #2c3e50;
      font-size: 1.1rem;
      font-weight: 600;
    }

    .view-all-link {
      color: #3498db;
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      transition: color 0.2s ease;
    }

    .view-all-link:hover {
      color: #2980b9;
    }

    .meeting-card, .client-card {
      display: flex;
      align-items: center;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid #f0f0f0;
      transition: background-color 0.2s ease;
    }

    .meeting-card:hover, .client-card:hover {
      background-color: #f8f9fa;
    }

    .meeting-card:last-child, .client-card:last-child {
      border-bottom: none;
    }

    .meeting-date {
      background: linear-gradient(135deg, #3498db, #2980b9);
      color: white;
      border-radius: 8px;
      padding: 0.75rem;
      text-align: center;
      margin-right: 1rem;
      min-width: 60px;
    }

    .date-day {
      font-size: 1.5rem;
      font-weight: 700;
      line-height: 1;
    }

    .date-month {
      font-size: 0.8rem;
      opacity: 0.9;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .meeting-info, .client-info {
      flex: 1;
    }

    .meeting-info h4, .client-info h4 {
      margin: 0 0 0.5rem 0;
      color: #2c3e50;
      font-size: 1rem;
      font-weight: 600;
    }

    .meeting-details, .client-details {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      color: #666;
    }

    .detail-icon {
      font-size: 0.9rem;
      opacity: 0.7;
    }

    .meeting-type {
      padding: 0.4rem 0.8rem;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 500;
      text-transform: capitalize;
      margin-left: 1rem;
    }

    .type-consultation {
      background-color: #e8f5e8;
      color: #27ae60;
    }

    .type-project-review {
      background-color: #e3f2fd;
      color: #2196f3;
    }

    .type-presentation {
      background-color: #fff8e1;
      color: #ff8f00;
    }

    .type-site-visit {
      background-color: #f3e5f5;
      color: #9c27b0;
    }

    .type-follow-up {
      background-color: #fce4ec;
      color: #e91e63;
    }

    .client-avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 1.2rem;
      margin-right: 1rem;
    }

    .client-status {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.4rem 0.8rem;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 500;
      margin-left: 1rem;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .status-active {
      background-color: #e8f5e8;
      color: #27ae60;
    }

    .status-active .status-dot {
      background-color: #27ae60;
    }

    .status-prospect {
      background-color: #fff3e0;
      color: #ff9800;
    }

    .status-prospect .status-dot {
      background-color: #ff9800;
    }

    .status-inactive {
      background-color: #fce4ec;
      color: #e91e63;
    }

    .status-inactive .status-dot {
      background-color: #e91e63;
    }

    .empty-state {
      text-align: center;
      padding: 3rem 1.5rem;
    }

    .empty-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      opacity: 0.6;
    }

    .empty-state p {
      color: #666;
      margin-bottom: 1.5rem;
      font-size: 1.1rem;
    }

    .quick-actions {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    }

    .quick-actions h3 {
      margin: 0 0 1.5rem 0;
      color: #2c3e50;
      font-size: 1.2rem;
      font-weight: 600;
      text-align: center;
    }

    .action-buttons {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 1.5rem;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      border: 1px solid #dee2e6;
      border-radius: 8px;
      text-decoration: none;
      color: #495057;
      transition: all 0.2s ease;
    }

    .action-btn:hover {
      background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
      color: white;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
    }

    .action-icon {
      font-size: 1.2rem;
    }

    .action-text {
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .dashboard-sections {
        grid-template-columns: 1fr;
      }
      
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .meeting-details, .client-details {
        display: none;
      }

      .action-buttons {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 480px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }

      .meeting-card, .client-card {
        flex-direction: column;
        text-align: center;
        gap: 1rem;
      }

      .meeting-date, .client-avatar {
        margin-right: 0;
      }

      .meeting-type, .client-status {
        margin-left: 0;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  totalClients = 0;
  activeClients = 0;
  upcomingMeetings: Meeting[] = [];
  recentClients: Client[] = [];

  constructor(
    private clientService: ClientService,
    private meetingService: MeetingService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    // Load clients data
    this.clientService.getClients().subscribe(clients => {
      this.totalClients = clients.length;
      this.activeClients = clients.filter(c => c.status === 'active').length;
      this.recentClients = clients
        .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
    });

    // Load meetings data
    this.meetingService.getMeetings().subscribe(meetings => {
      this.upcomingMeetings = this.meetingService.getUpcomingMeetings();
    });
  }
}
