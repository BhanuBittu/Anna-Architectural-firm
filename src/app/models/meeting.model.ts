export interface Meeting {
  id: number;
  clientId: number;
  clientName: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  duration: number; // in minutes
  location: string;
  type: 'consultation' | 'project-review' | 'presentation' | 'site-visit' | 'follow-up';
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  notes?: string;
  createdDate: Date;
}

export interface Project {
  id: number;
  clientId: number;
  name: string;
  description: string;
  type: 'Residential' | 'Commercial' | 'Industrial' | 'Mixed Use';
  status: 'planning' | 'in-progress' | 'on-hold' | 'completed' | 'cancelled';
  budget: number;
  startDate: Date;
  endDate?: Date;
  estimatedCompletion: Date;
  progress: number; // 0-100
  createdDate: Date;
}
