import React, { useState, ReactElement } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, GlassCard, Input } from './UI';
import { ChevronRight, ChevronLeft, Check, Calendar, User, Scissors } from 'lucide-react';

// --- Interfaces ---

interface StepProps {
  children: React.ReactNode;
}

interface StepperProps {
  initialStep?: number;
  onFinalStepCompleted: () => void;
  backButtonText?: string;
  nextButtonText?: string;
  children: ReactElement<StepProps>[];
}

interface OnboardingProps {
  onComplete: () => void;
}

// --- Components ---

// 1. Step Component (Structural)
const Step: React.FC<StepProps> = ({ children }) => <>{children}</>;

// 2. Stepper Component (Logic & Layout)
const Stepper: React.FC<StepperProps> = ({ 
  initialStep = 1, 
  onFinalStepCompleted, 
  backButtonText = "Voltar", 
  nextButtonText = "Próximo",
  children 
}) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const totalSteps = React.Children.count(children);
  const [direction, setDirection] = useState(0);

  const goNext = () => {
    if (currentStep < totalSteps) {
      setDirection(1);
      setCurrentStep(prev => prev + 1);
    } else {
      onFinalStepCompleted();
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep(prev => prev - 1);
    }
  };

  const currentChild = React.Children.toArray(children)[currentStep - 1];

  // Animation Variants
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0,
      scale: 0.95
    })
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Progress Dots */}
      <div className="flex justify-center gap-2 mb-6">
        {Array.from({ length: totalSteps }).map((_, idx) => (
          <div 
            key={idx} 
            className={`h-1.5 rounded-full transition-all duration-300 ${idx + 1 === currentStep ? 'w-8 bg-gold-500 shadow-[0_0_10px_rgba(218,165,32,0.5)]' : 'w-2 bg-white/10'}`} 
          />
        ))}
      </div>

      <GlassCard className="p-0 overflow-hidden min-h-[420px] flex flex-col relative border-darkveil-900/10 dark:border-white/10">
        {/* Step Content Area */}
        <div className="flex-1 p-8 relative">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentStep}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
              className="h-full flex flex-col"
            >
              {currentChild}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        <div className="p-6 border-t border-darkveil-900/5 dark:border-white/5 flex justify-between items-center bg-black/5 dark:bg-black/20">
          <Button 
            variant="ghost" 
            onClick={goBack} 
            disabled={currentStep === 1}
            className={currentStep === 1 ? 'invisible' : ''}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            {backButtonText}
          </Button>

          <Button onClick={goNext} className="shadow-gold-900/40">
            {currentStep === totalSteps ? (
              <>Let's Go <Check className="w-4 h-4 ml-1" /></>
            ) : (
              <>{nextButtonText} <ChevronRight className="w-4 h-4 ml-1" /></>
            )}
          </Button>
        </div>
      </GlassCard>
    </div>
  );
};

// 3. Main Onboarding Integration
export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [stylePreference, setStylePreference] = useState("");

  const handleFinish = () => {
    // Logic to save preference if needed
    console.log("User Style Preference:", stylePreference);
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-[15px]">
       <Stepper 
          initialStep={1} 
          onFinalStepCompleted={handleFinish}
          backButtonText="Voltar"
          nextButtonText="Próximo"
        >
          {/* Step 1: Boas-vindas */}
          <Step>
            <div className="flex flex-col items-center text-center h-full justify-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-br from-gold-600 to-darkveil-900 rounded-full flex items-center justify-center shadow-lg shadow-gold-900/30">
                <Scissors className="text-white w-10 h-10" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-darkveil-900 dark:text-white mb-3 tracking-tight">
                  Bem-vindo à Dom Barbieri!
                </h2>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                  Sua jornada com o Protocolo Italiano começa aqui. Vamos configurar seu acesso para oferecer o máximo de exclusividade.
                </p>
              </div>
            </div>
          </Step>

          {/* Step 2: Funcionalidades */}
          <Step>
            <div className="flex flex-col h-full space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-darkveil-900 dark:text-white mb-2">Agendamento Inteligente</h2>
                <p className="text-sm text-gray-500">Tecnologia a favor do seu tempo.</p>
              </div>
              
              {/* Image Placeholder with Blur */}
              <div className="relative w-full h-40 rounded-xl overflow-hidden border border-darkveil-900/10 dark:border-white/10 group">
                <img 
                  src="https://picsum.photos/600/400?grayscale&blur=2" 
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                  alt="Booking UI" 
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                  <Calendar className="w-12 h-12 text-gold-400 drop-shadow-[0_0_10px_rgba(218,165,32,0.5)]" />
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-400 text-center text-sm leading-relaxed px-2">
                Escolha seu serviço, barbeiro de preferência e receba a confirmação e lembretes direto no seu <span className="text-green-600 dark:text-green-400 font-semibold">WhatsApp</span>.
              </p>
            </div>
          </Step>

          {/* Step 3: Personalização */}
          <Step>
             <div className="flex flex-col h-full justify-center space-y-6">
              <div className="text-center">
                <div className="inline-block p-3 rounded-full bg-darkveil-900/5 dark:bg-white/5 mb-4">
                  <User className="w-8 h-8 text-gold-500" />
                </div>
                <h2 className="text-2xl font-bold text-darkveil-900 dark:text-white mb-2">Perfil & Visagismo</h2>
                <p className="text-gray-500 text-sm">Ajude-nos a personalizar sua experiência.</p>
              </div>

              <div className="space-y-4">
                <Input 
                  label="Como prefere ser chamado?" 
                  placeholder="Ex: Sr. Silva, João..." 
                  value={stylePreference}
                  onChange={(e) => setStylePreference(e.target.value)}
                  className="bg-black/5 dark:bg-black/50 border-gold-500/30 focus:border-gold-500"
                />
                <p className="text-xs text-gray-500 text-center">
                  Esta informação será usada pelos nossos barbeiros para o atendimento.
                </p>
              </div>
            </div>
          </Step>

          {/* Step 4: Finalização */}
          <Step>
            <div className="flex flex-col items-center text-center h-full justify-center space-y-6">
              <motion.div 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="w-24 h-24 bg-green-100 border-green-500 dark:bg-green-500/10 border dark:border-green-500/30 rounded-full flex items-center justify-center mb-2"
              >
                <Check className="w-12 h-12 text-green-600 dark:text-green-400" />
              </motion.div>
              
              <div>
                <h2 className="text-3xl font-bold text-darkveil-900 dark:text-white mb-4">Tudo Pronto!</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  Você já pode explorar nosso catálogo de Protocolos Italianos e marcar seu primeiro horário no trono.
                </p>
              </div>
            </div>
          </Step>
       </Stepper>
    </div>
  );
};