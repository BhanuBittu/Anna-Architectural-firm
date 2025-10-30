export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  projectType: 'Residential' | 'Commercial' | 'Industrial' | 'Mixed Use';
  status: 'active' | 'inactive' | 'prospect';
  createdDate: Date;
  lastContact: Date;
  notes?: string;
}
