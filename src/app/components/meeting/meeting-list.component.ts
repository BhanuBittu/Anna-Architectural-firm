import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MeetingService } from '../../services/meeting.service';
import { ClientService } from '../../services/client.service';
import { Meeting } from '../../models/meeting.model';
import { Client } from '../../models/client.model';

@Component({
  selector: 'app-meeting-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="meeting-management">
      <div class="page-header">
        <h2>Meeting Management</h2>
        <button class="btn btn-primary" (click)="showAddForm = !showAddForm">
          {{ showAddForm ? 'Cancel' : '+ Schedule Meeting' }}
        </button>
      </div>

      <!-- Add Meeting Form -->
      <div class="add-form" *ngIf="showAddForm">
        <div class="card">
          <div class="card-header">
            <h3>Schedule New Meeting</h3>
          </div>
          <div class="card-body">
            <form (ngSubmit)="addMeeting()" #meetingForm="ngForm">
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Client *</label>
                  <select 
                    class="form-control" 
                    [(ngModel)]="newMeeting.clientId" 
                    name="clientId" 
                    (change)="onClientChange()"
                    required>
                    <option value="">Select a client</option>
                    <option *ngFor="let client of clients" [value]="client.id">
                      {{ client.name }} ({{ client.company }})
                    </option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Meeting Type</label>
                  <select class="form-control" [(ngModel)]="newMeeting.type" name="type">
                    <option value="consultation">Consultation</option>
                    <option value="project-review">Project Review</option>
                    <option value="presentation">Presentation</option>
                    <option value="site-visit">Site Visit</option>
                    <option value="follow-up">Follow-up</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Title *</label>
                <input 
                  type="text" 
                  class="form-control" 
                  [(ngModel)]="newMeeting.title" 
                  name="title" 
                  required
                  placeholder="e.g., Initial Project Consultation">
              </div>
              <div class="form-group">
                <label class="form-label">Description</label>
                <textarea 
                  class="form-control" 
                  [(ngModel)]="newMeeting.description" 
                  name="description" 
                  rows="3"
                  placeholder="Meeting agenda and details..."></textarea>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Date *</label>
                  <input 
                    type="date" 
                    class="form-control" 
                    [(ngModel)]="newMeetingDate" 
                    name="date" 
                    required>
                </div>
                <div class="form-group">
                  <label class="form-label">Time *</label>
                  <input 
                    type="time" 
                    class="form-control" 
                    [(ngModel)]="newMeeting.time" 
                    name="time" 
                    required>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Duration (minutes)</label>
                  <input 
                    type="number" 
                    class="form-control" 
                    [(ngModel)]="newMeeting.duration" 
                    name="duration" 
                    min="15" 
                    step="15">
                </div>
                <div class="form-group">
                  <label class="form-label">Location</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    [(ngModel)]="newMeeting.location" 
                    name="location"
                    placeholder="Office, Client site, Virtual, etc.">
                </div>
              </div>
              <div class="form-actions">
                <button type="submit" class="btn btn-success" [disabled]="!meetingForm.form.valid">
                  Schedule Meeting
                </button>
                <button type="button" class="btn btn-secondary" (click)="resetForm()">
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Filter Controls -->
      <div class="filter-controls">
        <div class="filter-group">
          <select class="form-control" [(ngModel)]="statusFilter" (change)="filterMeetings()">
            <option value="">All Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="rescheduled">Rescheduled</option>
          </select>
        </div>
        <div class="filter-group">
          <select class="form-control" [(ngModel)]="typeFilter" (change)="filterMeetings()">
            <option value="">All Types</option>
            <option value="consultation">Consultation</option>
            <option value="project-review">Project Review</option>
            <option value="presentation">Presentation</option>
            <option value="site-visit">Site Visit</option>
            <option value="follow-up">Follow-up</option>
          </select>
        </div>
        <div class="filter-group">
          <input 
            type="text" 
            class="form-control" 
            placeholder="Search meetings..." 
            [(ngModel)]="searchTerm" 
            (input)="filterMeetings()">
        </div>
      </div>

      <!-- Meetings List -->
      <div class="meetings-list" *ngIf="filteredMeetings.length > 0; else noMeetings">
        <div class="meeting-card" *ngFor="let meeting of filteredMeetings" [class.past-meeting]="isPastMeeting(meeting)">
          <div class="meeting-header">
            <div class="meeting-date-badge">
              <div class="date-day">{{ meeting.date | date:'dd' }}</div>
              <div class="date-month">{{ meeting.date | date:'MMM' }}</div>
              <div class="date-year">{{ meeting.date | date:'yyyy' }}</div>
            </div>
            <div class="meeting-main-info">
              <h3>{{ meeting.title }}</h3>
              <div class="meeting-client">
                <span class="client-icon">👤</span>
                {{ meeting.clientName }}
              </div>
            </div>
            <div class="meeting-status-badge">
              <div class="status" [class]="'status-' + meeting.status">
                {{ meeting.status | titlecase }}
              </div>
              <div class="type" [class]="'type-' + meeting.type">
                {{ meeting.type | titlecase }}
              </div>
            </div>
          </div>

          <div class="meeting-details" *ngIf="meeting.description">
            <p>{{ meeting.description }}</p>
          </div>

          <div class="meeting-info-grid">
            <div class="info-item">
              <span class="info-icon">🕒</span>
              <span class="info-label">Time:</span>
              <span class="info-value">{{ meeting.time }} ({{ meeting.duration }}min)</span>
            </div>
            <div class="info-item">
              <span class="info-icon">📍</span>
              <span class="info-label">Location:</span>
              <span class="info-value">{{ meeting.location }}</span>
            </div>
            <div class="info-item" *ngIf="meeting.notes">
              <span class="info-icon">📝</span>
              <span class="info-label">Notes:</span>
              <span class="info-value">{{ meeting.notes }}</span>
            </div>
          </div>

          <div class="meeting-actions">
            <button class="btn btn-sm btn-primary" (click)="editMeeting(meeting)" *ngIf="meeting.status === 'scheduled'">
              Edit
            </button>
            <button class="btn btn-sm btn-success" (click)="markCompleted(meeting)" *ngIf="meeting.status === 'scheduled'">
              Mark Complete
            </button>
            <button class="btn btn-sm btn-warning" (click)="rescheduleMeeting(meeting)" *ngIf="meeting.status === 'scheduled'">
              Reschedule
            </button>
            <button class="btn btn-sm btn-danger" (click)="deleteMeeting(meeting.id)">
              Delete
            </button>
          </div>
        </div>
      </div>

      <ng-template #noMeetings>
        <div class="empty-state">
          <div class="empty-icon">📅</div>
          <h3>No meetings found</h3>
          <p>{{ searchTerm || statusFilter || typeFilter ? 'Try adjusting your search or filter criteria.' : 'Get started by scheduling your first meeting.' }}</p>
          <button class="btn btn-primary" (click)="showAddForm = true" *ngIf="!showAddForm">
            Schedule First Meeting
          </button>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .meeting-management {
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .page-header h2 {
      margin: 0;
      color: #2c3e50;
      font-size: 2rem;
      font-weight: 700;
    }

    .add-form {
      margin-bottom: 2rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    .filter-controls {
      display: grid;
      grid-template-columns: 1fr 1fr 2fr;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .meetings-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .meeting-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
      overflow: hidden;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .meeting-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.1);
    }

    .past-meeting {
      opacity: 0.8;
    }

    .meeting-header {
      display: flex;
      align-items: center;
      padding: 1.5rem;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      border-bottom: 1px solid #dee2e6;
    }

    .meeting-date-badge {
      background: linear-gradient(135deg, #3498db, #2980b9);
      color: white;
      border-radius: 12px;
      padding: 1rem;
      text-align: center;
      margin-right: 1.5rem;
      min-width: 80px;
    }

    .date-day {
      font-size: 1.75rem;
      font-weight: 700;
      line-height: 1;
    }

    .date-month {
      font-size: 0.8rem;
      opacity: 0.9;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .date-year {
      font-size: 0.75rem;
      opacity: 0.8;
    }

    .meeting-main-info {
      flex: 1;
    }

    .meeting-main-info h3 {
      margin: 0 0 0.5rem 0;
      color: #2c3e50;
      font-size: 1.3rem;
      font-weight: 600;
    }

    .meeting-client {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #666;
      font-size: 1rem;
      font-weight: 500;
    }

    .client-icon {
      font-size: 1.1rem;
    }

    .meeting-status-badge {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      align-items: flex-end;
    }

    .status, .type {
      padding: 0.4rem 0.8rem;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 500;
      text-transform: capitalize;
    }

    .status-scheduled {
      background-color: #e8f5e8;
      color: #27ae60;
    }

    .status-completed {
      background-color: #e3f2fd;
      color: #2196f3;
    }

    .status-cancelled {
      background-color: #fce4ec;
      color: #e91e63;
    }

    .status-rescheduled {
      background-color: #fff3e0;
      color: #ff9800;
    }

    .type-consultation {
      background-color: #f3e5f5;
      color: #9c27b0;
    }

    .type-project-review {
      background-color: #e8f5e8;
      color: #4caf50;
    }

    .type-presentation {
      background-color: #fff8e1;
      color: #ff8f00;
    }

    .type-site-visit {
      background-color: #e1f5fe;
      color: #0288d1;
    }

    .type-follow-up {
      background-color: #fce4ec;
      color: #e91e63;
    }

    .meeting-details {
      padding: 1rem 1.5rem;
      background-color: #f8f9fa;
      border-bottom: 1px solid #e9ecef;
    }

    .meeting-details p {
      margin: 0;
      color: #666;
      font-style: italic;
    }

    .meeting-info-grid {
      padding: 1.5rem;
      display: grid;
      gap: 1rem;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .info-icon {
      font-size: 1.1rem;
      opacity: 0.7;
      min-width: 20px;
    }

    .info-label {
      font-weight: 500;
      color: #666;
      min-width: 80px;
    }

    .info-value {
      color: #2c3e50;
      flex: 1;
    }

    .meeting-actions {
      padding: 1rem 1.5rem;
      background-color: #f8f9fa;
      border-top: 1px solid #dee2e6;
      display: flex;
      gap: 0.5rem;
      justify-content: flex-end;
    }

    .btn-sm {
      padding: 0.5rem 1rem;
      font-size: 0.85rem;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      opacity: 0.6;
    }

    .empty-state h3 {
      margin: 0 0 1rem 0;
      color: #2c3e50;
      font-size: 1.5rem;
    }

    .empty-state p {
      color: #666;
      margin-bottom: 2rem;
      font-size: 1.1rem;
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .filter-controls {
        grid-template-columns: 1fr;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .meeting-header {
        flex-direction: column;
        text-align: center;
        gap: 1rem;
      }

      .meeting-date-badge {
        margin-right: 0;
      }

      .meeting-status-badge {
        align-items: center;
      }

      .meeting-actions {
        justify-content: center;
        flex-wrap: wrap;
      }
    }
  `]
})
export class MeetingListComponent implements OnInit {
  meetings: Meeting[] = [];
  filteredMeetings: Meeting[] = [];
  clients: Client[] = [];
  searchTerm = '';
  statusFilter = '';
  typeFilter = '';
  showAddForm = false;
  newMeetingDate = '';
  
  newMeeting: Partial<Meeting> = {
    clientId: 0,
    clientName: '',
    title: '',
    description: '',
    time: '10:00',
    duration: 60,
    location: 'Office',
    type: 'consultation',
    status: 'scheduled'
  };

  constructor(
    private meetingService: MeetingService,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.loadMeetings();
    this.loadClients();
  }

  loadMeetings(): void {
    this.meetingService.getMeetings().subscribe(meetings => {
      this.meetings = meetings.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      this.filteredMeetings = this.meetings;
    });
  }

  loadClients(): void {
    this.clientService.getClients().subscribe(clients => {
      this.clients = clients;
    });
  }

  filterMeetings(): void {
    let filtered = this.meetings;

    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(meeting =>
        meeting.title.toLowerCase().includes(search) ||
        meeting.clientName.toLowerCase().includes(search) ||
        meeting.description.toLowerCase().includes(search) ||
        meeting.location.toLowerCase().includes(search)
      );
    }

    if (this.statusFilter) {
      filtered = filtered.filter(meeting => meeting.status === this.statusFilter);
    }

    if (this.typeFilter) {
      filtered = filtered.filter(meeting => meeting.type === this.typeFilter);
    }

    this.filteredMeetings = filtered;
  }

  onClientChange(): void {
    const selectedClient = this.clients.find(c => c.id === Number(this.newMeeting.clientId));
    if (selectedClient) {
      this.newMeeting.clientName = selectedClient.name;
    }
  }

  addMeeting(): void {
    if (this.newMeeting.title && this.newMeeting.clientId && this.newMeetingDate) {
      const meetingToAdd = {
        ...this.newMeeting,
        date: new Date(this.newMeetingDate),
        createdDate: new Date()
      } as Omit<Meeting, 'id'>;

      this.meetingService.addMeeting(meetingToAdd);
      this.resetForm();
      this.showAddForm = false;
      this.loadMeetings();
    }
  }

  resetForm(): void {
    this.newMeeting = {
      clientId: 0,
      clientName: '',
      title: '',
      description: '',
      time: '10:00',
      duration: 60,
      location: 'Office',
      type: 'consultation',
      status: 'scheduled'
    };
    this.newMeetingDate = '';
  }

  editMeeting(meeting: Meeting): void {
    // For now, just log - in a real app, this would open an edit modal
    console.log('Edit meeting:', meeting);
  }

  markCompleted(meeting: Meeting): void {
    const updatedMeeting = { ...meeting, status: 'completed' as const };
    this.meetingService.updateMeeting(updatedMeeting);
    this.loadMeetings();
  }

  rescheduleMeeting(meeting: Meeting): void {
    const updatedMeeting = { ...meeting, status: 'rescheduled' as const };
    this.meetingService.updateMeeting(updatedMeeting);
    this.loadMeetings();
  }

  deleteMeeting(id: number): void {
    if (confirm('Are you sure you want to delete this meeting?')) {
      this.meetingService.deleteMeeting(id);
      this.loadMeetings();
    }
  }

  isPastMeeting(meeting: Meeting): boolean {
    const today = new Date();
    const meetingDate = new Date(meeting.date);
    return meetingDate < today && meeting.status !== 'completed';
  }
}
