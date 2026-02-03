import { User, UserRole, Appointment, TimeSlot, Service } from '../types';
import { MOCK_TIME_SLOTS, SERVICES } from '../constants';

// Simulating network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class ApiService {
  // --- Auth ---
  
  async login(email: string, password: string): Promise<User> {
    await delay(800); // Simulate server processing
    
    // In a real app, hash verification happens on server.
    if (email === 'admin@dombarbieri.com' && password === 'admin') {
      return {
        id: 'u_admin',
        name: 'Admin User',
        email,
        role: UserRole.ADMIN,
        loyaltyPoints: 0,
        hasOnboarded: true,
        avatarUrl: 'https://picsum.photos/100/100?random=99'
      };
    }

    return {
      id: 'u_123',
      name: 'John Doe',
      email,
      role: UserRole.CLIENT,
      loyaltyPoints: 150,
      hasOnboarded: false, // Set to false to trigger onboarding flow for demo
      avatarUrl: 'https://picsum.photos/100/100?random=88'
    };
  }

  async completeOnboarding(userId: string): Promise<void> {
    await delay(500);
    console.log(`[Server] User ${userId} completed onboarding.`);
  }

  // --- Booking ---

  async getAvailableSlots(date: string, barberId: string): Promise<TimeSlot[]> {
    await delay(600);
    // Logic: In real backend, query DB for overlapping appointments.
    // Mock: Randomly disable some slots
    return MOCK_TIME_SLOTS.map(time => ({
      time,
      available: Math.random() > 0.3 // 70% chance of being available
    }));
  }

  async createAppointment(appointment: Omit<Appointment, 'id' | 'status'>): Promise<Appointment> {
    await delay(1200); // Simulate transaction
    
    // Server-Side Validation: Check if service exists and matches price
    const service = SERVICES.find(s => s.id === appointment.serviceId);
    if (!service) {
      throw new Error("Invalid Service ID");
    }
    
    // In real app, we would validate availability again here to prevent race conditions
    
    const newAppointment: Appointment = {
      ...appointment,
      id: `apt_${Date.now()}`,
      status: 'CONFIRMED'
    };
    
    // Trigger Webhook Logic (Mock)
    // IMPORTANT: API K eys for WhatsApp would be used here, safely on the server
    console.log('[Server] Validating transaction...');
    console.log(`[Server] Dispatching confirmation for ${service.name} to WhatsApp webhook.`);
    
    return newAppointment;
  }

  async getAppointments(userId: string): Promise<Appointment[]> {
    await delay(600);
    return []; // Return empty for demo
  }
}

export const api = new ApiService();