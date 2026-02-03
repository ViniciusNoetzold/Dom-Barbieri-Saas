import React, { useState } from 'react';
import { User, Appointment, Service, Barber } from '../types';
import { SectionHeader, GlassCard, Button, Input } from '../components/UI';
import { useAppointments } from '../context/AppointmentContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/AnimatedTabs';
import { 
  Calendar, Clock, CheckCircle, XCircle, FileText, 
  DollarSign, Image as ImageIcon, Trash2, Megaphone, 
  Scissors, User as UserIcon, Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminDashboard: React.FC<{ user: User }> = ({ user }) => {
  const { 
    appointments, 
    updateAppointmentStatus, 
    updateAppointmentNotes,
    services,
    updateService,
    announcements,
    addAnnouncement,
    removeAnnouncement,
    barbers,
    getServiceById,
    getBarberById
  } = useAppointments();

  // --- Local State for Forms ---
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeMsg, setNewNoticeMsg] = useState('');

  const handleAddNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeTitle || !newNoticeMsg) return;
    
    addAnnouncement({
      id: `ann_${Date.now()}`,
      title: newNoticeTitle,
      message: newNoticeMsg,
      date: new Date().toLocaleDateString('pt-BR')
    });
    setNewNoticeTitle('');
    setNewNoticeMsg('');
  };

  return (
    <div className="min-h-screen bg-darkveil-950 p-4 md:p-8 text-white pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
         <div>
            <h1 className="text-3xl font-serif font-bold text-gold-200">Command Center</h1>
            <p className="text-gray-400 text-sm">Bem-vindo, {user.name}</p>
         </div>
         <div className="px-3 py-1 bg-red-900/20 border border-red-500/30 rounded text-red-400 text-xs font-bold tracking-wider flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
           ADMIN ACCESS
         </div>
      </div>

      <Tabs defaultValue="agenda" className="w-full">
        <TabsList className="bg-darkveil-900 border border-white/5 mb-8">
            <TabsTrigger value="agenda">Agenda & CRM</TabsTrigger>
            <TabsTrigger value="services">Catálogo</TabsTrigger>
            <TabsTrigger value="comms">Comunicação</TabsTrigger>
        </TabsList>

        {/* --- TAB 1: AGENDA (The Command Center) --- */}
        <TabsContent value="agenda">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Stats */}
                <GlassCard className="lg:col-span-3 p-6 flex flex-wrap gap-8 items-center bg-darkveil-900/50">
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">Total Hoje</p>
                        <p className="text-2xl font-bold text-white">{appointments.length}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">Faturamento Est.</p>
                        <p className="text-2xl font-bold text-gold-400">R$ {appointments.reduce((acc, curr) => {
                            const svc = getServiceById(curr.serviceId);
                            return acc + (svc?.price || 0);
                        }, 0)}</p>
                    </div>
                </GlassCard>

                {/* Timeline */}
                <div className="lg:col-span-3 space-y-4">
                    <SectionHeader title="Timeline Diária" subtitle="Gestão operacional" />
                    
                    {appointments.length === 0 ? (
                        <p className="text-gray-500 italic">Nenhum agendamento registrado.</p>
                    ) : (
                        appointments.sort((a,b) => a.time.localeCompare(b.time)).map(apt => (
                            <AdminAppointmentCard 
                                key={apt.id} 
                                appointment={apt}
                                service={getServiceById(apt.serviceId)}
                                barber={getBarberById(apt.barberId)}
                                onStatusChange={updateAppointmentStatus}
                                onNoteChange={updateAppointmentNotes}
                            />
                        ))
                    )}
                </div>
            </div>
        </TabsContent>

        {/* --- TAB 2: CATÁLOGO (Services) --- */}
        <TabsContent value="services">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map(service => (
                    <GlassCard key={service.id} className="p-0 overflow-hidden group">
                        <div className="h-32 bg-gray-800 relative">
                            <img src={service.imageUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt={service.name} />
                            <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-xs font-bold">
                                {service.durationMinutes} min
                            </div>
                        </div>
                        <div className="p-4 space-y-3">
                            <div className="space-y-1">
                                <label className="text-[10px] text-gray-500 uppercase">Nome do Protocolo</label>
                                <input 
                                    className="w-full bg-transparent border-b border-white/10 focus:border-gold-500 outline-none text-gold-100 font-serif font-bold"
                                    value={service.name}
                                    onChange={(e) => updateService({...service, name: e.target.value})}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] text-gray-500 uppercase">Valor (R$)</label>
                                <input 
                                    type="number"
                                    className="w-full bg-transparent border-b border-white/10 focus:border-gold-500 outline-none text-white"
                                    value={service.price}
                                    onChange={(e) => updateService({...service, price: Number(e.target.value)})}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] text-gray-500 uppercase">Descrição</label>
                                <textarea 
                                    className="w-full bg-white/5 rounded p-2 text-xs text-gray-300 focus:outline-none focus:ring-1 focus:ring-gold-500/50 resize-none h-16"
                                    value={service.description}
                                    onChange={(e) => updateService({...service, description: e.target.value})}
                                />
                            </div>
                        </div>
                    </GlassCard>
                ))}
            </div>
        </TabsContent>

        {/* --- TAB 3: COMUNICAÇÃO (Notices & Team) --- */}
        <TabsContent value="comms">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Notices */}
                <div className="space-y-6">
                    <SectionHeader title="Quadro de Avisos" subtitle="Notificações Push para todos os clientes" />
                    
                    <GlassCard className="p-6 border-gold-500/20">
                        <form onSubmit={handleAddNotice} className="space-y-4">
                            <Input 
                                placeholder="Título do Aviso" 
                                value={newNoticeTitle}
                                onChange={e => setNewNoticeTitle(e.target.value)}
                                className="bg-darkveil-900 border-white/10"
                            />
                            <textarea 
                                placeholder="Mensagem..." 
                                className="w-full bg-darkveil-900/50 border border-white/10 rounded-lg p-3 text-white text-sm focus:border-gold-500 outline-none h-24 resize-none placeholder-gray-600"
                                value={newNoticeMsg}
                                onChange={e => setNewNoticeMsg(e.target.value)}
                            />
                            <Button type="submit" className="w-full">
                                <Megaphone className="w-4 h-4 mr-2" /> Publicar
                            </Button>
                        </form>
                    </GlassCard>

                    <div className="space-y-3">
                        {announcements.map(ann => (
                            <div key={ann.id} className="flex justify-between items-center p-4 rounded-lg bg-white/5 border border-white/5">
                                <div>
                                    <h4 className="font-bold text-gold-200">{ann.title}</h4>
                                    <p className="text-xs text-gray-400">{ann.message}</p>
                                    <span className="text-[10px] text-gray-600">{ann.date}</span>
                                </div>
                                <button onClick={() => removeAnnouncement(ann.id)} className="text-red-500 hover:text-red-400 p-2">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Team Status (Read Only for now) */}
                <div className="space-y-6">
                    <SectionHeader title="Equipe & Status" subtitle="Visão geral dos profissionais" />
                    <div className="space-y-3">
                        {barbers.map(barber => (
                            <GlassCard key={barber.id} className="p-4 flex items-center gap-4">
                                <img src={barber.avatarUrl} className="w-12 h-12 rounded-full object-cover" alt="Avatar" />
                                <div className="flex-1">
                                    <h4 className="font-bold text-white">{barber.name}</h4>
                                    <div className="flex gap-2 text-xs text-gray-400">
                                        <span className="flex items-center text-gold-500"><Scissors className="w-3 h-3 mr-1"/> {barber.specialties[0]}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                     <div className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded border border-green-500/20 inline-block">
                                        Online
                                     </div>
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                </div>
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// --- Subcomponent: Appointment Card (Admin Version) ---
const AdminAppointmentCard: React.FC<{ 
    appointment: Appointment, 
    service?: Service,
    barber?: Barber,
    onStatusChange: (id: string, s: Appointment['status']) => void,
    onNoteChange: (id: string, n: string) => void
}> = ({ appointment, service, barber, onStatusChange, onNoteChange }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <GlassCard className={`p-0 overflow-hidden transition-all ${isExpanded ? 'border-gold-500/30 ring-1 ring-gold-500/20' : 'border-white/5'}`}>
            <div 
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-4 flex items-center gap-4 cursor-pointer hover:bg-white/5 transition-colors"
            >
                <div className="flex flex-col items-center justify-center w-14 h-14 bg-darkveil-800 rounded text-gold-500 font-bold border border-white/5">
                    <span className="text-lg">{appointment.time}</span>
                </div>
                
                <div className="flex-1">
                    <h3 className="font-serif font-bold text-white text-lg">{service?.name || 'Serviço'}</h3>
                    <div className="flex items-center gap-2 text-gray-400 text-xs">
                        <UserIcon className="w-3 h-3" /> 
                        <span>Cliente (ID: {appointment.userId})</span>
                        <span className="w-1 h-1 bg-gray-600 rounded-full" />
                        <span>{barber?.name}</span>
                    </div>
                </div>

                <div className={`px-3 py-1 rounded text-xs font-bold border ${
                    appointment.status === 'CONFIRMED' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                    appointment.status === 'COMPLETED' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                    appointment.status === 'CANCELLED' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                    'bg-gray-500/10 text-gray-400'
                }`}>
                    {appointment.status}
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div 
                        initial={{ height: 0 }} 
                        animate={{ height: 'auto' }} 
                        exit={{ height: 0 }}
                        className="bg-black/20 border-t border-white/5"
                    >
                        <div className="p-4 space-y-4">
                            {/* Actions */}
                            <div className="flex gap-2">
                                {appointment.status !== 'COMPLETED' && (
                                    <button 
                                        onClick={() => onStatusChange(appointment.id, 'COMPLETED')}
                                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-600 hover:bg-green-500 text-white rounded text-sm font-bold transition-colors"
                                    >
                                        <CheckCircle className="w-4 h-4" /> Concluir
                                    </button>
                                )}
                                {appointment.status !== 'CANCELLED' && appointment.status !== 'COMPLETED' && (
                                    <button 
                                        onClick={() => onStatusChange(appointment.id, 'CANCELLED')}
                                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-900/40 hover:bg-red-900/60 text-red-400 border border-red-500/20 rounded text-sm font-bold transition-colors"
                                    >
                                        <XCircle className="w-4 h-4" /> Cancelar
                                    </button>
                                )}
                            </div>

                            {/* Notes */}
                            <div className="space-y-1">
                                <label className="text-xs text-gold-500 uppercase font-bold flex items-center gap-1">
                                    <FileText className="w-3 h-3" /> Notas Internas
                                </label>
                                <textarea 
                                    className="w-full bg-darkveil-900 border border-white/10 rounded p-2 text-sm text-gray-300 focus:border-gold-500 outline-none resize-none h-20"
                                    placeholder="Preferências do cliente, observações..."
                                    value={appointment.notes || ''}
                                    onChange={(e) => onNoteChange(appointment.id, e.target.value)}
                                />
                                <p className="text-[10px] text-gray-500 text-right">Salvo automaticamente</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </GlassCard>
    );
};