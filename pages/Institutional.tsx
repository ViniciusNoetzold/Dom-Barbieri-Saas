import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard, SectionHeader } from '../components/UI';
import { BARBERS, ASSETS } from '../constants';
import { MapPin, Star } from 'lucide-react';

export const Institutional: React.FC = () => {
  return (
    <div className="pb-24 space-y-12 bg-gold-50 dark:bg-darkveil-950 transition-colors duration-300">
      
      {/* 1. Brand Story */}
      <section className="px-6 pt-10">
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
        >
            <h1 className="text-4xl font-serif font-bold text-darkveil-900 dark:text-white tracking-widest uppercase drop-shadow-sm dark:drop-shadow-xl transition-colors">
                DarkVeil
            </h1>
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto" />
            <p className="text-gray-600 dark:text-gray-300 leading-8 font-light text-base max-w-sm mx-auto">
                Nascida da tradição clássica e forjada na modernidade. O <span className="text-gold-600 dark:text-gold-300 font-medium">Protocolo Italiano</span> não é apenas um corte, é um ritual de renovação. 
                <br/><br/>
                Em nosso santuário, o tempo para e a sua imagem é esculpida com precisão cirúrgica.
            </p>
        </motion.div>
      </section>

      {/* 2. Map Section - Silver/Dark Theme */}
      <section className="space-y-4">
          <div className="px-6">
            <SectionHeader title="Nosso Território" subtitle="Onde a mágica acontece" />
          </div>
          <div className="w-full h-72 relative overflow-hidden bg-gray-200 dark:bg-darkveil-900 border-y border-darkveil-900/10 dark:border-white/10 group">
            <iframe 
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d440.58519059854723!2d-52.919627!3d-27.942407!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94fcc52b7d33d801%3A0x13244f1a5934d15a!2sDOM%20BARBIERI!5e0!3m2!1sen!2sbr!4v1769567925190!5m2!1sen!2sbr" 
                width="100%" 
                height="100%" 
                style={{ border: 0, filter: 'grayscale(100%) invert(92%) contrast(83%)' }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Location Map"
                className="opacity-80 group-hover:opacity-100 transition-opacity duration-700"
            ></iframe>
            <div className="absolute bottom-6 right-6">
                <a 
                    href="https://maps.google.com/?q=DOM+BARBIERI" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-gold-500 text-darkveil-950 hover:bg-gold-400 text-xs font-bold py-3 px-6 rounded-full shadow-2xl flex items-center gap-2 transition-transform active:scale-95 border border-gold-600"
                >
                    <MapPin className="w-3 h-3" /> TRAÇAR ROTA
                </a>
            </div>
          </div>
      </section>

      {/* 3. Studio Gallery */}
      <section className="px-6">
        <SectionHeader title="O Ambiente" />
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-6 snap-x">
            {[10, 11, 12, 13].map((id) => (
                <motion.div 
                    key={id}
                    className="min-w-[300px] h-56 rounded-none overflow-hidden snap-center border border-darkveil-900/10 dark:border-white/10 relative group"
                    whileTap={{ scale: 0.98 }}
                >
                    <img 
                        src={ASSETS.getGalleryImage(id)} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 sepia-[.3]" 
                        alt="Studio" 
                    />
                    {/* Overlay: White/Cream in Light Mode, Dark in Dark Mode */}
                    <div className="absolute inset-0 bg-white/20 dark:bg-darkveil-950/40 group-hover:bg-transparent transition-colors duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-darkveil-950/90 to-transparent flex items-end p-6">
                        <span className="text-white text-xs font-bold tracking-widest uppercase border-l-2 border-gold-500 pl-3">Lounge & Bar</span>
                    </div>
                </motion.div>
            ))}
        </div>
      </section>

      {/* 4. Team & Portfolio */}
      <section className="px-6">
         <SectionHeader title="Mestres do Corte" subtitle="Conheça quem cuida da sua imagem" />
         <div className="space-y-6">
            {BARBERS.map((barber) => (
                <GlassCard key={barber.id} className="overflow-hidden group cursor-pointer border border-darkveil-900/5 dark:border-white/5 hover:border-gold-500/30 transition-colors">
                    <div className="flex h-32">
                        {/* Avatar: B&W to Color Transition */}
                        <div className="w-32 relative overflow-hidden bg-gray-200 dark:bg-gray-800">
                            <img 
                                src={barber.avatarUrl} 
                                alt={barber.name} 
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out"
                            />
                        </div>
                        <div className="flex-1 p-4 flex flex-col justify-center bg-white/50 dark:bg-white/5">
                            <h3 className="font-bold text-lg text-darkveil-900 dark:text-white group-hover:text-gold-600 dark:group-hover:text-gold-200 transition-colors font-serif">
                                {barber.name}
                            </h3>
                            <div className="flex items-center gap-1 text-gold-600 dark:text-gold-500 text-xs mb-2">
                                <Star className="w-3 h-3 fill-current" /> {barber.rating}
                            </div>
                            <div className="flex flex-wrap gap-1 mt-auto">
                                {barber.specialties.map(spec => (
                                    <span key={spec} className="text-[9px] uppercase tracking-wider bg-darkveil-900/10 dark:bg-black/40 border border-darkveil-900/5 dark:border-white/10 px-2 py-1 text-gray-500 dark:text-gray-400">
                                        {spec}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </GlassCard>
            ))}
         </div>

         {/* Mini Masonry Portfolio */}
         <div className="mt-12">
            <h3 className="text-darkveil-900 dark:text-white font-serif font-bold text-xl mb-6 border-b border-darkveil-900/10 dark:border-white/10 pb-2">Portfólio Recente</h3>
            <div className="columns-2 gap-3 space-y-3">
                {[20, 21, 22, 23, 24].map((i) => (
                    <motion.div 
                        key={i} 
                        initial={{ opacity: 0 }} 
                        whileInView={{ opacity: 1 }}
                        className="break-inside-avoid overflow-hidden border border-darkveil-900/5 dark:border-white/5 bg-gray-200 dark:bg-darkveil-900"
                    >
                        <img 
                            src={`https://picsum.photos/300/${i % 2 === 0 ? '400' : '300'}?random=${i}&grayscale`} 
                            className="w-full h-full object-cover hover:scale-105 hover:grayscale-0 grayscale transition-all duration-700" 
                            alt="Cut" 
                        />
                    </motion.div>
                ))}
            </div>
         </div>
      </section>

    </div>
  );
};