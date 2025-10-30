import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  { 
    path: 'clients', 
    loadComponent: () => import('./components/client/client-list.component').then(m => m.ClientListComponent)
  },
  { 
    path: 'meetings', 
    loadComponent: () => import('./components/meeting/meeting-list.component').then(m => m.MeetingListComponent)
  }
];
