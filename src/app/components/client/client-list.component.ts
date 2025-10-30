import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="client-management">
      <div class="page-header">
        <h2>Client Management</h2>
        <button class="btn btn-primary" (click)="showAddForm = !showAddForm">
          {{ showAddForm ? 'Cancel' : '+ Add New Client' }}
        </button>
      </div>

      <!-- Add Client Form -->
      <div class="add-form" *ngIf="showAddForm">
        <div class="card">
          <div class="card-header">
            <h3>Add New Client</h3>
          </div>
          <div class="card-body">
            <form (ngSubmit)="addClient()" #clientForm="ngForm">
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Name *</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    [(ngModel)]="newClient.name" 
                    name="name" 
                    required>
                </div>
                <div class="form-group">
                  <label class="form-label">Email *</label>
                  <input 
                    type="email" 
                    class="form-control" 
                    [(ngModel)]="newClient.email" 
                    name="email" 
                    required>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Phone</label>
                  <input 
                    type="tel" 
                    class="form-control" 
                    [(ngModel)]="newClient.phone" 
                    name="phone">
                </div>
                <div class="form-group">
                  <label class="form-label">Company</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    [(ngModel)]="newClient.company" 
                    name="company">
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">City</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    [(ngModel)]="newClient.city" 
                    name="city">
                </div>
                <div class="form-group">
                  <label class="form-label">State</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    [(ngModel)]="newClient.state" 
                    name="state">
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Project Type</label>
                  <select class="form-control" [(ngModel)]="newClient.projectType" name="projectType">
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Mixed Use">Mixed Use</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Status</label>
                  <select class="form-control" [(ngModel)]="newClient.status" name="status">
                    <option value="prospect">Prospect</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Address</label>
                <textarea 
                  class="form-control" 
                  [(ngModel)]="newClient.address" 
                  name="address" 
                  rows="2"></textarea>
              </div>
              <div class="form-group">
                <label class="form-label">Notes</label>
                <textarea 
                  class="form-control" 
                  [(ngModel)]="newClient.notes" 
                  name="notes" 
                  rows="3" 
                  placeholder="Additional notes about the client..."></textarea>
              </div>
              <div class="form-actions">
                <button type="submit" class="btn btn-success" [disabled]="!clientForm.form.valid">
                  Add Client
                </button>
                <button type="button" class="btn btn-secondary" (click)="resetForm()">
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Search and Filter -->
      <div class="search-filter">
        <div class="search-group">
          <input 
            type="text" 
            class="form-control" 
            placeholder="Search clients..." 
            [(ngModel)]="searchTerm" 
            (input)="filterClients()">
        </div>
        <div class="filter-group">
          <select class="form-control" [(ngModel)]="statusFilter" (change)="filterClients()">
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="prospect">Prospect</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <!-- Clients List -->
      <div class="clients-grid" *ngIf="filteredClients.length > 0; else noClients">
        <div class="client-card" *ngFor="let client of filteredClients">
          <div class="client-header">
            <div class="client-avatar">
              {{ client.name.charAt(0).toUpperCase() }}
            </div>
            <div class="client-basic-info">
              <h3>{{ client.name }}</h3>
              <p>{{ client.company }}</p>
            </div>
            <div class="client-status" [class]="'status-' + client.status">
              {{ client.status | titlecase }}
            </div>
          </div>
          
          <div class="client-details">
            <div class="detail-row">
              <span class="detail-label">📧 Email:</span>
              <span class="detail-value">{{ client.email }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">📞 Phone:</span>
              <span class="detail-value">{{ client.phone }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">🏗️ Project Type:</span>
              <span class="detail-value">{{ client.projectType }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">📍 Location:</span>
              <span class="detail-value">{{ client.city }}, {{ client.state }}</span>
            </div>
            <div class="detail-row" *ngIf="client.notes">
              <span class="detail-label">📝 Notes:</span>
              <span class="detail-value">{{ client.notes }}</span>
            </div>
          </div>

          <div class="client-meta">
            <span class="meta-item">
              Created: {{ client.createdDate | date:'MMM dd, yyyy' }}
            </span>
            <span class="meta-item">
              Last Contact: {{ client.lastContact | date:'MMM dd, yyyy' }}
            </span>
          </div>

          <div class="client-actions">
            <button class="btn btn-sm btn-primary" (click)="editClient(client)">
              Edit
            </button>
            <button class="btn btn-sm btn-danger" (click)="deleteClient(client.id)">
              Delete
            </button>
          </div>
        </div>
      </div>

      <ng-template #noClients>
        <div class="empty-state">
          <div class="empty-icon">👥</div>
          <h3>No clients found</h3>
          <p>{{ searchTerm || statusFilter ? 'Try adjusting your search or filter criteria.' : 'Get started by adding your first client.' }}</p>
          <button class="btn btn-primary" (click)="showAddForm = true" *ngIf="!showAddForm">
            Add First Client
          </button>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .client-management {
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

    .search-filter {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .search-group, .filter-group {
      flex: 1;
    }

    .clients-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 1.5rem;
    }

    .client-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
      overflow: hidden;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .client-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.1);
    }

    .client-header {
      display: flex;
      align-items: center;
      padding: 1.5rem;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      border-bottom: 1px solid #dee2e6;
    }

    .client-avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1.5rem;
      margin-right: 1rem;
    }

    .client-basic-info {
      flex: 1;
    }

    .client-basic-info h3 {
      margin: 0 0 0.25rem 0;
      color: #2c3e50;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .client-basic-info p {
      margin: 0;
      color: #666;
      font-size: 0.95rem;
    }

    .client-status {
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .status-active {
      background-color: #d4edda;
      color: #155724;
    }

    .status-prospect {
      background-color: #fff3cd;
      color: #856404;
    }

    .status-inactive {
      background-color: #f8d7da;
      color: #721c24;
    }

    .client-details {
      padding: 1.5rem;
    }

    .detail-row {
      display: flex;
      margin-bottom: 0.75rem;
      align-items: flex-start;
    }

    .detail-row:last-child {
      margin-bottom: 0;
    }

    .detail-label {
      min-width: 120px;
      font-weight: 500;
      color: #666;
      font-size: 0.9rem;
    }

    .detail-value {
      flex: 1;
      color: #2c3e50;
      font-size: 0.9rem;
      word-break: break-word;
    }

    .client-meta {
      padding: 1rem 1.5rem;
      background-color: #f8f9fa;
      border-top: 1px solid #dee2e6;
      display: flex;
      justify-content: space-between;
      font-size: 0.85rem;
      color: #666;
    }

    .client-actions {
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

      .search-filter {
        flex-direction: column;
      }

      .clients-grid {
        grid-template-columns: 1fr;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .client-header {
        flex-direction: column;
        text-align: center;
        gap: 1rem;
      }

      .client-avatar {
        margin-right: 0;
      }

      .client-meta {
        flex-direction: column;
        gap: 0.5rem;
      }

      .client-actions {
        justify-content: center;
      }
    }
  `]
})
export class ClientListComponent implements OnInit {
  clients: Client[] = [];
  filteredClients: Client[] = [];
  searchTerm = '';
  statusFilter = '';
  showAddForm = false;
  
  newClient: Partial<Client> = {
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    projectType: 'Residential',
    status: 'prospect',
    notes: ''
  };

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.clientService.getClients().subscribe(clients => {
      this.clients = clients;
      this.filteredClients = clients;
    });
  }

  filterClients(): void {
    let filtered = this.clients;

    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(client =>
        client.name.toLowerCase().includes(search) ||
        client.company.toLowerCase().includes(search) ||
        client.email.toLowerCase().includes(search) ||
        client.projectType.toLowerCase().includes(search)
      );
    }

    if (this.statusFilter) {
      filtered = filtered.filter(client => client.status === this.statusFilter);
    }

    this.filteredClients = filtered;
  }

  addClient(): void {
    if (this.newClient.name && this.newClient.email) {
      const clientToAdd = {
        ...this.newClient,
        createdDate: new Date(),
        lastContact: new Date()
      } as Omit<Client, 'id'>;

      this.clientService.addClient(clientToAdd);
      this.resetForm();
      this.showAddForm = false;
      this.loadClients();
    }
  }

  resetForm(): void {
    this.newClient = {
      name: '',
      email: '',
      phone: '',
      company: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      projectType: 'Residential',
      status: 'prospect',
      notes: ''
    };
  }

  editClient(client: Client): void {
    // For now, just log - in a real app, this would open an edit modal
    console.log('Edit client:', client);
  }

  deleteClient(id: number): void {
    if (confirm('Are you sure you want to delete this client?')) {
      this.clientService.deleteClient(id);
      this.loadClients();
    }
  }
}
