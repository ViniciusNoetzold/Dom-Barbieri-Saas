import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Service, Barber, TimeSlot } from '../types';
import { api } from '../services/api';
import { GlassCard, Button, SectionHeader } from '../components/UI';
import { AnimatedList } from '../components/AnimatedList';
import { GlobalHero } from '../components/GlobalHero';
import { AppointmentCard } from '../components/AppointmentCard';
import { useAppointments } from '../context/AppointmentContext';
import { Calendar as CalendarIcon, CheckCircle, X, ChevronLeft, ChevronRight, Clock, History, RotateCcw } from 'lucide-react';
import { PAGE_THEMES } from '../constants';

interface BookingProps {
  user: User;
}

// --- Helper for Calendar ---
const daysOfWeek = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const FullCalendar: React.FC<{ 
    selectedDate: Date, 
    onSelectDate: (d: Date) => void 
}> = ({ selectedDate, onSelectDate }) => {
    const [viewDate, setViewDate] = useState(new Date());

    const changeMonth = (offset: number) => {
        const newDate = new Date(viewDate.setMonth(viewDate.getMonth() + offset));
        setViewDate(new Date(newDate));
    };

    // Calendar Grid Logic
    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const today = new Date();
    today.setHours(0,0,0,0);

    const renderDays = () => {
        const days = [];
        // Empty slots for previous month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-10"></div>);
        }

        for (let d = 1; d <= daysInMonth; d++) {
            const dateToCheck = new Date(year, month, d);
            const isToday = dateToCheck.getTime() === today.getTime();
            const isSelected = dateToCheck.getTime() === selectedDate.getTime();
            const isPast = dateToCheck < today;

            days.push(
                <button
                    key={d}
                    disabled={isPast}
                    onClick={() => onSelectDate(dateToCheck)}
                    className={`
                        h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200
                        ${isSelected ? 'bg-gold-500 text-darkveil-950 shadow-[0_0_15px_rgba(184,146,48,0.4)] scale-110 z-10 font-bold' : ''}
                        ${!isSelected && !isPast ? 'hover:bg-darkveil-900/5 dark:hover:bg-white/10 text-darkveil-900 dark:text-gray-200' : ''}
                        ${isToday && !isSelected ? 'border border-gold-500 text-gold-600 dark:text-gold-400' : ''}
                        ${isPast ? 'text-gray-400 dark:text-gray-700 cursor-not-allowed opacity-30' : ''}
                    `}
                >
                    {d}
                </button>
            );
        }
        return days;
    };

    return (
        <GlassCard className="p-4 mx-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-darkveil-900/5 dark:hover:bg-white/10 rounded"><ChevronLeft className="w-5 h-5 text-gray-500 dark:text-gray-400" /></button>
                <h3 className="text-darkveil-900 dark:text-white font-bold capitalize">{months[month]} <span className="text-gold-600 dark:text-gold-400 ml-1">{year}</span></h3>
                <button onClick={() => changeMonth(1)} className="p-1 hover:bg-darkveil-900/5 dark:hover:bg-white/10 rounded"><ChevronRight className="w-5 h-5 text-gray-500 dark:text-gray-400" /></button>
            </div>
            
            {/* Days Header */}
            <div className="grid grid-cols-7 mb-2 text-center">
                {daysOfWeek.map(day => (
                    <span key={day} className="text-[10px] text-gray-500 font-bold uppercase">{day}</span>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 gap-y-2 place-items-center">
                {renderDays()}
            </div>
        </GlassCard>
    );
};

// --- Main Flow ---

export const BookingFlow: React.FC<BookingProps> = ({ user }) => {
  const { 
    activeAppointment, 
    addAppointment, 
    getServiceById, 
    getBarberById, 
    draftBooking, 
    setDraftBooking,
    services, 
    barbers,
    history 
  } = useAppointments();

  const [view, setView] = useState<'HOME' | 'BARBER' | 'TIME' | 'SUCCESS'>('HOME');
  const [showServiceOverlay, setShowServiceOverlay] = useState(false);
  const [showHistoryOverlay, setShowHistoryOverlay] = useState(false);
  
  // State
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const d = new Date();
    d.setHours(0,0,0,0);
    return d;
  });
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Effects ---
  
  useEffect(() => {
    if (draftBooking && view === 'HOME') {
      const service = services.find(s => s.id === draftBooking.serviceId);
      const barber = barbers.find(b => b.id === draftBooking.barberId);
      
      if (service && barber) {
        setSelectedService(service);
        setSelectedBarber(barber);
        setDraftBooking(null); // Clear draft
        setView('TIME'); // Jump straight to time selection
      }
    }
  }, [draftBooking, view, setDraftBooking, services, barbers]);


  useEffect(() => {
      if (view === 'TIME' && selectedBarber) {
          setLoadingSlots(true);
          const dateString = selectedDate.toISOString().split('T')[0];
          api.getAvailableSlots(dateString, selectedBarber.id)
            .then(slots => setAvailableSlots(slots))
            .finally(() => setLoadingSlots(false));
      }
  }, [view, selectedDate, selectedBarber]);

  // --- Handlers ---
  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setShowServiceOverlay(false);
    setView('BARBER');
  };

  const handleRepeatBooking = (apt: any) => {
    const service = getServiceById(apt.serviceId);
    const barber = getBarberById(apt.barberId);
    if(service && barber) {
        setSelectedService(service);
        setSelectedBarber(barber);
        setShowHistoryOverlay(false);
        setView('TIME');
    }
  };

  const handleConfirm = async () => {
    if (!selectedService || !selectedBarber || !selectedTime) return;
    setIsSubmitting(true);
    try {
      const appointmentData = {
        serviceId: selectedService.id,
        barberId: selectedBarber.id,
        userId: user.id,
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime
      };
      
      const newApt = await api.createAppointment(appointmentData);
      addAppointment(newApt);
      setView('SUCCESS');
    } catch (e) {
      alert("Failed to book: " + e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetFlow = () => {
    setView('HOME');
    setSelectedService(null);
    setSelectedBarber(null);
    setSelectedTime(null);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  // --- Render Views ---

  if (view === 'SUCCESS') {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gold-50 dark:bg-darkveil-950 text-center px-6 transition-colors duration-300">
        <motion.div 
          initial={{ scale: 0 }} animate={{ scale: 1 }} 
          className="w-24 h-24 bg-green-100 border-green-500 dark:bg-green-900/40 border dark:border-green-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-900/30"
        >
          <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
        </motion.div>
        <h2 className="text-3xl font-serif font-bold mb-2 text-darkveil-900 dark:text-gold-100">Confirmado!</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-xs">
          Seu {selectedService?.name} está agendado. Enviamos os detalhes para seu WhatsApp.
        </p>
        <Button onClick={resetFlow} className="w-full max-w-xs">
          Voltar ao Início
        </Button>
      </div>
    );
  }

  const SubPageHeader = ({ title }: { title: string }) => (
    <div className="flex items-center gap-4 mb-6 pt-6 px-4">
      <button 
        onClick={() => {
            if (view === 'TIME') setView('BARBER');
            else if (view === 'BARBER') {
                setView('HOME');
                setSelectedService(null);
            }
        }} 
        className="p-2 rounded-full bg-darkveil-900/5 hover:bg-darkveil-900/10 dark:bg-white/5 dark:hover:bg-white/10"
      >
        <ChevronLeft className="w-5 h-5 text-darkveil-900 dark:text-white" />
      </button>
      <h2 className="text-xl font-bold font-serif text-darkveil-900 dark:text-white">{title}</h2>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-gold-50 dark:bg-darkveil-950 pb-48 transition-colors duration-300">
      
      {/* View: HOME (Landing) */}
      {view === 'HOME' && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
        >
          <GlobalHero 
            title="Bem-vindo à Dom Barbieri" 
            subtitle={`${getGreeting()}, ${user.name.split(' ')[0]}.`}
            backgroundImage={PAGE_THEMES.BOOKING.bgImage}
            titleColor={PAGE_THEMES.BOOKING.titleColor}
            overlayGradient={PAGE_THEMES.BOOKING.overlayColor}
          />
          
          <div className="relative z-30 -mt-16 space-y-6">
             
             {/* 2.1 Active Appointment OR Empty State */}
             <div className="px-6">
                {activeAppointment ? (
                    <AppointmentCard 
                        type="ACTIVE" 
                        appointment={activeAppointment} 
                        service={getServiceById(activeAppointment.serviceId)}
                        barber={getBarberById(activeAppointment.barberId)}
                        onAction={() => alert('Abrindo mapa...')}
                    />
                ) : (
                    <AppointmentCard 
                        type="EMPTY" 
                        onAction={() => setShowHistoryOverlay(true)}
                    />
                )}
             </div>

             {/* Calendar Section */}
             <div className="mt-4">
                 <h3 className="px-6 text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Agenda</h3>
                 <FullCalendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
             </div>

             <div className="px-6 flex justify-center mt-2">
               <motion.button
                 whileHover={{ scale: 1.02 }}
                 whileTap={{ scale: 0.98 }}
                 onClick={() => setShowServiceOverlay(true)}
                 className="
                   w-full py-5 rounded-xl
                   bg-gradient-to-r from-darkveil-800 to-darkveil-950
                   shadow-[0_4px_20px_rgba(0,0,0,0.2)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)]
                   border border-gold-500/30
                   text-gold-400 font-bold text-lg tracking-widest uppercase
                   flex items-center justify-center gap-3
                   group transition-all
                 "
               >
                 <CalendarIcon className="w-5 h-5 text-gold-500 group-hover:text-gold-200 transition-colors" />
                 Realizar Agendamento
               </motion.button>
             </div>
          </div>
        </motion.div>
      )}

      {/* View: BARBER Selection */}
      {view === 'BARBER' && (
        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}>
            <SubPageHeader title="Escolha o Profissional" />
            <div className="px-4">
                 {selectedService && (
                    <div className="mb-6 p-4 rounded-lg bg-white/50 border border-darkveil-900/10 dark:bg-darkveil-800/50 dark:border-gold-500/20 flex items-center gap-4">
                        <div className="p-3 bg-darkveil-100 dark:bg-darkveil-950 rounded-full border border-darkveil-900/5 dark:border-white/5">
                            <Clock className="w-5 h-5 text-gold-600 dark:text-gold-500" />
                        </div>
                        <div>
                            <p className="text-xs text-gold-600 dark:text-gold-500 uppercase font-bold tracking-wider">Serviço</p>
                            <p className="text-darkveil-900 dark:text-white font-medium">{selectedService.name}</p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    {barbers.map(barber => (
                    <GlassCard 
                        key={barber.id}
                        onClick={() => { setSelectedBarber(barber); setView('TIME'); }}
                        className="cursor-pointer hover:border-gold-500/50 flex flex-col items-center p-4 text-center active:scale-95 transition-all group"
                        intensity="low"
                    >
                        <div className="relative w-20 h-20 mb-3">
                            <img 
                                src={barber.avatarUrl} 
                                alt={barber.name} 
                                className="w-full h-full rounded-full object-cover border-2 border-darkveil-900/10 dark:border-white/10 group-hover:border-gold-500 transition-colors" 
                            />
                        </div>
                        <h3 className="font-bold text-sm text-darkveil-900 dark:text-gold-100">{barber.name}</h3>
                        <div className="flex gap-1 flex-wrap justify-center mt-2">
                        {barber.specialties.slice(0,2).map(spec => (
                            <span key={spec} className="text-[9px] bg-darkveil-900/5 dark:bg-white/5 border border-darkveil-900/5 dark:border-white/5 px-2 py-0.5 rounded text-gray-500 dark:text-gray-400 uppercase tracking-tight">{spec}</span>
                        ))}
                        </div>
                    </GlassCard>
                    ))}
                </div>
            </div>
        </motion.div>
      )}

      {/* View: TIME Selection */}
      {view === 'TIME' && (
        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}>
           <SubPageHeader title="Horário Disponível" />
           <div className="px-4">
                <GlassCard className="p-5 mb-6">
                    <div className="flex justify-between items-center mb-6 border-b border-darkveil-900/10 dark:border-white/5 pb-4">
                        <div className="flex items-center gap-3">
                            <CalendarIcon className="w-5 h-5 text-gold-600 dark:text-gold-500" />
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase font-bold">Data Selecionada</p>
                                <span className="text-darkveil-900 dark:text-white font-bold capitalize">
                                    {selectedDate.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'long' })}
                                </span>
                            </div>
                        </div>
                        <button onClick={() => setView('HOME')} className="text-xs text-gold-600 dark:text-gold-500 underline">Alterar</button>
                    </div>
                    
                    {loadingSlots ? (
                    <div className="py-12 flex justify-center">
                        <div className="w-6 h-6 border-2 border-gold-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                    ) : (
                    <div className="grid grid-cols-3 gap-3">
                        {availableSlots.map(slot => (
                        <button
                            key={slot.time}
                            disabled={!slot.available}
                            onClick={() => setSelectedTime(slot.time)}
                            className={`
                            py-3 rounded-lg text-sm border transition-all font-medium relative overflow-hidden
                            ${!slot.available 
                                ? 'opacity-30 cursor-not-allowed border-transparent bg-gray-200 dark:bg-white/5 grayscale decoration-slice line-through' 
                                : ''}
                            ${selectedTime === slot.time 
                                ? 'bg-gold-500 border-gold-400 text-darkveil-950 shadow-[0_0_15px_rgba(184,146,48,0.4)] font-bold' 
                                : 'border-darkveil-900/10 dark:border-white/10 hover:bg-darkveil-900/5 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300'}
                            `}
                        >
                            {slot.time}
                        </button>
                        ))}
                    </div>
                    )}
                </GlassCard>
           </div>
           
           {/* STICKY FOOTER ACTION BUTTON */}
           <div className="fixed bottom-[70px] left-0 w-full px-6 z-40">
                <AnimatePresence>
                    {selectedTime && (
                         <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                         >
                            <Button 
                                onClick={handleConfirm} 
                                className="w-full shadow-2xl shadow-black/20 dark:shadow-black/60 py-4 text-lg bg-gold-500 text-darkveil-950 hover:bg-gold-400 border-none font-serif" 
                                disabled={isSubmitting}
                                isLoading={isSubmitting}
                            >
                                Confirmar Agendamento
                            </Button>
                         </motion.div>
                    )}
                </AnimatePresence>
           </div>
        </motion.div>
      )}

      {/* Service Overlay */}
      <AnimatePresence>
        {showServiceOverlay && (
          <div className="fixed inset-0 z-[60] flex flex-col justify-end">
             <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setShowServiceOverlay(false)}
                className="absolute inset-0 bg-black/50 dark:bg-black/80 backdrop-blur-md"
             />
             <motion.div
                initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative z-10 bg-gold-50 dark:bg-darkveil-950 border-t border-darkveil-900/10 dark:border-gold-500/20 rounded-t-3xl h-[85vh] flex flex-col shadow-2xl"
             >
                <div className="p-6 pb-2 flex justify-between items-center border-b border-darkveil-900/10 dark:border-white/5">
                    <div>
                        <h2 className="text-2xl font-serif text-darkveil-900 dark:text-white">Catálogo</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Selecione seu Protocolo Italiano</p>
                    </div>
                    <button 
                        onClick={() => setShowServiceOverlay(false)}
                        className="p-2 bg-darkveil-900/5 dark:bg-white/10 rounded-full text-gray-500 dark:text-gray-400 hover:text-darkveil-900 dark:hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex-1 overflow-hidden p-2">
                    <AnimatedList items={services} onSelect={handleServiceSelect} />
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* History Overlay (Full Screen Blur) */}
      <AnimatePresence>
        {showHistoryOverlay && (
             <motion.div
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[70] bg-gold-50/90 dark:bg-darkveil-950/90 backdrop-blur-[15px] flex flex-col"
             >
                <div className="pt-safe px-6 pb-6 flex items-center justify-between">
                     <SectionHeader title="Histórico" subtitle="Seus rituais anteriores" />
                     <button 
                        onClick={() => setShowHistoryOverlay(false)}
                        className="p-3 rounded-full bg-darkveil-900/10 dark:bg-white/10"
                     >
                        <X className="w-6 h-6 text-darkveil-900 dark:text-white" />
                     </button>
                </div>
                
                <div className="flex-1 overflow-y-auto px-6 space-y-4 pb-12">
                     {history.length > 0 ? (
                         history.map(apt => (
                            <motion.div 
                                key={apt.id}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                            >
                                <GlassCard className="p-4 flex flex-col gap-3 border-l-4 border-l-gold-500">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-lg font-serif text-darkveil-900 dark:text-white">
                                                {getServiceById(apt.serviceId)?.name}
                                            </h4>
                                            <p className="text-sm text-gray-500">
                                                {new Date(apt.date).toLocaleDateString()} • {apt.time}
                                            </p>
                                        </div>
                                        <div className="px-2 py-1 bg-green-500/20 text-green-600 dark:text-green-400 text-[10px] font-bold uppercase rounded">
                                            Concluído
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 border-t border-darkveil-900/5 dark:border-white/5 pt-3">
                                        <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-300">
                                            <img src={getBarberById(apt.barberId)?.avatarUrl} className="w-full h-full object-cover" />
                                        </div>
                                        <span>{getBarberById(apt.barberId)?.name}</span>
                                        
                                        <Button 
                                            variant="ghost" 
                                            className="ml-auto text-xs py-1 h-8 text-gold-600 dark:text-gold-400"
                                            onClick={() => handleRepeatBooking(apt)}
                                        >
                                            <RotateCcw className="w-3 h-3 mr-1" /> Agendar Novamente
                                        </Button>
                                    </div>
                                </GlassCard>
                            </motion.div>
                         ))
                     ) : (
                         <div className="flex flex-col items-center justify-center h-64 text-center">
                             <History className="w-12 h-12 text-gray-300 mb-4" />
                             <p className="text-gray-500">Nenhum histórico disponível.</p>
                         </div>
                     )}
                </div>
             </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};