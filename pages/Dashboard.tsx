import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Calendar, User as UserIcon, Building2, Bell, Settings, Moon, Sun } from 'lucide-react';
import { BookingFlow } from './Booking';
import { Institutional } from './Institutional';
import { User } from '../types';
import { GlassCard, SectionHeader, Button } from '../components/UI';
import { ANNOUNCEMENTS } from '../constants';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  // 'studio' replaces 'settings' in the main nav
  const [activeTab, setActiveTab] = useState<'booking' | 'profile' | 'alerts' | 'studio'>('booking');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Initialize Theme
  useEffect(() => {
    // Check HTML class instead of local storage for this demo, or default to dark
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

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

  // Animation variants for page transitions
  const pageVariants = {
    initial: { opacity: 0, filter: 'blur(10px)' },
    animate: { opacity: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, filter: 'blur(10px)' }
  };

  return (
    <div className="min-h-screen bg-gold-50 dark:bg-darkveil-950 relative transition-colors duration-300">
      
      {/* Settings Modal (Overlay) */}
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
                        
                        {/* Theme Toggle */}
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

                        <div className="flex justify-between items-center py-3 border-b border-darkveil-900/10 dark:border-white/5">
                            <span className="text-darkveil-900 dark:text-white">Notificações Push</span>
                            <div className="w-10 h-6 bg-gold-600 rounded-full relative"><div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1" /></div>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-darkveil-900/10 dark:border-white/5">
                            <span className="text-darkveil-900 dark:text-white">Segurança (Biometria)</span>
                            <span className="text-gray-500 dark:text-gray-400 text-sm">Habilitado</span>
                        </div>
                        <Button variant="ghost" onClick={onLogout} className="w-full text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 mt-4">
                            Sair da Conta
                        </Button>
                    </GlassCard>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
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

          {/* TAB: PROFILE */}
          {activeTab === 'profile' && (
             <motion.div 
              key="profile"
              variants={pageVariants}
              initial="initial" animate="animate" exit="exit"
              transition={{ duration: 0.3 }}
              className="p-4 pb-24 space-y-6"
            >
              {/* Profile Header with Settings Button */}
              <div className="flex justify-between items-center pt-4">
                  <SectionHeader title="Meu Perfil" subtitle="Gerencie seus dados" />
                  <button 
                    onClick={() => setShowSettingsModal(true)}
                    className="p-2 bg-darkveil-900/5 dark:bg-white/5 rounded-full hover:bg-gold-500/20 active:scale-95 transition-all text-darkveil-900 dark:text-gold-300"
                  >
                      <Settings className="w-6 h-6" />
                  </button>
              </div>
              
              <GlassCard className="p-6 flex flex-col items-center border-gold-500/20">
                 <div className="w-24 h-24 rounded-full border-2 border-gold-500 overflow-hidden mb-4 shadow-lg shadow-gold-900/20">
                    <img src={user.avatarUrl} alt="Me" className="w-full h-full object-cover" />
                 </div>
                 <h3 className="text-xl font-bold font-serif text-darkveil-900 dark:text-gold-100">{user.name}</h3>
                 <p className="text-gray-500 dark:text-gold-500/60 text-sm">{user.email}</p>
                 <div className="flex gap-4 mt-6 w-full">
                     <div className="flex-1 text-center p-3 bg-white border border-darkveil-900/5 dark:bg-darkveil-800 dark:border-white/5 rounded-lg shadow-sm">
                         <span className="block text-xl font-bold text-gold-600 dark:text-gold-400">{user.loyaltyPoints}</span>
                         <span className="text-[10px] uppercase text-gray-500 dark:text-gray-400 tracking-wider">Pontos</span>
                     </div>
                     <div className="flex-1 text-center p-3 bg-white border border-darkveil-900/5 dark:bg-darkveil-800 dark:border-white/5 rounded-lg shadow-sm">
                         <span className="block text-xl font-bold text-darkveil-900 dark:text-white">Elite</span>
                         <span className="text-[10px] uppercase text-gray-500 dark:text-gray-400 tracking-wider">Nível</span>
                     </div>
                 </div>
              </GlassCard>
              
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                <SectionHeader title="Agendamento Ativo" />
                <GlassCard className="p-5 border-l-4 border-l-gold-500 bg-gold-50 dark:bg-gold-900/10">
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="font-bold text-lg text-darkveil-900 dark:text-white">Corte de cabelo e Visagismo</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Amanhã, 14:00</p>
                            <p className="text-xs text-gold-600 dark:text-gold-400 mt-2 font-semibold uppercase tracking-wide">Barbeiro: Marcus "Fade"</p>
                        </div>
                        <span className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 text-[10px] px-2 py-1 rounded border border-green-500/30">CONFIRMADO</span>
                    </div>
                </GlassCard>
              </motion.div>

              <SectionHeader title="Histórico" />
              <div className="space-y-3">
                {[
                  { name: 'Corte de cabelo', date: '12 Ago 2023', barber: 'Silas Vane' },
                  { name: 'Barba', date: '15 Jul 2023', barber: 'Elena Ray' },
                ].map((item, idx) => (
                    <GlassCard key={idx} className="p-4 flex justify-between items-center opacity-70 hover:opacity-100 transition-opacity">
                        <div>
                            <h4 className="font-medium text-sm text-darkveil-900 dark:text-gold-100">{item.name}</h4>
                            <p className="text-xs text-gray-500">{item.barber}</p>
                        </div>
                        <span className="text-xs text-gray-500">{item.date}</span>
                    </GlassCard>
                ))}
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
              className="p-4 pb-24 space-y-4"
            >
              <div className="pt-4">
                  <SectionHeader title="Avisos" subtitle="Novidades da DarkVeil" />
              </div>
              {ANNOUNCEMENTS.map(ann => (
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
              ))}
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Bottom Navigation Hub */}
      <nav className="fixed bottom-0 left-0 w-full bg-white/90 dark:bg-darkveil-950/90 backdrop-blur-xl border-t border-darkveil-900/10 dark:border-white/5 pb-safe z-50 transition-colors duration-300">
        <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
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