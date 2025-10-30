import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Client } from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private clients: Client[] = [];

  private clientsSubject = new BehaviorSubject<Client[]>(this.clients);

  getClients(): Observable<Client[]> {
    return this.clientsSubject.asObservable();
  }

  getClientById(id: number): Client | undefined {
    return this.clients.find(client => client.id === id);
  }

  addClient(client: Omit<Client, 'id'>): void {
    const newClient: Client = {
      ...client,
      id: this.clients.length > 0 ? Math.max(...this.clients.map(c => c.id)) + 1 : 1
    };
    this.clients.push(newClient);
    this.clientsSubject.next([...this.clients]);
  }

  updateClient(updatedClient: Client): void {
    const index = this.clients.findIndex(c => c.id === updatedClient.id);
    if (index !== -1) {
      this.clients[index] = updatedClient;
      this.clientsSubject.next([...this.clients]);
    }
  }

  deleteClient(id: number): void {
    this.clients = this.clients.filter(c => c.id !== id);
    this.clientsSubject.next([...this.clients]);
  }

  searchClients(query: string): Client[] {
    const lowercaseQuery = query.toLowerCase();
    return this.clients.filter(client =>
      client.name.toLowerCase().includes(lowercaseQuery) ||
      client.company.toLowerCase().includes(lowercaseQuery) ||
      client.email.toLowerCase().includes(lowercaseQuery) ||
      client.projectType.toLowerCase().includes(lowercaseQuery)
    );
  }

  getClientsByStatus(status: Client['status']): Client[] {
    return this.clients.filter(client => client.status === status);
  }
}
