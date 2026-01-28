export enum UserRole {
  CLIENT = 'CLIENT',
  BARBER = 'BARBER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  role: UserRole;
  loyaltyPoints: number;
  hasOnboarded: boolean;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  imageUrl: string;
}

export interface Barber {
  id: string;
  name: string;
  bio: string;
  avatarUrl: string;
  rating: number;
  specialties: string[];
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface Appointment {
  id: string;
  serviceId: string;
  barberId: string;
  userId: string;
  date: string;
  time: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  date: string;
  imageUrl?: string;
}