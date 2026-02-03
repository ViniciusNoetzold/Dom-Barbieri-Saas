import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appointment, Service, Barber, Announcement } from '../types';
import { SERVICES as INIT_SERVICES, BARBERS as INIT_BARBERS, ANNOUNCEMENTS as INIT_ANNOUNCEMENTS } from '../constants';

interface DraftBooking {
  serviceId: string;
  barberId: string;
}

interface AppointmentContextType {
  appointments: Appointment[];
  services: Service[];
  barbers: Barber[];
  announcements: Announcement[];
  activeAppointment: Appointment | null;
  history: Appointment[];
  draftBooking: DraftBooking | null;
  
  // Actions
  addAppointment: (apt: Appointment) => void;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  updateAppointmentNotes: (id: string, notes: string) => void;
  setDraftBooking: (draft: DraftBooking | null) => void;
  
  // Data Management (Admin)
  updateService: (service: Service) => void;
  updateBarber: (barber: Barber) => void;
  addAnnouncement: (announcement: Announcement) => void;
  removeAnnouncement: (id: string) => void;
  
  // Getters
  getServiceById: (id: string) => Service | undefined;
  getBarberById: (id: string) => Barber | undefined;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>(INIT_SERVICES);
  const [barbers, setBarbers] = useState<Barber[]>(INIT_BARBERS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INIT_ANNOUNCEMENTS);
  
  const [draftBooking, setDraftBooking] = useState<DraftBooking | null>(null);

  // Mock Initial Data
  useEffect(() => {
    setAppointments([
       {
         id: 'apt_old_1',
         serviceId: 's1',
         barberId: 'b2',
         userId: 'current',
         date: '2023-08-15',
         time: '10:00',
         status: 'COMPLETED',
         notes: 'Cliente gosta do corte mais baixo nas laterais.'
       }
    ]);
  }, []);

  const activeAppointment = appointments.find(a => {
    const aptDate = new Date(a.date + 'T' + a.time);
    const now = new Date();
    // Confirmed appointments in the future or today
    return aptDate >= now && a.status === 'CONFIRMED';
  }) || null;

  const history = appointments
    .filter(a => a.status === 'COMPLETED' || (a.status !== 'CONFIRMED' && a.id !== activeAppointment?.id))
    .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // --- Actions ---

  const addAppointment = (apt: Appointment) => {
    setAppointments(prev => [...prev, apt]);
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const updateAppointmentNotes = (id: string, notes: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, notes } : a));
  };

  // --- Data Management ---

  const updateService = (updatedService: Service) => {
    setServices(prev => prev.map(s => s.id === updatedService.id ? updatedService : s));
  };

  const updateBarber = (updatedBarber: Barber) => {
    setBarbers(prev => prev.map(b => b.id === updatedBarber.id ? updatedBarber : b));
  };

  const addAnnouncement = (ann: Announcement) => {
    setAnnouncements(prev => [ann, ...prev]);
  };

  const removeAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  // --- Getters ---

  const getServiceById = (id: string) => services.find(s => s.id === id);
  const getBarberById = (id: string) => barbers.find(b => b.id === id);

  return (
    <AppointmentContext.Provider value={{
      appointments,
      services,
      barbers,
      announcements,
      activeAppointment,
      history,
      draftBooking,
      addAppointment,
      updateAppointmentStatus,
      updateAppointmentNotes,
      setDraftBooking,
      updateService,
      updateBarber,
      addAnnouncement,
      removeAnnouncement,
      getServiceById,
      getBarberById
    }}>
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (!context) throw new Error("useAppointments must be used within AppointmentProvider");
  return context;
};