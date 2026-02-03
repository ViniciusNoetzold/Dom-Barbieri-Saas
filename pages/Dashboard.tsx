import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Calendar, User as UserIcon, Building2, Bell, Settings, Moon, Sun, Camera, Save, Edit2 } from 'lucide-react';
import { BookingFlow } from './Booking';
import { Institutional } from './Institutional';
import { User } from '../types';
import { GlassCard, SectionHeader, Button, Input } from '../components/UI';
import { GlobalHero } from '../components/GlobalHero';
import { useAppointments } from '../context/AppointmentContext';
import { AppointmentCard } from '../components/AppointmentCard';
import { PAGE_THEMES } from '../constants';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onUpdateUser: (updatedUser: User) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, onUpdateUser }) => {
  const [activeTab, setActiveTab] = useState<'booking' | 'profile' | 'alerts' | 'studio'>('booking');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { activeAppointment, history, getServiceById, getBarberById, setDraftBooking, announcements } = useAppointments();

  // Initialize Theme
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  // Sync edit form with user data when not editing
  useEffect(() => {
    if (!isEditingProfile) {
      setEditForm({
        name: user.name,
        email: user.email,
        phone: user.phone || ''
      });
    }
  }, [user, isEditingProfile]);

  const toggleTheme = () => {
    const html = document.documentElement;
    if (isDarkMode) {
        html.classList.remove('dark');
        setIsDarkMode(false);
    } else {
        html.classList.add('dark');
        setIsDarkMode(true);
    }
  };

  const handleRepeatBooking = (serviceId: string, barberId: string) => {
     setDraftBooking({ serviceId, barberId });
     setActiveTab('booking');
  };

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Create local preview URL
      const objectUrl = URL.createObjectURL(file);
      
      // Update User State immediately (Simulating upload)
      onUpdateUser({ ...user, avatarUrl: objectUrl });
    }
  };

  const handleSaveProfile = () => {
    // Simulate API call
    onUpdateUser({ 
      ...user, 
      name: editForm.name, 
      email: editForm.email, 
      phone: editForm.phone 
    });
    setIsEditingProfile(false);
  };

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, filter: 'blur(5px)' },
    animate: { opacity: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, filter: 'blur(5px)' }
  };

  return (
    <div className="min-h-screen bg-gold-50 dark:bg-darkveil-950 relative transition-colors duration-300">
      
      {/* Settings Modal */}
      <AnimatePresence>
        {showSettingsModal && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 dark:bg-black/80 backdrop-blur-md">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="w-full max-w-sm"
                >
                    <GlassCard className="p-6 space-y-4 border-gold-500/20">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-darkveil-900 dark:text-gold-200">Configurações</h2>
                            <button onClick={() => setShowSettingsModal(false)} className="text-gray-500 hover:text-darkveil-900 dark:text-gray-400 dark:hover:text-white">Fechar</button>
                        </div>
                        
                        <div className="flex justify-between items-center py-3 border-b border-darkveil-900/10 dark:border-white/5">
                            <span className="text-darkveil-900 dark:text-white flex items-center gap-2">
                                {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                                Tema
                            </span>
                            <button 
                                onClick={toggleTheme}
                                className={`w-12 h-6 rounded-full p-1 transition-colors ${isDarkMode ? 'bg-gold-600' : 'bg-gray-300'}`}
                            >
                                <motion.div 
                                    className="w-4 h-4 bg-white rounded-full shadow-sm"
                                    animate={{ x: isDarkMode ? 24 : 0 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            </button>
                        </div>

                        <Button variant="ghost" onClick={onLogout} className="w-full text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 mt-4">
                            Sair da Conta
                        </Button>
                    </GlassCard>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      <main className="min-h-screen">
        <AnimatePresence mode="wait">
          
          {/* TAB: BOOKING */}
          {activeTab === 'booking' && (
            <motion.div 
              key="booking"
              variants={pageVariants}
              initial="initial" animate="animate" exit="exit"
              transition={{ duration: 0.3 }}
            >
              <BookingFlow user={user} />
            </motion.div>
          )}

          {/* TAB: STUDIO (INSTITUTIONAL) */}
          {activeTab === 'studio' && (
             <motion.div 
                key="studio"
                variants={pageVariants}
                initial="initial" animate="animate" exit="exit"
                transition={{ duration: 0.3 }}
             >
                 <Institutional />
             </motion.div>
          )}

          {/* TAB: PROFILE (EDITABLE) */}
          {activeTab === 'profile' && (
             <motion.div 
              key="profile"
              variants={pageVariants}
              initial="initial" animate="animate" exit="exit"
              transition={{ duration: 0.3 }}
              className="pb-24"
            >
              <GlobalHero 
                title="Meu Perfil" 
                heightClass="h-[35vh]" 
                backgroundImage={PAGE_THEMES.PROFILE.bgImage}
                titleColor={PAGE_THEMES.PROFILE.titleColor}
                overlayGradient={PAGE_THEMES.PROFILE.overlayColor}
              />
              
              <div className="relative z-30 -mt-16 px-6 space-y-6">
                 {/* Profile Card */}
                 <GlassCard className="p-8 flex flex-col items-center border-gold-500/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4">
                        <button onClick={() => setShowSettingsModal(true)}>
                            <Settings className="w-6 h-6 text-gray-400 hover:text-gold-500" />
                        </button>
                    </div>
                    
                    {/* Editable Avatar */}
                    <div className="relative group mb-4">
                        <div className="w-32 h-32 rounded-full border-4 border-gold-500/50 overflow-hidden shadow-2xl relative">
                            <img src={user.avatarUrl} alt="Me" className="w-full h-full object-cover" />
                            {/* Overlay for Edit */}
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm"
                            >
                                <Camera className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        {/* Hidden Input */}
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleProfileImageUpload} 
                        />
                    </div>
                    
                    <AnimatePresence mode="wait">
                        {!isEditingProfile ? (
                            <motion.div 
                                key="view"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="text-center w-full"
                            >
                                <h3 className="text-2xl font-bold font-serif text-darkveil-900 dark:text-gold-100 mb-1">{user.name}</h3>
                                <p className="text-gray-500 dark:text-gold-500/80 text-sm tracking-widest uppercase mb-4">{user.email}</p>
                                
                                <Button variant="secondary" onClick={() => setIsEditingProfile(true)} className="mx-auto text-sm py-2 px-4">
                                    <Edit2 className="w-3 h-3 mr-2" /> Editar Dados
                                </Button>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="edit"
                                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                className="w-full space-y-4"
                            >
                                <Input 
                                    label="Nome Completo"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                    className="text-center"
                                />
                                <Input 
                                    label="Telefone (WhatsApp)"
                                    value={editForm.phone}
                                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                                    className="text-center"
                                />
                                <Input 
                                    label="E-mail"
                                    value={editForm.email}
                                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                    className="text-center"
                                />
                                <div className="flex gap-2 pt-2">
                                    <Button variant="ghost" onClick={() => setIsEditingProfile(false)} className="flex-1">Cancelar</Button>
                                    <Button onClick={handleSaveProfile} className="flex-1">
                                        <Save className="w-4 h-4 mr-2" /> Salvar
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                 </GlassCard>
                 
                 {/* Active Appointment & Stats */}
                 {!isEditingProfile && (
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                        {activeAppointment && (
                            <div className="space-y-2 mb-6">
                                <SectionHeader title="Agendamento Ativo" />
                                <AppointmentCard 
                                    type="ACTIVE" 
                                    appointment={activeAppointment} 
                                    service={getServiceById(activeAppointment.serviceId)}
                                    barber={getBarberById(activeAppointment.barberId)}
                                />
                            </div>
                        )}

                        <div className="space-y-3">
                            <SectionHeader title="Fidelidade" subtitle="Dom Member Club" />
                            <GlassCard className="flex items-center justify-between p-6 bg-gradient-to-r from-darkveil-900 to-darkveil-800 border-gold-500/30">
                                <div>
                                    <p className="text-xs text-gold-500 uppercase tracking-widest font-bold">Pontos Acumulados</p>
                                    <p className="text-3xl font-serif font-bold text-white">{user.loyaltyPoints || 0}</p>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-gold-500 flex items-center justify-center text-darkveil-900 font-bold">
                                    DM
                                </div>
                            </GlassCard>
                        </div>
                     </motion.div>
                 )}
              </div>
            </motion.div>
          )}

          {/* TAB: ALERTS */}
          {activeTab === 'alerts' && (
             <motion.div 
              key="alerts"
              variants={pageVariants}
              initial="initial" animate="animate" exit="exit"
              transition={{ duration: 0.3 }}
              className="pb-24"
            >
              <GlobalHero 
                title="Avisos" 
                heightClass="h-[35vh]"
                backgroundImage={PAGE_THEMES.ALERTS.bgImage}
                titleColor={PAGE_THEMES.ALERTS.titleColor}
                overlayGradient={PAGE_THEMES.ALERTS.overlayColor}
              />
              <div className="relative z-30 -mt-10 px-6 space-y-4">
                  {announcements.length > 0 ? announcements.map(ann => (
                    <GlassCard key={ann.id} className="overflow-hidden border-gold-500/10">
                      {ann.imageUrl && (
                        <div className="h-32 w-full overflow-hidden">
                          <img src={ann.imageUrl} className="w-full h-full object-cover sepia-[.3]" alt="Banner" />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-serif font-bold text-lg mb-1 text-darkveil-900 dark:text-gold-200">{ann.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{ann.message}</p>
                        <span className="text-xs text-gold-600 dark:text-gold-500/80 uppercase tracking-widest">{ann.date}</span>
                      </div>
                    </GlassCard>
                  )) : (
                     <p className="text-center text-gray-500 mt-10">Nenhum aviso no momento.</p>
                  )}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full bg-white/90 dark:bg-darkveil-950/90 backdrop-blur-xl border-t border-darkveil-900/10 dark:border-white/5 pb-safe z-50 transition-colors duration-300">
        <div className="flex justify-between items-center h-20 max-w-md mx-auto px-12">
          <NavBtn icon={Home} label="Book" active={activeTab === 'booking'} onClick={() => setActiveTab('booking')} />
          <NavBtn icon={Building2} label="A Barbearia" active={activeTab === 'studio'} onClick={() => setActiveTab('studio')} />
          <NavBtn icon={Bell} label="Avisos" active={activeTab === 'alerts'} onClick={() => setActiveTab('alerts')} />
          <NavBtn icon={UserIcon} label="Perfil" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
        </div>
      </nav>
    </div>
  );
};

const NavBtn = ({ icon: Icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-16 transition-colors duration-200 ${active ? 'text-gold-600 dark:text-gold-400' : 'text-gray-400 hover:text-darkveil-900 dark:hover:text-gold-200'}`}
  >
    <Icon className={`w-6 h-6 mb-1 ${active ? 'scale-110 drop-shadow-[0_0_8px_rgba(212,179,94,0.4)]' : 'scale-100'} transition-all`} />
    <span className="text-[10px] font-medium whitespace-nowrap tracking-wide">{label}</span>
  </button>
);