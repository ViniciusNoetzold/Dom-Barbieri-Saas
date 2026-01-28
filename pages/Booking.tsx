import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Service, Barber, TimeSlot } from '../types';
import { SERVICES, BARBERS, ASSETS } from '../constants';
import { api } from '../services/api';
import { GlassCard, Button } from '../components/UI';
import { AnimatedList } from '../components/AnimatedList';
import { Calendar as CalendarIcon, CheckCircle, X, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

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

// --- Hero Section ---
const HeroSection: React.FC<{ userName: string }> = ({ userName }) => {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Bom dia');
    else if (hour < 18) setGreeting('Boa tarde');
    else setGreeting('Boa noite');
  }, []);

  return (
    <div className="relative w-full h-[40vh] overflow-hidden flex items-end group">
      {/* Background Image with Gradient Mask */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-500"
        style={{ 
          backgroundImage: `url("${ASSETS.HERO_BG}")`,
          maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)'
        }}
      />
      
      {/* Content */}
      <div className="relative z-20 px-6 pb-8 w-full">
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            {/* Force text to be readable on the hero image even in light mode, or adapt if image changes */}
            {/* Strategy: Use text-shadow or keep it light-on-dark since the image is usually dark/grayscale */}
            <h1 className="text-4xl font-serif text-white drop-shadow-md tracking-tight leading-tight mix-blend-overlay dark:mix-blend-normal">
            {greeting}, <br />
            <span className="text-gold-200 dark:text-gold-300">{userName.split(' ')[0]}</span>.
            </h1>
            <div className="w-12 h-1 bg-gold-600 mt-3 mb-3 rounded-full" />
            <p className="text-gray-200 dark:text-gray-400 text-sm font-light uppercase tracking-widest opacity-90 drop-shadow-sm">
            A cada dia mais perto de sua melhor versão.
            </p>
        </motion.div>
      </div>
    </div>
  );
};

// --- Main Flow ---

export const BookingFlow: React.FC<BookingProps> = ({ user }) => {
  const [view, setView] = useState<'HOME' | 'BARBER' | 'TIME' | 'SUCCESS'>('HOME');
  const [showServiceOverlay, setShowServiceOverlay] = useState(false);
  
  // State
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  // Initialize with current date
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
    // When date changes in TIME view, or we enter TIME view
    if ((view === 'TIME' || view === 'HOME') && selectedBarber) {
       // We can pre-fetch here if we wanted to show indicators on the calendar
       // For now, we fetch when the user selects a barber/time
    }
  }, [selectedDate, selectedBarber, view]);

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

  const handleConfirm = async () => {
    if (!selectedService || !selectedBarber || !selectedTime) return;
    setIsSubmitting(true);
    try {
      await api.createAppointment({
        serviceId: selectedService.id,
        barberId: selectedBarber.id,
        userId: user.id,
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime
      });
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

  // Common Header for Sub-pages
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
    // Padding bottom massive to account for sticky button + nav
    <div className="relative min-h-screen bg-gold-50 dark:bg-darkveil-950 pb-48 transition-colors duration-300">
      
      {/* View: HOME (Landing) */}
      {view === 'HOME' && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
        >
          <HeroSection userName={user.name} />
          
          <div className="relative z-30">
             <FullCalendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />

             <div className="px-6 flex justify-center mt-8">
               <motion.button
                 whileHover={{ scale: 1.02 }}
                 whileTap={{ scale: 0.98 }}
                 onClick={() => setShowServiceOverlay(true)}
                 className="
                   w-full py-5 rounded-xl
                   bg-gradient-to-r from-darkveil-800 to-darkveil-950
                   shadow-[0_4px_20px_rgba(0,0,0,0.2)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)]
                   border border-gold-500/30
                   text-gold-300 font-bold text-lg tracking-widest uppercase
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
                    {BARBERS.map(barber => (
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

      {/* Service Overlay (Modal) */}
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
                    <AnimatedList items={SERVICES} onSelect={handleServiceSelect} />
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};