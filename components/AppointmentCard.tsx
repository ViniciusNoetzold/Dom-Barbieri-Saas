import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard, Button } from './UI';
import { Calendar, Clock, MapPin, RefreshCw, Scissors } from 'lucide-react';
import { Appointment, Service, Barber } from '../types';

interface AppointmentCardProps {
  type: 'ACTIVE' | 'HISTORY' | 'EMPTY';
  appointment?: Appointment;
  service?: Service;
  barber?: Barber;
  onAction?: () => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({ 
  type, 
  appointment, 
  service, 
  barber, 
  onAction 
}) => {
  
  if (type === 'EMPTY') {
    return (
      <GlassCard className="p-6 border-dashed border-2 border-darkveil-900/10 dark:border-white/10 flex flex-col items-center justify-center text-center bg-white/20 dark:bg-white/5 backdrop-blur-sm">
        <div className="w-12 h-12 rounded-full bg-darkveil-900/5 dark:bg-white/5 flex items-center justify-center mb-3">
            <Calendar className="w-6 h-6 text-gray-400" />
        </div>
        <h3 className="text-darkveil-900 dark:text-white font-serif font-bold text-lg mb-1">
          Nenhum agendamento ativo
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-[200px]">
          Seu trono está esperando. Consulte o histórico ou agende agora.
        </p>
        {onAction && (
          <button 
            onClick={onAction}
            className="text-xs font-bold text-gold-600 dark:text-gold-400 uppercase tracking-widest hover:underline"
          >
            Ver Histórico
          </button>
        )}
      </GlassCard>
    );
  }

  // Formatting
  const dateObj = appointment ? new Date(appointment.date + 'T' + appointment.time) : new Date();
  const dateStr = dateObj.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
  const weekDay = dateObj.toLocaleDateString('pt-BR', { weekday: 'long' });

  if (type === 'ACTIVE') {
    return (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <GlassCard className="relative overflow-hidden p-0 border-gold-500/30 shadow-[0_10px_30px_rgba(218,165,32,0.15)] bg-gradient-to-br from-gold-50 to-white dark:from-darkveil-900 dark:to-darkveil-950">
                <div className="absolute top-0 right-0 p-2">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-500/10 border border-green-500/20 text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-wide">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"/> Confirmado
                    </span>
                </div>
                
                <div className="p-5 flex gap-4 items-start">
                    <div className="flex flex-col items-center justify-center bg-darkveil-900 text-gold-400 rounded-lg w-16 h-16 shrink-0 shadow-lg border border-gold-500/20">
                        <span className="text-xs font-bold uppercase">{weekDay.split('-')[0].slice(0,3)}</span>
                        <span className="text-2xl font-serif font-bold leading-none">{dateObj.getDate()}</span>
                    </div>
                    
                    <div>
                        <h3 className="font-serif font-bold text-xl text-darkveil-900 dark:text-white leading-tight mb-1">
                            {service?.name || 'Serviço'}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-2">
                             <Clock className="w-3 h-3 text-gold-500" /> {appointment?.time}
                             <span className="text-gold-500">•</span>
                             <Scissors className="w-3 h-3 text-gold-500" /> {barber?.name.split(' ')[0]}
                        </div>
                    </div>
                </div>

                <div className="px-5 pb-5 pt-0">
                    <Button 
                        onClick={onAction} 
                        className="w-full py-2 text-xs h-10 bg-darkveil-900 hover:bg-darkveil-800 text-gold-100 border border-gold-500/20 shadow-none"
                    >
                        <MapPin className="w-3 h-3 mr-2" /> Check-in / Localização
                    </Button>
                </div>
            </GlassCard>
        </motion.div>
    );
  }

  // HISTORY
  return (
    <GlassCard className="p-4 flex items-center justify-between group hover:border-gold-500/30 transition-colors">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-white/5 overflow-hidden">
                <img src={barber?.avatarUrl} alt="Barber" className="w-full h-full object-cover grayscale" />
            </div>
            <div>
                <h4 className="font-medium text-sm text-darkveil-900 dark:text-gold-100">{service?.name}</h4>
                <p className="text-xs text-gray-500">{dateStr} • {barber?.name}</p>
            </div>
        </div>
        <button 
            onClick={onAction}
            className="p-2 rounded-full hover:bg-gold-500/10 text-gold-600 dark:text-gold-400 transition-colors"
            title="Repetir Agendamento"
        >
            <RefreshCw className="w-4 h-4" />
        </button>
    </GlassCard>
  );
};